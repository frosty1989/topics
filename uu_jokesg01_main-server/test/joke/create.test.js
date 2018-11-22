const { TestHelper } = require("uu_appg01_workspace-test");
const path = require("path");
const fs = require("fs");
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;

const INIT = "jokesInstance/init";
const CREATE = "joke/create";

beforeAll(async () => {
  await TestHelper.setup();
});

afterAll(() => {
  TestHelper.teardown();
});

beforeEach(async () => {
  await TestHelper.dropDatabase();
  await TestHelper.initApp();
  await TestHelper.initAppWorkspace();
  await TestHelper.login("AwidOwner");
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("HDS - no image, Authorities call", async () => {
  await initJokesInstance();
  await TestHelper.login("Authority");

  let name = "nejvtipnejsi vtip";
  let text = "jeho text";
  let dtoIn = {
    name,
    text
  };
  let joke = await TestHelper.executePostCommand(CREATE, dtoIn);
  expect(joke.status).toEqual(200);
  let dtoOut = joke.data;
  expect(dtoOut.text).toEqual(text);
  expect(dtoOut.name).toEqual(name);
  expect(dtoOut.uuIdentity).toEqual("19-7019-1");
  expect(dtoOut.uuIdentityName).toBeTruthy();
  expect(dtoOut.averageRating).toEqual(0);
  expect(dtoOut.ratingCount).toEqual(0);
  expect(dtoOut.visibility).toEqual(true);
  expect(dtoOut.image).toBeUndefined();
  expect(dtoOut.categoryList).toBeUndefined();
  expect(dtoOut.uuAppErrorMap).toEqual({});
  expect(dtoOut.awid).toEqual(TestHelper.getAwid());
});

test("HDS - no image, Executives call", async () => {
  await initJokesInstance();
  await TestHelper.login("Executive");

  let dtoIn = {
    name: "hmm",
    text: "joo"
  };
  let joke = await TestHelper.executePostCommand(CREATE, dtoIn);
  expect(joke.status).toEqual(200);
  let dtoOut = joke.data;
  expect(dtoOut.uuIdentity).toEqual("14-2710-1");
  expect(dtoOut.visibility).toEqual(false);
  expect(dtoOut.uuAppErrorMap).toEqual({});
});

test("HDS - image", async () => {
  await initJokesInstance();
  await TestHelper.login("Authority");

  let dtoIn = {
    name: "nejm",
    image: fs.createReadStream(path.resolve(__dirname, "..", "logo.png"))
  };
  let joke = await TestHelper.executePostCommand(CREATE, dtoIn);
  expect(joke.status).toEqual(200);
  let dtoOut = joke.data;
  expect(dtoOut.image).toBeTruthy();
  expect(dtoOut.uuAppErrorMap).toEqual({});
});

test("A1 - jokesInstance does nto exist", async () => {
  expect.assertions(2);
  await TestHelper.login("Authority");
  try {
    await TestHelper.executePostCommand(CREATE, { name: "Smutny programator" });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/create/jokesInstanceDoesNotExist");
    expect(e.message).toEqual("JokesInstance does not exist.");
  }
});

test("A2 - jokes instance is closed", async () => {
  expect.assertions(4);
  await initJokesInstance("closed");
  await TestHelper.login("Authority");
  try {
    await TestHelper.executePostCommand(CREATE, { name: "Vesely partyzan" });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/create/jokesInstanceNotInProperState");
    expect(e.message).toEqual("JokesInstance is not in proper state [active|underConstruction].");
    expect(e.paramMap.state).toEqual("closed");
    expect(e.paramMap.expectedStateList).toEqual(["active", "underConstruction"]);
  }
});

test("A3 - unsupported keys in dtoIn", async () => {
  await initJokesInstance();
  await TestHelper.login("Authority");

  let joke = await TestHelper.executePostCommand(CREATE, { name: "Hrebik v zasuvce", navic: "ja jsem navic" });
  expect(joke.status).toEqual(200);
  let warning = joke.data.uuAppErrorMap["uu-jokes-main/joke/create/unsupportedKeys"];
  expect(warning).toBeTruthy();
  expect(warning.type).toEqual("warning");
  expect(warning.message).toEqual("DtoIn contains unsupported keys.");
  expect(warning.paramMap.unsupportedKeyList).toEqual(["$.navic"]);
});

test("A4 - dtoIn is not valid", async () => {
  expect.assertions(2);
  await initJokesInstance();
  await TestHelper.login("Authority");

  try {
    await TestHelper.executePostCommand(CREATE, { name: "Nehorlavy petrolej", image: 4 });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/create/invalidDtoIn");
    expect(e.message).toEqual("DtoIn is not valid.");
  }
});

test("A5 - creating image fails", async () => {
  expect.assertions(2);

  let { JokeModel, UuBinaryModel } = mockModels();
  jest.spyOn(UuBinaryModel, "createBinary").mockImplementation(() => {
    throw new Error("it failed");
  });

  try {
    await JokeModel.create(
      "awid",
      { name: "astronaut s pletenou cepici", image: fs.createReadStream(path.resolve(__dirname, "..", "logo.png")) },
      getSessionMock(),
      getAuthzResultMock()
    );
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/create/uuBinaryCreateFailed");
    expect(e.message).toEqual("Creating uuBinary failed.");
  }
});

test("A6 - categories don't exist", async () => {
  await initJokesInstance();
  await TestHelper.login("Authority");

  let existingCategoryId = "012345678910111213141516";
  let nonExistentCategoryId = "171819202122232425262728";
  let dtoIn = {
    name: "Uz mi dochazi jmena vtipu",
    categoryList: [existingCategoryId, nonExistentCategoryId]
  };

  await TestHelper.executeDbScript(
    `db.getCollection('category').insert({_id:ObjectId("${existingCategoryId}"),awid:"${TestHelper.getAwid()}"})`
  );

  let result = await TestHelper.executePostCommand(CREATE, dtoIn);
  expect(result.status).toBe(200);
  let dtoOut = result.data;
  expect(dtoOut.categoryList).toEqual([existingCategoryId]);

  let warning = dtoOut.uuAppErrorMap["uu-jokes-main/joke/create/categoryDoesNotExist"];
  expect(warning).toBeTruthy();
  expect(warning.type).toEqual("warning");
  expect(warning.message).toEqual("One or more categories with given categoryId do not exist.");
  expect(warning.paramMap.categoryList).toEqual([nonExistentCategoryId]);
});

test("A7 - storing the joke fails", async () => {
  expect.assertions(2);

  let { JokeModel } = mockModels();
  JokeModel.dao.create = () => {
    throw new ObjectStoreError("it failed");
  };

  try {
    await JokeModel.create("awid", { name: "za chvili pujdu domu" }, getSessionMock(), getAuthzResultMock());
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/create/jokeDaoCreateFailed");
    expect(e.message).toEqual("Create joke by joke DAO create failed.");
  }
});

function mockModels() {
  // this mock ensures that all of the models can be required
  jest.spyOn(DaoFactory, "getDao").mockImplementation(() => {
    let dao = {};
    dao.createSchema = () => {};
    return dao;
  });

  const JokeModel = require("../../app/models/joke-model");
  const { UuBinaryModel } = require("uu_appg01_binarystore-cmd");

  JokeModel.jokesInstanceDao = {
    getByAwid: () => {
      return {};
    }
  };

  return { JokeModel, UuBinaryModel };
}

function getSessionMock() {
  let identity = {
    getUuIdentity: () => {},
    getName: () => {}
  };
  return {
    getIdentity: () => identity
  };
}

function getAuthzResultMock() {
  return {
    getAuthorizedProfiles: () => []
  };
}

function initJokesInstance(state = "active") {
  TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: "spektakularniJavascript", state });
}

const { TestHelper } = require("uu_appg01_workspace-test");
const path = require("path");
const fs = require("fs");
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;

const INIT = "jokesInstance/init";
const CREATE = "joke/create";
const UPDATE = "joke/update";
const MONGO_ID = "012345678910111213141516";

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

test("HDS - no image", async () => {
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: "kostkovyCukr" });
  await TestHelper.login("Authority");
  let string = "hmm";
  let create = await TestHelper.executePostCommand(CREATE, { name: string });
  let update = await TestHelper.executePostCommand(UPDATE, {
    id: create.id,
    name: `${string}${string}`,
    text: `${string}${string}${string}`
  });
  expect(update.status).toEqual(200);
  expect(update.data.name).not.toEqual(create.data.name);
  expect(update.data.name).toEqual(`${string}${string}`);
  expect(update.data.text).not.toEqual(create.data.text);
  expect(update.data.text).toEqual(`${string}${string}${string}`);
});

test("HDS - create image", async () => {
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: "kostkovyCukr" });
  await TestHelper.login("Authority");
  let create = await TestHelper.executePostCommand(CREATE, { name: "mlzi se tu Okna" });
  let update = await TestHelper.executePostCommand(UPDATE, { id: create.id, image: getImageStream() });
  expect(update.status).toEqual(200);
  expect(update.data.image).not.toEqual(create.data.image);
  expect(update.data.image).toBeTruthy();

  //check if binary was really created
  let result = await TestHelper.executeGetCommand("uu-app-binarystore/listBinaries");
  expect(result.data.pageInfo.total).toEqual(1);
  expect(result.data.itemList[0].code).toEqual(update.data.image);
});

test("HDS - update image", async () => {
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: "kostkovyCukr" });
  await TestHelper.login("Authority");
  let create = await TestHelper.executePostCommand(CREATE, {
    name: "Zapomnel jsem si salu a je mi zima na krk",
    image: getImageStream()
  });

  // check if binary was created
  let result = await TestHelper.executeGetCommand("uu-app-binarystore/listBinaries");
  expect(result.data.pageInfo.total).toEqual(1);
  expect(result.data.itemList[0].sys.rev).toEqual(0);

  let update = await TestHelper.executePostCommand(UPDATE, { image: getImageStream(), id: create.id });
  expect(update.data.image).toEqual(create.data.image);
  expect(update.data.image).toBeTruthy();

  // check if binary was updated
  result = await TestHelper.executeGetCommand("uu-app-binarystore/listBinaries");
  expect(result.data.pageInfo.total).toEqual(1);
  expect(result.data.itemList[0].sys.rev).toEqual(1);
});

test("A1 - jokes instance does not exist", async () => {
  expect.assertions(2);
  await TestHelper.login("Authority");
  try {
    await TestHelper.executePostCommand(UPDATE, {});
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/update/jokesInstanceDoesNotExist");
    expect(e.message).toEqual("JokesInstance does not exist.");
  }
});

test("A2 - jokes instance is closed", async () => {
  expect.assertions(4);
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: "energetickyNapoj", state: "closed" });
  await TestHelper.login("Authority");
  try {
    await TestHelper.executePostCommand(UPDATE, {});
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/update/jokesInstanceNotInProperState");
    expect(e.message).toEqual("JokesInstance is not in proper state [active|underConstruction].");
    expect(e.paramMap.state).toEqual("closed");
    expect(e.paramMap.expectedStateList).toEqual(["active", "underConstruction"]);
  }
});

test("A3 - unsupported keys in dtoIn", async () => {
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: "vickoJeFuc" });
  await TestHelper.login("Authority");
  let joke = await TestHelper.executePostCommand(CREATE, { name: "Velmi vtipny vtip, opet.." });
  joke = await TestHelper.executePostCommand(UPDATE, { id: joke.id, zmatenyTurista: "kudy se dostanu na..." });
  expect(joke.status).toEqual(200);
  let warning = joke.data.uuAppErrorMap["uu-jokes-main/joke/update/unsupportedKeys"];
  expect(warning).toBeTruthy();
});

test("A4 - invalid dtoIn", async () => {
  expect.assertions(2);
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: "theMournfulWhy" });
  await TestHelper.login("Authority");
  try {
    await TestHelper.executePostCommand(UPDATE, {});
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/update/invalidDtoIn");
    expect(e.message).toEqual("DtoIn is not valid.");
  }
});

test("A5 - joke does not exist", async () => {
  expect.assertions(3);
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: "StellaWasADiver" });
  await TestHelper.login("Authority");
  try {
    await TestHelper.executePostCommand(UPDATE, { id: MONGO_ID });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/update/jokeDoesNotExist");
    expect(e.message).toEqual("Joke does not exist.");
    expect(e.paramMap.jokeId).toEqual(MONGO_ID);
  }
});

test("A6 - Executives trying to update Authorities' joke", async () => {
  expect.assertions(2);
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: "theMournfulWhy" });
  await TestHelper.login("Authority");
  let joke = await TestHelper.executePostCommand(CREATE, { name: "It's different now, that I'm poor and aging." });
  await TestHelper.login("Executive");
  try {
    await TestHelper.executePostCommand(UPDATE, { id: joke.id });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/update/userNotAuthorized");
    expect(e.message).toEqual("User not authorized.");
  }
});

test("A7 - categories don't exist", async () => {
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: "theWholesomeMurder" });
  await TestHelper.login("Authority");

  let existingCategoryId = "012345678910111213141516";
  let nonExistentCategoryId = "171819202122232425262728";
  await TestHelper.executeDbScript(
    `db.getCollection('category').insert({_id:ObjectId("${existingCategoryId}"),awid:"${TestHelper.getAwid()}"})`
  );

  let joke = await TestHelper.executePostCommand(CREATE, {
    name: "My best friend is a butcher, he has sixteen knives"
  });

  joke = await TestHelper.executePostCommand(UPDATE, {
    id: joke.id,
    categoryList: [existingCategoryId, nonExistentCategoryId]
  });

  expect(joke.status).toEqual(200);
  expect(joke.data.categoryList).toEqual([existingCategoryId]);
  let warning = joke.data.uuAppErrorMap["uu-jokes-main/joke/update/categoryDoesNotExist"];
  expect(warning).toBeTruthy();
  expect(warning.type).toEqual("warning");
  expect(warning.message).toEqual("One or more categories with given categoryId do not exist.");
  expect(warning.paramMap.categoryList).toEqual([nonExistentCategoryId]);
});

test("A8 - creating binary fails", async () => {
  expect.assertions(2);
  let { JokeModel, UuBinaryModel } = mockModels();
  jest.spyOn(UuBinaryModel, "createBinary").mockImplementation(() => {
    throw new Error("it failed");
  });
  JokeModel.dao = {
    get: () => {
      return {
        uuIdentity: "19-7019-1"
      };
    }
  };

  let dtoIn = {
    id: MONGO_ID,
    image: getImageStream()
  };

  try {
    await JokeModel.update("awid", dtoIn, getSessionMock(), getAuthzResultMock());
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/update/uuBinaryCreateFailed");
    expect(e.message).toEqual("Creating uuBinary failed.");
  }
});

test("A9 - updating binary fails", async () => {
  expect.assertions(2);
  let { JokeModel, UuBinaryModel } = mockModels();
  jest.spyOn(UuBinaryModel, "updateBinaryData").mockImplementation(() => {
    throw new Error("it failed");
  });
  JokeModel.dao = {
    get: () => {
      return {
        uuIdentity: "19-7019-1",
        image: true
      };
    }
  };

  let dtoIn = {
    id: MONGO_ID,
    image: getImageStream()
  };

  try {
    await JokeModel.update("awid", dtoIn, getSessionMock(), getAuthzResultMock());
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/update/uuBinaryUpdateBinaryDataFailed");
    expect(e.message).toEqual("Updating uuBinary data failed.");
  }
});

test("A10 - updating joke fails", async () => {
  expect.assertions(2);
  let { JokeModel } = mockModels();
  JokeModel.dao = {
    get: () => {
      return {
        uuIdentity: "19-7019-1"
      };
    },
    update: () => {
      throw new ObjectStoreError("it failed");
    }
  };

  try {
    await JokeModel.update("awid", { id: MONGO_ID }, getSessionMock(), getAuthzResultMock());
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/update/jokeDaoUpdateFailed");
    expect(e.message).toEqual("Update joke by joke Dao update failed.");
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
    getUuIdentity: () => "19-7019-1",
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

function getImageStream() {
  return fs.createReadStream(path.resolve(__dirname, "..", "logo.png"));
}

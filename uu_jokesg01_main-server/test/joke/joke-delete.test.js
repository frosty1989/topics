const { TestHelper } = require("uu_appg01_workspace-test");
const path = require("path");
const fs = require("fs");
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;

const INIT = "jokesInstance/init";
const CREATE = "joke/create";
const DELETE = "joke/delete";
const GET = "joke/get";
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

test("HDS", async () => {
  expect.assertions(2);
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authority");
  let joke = await TestHelper.executePostCommand(CREATE, { name: "There should be unicorns" });
  let result = await TestHelper.executePostCommand(DELETE, { id: joke.id });
  expect(result.status).toEqual(200);
  try {
    await TestHelper.executeGetCommand(GET, { id: joke.id });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/get/jokeDoesNotExist");
  }
});

test("HDS - deleting image", async () => {
  expect.assertions(3);
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authority");
  let joke = await TestHelper.executePostCommand(CREATE, {
    name: "The ones with the purple eyes",
    image: getImageStream()
  });
  let result = await TestHelper.executePostCommand(DELETE, { id: joke.id });
  expect(result.status).toEqual(200);
  try {
    await TestHelper.executeGetCommand(GET, { id: joke.id });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/get/jokeDoesNotExist");
  }
  let binaries = await TestHelper.executeGetCommand("uu-app-binarystore/listBinaries");
  expect(binaries.pageInfo.total).toEqual(0);
});

test("HDS - deleting ratings", async () => {
  expect.assertions(4);
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authority");
  let joke = await TestHelper.executePostCommand(CREATE, { name: "Not the green eyes" });

  // joke/addRating is yet to be implemented, thia creates some ratings in database
  await TestHelper.executeDbScript(
    `db.getCollection('jokeRating').insertMany([
      {jokeId:ObjectId("${joke.id}"),awid:"${TestHelper.getAwid()}",uuIdentity:1},
      {jokeId:ObjectId("${joke.id}"),awid:"${TestHelper.getAwid()}",uuIdentity:2},
      {awid:"${TestHelper.getAwid()}",uuIdentity:3}
    ])`
  );

  let result = await TestHelper.executePostCommand(DELETE, { id: joke.id });
  expect(result.status).toEqual(200);

  // only on rating remains in the db
  let dbResult = await TestHelper.executeDbScript(`db.getCollection('jokeRating').find().toArray()`);
  expect(dbResult.length).toEqual(1);
  expect(dbResult[0].uuIdentity).toEqual(3);

  // getting joke results in error as it was just deleted
  try {
    await TestHelper.executeGetCommand(GET, { id: joke.id });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/get/jokeDoesNotExist");
  }
});

test("A1 - jokes instance does not exist", async () => {
  expect.assertions(2);
  await TestHelper.login("Authority");
  try {
    await TestHelper.executePostCommand(DELETE, { id: MONGO_ID });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/delete/jokesInstanceDoesNotExist");
    expect(e.message).toEqual("JokesInstance does not exist.");
  }
});

test("A2 - jokes instance is closed", async () => {
  expect.assertions(4);
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: ".", state: "closed" });
  await TestHelper.login("Authority");
  try {
    await TestHelper.executePostCommand(DELETE, { id: MONGO_ID });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/delete/jokesInstanceNotInProperState");
    expect(e.message).toEqual("JokesInstance is not in proper state [active|underConstruction].");
    expect(e.paramMap.state).toEqual("closed");
    expect(e.paramMap.expectedStateList).toEqual(["active", "underConstruction"]);
  }
});

test("A3 - unsupported keys in dtoIn", async () => {
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authority");
  let joke = await TestHelper.executePostCommand(CREATE, { name: "If the police shows up.." });
  joke = await TestHelper.executePostCommand(DELETE, { id: joke.id, continued: "..we will give them so much money.." });
  expect(joke.status).toEqual(200);
  let warning = joke.uuAppErrorMap["uu-jokes-main/joke/delete/unsupportedKeys"];
  expect(warning).toBeTruthy();
  expect(warning.type).toEqual("warning");
  expect(warning.message).toEqual("DtoIn contains unsupported keys.");
  expect(warning.paramMap.unsupportedKeyList).toEqual(["$.continued"]);
});

test("A4 - invalid dtoIn", async () => {
  expect.assertions(2);
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authority");
  try {
    await TestHelper.executePostCommand(DELETE, {});
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/delete/invalidDtoIn");
    expect(e.message).toEqual("DtoIn is not valid.");
  }
});

test("A5 - joke does nto exist", async () => {
  expect.assertions(2);
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authority");
  try {
    await TestHelper.executePostCommand(DELETE, { id: MONGO_ID });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/delete/jokeDoesNotExist");
    expect(e.message).toEqual("Joke does not exist.");
  }
});

test("A6 - Executives trying to delete Authorities' joke", async () => {
  expect.assertions(2);
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authority");
  let joke = await TestHelper.executePostCommand(CREATE, { name: "..it will make them cry. And forgive us." });
  await TestHelper.login("Executive");
  try {
    await TestHelper.executePostCommand(DELETE, { id: joke.id });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/delete/userNotAuthorized");
    expect(e.message).toEqual("User not authorized.");
  }
});

test("A7 - deleting ratings fails", async () => {
  expect.assertions(2);
  let { JokeModel } = mockModels();
  JokeModel.dao.get = () => {
    return {};
  };
  JokeModel.jokeRatingDao.deleteByJokeId = () => {
    throw new ObjectStoreError("it failed.");
  };

  try {
    await JokeModel.delete("awid", { id: MONGO_ID }, getSessionMock(), getAuthzResultMock());
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/delete/jokeRatingDaoDeleteByJokeIdFailed");
    expect(e.message).toEqual("Delete jokeRating by jokeRating Dao deleteByJokeId failed.");
  }
});

test("A8 - deleting image fails", async () => {
  expect.assertions(2);
  let { JokeModel, UuBinaryModel } = mockModels();
  JokeModel.dao.get = () => {
    return { image: "For the love of god, javascript, I hope this is truthy!!" };
  };
  JokeModel.jokeRatingDao.deleteByJokeId = () => null;
  UuBinaryModel.deleteBinary = () => {
    throw new Error("it failed.");
  };

  try {
    await JokeModel.delete("awid", { id: MONGO_ID }, getSessionMock(), getAuthzResultMock());
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/delete/uuBinaryDeleteFailed");
    expect(e.message).toEqual("Deleting uuBinary failed.");
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
  const JokesInstanceModel = require("../../app/models/jokes-instance-model");

  JokesInstanceModel.checkInstance = () => null;

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

function getImageStream() {
  return fs.createReadStream(path.resolve(__dirname, "..", "logo.png"));
}

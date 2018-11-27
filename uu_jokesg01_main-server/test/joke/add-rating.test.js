const { TestHelper } = require("uu_appg01_workspace-test");
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;

const INIT = "jokesInstance/init";
const CREATE = "joke/create";
const GET = "joke/get";
const ADD_RATING = "joke/addRating";
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

test("HDS - vote for the first time", async () => {
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authority");
  let response = await TestHelper.executePostCommand(CREATE, { name: "And she knows that.." });
  await TestHelper.login("Executive");
  let ratedResponse = await TestHelper.executePostCommand(ADD_RATING, { id: response.data.id, rating: 4 });
  expect(ratedResponse.status).toEqual(200);
  expect(ratedResponse.data.averageRating).toEqual(4);
  expect(ratedResponse.data.ratingCount).toEqual(1);
  response = await TestHelper.executeGetCommand(GET, { id: response.data.id });
  expect(response.data).toEqual(ratedResponse.data);
});

test("HDS - change the vote, it wasn't funny after all", async () => {
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authority");
  let response = await TestHelper.executePostCommand(CREATE, { name: "it'd be tragic if thos eveil robots win" });
  await TestHelper.login("Executive");
  let ratedResponse = await TestHelper.executePostCommand(ADD_RATING, { id: response.data.id, rating: 4 });
  expect(ratedResponse.status).toEqual(200);
  expect(ratedResponse.data.averageRating).toEqual(4);
  expect(ratedResponse.data.ratingCount).toEqual(1);
  ratedResponse = await TestHelper.executePostCommand(ADD_RATING, { id: response.data.id, rating: 1 });
  expect(ratedResponse.status).toEqual(200);
  expect(ratedResponse.data.averageRating).toEqual(1);
  expect(ratedResponse.data.ratingCount).toEqual(1);
  response = await TestHelper.executeGetCommand(GET, { id: response.data.id });
  expect(response.data).toEqual(ratedResponse.data);
});

test("HDS - correct rating recalculating", async () => {
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authority");

  // there is not enough testing identities => create joke straight in database
  await TestHelper.executeDbScript(
    `db.getCollection('joke').insert({
        _id:ObjectId("${MONGO_ID}"), 
        awid: "${TestHelper.getAwid()}", 
        name:"A", 
        averageRating:3.5, 
        ratingCount:4 })`
  );

  // cast the first vote
  let response = await TestHelper.executePostCommand(ADD_RATING, { id: MONGO_ID, rating: 2 });
  expect(response.status).toEqual(200);
  expect(response.data.averageRating).toEqual(3.2);
  expect(response.data.ratingCount).toEqual(5);

  // change the vote
  response = await TestHelper.executePostCommand(ADD_RATING, { id: MONGO_ID, rating: 1 });
  expect(response.status).toEqual(200);
  expect(response.data.averageRating).toEqual(3);
  expect(response.data.ratingCount).toEqual(5);
});

test("A1 - jokes instance does not exist", async () => {
  expect.assertions(2);
  await TestHelper.login("Authority");
  try {
    await TestHelper.executePostCommand(ADD_RATING, {});
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/addRating/jokesInstanceDoesNotExist");
    expect(e.message).toEqual("JokesInstance does not exist.");
  }
});

test("A2 - jokes instance is closed", async () => {
  expect.assertions(4);
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: ".", state: "closed" });
  await TestHelper.login("Authority");
  try {
    await TestHelper.executePostCommand(ADD_RATING, {});
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/addRating/jokesInstanceNotInProperState");
    expect(e.message).toEqual("JokesInstance is not in proper state [active|underConstruction].");
    expect(e.paramMap.state).toEqual("closed");
    expect(e.paramMap.expectedStateList).toEqual(["active", "underConstruction"]);
  }
});

test("A3 - unsupported keys in dtoIn", async () => {
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: "." });
  await TestHelper.login("Authority");
  let joke = await TestHelper.executePostCommand(CREATE, { name: "walk in on your own feet, says the rover" });
  await TestHelper.login("Executive");
  joke = await TestHelper.executePostCommand(ADD_RATING, { id: joke.id, rating: 3, dog: "woof" });
  expect(joke.status).toEqual(200);
  let warning = joke.data.uuAppErrorMap["uu-jokes-main/joke/addRating/unsupportedKeys"];
  expect(warning).toBeTruthy();
});

test("A4 - invalid dtoIn", async () => {
  expect.assertions(2);
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: "." });
  await TestHelper.login("Authority");
  try {
    await TestHelper.executePostCommand(ADD_RATING, {});
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/addRating/invalidDtoIn");
    expect(e.message).toEqual("DtoIn is not valid.");
  }
});

test("A5 - joke does not exist", async () => {
  expect.assertions(3);
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: "." });
  await TestHelper.login("Authority");
  try {
    await TestHelper.executePostCommand(ADD_RATING, { id: MONGO_ID, rating: 5 });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/addRating/jokeDoesNotExist");
    expect(e.message).toEqual("Joke does not exist.");
    expect(e.paramMap.jokeId).toEqual(MONGO_ID);
  }
});

test("A6 - Authorities trying to rate their own joke", async () => {
  expect.assertions(2);
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: "." });
  await TestHelper.login("Authority");
  let joke = await TestHelper.executePostCommand(CREATE, { name: "it's my way or the all leave, says the rover" });
  try {
    await TestHelper.executePostCommand(ADD_RATING, { id: joke.id, rating: 5 });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/addRating/userNotAuthorized");
    expect(e.message).toEqual("User is not authorized.");
  }
});

test("A7 - joke rating update fails", async () => {
  expect.assertions(2);

  let JokeModel = mockModels();
  JokeModel.jokeRatingDao.getByJokeIdAndUuIdentity = () => {
    return { value: null };
  };
  JokeModel.jokeRatingDao.update = () => {
    throw new ObjectStoreError("it failed.");
  };

  try {
    await JokeModel.addRating("awid", { id: MONGO_ID, rating: 2 }, getSessionMock());
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/addRating/jokeRatingDaoUpdateFailed");
    expect(e.message).toEqual("Update jokeRating by jokeRating DAO update failed.");
  }
});

test("A7 - creating new joke rating fails", async () => {
  expect.assertions(2);

  let JokeModel = mockModels();
  JokeModel.jokeRatingDao.getByJokeIdAndUuIdentity = () => null;
  JokeModel.jokeRatingDao.create = () => {
    throw new ObjectStoreError("it failed.");
  };

  try {
    await JokeModel.addRating("awid", { id: MONGO_ID, rating: 2 }, getSessionMock());
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/addRating/jokeRatingDaoCreateFailed");
    expect(e.message).toEqual("Create jokeRating by jokeRating DAO create failed.");
  }
});

test("A8 - updating joke fails", async () => {
  expect.assertions(2);

  let JokeModel = mockModels();
  JokeModel.jokeRatingDao.getByJokeIdAndUuIdentity = () => false;
  JokeModel.jokeRatingDao.create = () => null;
  JokeModel.dao.update = () => {
    throw new ObjectStoreError("it failed.");
  };

  try {
    await JokeModel.addRating("awid", { id: MONGO_ID, rating: 2 }, getSessionMock());
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/addRating/jokeDaoUpdateFailed");
    expect(e.message).toEqual("Update joke by joke DAO update failed.");
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
  const JokesInstanceModel = require("../../app/models/jokes-instance-model");

  JokesInstanceModel.checkInstance = () => null;
  JokeModel.dao.get = () => {
    return { id: 1, uuIdentity: 2 };
  };

  return JokeModel;
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

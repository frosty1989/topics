const { TestHelper } = require("uu_appg01_workspace-test");
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;

const INIT = "jokesInstance/init";
const CREATE = "joke/create";
const UPDATE_VISIBILITY = "joke/updateVisibility";
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
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: "." });
  await TestHelper.login("Authority");
  let joke = await TestHelper.executePostCommand(CREATE, {
    name: "She lives with a broken man, a cracked polystyrene man"
  });
  expect(joke.data.visibility).toEqual(true);
  joke = await TestHelper.executePostCommand(UPDATE_VISIBILITY, { id: joke.id, visibility: false });
  expect(joke.status).toEqual(200);
  expect(joke.data.visibility).toEqual(false);
});

test("A1 - jokes instance does not exist", async () => {
  expect.assertions(2);
  await TestHelper.login("Authority");
  try {
    await TestHelper.executePostCommand(UPDATE_VISIBILITY, {});
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/updateVisibility/jokesInstanceDoesNotExist");
    expect(e.message).toEqual("JokesInstance does not exist.");
  }
});

test("A2 - jokes instance is closed", async () => {
  expect.assertions(4);
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: ".", state: "closed" });
  await TestHelper.login("Authority");
  try {
    await TestHelper.executePostCommand(UPDATE_VISIBILITY, {});
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/updateVisibility/jokesInstanceNotInProperState");
    expect(e.message).toEqual("JokesInstance is not in proper state [active|underConstruction].");
    expect(e.paramMap.state).toEqual("closed");
    expect(e.paramMap.expectedStateList).toEqual(["active", "underConstruction"]);
  }
});

test("A3 - unsupported keys in dtoIn", async () => {
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: "." });
  await TestHelper.login("Authority");
  let joke = await TestHelper.executePostCommand(CREATE, { name: "Predavkovali se smutnymi pribehy" });
  joke = await TestHelper.executePostCommand(UPDATE_VISIBILITY, { id: joke.id, visibility: true, ema: "mele maso" });
  expect(joke.status).toEqual(200);
  let warning = joke.data.uuAppErrorMap["uu-jokes-main/joke/updateVisibility/unsupportedKeys"];
  expect(warning).toBeTruthy();
});

test("A4 - invalid dtoIn", async () => {
  expect.assertions(2);
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: "." });
  await TestHelper.login("Authority");
  try {
    await TestHelper.executePostCommand(UPDATE_VISIBILITY, {});
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/updateVisibility/invalidDtoIn");
    expect(e.message).toEqual("DtoIn is not valid.");
  }
});

test("A5 - the update in db fails", async () => {
  expect.assertions(2);

  jest.spyOn(DaoFactory, "getDao").mockImplementation(() => {
    let dao = {};
    dao.createSchema = () => {};
    return dao;
  });

  const JokeModel = require("../../app/models/joke-model");
  const JokesInstanceModel = require("../../app/models/jokes-instance-model");

  JokesInstanceModel.checkInstance = () => null;
  JokeModel.dao = {
    updateVisibility: () => {
      throw new ObjectStoreError("it failed");
    }
  };

  let dtoIn = {
    id: MONGO_ID,
    visibility: true
  };

  try {
    await JokeModel.updateVisibility("awid", dtoIn);
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/updateVisibility/jokeDaoUpdateVisibilityFailed");
    expect(e.message).toEqual("Update joke by joke Dao updateVisibility failed");
  }
});

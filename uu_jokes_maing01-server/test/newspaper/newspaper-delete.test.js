const { TestHelper } = require("uu_appg01_workspace-test");
const { ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const {
  JOKES_INSTANCE_INIT,
  CATEGORY_CREATE,
  CATEGORY_DELETE,
  CATEGORY_GET,
  JOKE_GET,
  MONGO_ID,
  mockDaoFactory
} = require("../general-test-hepler");

beforeAll(async () => {
  await TestHelper.setup(null, { authEnabled: false });
});

afterAll(() => {
  TestHelper.teardown();
});

beforeEach(async () => {
  await TestHelper.dropDatabase();
  await TestHelper.initApp();
  await TestHelper.initAppWorkspace();
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("HDS - delete succeeds even when there is nothing to delete", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "." });
  let response = await TestHelper.executePostCommand(CATEGORY_DELETE, { id: MONGO_ID });
  expect(response.status).toEqual(200);
  expect(response.uuAppErrorMap).toEqual({});
});

test("HDS - create newspaper then delete it, no jokes involved", async () => {
  expect.assertions(3);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: ".", state: "active" });
  let newspaper = await TestHelper.executePostCommand(CATEGORY_CREATE, { name: ".." });
  let response = await TestHelper.executePostCommand(CATEGORY_DELETE, { id: newspaper.id });
  expect(response.status).toEqual(200);
  expect(response.uuAppErrorMap).toEqual({});
  try {
    await TestHelper.executeGetCommand(CATEGORY_GET, { id: newspaper.id });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/newspaper/get/newspaperDoesNotExist");
  }
});

test("HDS - force delete newspaper and checks that its removed from joke", async () => {
  expect.assertions(3);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: ".", state: "active" });

  // create two newspapers
  let newspaperOne = await TestHelper.executePostCommand(CATEGORY_CREATE, { name: ".." });
  let newspaperTwo = await TestHelper.executePostCommand(CATEGORY_CREATE, { name: "..." });

  // create joke belonging to both newspapers
  await createNewspaperdJokeDb([newspaperOne.id, newspaperTwo.id]);

  // force delete one newspaper
  let response = await TestHelper.executePostCommand(CATEGORY_DELETE, { id: newspaperTwo.id, forceDelete: true });
  expect(response.status).toEqual(200);
  expect(response.uuAppErrorMap).toEqual({});

  // the deleted newspaper is also deleted from joke
  let joke = await TestHelper.executeGetCommand(JOKE_GET, { id: MONGO_ID });
  expect(joke.newspaperList).toEqual([newspaperOne.id]);
});

test("A1 - jokesInstance does nto exist", async () => {
  expect.assertions(2);
  try {
    await TestHelper.executePostCommand(CATEGORY_DELETE);
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/newspaper/delete/jokesInstanceDoesNotExist");
    expect(e.message).toEqual("JokesInstance does not exist.");
  }
});

test("A2 - jokes instance is closed", async () => {
  expect.assertions(4);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: ".", state: "closed" });
  try {
    await TestHelper.executePostCommand(CATEGORY_DELETE, {});
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/newspaper/delete/jokesInstanceNotInProperState");
    expect(e.message).toEqual("JokesInstance is not in proper state [active|underConstruction].");
    expect(e.paramMap.state).toEqual("closed");
    expect(e.paramMap.expectedStateList).toEqual(["active", "underConstruction"]);
  }
});

test("A3 - unsupported keys in dtoIn", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "." });
  let response = await TestHelper.executePostCommand(CATEGORY_DELETE, { id: MONGO_ID, vrchr: "japko" });
  expect(response.status).toEqual(200);
  let warning = response.uuAppErrorMap["uu-jokes-main/newspaper/delete/unsupportedKeys"];
  expect(warning).toBeTruthy();
  expect(warning.type).toEqual("warning");
  expect(warning.message).toEqual("DtoIn contains unsupported keys.");
  expect(warning.paramMap.unsupportedKeyList).toEqual(["$.vrchr"]);
});

test("A4 - dtoIn is not valid", async () => {
  expect.assertions(2);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "." });
  try {
    await TestHelper.executePostCommand(CATEGORY_DELETE, {});
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/newspaper/delete/invalidDtoIn");
    expect(e.message).toEqual("DtoIn is not valid.");
  }
});

test("A5 - obtaining count of relevant jokes fails", async () => {
  expect.assertions(2);

  let NewspaperAbl = mockAbl();
  NewspaperAbl.jokeDao.getCountByNewspaperId = () => {
    throw new ObjectStoreError("it failed.");
  };

  try {
    await NewspaperAbl.delete("awid", { id: MONGO_ID });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/newspaper/delete/jokeDaoGetCountByNewspaperFailed");
    expect(e.message).toEqual("Get count by joke Dao getCountByNewspaper failed.");
  }
});

test("A6 - there are jokes with deleted newspaper and the delete is not forced", async () => {
  expect.assertions(3);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "." });
  let newspaper = await TestHelper.executePostCommand(CATEGORY_CREATE, { name: ".." });
  await createNewspaperdJokeDb([newspaper.id]);
  try {
    await TestHelper.executePostCommand(CATEGORY_DELETE, { id: newspaper.id });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/newspaper/delete/relatedJokesExist");
    expect(e.message).toEqual("Newspaper contains jokes.");
    expect(e.paramMap.relatedJokes).toEqual(1);
  }
});

test("A7 - removing newspaper fails", async () => {
  expect.assertions(2);

  let NewspaperAbl = mockAbl();
  NewspaperAbl.jokeDao.removeNewspaper = () => {
    throw new ObjectStoreError("it failed.");
  };

  try {
    await NewspaperAbl.delete("awid", { id: MONGO_ID, forceDelete: true });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/newspaper/delete/jokeDaoRemoveNewspaperFailed");
    expect(e.message).toEqual("Removing newspaper by joke Dao removeNewspaper failed.");
  }
});

function mockAbl() {
  mockDaoFactory();
  const NewspaperAbl = require("../../app/abl/newspaper-abl");
  const JokesInstanceAbl = require("../../app/abl/jokes-instance-abl");
  JokesInstanceAbl.checkInstance = () => null;
  return NewspaperAbl;
}

// calling joke/create doesn't work with disabled authorization/authentication, this is a shortcut
async function createNewspaperdJokeDb(newspaperList) {
  newspaperList = newspaperList.map(newspaper => {
    return `ObjectId("${newspaper}")`;
  });
  await TestHelper.executeDbScript(
    `db.getCollection('joke').insert({
      _id:ObjectId("${MONGO_ID}"),
      awid:"${TestHelper.getAwid()}",
      newspaperList:[${newspaperList}]
    })`
  );
}

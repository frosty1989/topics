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

test("HDS - create topic then delete it, no jokes involved", async () => {
  expect.assertions(3);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: ".", state: "active" });
  let topic = await TestHelper.executePostCommand(CATEGORY_CREATE, { name: ".." });
  let response = await TestHelper.executePostCommand(CATEGORY_DELETE, { id: topic.id });
  expect(response.status).toEqual(200);
  expect(response.uuAppErrorMap).toEqual({});
  try {
    await TestHelper.executeGetCommand(CATEGORY_GET, { id: topic.id });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/topic/get/topicDoesNotExist");
  }
});

test("HDS - force delete topic and checks that its removed from joke", async () => {
  expect.assertions(3);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: ".", state: "active" });

  // create two categories
  let topicOne = await TestHelper.executePostCommand(CATEGORY_CREATE, { name: ".." });
  let topicTwo = await TestHelper.executePostCommand(CATEGORY_CREATE, { name: "..." });

  // create joke belonging to both categories
  await createTopicdJokeDb([topicOne.id, topicTwo.id]);

  // force delete one topic
  let response = await TestHelper.executePostCommand(CATEGORY_DELETE, { id: topicTwo.id, forceDelete: true });
  expect(response.status).toEqual(200);
  expect(response.uuAppErrorMap).toEqual({});

  // the deleted topic is also deleted from joke
  let joke = await TestHelper.executeGetCommand(JOKE_GET, { id: MONGO_ID });
  expect(joke.topicList).toEqual([topicOne.id]);
});

test("A1 - jokesInstance does nto exist", async () => {
  expect.assertions(2);
  try {
    await TestHelper.executePostCommand(CATEGORY_DELETE);
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/topic/delete/jokesInstanceDoesNotExist");
    expect(e.message).toEqual("JokesInstance does not exist.");
  }
});

test("A2 - jokes instance is closed", async () => {
  expect.assertions(4);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: ".", state: "closed" });
  try {
    await TestHelper.executePostCommand(CATEGORY_DELETE, {});
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/topic/delete/jokesInstanceNotInProperState");
    expect(e.message).toEqual("JokesInstance is not in proper state [active|underConstruction].");
    expect(e.paramMap.state).toEqual("closed");
    expect(e.paramMap.expectedStateList).toEqual(["active", "underConstruction"]);
  }
});

test("A3 - unsupported keys in dtoIn", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "." });
  let response = await TestHelper.executePostCommand(CATEGORY_DELETE, { id: MONGO_ID, vrchr: "japko" });
  expect(response.status).toEqual(200);
  let warning = response.uuAppErrorMap["uu-jokes-main/topic/delete/unsupportedKeys"];
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
    expect(e.code).toEqual("uu-jokes-main/topic/delete/invalidDtoIn");
    expect(e.message).toEqual("DtoIn is not valid.");
  }
});

test("A5 - obtaining count of relevant jokes fails", async () => {
  expect.assertions(2);

  let TopicAbl = mockAbl();
  TopicAbl.jokeDao.getCountByTopicId = () => {
    throw new ObjectStoreError("it failed.");
  };

  try {
    await TopicAbl.delete("awid", { id: MONGO_ID });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/topic/delete/jokeDaoGetCountByTopicFailed");
    expect(e.message).toEqual("Get count by joke Dao getCountByTopic failed.");
  }
});

test("A6 - there are jokes with deleted topic and the delete is not forced", async () => {
  expect.assertions(3);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "." });
  let topic = await TestHelper.executePostCommand(CATEGORY_CREATE, { name: ".." });
  await createTopicdJokeDb([topic.id]);
  try {
    await TestHelper.executePostCommand(CATEGORY_DELETE, { id: topic.id });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/topic/delete/relatedJokesExist");
    expect(e.message).toEqual("Topic contains jokes.");
    expect(e.paramMap.relatedJokes).toEqual(1);
  }
});

test("A7 - removing topic fails", async () => {
  expect.assertions(2);

  let TopicAbl = mockAbl();
  TopicAbl.jokeDao.removeTopic = () => {
    throw new ObjectStoreError("it failed.");
  };

  try {
    await TopicAbl.delete("awid", { id: MONGO_ID, forceDelete: true });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/topic/delete/jokeDaoRemoveTopicFailed");
    expect(e.message).toEqual("Removing topic by joke Dao removeTopic failed.");
  }
});

function mockAbl() {
  mockDaoFactory();
  const TopicAbl = require("../../app/abl/topic-abl");
  const JokesInstanceAbl = require("../../app/abl/jokes-instance-abl");
  JokesInstanceAbl.checkInstance = () => null;
  return TopicAbl;
}

// calling joke/create doesn't work with disabled authorization/authentication, this is a shortcut
async function createTopicdJokeDb(topicList) {
  topicList = topicList.map(topic => {
    return `ObjectId("${topic}")`;
  });
  await TestHelper.executeDbScript(
    `db.getCollection('joke').insert({
      _id:ObjectId("${MONGO_ID}"),
      awid:"${TestHelper.getAwid()}",
      topicList:[${topicList}]
    })`
  );
}

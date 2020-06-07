const { TestHelper } = require("uu_appg01_workspace-test");
const { JOKES_INSTANCE_INIT, CATEGORY_CREATE, CATEGORY_GET, MONGO_ID } = require("../general-test-hepler");

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

test("HDS", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, {
    uuAppProfileAuthorities: "jaJsemTakyUri",
    state: "active"
  });
  await TestHelper.login("Authority");
  let name = "Steven Senegal";
  let create = await TestHelper.executePostCommand(CATEGORY_CREATE, { name: name });

  // get topic by id
  let getOne = await TestHelper.executeGetCommand(CATEGORY_GET, { id: create.id });
  expect(getOne.status).toEqual(200);
  expect(getOne).toEqual(create);

  // get topic by name (it is the same topic as before)
  let getTwo = await TestHelper.executeGetCommand(CATEGORY_GET, { name: name });
  expect(getTwo.status).toEqual(200);
  expect(getTwo).toEqual(getOne);
});

test("A1 - jokes instance does not exist", async () => {
  expect.assertions(2);
  await TestHelper.login("Authority");
  try {
    await TestHelper.executeGetCommand(CATEGORY_GET, { id: MONGO_ID });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/topic/get/jokesInstanceDoesNotExist");
    expect(e.message).toEqual("JokesInstance does not exist.");
  }
});

test("A2 - jokes instance is closed", async () => {
  expect.assertions(4);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: ".", state: "closed" });
  await TestHelper.login("Authority");
  try {
    await TestHelper.executeGetCommand(CATEGORY_GET, { id: MONGO_ID });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/topic/get/jokesInstanceNotInProperState");
    expect(e.message).toEqual("JokesInstance is not in proper state [active|underConstruction].");
    expect(e.paramMap.state).toEqual("closed");
    expect(e.paramMap.expectedStateList).toEqual(["active", "underConstruction"]);
  }
});

test("A3 - jokes instance is under construction", async () => {
  expect.assertions(3);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, {
    uuAppProfileAuthorities: ".",
    state: "underConstruction"
  });
  await TestHelper.login("Reader");
  try {
    await TestHelper.executeGetCommand(CATEGORY_GET, { id: MONGO_ID });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/topic/get/jokesInstanceIsUnderConstruction");
    expect(e.message).toEqual("JokesInstance is in state underConstruction.");
    expect(e.paramMap.state).toEqual("underConstruction");
  }
});

test("A4 - unsupported keys in dtoIn", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authority");
  let joke = await TestHelper.executePostCommand(CATEGORY_CREATE, { name: "..." });
  joke = await TestHelper.executeGetCommand(CATEGORY_GET, { id: joke.id, whatThe: "heck" });
  expect(joke.status).toEqual(200);
  let warning = joke.uuAppErrorMap["uu-jokes-main/topic/get/unsupportedKeys"];
  expect(warning).toBeTruthy();
  expect(warning.type).toEqual("warning");
  expect(warning.message).toEqual("DtoIn contains unsupported keys.");
  expect(warning.paramMap.unsupportedKeyList).toEqual(["$.whatThe"]);
});

test("A5 - invalid dtoIn", async () => {
  expect.assertions(2);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authority");
  try {
    await TestHelper.executeGetCommand(CATEGORY_GET, {});
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/topic/get/invalidDtoIn");
    expect(e.message).toEqual("DtoIn is not valid.");
  }
});

test("A6 - topic does not exist", async () => {
  expect.assertions(8);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authority");
  try {
    await TestHelper.executeGetCommand(CATEGORY_GET, { id: MONGO_ID });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/topic/get/topicDoesNotExist");
    expect(e.message).toEqual("Topic does not exist.");
    expect(e.paramMap.topicId).toEqual(MONGO_ID);
    expect(e.paramMap.topicName).toBeUndefined();
  }
  let name = "...";
  try {
    await TestHelper.executeGetCommand(CATEGORY_GET, { name });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/topic/get/topicDoesNotExist");
    expect(e.message).toEqual("Topic does not exist.");
    expect(e.paramMap.topicId).toBeUndefined();
    expect(e.paramMap.topicName).toEqual(name);
  }
});

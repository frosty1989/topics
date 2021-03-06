const { TestHelper } = require("uu_appg01_workspace-test");
const { JOKES_INSTANCE_INIT, JOKE_CREATE, JOKE_GET, MONGO_ID } = require("../general-test-hepler");

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
  let create = await TestHelper.executePostCommand(JOKE_CREATE, { name: "Silvester Stalin" });
  let get = await TestHelper.executeGetCommand(JOKE_GET, { id: create.id });
  expect(get.status).toEqual(200);
  expect(get).toEqual(create);
});

test("A1 - jokes instance does not exist", async () => {
  expect.assertions(2);
  await TestHelper.login("Authority");
  try {
    await TestHelper.executeGetCommand(JOKE_GET, { id: MONGO_ID });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/get/jokesInstanceDoesNotExist");
    expect(e.message).toEqual("JokesInstance does not exist.");
  }
});

test("A2 - jokes instance is closed", async () => {
  expect.assertions(4);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, {
    uuAppProfileAuthorities: "vimperskeParky",
    state: "closed"
  });
  await TestHelper.login("Authority");
  try {
    await TestHelper.executeGetCommand(JOKE_GET, { id: MONGO_ID });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/get/jokesInstanceNotInProperState");
    expect(e.message).toEqual("JokesInstance is not in proper state [active|underConstruction].");
    expect(e.paramMap.state).toEqual("closed");
    expect(e.paramMap.expectedStateList).toEqual(["active", "underConstruction"]);
  }
});

test("A3 - jokes instance is under construction", async () => {
  expect.assertions(3);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, {
    uuAppProfileAuthorities: "jogurtovaCokolada",
    state: "underConstruction"
  });
  await TestHelper.login("Reader");
  try {
    await TestHelper.executeGetCommand(JOKE_GET, { id: MONGO_ID });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/get/jokesInstanceIsUnderConstruction");
    expect(e.message).toEqual("JokesInstance is in underConstruction state.");
    expect(e.paramMap.state).toEqual("underConstruction");
  }
});

test("A4 - unsupported keys in dtoIn", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, {
    uuAppProfileAuthorities: "konviceNaCaj",
    state: "active"
  });
  await TestHelper.login("Authority");
  let joke = await TestHelper.executePostCommand(JOKE_CREATE, { name: "zelena okurka" });
  joke = await TestHelper.executeGetCommand(JOKE_GET, { id: joke.id, cosi: "to je jedno, co tu je" });
  expect(joke.status).toEqual(200);
  let warning = joke.uuAppErrorMap["uu-jokes-main/joke/get/unsupportedKeys"];
  expect(warning).toBeTruthy();
  expect(warning.type).toEqual("warning");
  expect(warning.message).toEqual("DtoIn contains unsupported keys.");
  expect(warning.paramMap.unsupportedKeyList).toEqual(["$.cosi"]);
});

test("A5 - invalid dtoIn", async () => {
  expect.assertions(2);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, {
    uuAppProfileAuthorities: "umeleSladidlo",
    state: "active"
  });
  await TestHelper.login("Authority");
  try {
    await TestHelper.executeGetCommand(JOKE_GET, {});
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/get/invalidDtoIn");
    expect(e.message).toEqual("DtoIn is not valid.");
  }
});

test("A6 - joke does not exist", async () => {
  expect.assertions(3);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, {
    uuAppProfileAuthorities: "umeleSladidlo",
    state: "active"
  });
  await TestHelper.login("Authority");
  try {
    await TestHelper.executeGetCommand(JOKE_GET, { id: MONGO_ID });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/get/jokeDoesNotExist");
    expect(e.message).toEqual("Joke does not exist.");
    expect(e.paramMap.jokeId).toEqual(MONGO_ID);
  }
});

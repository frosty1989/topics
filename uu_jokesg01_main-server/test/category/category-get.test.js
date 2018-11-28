const { TestHelper } = require("uu_appg01_workspace-test");

const INIT = "jokesInstance/init";
const CREATE = "category/create";
const GET = "category/get";
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

test("HDS", async () => {
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: "jaJsemTakyUri", state: "active" });
  await TestHelper.login("Authority");
  let name = "Steven Senegal";
  let create = await TestHelper.executePostCommand(CREATE, { name: name });

  // get category by id
  let getOne = await TestHelper.executeGetCommand(GET, { id: create.id });
  expect(getOne.status).toEqual(200);
  expect(getOne.data).toEqual(create.data);

  // get category by name (it is the same category as before)
  let getTwo = await TestHelper.executeGetCommand(GET, { name: name });
  expect(getTwo.status).toEqual(200);
  expect(getTwo.data).toEqual(getOne.data);
});

test("A1 - jokes instance does not exist", async () => {
  expect.assertions(2);
  await TestHelper.login("Authority");
  try {
    await TestHelper.executeGetCommand(GET, { id: MONGO_ID });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/category/get/jokesInstanceDoesNotExist");
    expect(e.message).toEqual("JokesInstance does not exist.");
  }
});

test("A2 - jokes instance is closed", async () => {
  expect.assertions(4);
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: ".", state: "closed" });
  await TestHelper.login("Authority");
  try {
    await TestHelper.executeGetCommand(GET, { id: MONGO_ID });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/category/get/jokesInstanceNotInProperState");
    expect(e.message).toEqual("JokesInstance is not in proper state [active|underConstruction].");
    expect(e.paramMap.state).toEqual("closed");
    expect(e.paramMap.expectedStateList).toEqual(["active", "underConstruction"]);
  }
});

test("A3 - jokes instance is under construction", async () => {
  expect.assertions(3);
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: ".", state: "underConstruction" });
  await TestHelper.login("Authority");
  try {
    await TestHelper.executeGetCommand(GET, { id: MONGO_ID });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/category/get/jokesInstanceIsUnderConstruction");
    expect(e.message).toEqual("JokesInstance is in state underConstruction.");
    expect(e.paramMap.state).toEqual("underConstruction");
  }
});

test("A4 - unsupported keys in dtoIn", async () => {
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authority");
  let joke = await TestHelper.executePostCommand(CREATE, { name: "..." });
  joke = await TestHelper.executeGetCommand(GET, { id: joke.id, whatThe: "heck" });
  expect(joke.status).toEqual(200);
  let warning = joke.data.uuAppErrorMap["uu-jokes-main/category/get/unsupportedKeys"];
  expect(warning).toBeTruthy();
  expect(warning.type).toEqual("warning");
  expect(warning.message).toEqual("DtoIn contains unsupported keys.");
  expect(warning.paramMap.unsupportedKeyList).toEqual(["$.whatThe"]);
});

test("A5 - invalid dtoIn", async () => {
  expect.assertions(2);
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authority");
  try {
    await TestHelper.executeGetCommand(GET, {});
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/category/get/invalidDtoIn");
    expect(e.message).toEqual("DtoIn is not valid.");
  }
});

test("A6 - category does not exist", async () => {
  expect.assertions(8);
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authority");
  try {
    await TestHelper.executeGetCommand(GET, { id: MONGO_ID });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/category/get/categoryDoesNotExist");
    expect(e.message).toEqual("Category does not exist.");
    expect(e.paramMap.categoryId).toEqual(MONGO_ID);
    expect(e.paramMap.categoryName).toBeUndefined();
  }
  let name = "...";
  try {
    await TestHelper.executeGetCommand(GET, { name });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/category/get/categoryDoesNotExist");
    expect(e.message).toEqual("Category does not exist.");
    expect(e.paramMap.categoryId).toBeUndefined();
    expect(e.paramMap.categoryName).toEqual(name);
  }
});

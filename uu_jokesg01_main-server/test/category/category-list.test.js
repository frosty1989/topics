const { TestHelper } = require("uu_appg01_workspace-test");

const INIT = "jokesInstance/init";
const CREATE = "category/create";
const LIST = "category/list";
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
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authority");

  let nameOne = "cats",
    nameTwo = "dogs";
  await TestHelper.executePostCommand(CREATE, { name: nameOne });
  await TestHelper.executePostCommand(CREATE, { name: nameTwo });

  let list = await TestHelper.executeGetCommand(LIST);
  expect(list.status).toEqual(200);
  expect(list.pageInfo.total).toEqual(2);

  let names = [list.itemList[0].name, list.itemList[1].name].slice(0).sort();
  expect(names).toEqual([nameOne, nameTwo]);
});

test("HDS - custom pageInfo", async () => {
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authority");

  let nameOne = "birds",
    nameTwo = "pokemons";
  await TestHelper.executePostCommand(CREATE, { name: nameOne });
  await TestHelper.executePostCommand(CREATE, { name: nameTwo });

  let pageSize = 1,
    pageIndex = 1;
  let list = await TestHelper.executeGetCommand(LIST, { pageInfo: { pageSize: pageSize, pageIndex: pageIndex } });
  expect(list.status).toEqual(200);
  expect(list.pageInfo.total).toEqual(2);
  expect(list.pageInfo.pageSize).toEqual(pageSize);
  expect(list.pageInfo.pageIndex).toEqual(pageIndex);
  // the list cmd doesn't (yet) specify the order in which the items are returned
  let expectedNamePattern = new RegExp(`^(${nameOne}|${nameTwo})$`);
  expect(list.itemList[0].name).toMatch(expectedNamePattern);
});

test("A1 - jokes instance does not exist", async () => {
  expect.assertions(2);
  await TestHelper.login("Authority");
  try {
    await TestHelper.executeGetCommand(LIST);
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/category/list/jokesInstanceDoesNotExist");
    expect(e.message).toEqual("JokesInstance does not exist.");
  }
});

test("A2 - jokes instance is closed", async () => {
  expect.assertions(4);
  await TestHelper.executePostCommand(INIT, {
    uuAppProfileAuthorities: ".",
    state: "closed"
  });
  await TestHelper.login("Authority");
  try {
    await TestHelper.executeGetCommand(LIST);
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/category/list/jokesInstanceNotInProperState");
    expect(e.message).toEqual("JokesInstance is not in proper state [active|underConstruction].");
    expect(e.paramMap.state).toEqual("closed");
    expect(e.paramMap.expectedStateList).toEqual(["active", "underConstruction"]);
  }
});

test("A3 - jokes instance is under construction", async () => {
  expect.assertions(3);
  await TestHelper.executePostCommand(INIT, {
    uuAppProfileAuthorities: ".",
    state: "underConstruction"
  });
  await TestHelper.login("Authority");
  try {
    await TestHelper.executeGetCommand(LIST);
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/category/list/jokesInstanceIsUnderConstruction");
    expect(e.message).toEqual("JokesInstance is in state underConstruction.");
    expect(e.paramMap.state).toEqual("underConstruction");
  }
});

test("A4 - unsupported keys in dtoIn", async () => {
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authority");
  let response = await TestHelper.executeGetCommand(LIST, { brambor: true });
  expect(response.status).toEqual(200);
  let warning = response.data.uuAppErrorMap["uu-jokes-main/category/list/unsupportedKeys"];
  expect(warning).toBeTruthy();
  expect(warning.type).toEqual("warning");
  expect(warning.message).toEqual("DtoIn contains unsupported keys.");
  expect(warning.paramMap.unsupportedKeyList).toEqual(["$.brambor"]);
});

test("A5 - invalid dtoIn", async () => {
  expect.assertions(2);
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authority");
  try {
    await TestHelper.executeGetCommand(LIST, { pageInfo: false });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/category/list/invalidDtoIn");
    expect(e.message).toEqual("DtoIn is not valid.");
  }
});

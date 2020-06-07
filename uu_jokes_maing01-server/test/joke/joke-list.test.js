const { TestHelper } = require("uu_appg01_workspace-test");
const { JOKES_INSTANCE_INIT, JOKE_CREATE, JOKE_LIST, MONGO_ID } = require("../general-test-hepler");

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
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authority");

  // create some jokes
  await TestHelper.executePostCommand(JOKE_CREATE, { name: "A" });
  await TestHelper.executePostCommand(JOKE_CREATE, { name: "C" });
  await TestHelper.executePostCommand(JOKE_CREATE, { name: "B" });

  let response = await TestHelper.executeGetCommand(JOKE_LIST);
  expect(response.status).toEqual(200);
  let dtoOut = response;
  expect(dtoOut.pageInfo.total).toEqual(3);
  expect(dtoOut.pageInfo.pageIndex).toEqual(0);
  expect(dtoOut.pageInfo.pageSize).toEqual(100);
  // by default, list is ordered by name in ascending order
  expect(dtoOut.itemList[0].name).toEqual("A");
  expect(dtoOut.itemList[1].name).toEqual("B");
  expect(dtoOut.itemList[2].name).toEqual("C");
});

test("HDS - default sort by (name), default order (ascending)", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authority");

  // create some jokes
  await TestHelper.executePostCommand(JOKE_CREATE, { name: "A" });
  await TestHelper.executePostCommand(JOKE_CREATE, { name: "C" });
  await TestHelper.executePostCommand(JOKE_CREATE, { name: "B" });

  let response = await TestHelper.executeGetCommand(JOKE_LIST);
  expect(response.status).toEqual(200);
  let dtoOut = response;
  expect(dtoOut.pageInfo.total).toEqual(3);
  expect(dtoOut.itemList[0].name).toEqual("A");
  expect(dtoOut.itemList[1].name).toEqual("B");
  expect(dtoOut.itemList[2].name).toEqual("C");
});

test("HDS - default sort by (name), custom order", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authority");

  // create some jokes
  await TestHelper.executePostCommand(JOKE_CREATE, { name: "A" });
  await TestHelper.executePostCommand(JOKE_CREATE, { name: "C" });
  await TestHelper.executePostCommand(JOKE_CREATE, { name: "B" });

  let response = await TestHelper.executeGetCommand(JOKE_LIST, { order: "desc" });
  expect(response.status).toEqual(200);
  let dtoOut = response;
  expect(dtoOut.pageInfo.total).toEqual(3);
  expect(dtoOut.itemList[0].name).toEqual("C");
  expect(dtoOut.itemList[1].name).toEqual("B");
  expect(dtoOut.itemList[2].name).toEqual("A");
});

test("HDS - custom sort by, default order (ascending)", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authority");

  // rating the jokes is yet to be implemented => crate some jokes with rating in db
  await TestHelper.executeDbScript(
    `db.getCollection('joke').insertMany([
      {awid: "${TestHelper.getAwid()}", name:"A", rating:3.5},
      {awid: "${TestHelper.getAwid()}", name:"B", rating:1.7},
      {awid: "${TestHelper.getAwid()}", name:"C", rating:2.0}
    ])`
  );

  let response = await TestHelper.executeGetCommand(JOKE_LIST, { sortBy: "rating" });
  expect(response.status).toEqual(200);
  let dtoOut = response;
  expect(dtoOut.pageInfo.total).toEqual(3);
  expect(dtoOut.itemList[0].name).toEqual("B");
  expect(dtoOut.itemList[1].name).toEqual("C");
  expect(dtoOut.itemList[2].name).toEqual("A");
});

test("HDS - pageInfo", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authority");

  // create some jokes
  await TestHelper.executePostCommand(JOKE_CREATE, { name: "A" });
  await TestHelper.executePostCommand(JOKE_CREATE, { name: "B" });
  await TestHelper.executePostCommand(JOKE_CREATE, { name: "C" });

  let pIndex = 2;
  let pSize = 1;
  let response = await TestHelper.executeGetCommand(JOKE_LIST, { pageInfo: { pageSize: pSize, pageIndex: pIndex } });
  expect(response.status).toEqual(200);
  let dtoOut = response;
  expect(dtoOut.pageInfo.total).toEqual(3);
  expect(dtoOut.pageInfo.pageIndex).toEqual(pIndex);
  expect(dtoOut.pageInfo.pageSize).toEqual(pSize);
  expect(dtoOut.itemList[0].name).toEqual("C");
});

test("HDS - only pageSize in pageInfo", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authority");

  // create some jokes
  await TestHelper.executePostCommand(JOKE_CREATE, { name: "A" });
  await TestHelper.executePostCommand(JOKE_CREATE, { name: "B" });
  await TestHelper.executePostCommand(JOKE_CREATE, { name: "C" });

  let pSize = 1;
  let response = await TestHelper.executeGetCommand(JOKE_LIST, { pageInfo: { pageSize: pSize } });
  expect(response.status).toEqual(200);
  let dtoOut = response;
  expect(dtoOut.pageInfo.total).toEqual(3);
  expect(dtoOut.pageInfo.pageIndex).toEqual(0);
  expect(dtoOut.pageInfo.pageSize).toEqual(pSize);
  expect(dtoOut.itemList[0].name).toEqual("A");
});

test("HDS - only pageIndex in pageInfo", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authority");

  // create some jokes
  await TestHelper.executePostCommand(JOKE_CREATE, { name: "A" });
  await TestHelper.executePostCommand(JOKE_CREATE, { name: "B" });
  await TestHelper.executePostCommand(JOKE_CREATE, { name: "C" });

  let pIndex = 2;
  let response = await TestHelper.executeGetCommand(JOKE_LIST, { pageInfo: { pageIndex: pIndex } });
  expect(response.status).toEqual(200);
  let dtoOut = response;
  expect(dtoOut.pageInfo.total).toEqual(3);
  expect(dtoOut.pageInfo.pageIndex).toEqual(pIndex);
  expect(dtoOut.pageInfo.pageSize).toEqual(100);
  expect(dtoOut.itemList).toEqual([]);
});

test("HDS - filter by newspaper", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authority");

  // newspaper management commands are not yet implemented => creating something straight in the database
  await TestHelper.executeDbScript(
    `db.getCollection('joke').insertMany([
      {awid: "${TestHelper.getAwid()}", name:"A", newspaperList:[ObjectId("${MONGO_ID}"), 14]},
      {awid: "${TestHelper.getAwid()}", name:"B", newspaperList:[true]},
      {awid: "${TestHelper.getAwid()}", name:"C", newspaperList:[ObjectId("${MONGO_ID}")]},
    ])`
  );

  // The second newspaperId is a valid id - it will pass through the validation - but there is no newspaper
  // (obviously) with such id, so it won't influence the result. It will check the correct conversion
  // from string to mongodb's objectID in some dao.
  let response = await TestHelper.executeGetCommand(JOKE_LIST, { newspaperList: [MONGO_ID, `${MONGO_ID}12345678`] });
  expect(response.status).toEqual(200);
  let dtoOut = response;
  expect(dtoOut.pageInfo.total).toEqual(2);
  expect(dtoOut.itemList[0].name).toEqual("A");
  expect(dtoOut.itemList[1].name).toEqual("C");
});

test("A1 - jokes instance does not exist", async () => {
  expect.assertions(2);
  await TestHelper.login("Authority");
  try {
    await TestHelper.executeGetCommand(JOKE_LIST);
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/list/jokesInstanceDoesNotExist");
    expect(e.message).toEqual("JokesInstance does not exist.");
  }
});

test("A2 - jokes instance is closed", async () => {
  expect.assertions(4);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, {
    uuAppProfileAuthorities: ".",
    state: "closed"
  });
  await TestHelper.login("Authority");
  try {
    await TestHelper.executeGetCommand(JOKE_LIST);
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/list/jokesInstanceNotInProperState");
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
    await TestHelper.executeGetCommand(JOKE_LIST);
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/list/jokesInstanceIsUnderConstruction");
    expect(e.message).toEqual("JokesInstance is in state underConstruction.");
    expect(e.paramMap.state).toEqual("underConstruction");
  }
});

test("A4 - unsupported keys in dtoIn", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authority");
  let response = await TestHelper.executeGetCommand(JOKE_LIST, { kedluben: true });
  expect(response.status).toEqual(200);
  let warning = response.uuAppErrorMap["uu-jokes-main/joke/list/unsupportedKeys"];
  expect(warning).toBeTruthy();
  expect(warning.type).toEqual("warning");
  expect(warning.message).toEqual("DtoIn contains unsupported keys.");
  expect(warning.paramMap.unsupportedKeyList).toEqual(["$.kedluben"]);
});

test("A5 - invalid dtoIn", async () => {
  expect.assertions(2);
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: ".", state: "active" });
  await TestHelper.login("Authority");
  try {
    await TestHelper.executeGetCommand(JOKE_LIST, { order: true });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/joke/list/invalidDtoIn");
    expect(e.message).toEqual("DtoIn is not valid.");
  }
});

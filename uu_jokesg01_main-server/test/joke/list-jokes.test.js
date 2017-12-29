const { Utils } = require("uu_appg01_server");
const { TestHelper } = require("uu_appg01_workspace-test");
const { CreateJoke } = require("../general-test-hepler");
const { CreateCategory } = require("../general-test-hepler");

beforeEach(async done => {
  await TestHelper.setup();
  await TestHelper.initAppWorkspace();
  await TestHelper.createPermission("Readers");
  done();
});

afterEach(async done => {
  await TestHelper.teardown();
  done();
});

describe("Test listJokes command", () => {
  test("HDS", async () => {
    await TestHelper.login("Readers");
    let createCategoryResponse = await CreateCategory();
    let categoryId = createCategoryResponse.data.id;
    await CreateJoke({}, categoryId);
    let listResponce = await TestHelper.executeGetCommand("listJokes");
    let itemId = listResponce.data.itemList[0].id;
    let response = await TestHelper.executeGetCommand("listJokes");
    console.log(response.data.itemList[0].name);
    expect(response.data.itemList[0].name).toEqual("test joke");
    expect(response.data.itemList[0].text).toEqual("test joke text");
    expect(response.data.itemList[0].categoryList).toEqual([categoryId]);
    expect(response.data.itemList[0].id).toEqual(itemId);
    expect(Array.isArray(response.data.itemList[0].categoryList)).toBe(true);
    expect(response.data.itemList[0].awid).toEqual(
      Utils.Config.get("sysAppWorkspace")["awid"]
    );
    expect(response.data.uuAppErrorMap).toEqual({});
    expect(response.data.pageInfo.total).toEqual(1);
  });
});

describe("Test listJokes command", () => {
  test("A1", async () => {
    await TestHelper.login("Readers");
    let createCategoryResponse = await CreateCategory();
    let categoryId = createCategoryResponse.data.id;
    await CreateJoke({}, categoryId);
    let listResponce = await TestHelper.executeGetCommand("listJokes");
    let invalidDtoIn = {
      notvalid: "not valid key"
    };
    let response = await TestHelper.executeGetCommand(
      "listJokes",
      invalidDtoIn
    );
    console.log(response.data.uuAppErrorMap);
    expect(typeof response.data.uuAppErrorMap).toBe("object");
    expect("warning").toEqual(
      response.data.uuAppErrorMap["uu-jokesg01-main/undefined/unsupportedKey"]
        .type
    );
    expect("DtoIn contains unsupported keys.").toEqual(
      response.data.uuAppErrorMap["uu-jokesg01-main/undefined/unsupportedKey"]
        .message
    );
    let invalidData =
      response.data.uuAppErrorMap["uu-jokesg01-main/undefined/unsupportedKey"]
        .paramMap["unsupportedKeyList"][0];
    expect(invalidData).toEqual("$.notvalid");
  });
});

describe("Test createJoke command", () => {
  test("A2", async () => {
    await TestHelper.login("Readers");
    let invalidDtoIn = {
      sortBy: 123,
      order: 123,
      pageInfo: {
        pageIndex: "string",
        pageSize: "string"
      }
    };
    let status;
    try {
      await TestHelper.executeGetCommand("listJokes", invalidDtoIn);
    } catch (error) {
      status = error.response.status;
    }
    expect(status).toBe(400);
  });
});

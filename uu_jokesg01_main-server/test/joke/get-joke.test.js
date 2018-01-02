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

describe("Test getJoke command", () => {
  test("HDS", async () => {
    await TestHelper.login("Readers");
    await CreateJoke();
    let listResponce = await TestHelper.executeGetCommand("listJokes");
    let itemId = listResponce.data.itemList[0].id;
    let dtoIn = { id: itemId };
    let response = await TestHelper.executeGetCommand("getJoke", dtoIn);

    expect(response.data.name).toEqual("test joke");
    expect(response.data.text).toEqual("test joke text");
    expect(response.data.id).toEqual(itemId);
    expect(Array.isArray(response.data.categoryList)).toBe(true);
    expect(response.data.awid).toEqual(
      Utils.Config.get("sysAppWorkspace")["awid"]
    );
    expect(response.data.uuAppErrorMap).toEqual({});
    expect(response.status).toEqual(200);
    expect(response.data.uuAppErrorMap).toBeDefined();
    expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect(response.data.uuAppErrorMap).toMatchObject({});
  });
});

describe("Test getJoke command", () => {
  test("A1", async () => {
    await TestHelper.login("Readers");
    await CreateJoke();
    let listResponce = await TestHelper.executeGetCommand("listJokes");
    let itemId = listResponce.data.itemList[0].id;
    let invalidDtoIn = {
      id: itemId,
      notvalid: "not valid key"
    };
    let response = await TestHelper.executeGetCommand("getJoke", invalidDtoIn);

    expect(typeof response.data.uuAppErrorMap).toBe("object");
    expect(response.status).toEqual(200);
    expect("warning").toEqual(
      response.data.uuAppErrorMap["uu-jokesg01-main/getJoke/unsupportedKey"]
        .type
    );
    expect("DtoIn contains unsupported keys.").toEqual(
      response.data.uuAppErrorMap["uu-jokesg01-main/getJoke/unsupportedKey"]
        .message
    );
    let invalidData =
      response.data.uuAppErrorMap["uu-jokesg01-main/getJoke/unsupportedKey"]
        .paramMap["unsupportedKeyList"][0];
    expect(invalidData).toEqual("$.notvalid");
  });
});

describe("Test getJoke command", () => {
  test("A2", async () => {
    await TestHelper.login("Readers");
    let invalidDtoIn = { id: "invalid string id" };
    let status;
    try {
      await TestHelper.executeGetCommand("getJoke", invalidDtoIn);
    } catch (error) {
      status = error;
    }
    expect(status.status).toEqual(400);
    expect(status).toHaveProperty("paramMap");
    expect(status.paramMap).toHaveProperty("invalidValueKeyMap");
    expect(status.dtoOut).toHaveProperty("uuAppErrorMap");
    expect(status).toHaveProperty("response");
    expect(status).toHaveProperty("status");
    expect(status.dtoOut.uuAppErrorMap).toBeInstanceOf(Object);
  });
});

describe("Test getJoke command", () => {
  test("A4", async () => {
    await TestHelper.login("Readers");
    let nonexistintId = "5a33ba462eb85507bcf0c444";
    let createCategoryResponse = await CreateCategory();
    let categoryId = createCategoryResponse.data.id;
    await CreateJoke({}, categoryId);
    let response;
    let jokeDoesNotExistCode = "uu-jokesg01-main/getJoke/jokeDoesNotExist";

    try {
      await TestHelper.executeGetCommand("getJoke", {
        id: nonexistintId
      });
    } catch (error) {
      response = error;
    }

    expect(response.status).toBe(500);
    expect(response.code).toBe(jokeDoesNotExistCode);
  });
});

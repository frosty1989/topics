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
    expect(Array.isArray(response.data.categoryList)).toBeFalsy();
    expect(response.data.awid).toEqual(
      Utils.Config.get("sysAppWorkspace")["awid"]
    );
    expect(response.data.uuAppErrorMap).toEqual({});
    expect(response.status).toEqual(200);
    expect(response.data.uuAppErrorMap).toBeDefined();
    expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect(response.data.uuAppErrorMap).toMatchObject({});
  });

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

  test("A2", async () => {
    await TestHelper.login("Readers");
    expect.assertions(7);
    let invalidDtoIn = { id: "invalid string id" };
    try {
      await TestHelper.executeGetCommand("getJoke", invalidDtoIn);
    } catch (error) {
      expect(error.status).toEqual(400);
      expect(error).toHaveProperty("paramMap");
      expect(error.paramMap).toHaveProperty("invalidValueKeyMap");
      expect(error.dtoOut).toHaveProperty("uuAppErrorMap");
      expect(error).toHaveProperty("response");
      expect(error).toHaveProperty("status");
      expect(error.dtoOut.uuAppErrorMap).toBeInstanceOf(Object);
    }
  });

  test("A4", async () => {
    await TestHelper.login("Readers");
    let nonexistintId = "5a33ba462eb85507bcf0c444";
    let createCategoryResponse = await CreateCategory();
    let categoryId = createCategoryResponse.data.id;
    await CreateJoke({}, categoryId);
    let response;
    let jokeDoesNotExistCode = "uu-jokesg01-main/getJoke/jokeDoesNotExist";

    expect.assertions(2);
    try {
      await TestHelper.executeGetCommand("getJoke", {
        id: nonexistintId
      });
    } catch (error) {
      expect(error.status).toBe(500);
      expect(error.code).toBe(jokeDoesNotExistCode);
    }
  });

  test("A5", async () => {
    await TestHelper.login("Readers");

    let category1 = await CreateCategory({
      name: "Category 1",
      desc: "Category 1 description"
    });
    let category2 = await CreateCategory({
      name: "Category 2",
      desc: "Category 2 description"
    });
    let joke = await CreateJoke({
      name: "Joke",
      text: "Text of funny joke",
      categoryList: [category1.data.id, category2.data.id]
    });

    console.log(joke);
  });
});

const { TestHelper } = require("uu_appg01_workspace-test");
const { CreateCategory } = require("../general-test-hepler");
const { CreateJoke } = require("../general-test-hepler");

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

describe("Test deleteCategory command", () => {
  test("HDS", async () => {
    await TestHelper.login("Readers");
    await CreateCategory();
    let listResponce = await TestHelper.executeGetCommand("listCategories");
    let itemId = listResponce.data.itemList[0].id;
    let dtoIn = { id: itemId, forceDelete: true };
    let response = await TestHelper.executePostCommand("deleteCategory", dtoIn);

    expect(response.status).toEqual(200);
    expect(response.data.uuAppErrorMap).toEqual({});
    expect(response.data.uuAppErrorMap).toBeDefined();
    expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect(response.data.uuAppErrorMap).toMatchObject({});
  });

  test("A1", async () => {
    await TestHelper.login("Readers");

    await CreateCategory();
    let listResponce = await TestHelper.executeGetCommand("listCategories");
    let itemId = listResponce.data.itemList[0].id;
    let dtoIn = {
      id: itemId,
      forceDelete: true,
      unsupportedKey: "unsupportedValue"
    };
    let unsuportedKey = "uu-jokesg01-main/deleteCategory/unsupportedKey";
    let response = await TestHelper.executePostCommand("deleteCategory", dtoIn);
    expect(response.status).toEqual(200);
    expect("warning").toEqual(
      response.data.uuAppErrorMap[
        unsuportedKey
      ].type
    );
    expect("DtoIn contains unsupported keys.").toEqual(
      response.data.uuAppErrorMap[
        unsuportedKey
      ].message
    );
    let invalidData =
      response.data.uuAppErrorMap[
        unsuportedKey
      ].paramMap["unsupportedKeyList"][0];
    expect(invalidData).toEqual("$.unsupportedKey");
  });

  test("A2", async () => {
    await TestHelper.login("Readers", true);
    let response;

    try {
      await TestHelper.executePostCommand("deleteCategory", {});
    } catch (err) {
      response = err;
    }

    expect(response).toHaveProperty("paramMap");
    expect(response.paramMap).toHaveProperty("invalidValueKeyMap");
    expect(response.paramMap).toHaveProperty("missingKeyMap");
    expect(response.dtoOut).toHaveProperty("uuAppErrorMap");
    expect(response).toHaveProperty("response");
    expect(response).toHaveProperty("status");
    expect(response.status).toEqual(400);
  });

  test("A4 related jokes exists", async () => {
    await TestHelper.login("Readers", true);
    let createCategoryResponse = await CreateCategory();
    let categoryId = createCategoryResponse.data.id;
    await CreateJoke({}, categoryId);
    let result;
    try {
      await TestHelper.executePostCommand("deleteCategory", {
        id: createCategoryResponse.data.id
      });
    } catch (error) {
      result = error;
    }

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("status");
    expect(result.status).toEqual(500);
    expect(result.code).toEqual(
      "uu-jokesg01-main/deleteCategory/relatedJokesExist"
    );
    expect(result).toBeInstanceOf(Object);
    expect(result).toHaveProperty("response");
  });
});

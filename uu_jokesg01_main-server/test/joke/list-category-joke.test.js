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

describe("Test listCategoryJokes command", () => {
  test("HDS", async () => {
    await TestHelper.login("Readers");
    let createCategoryResponse = await CreateCategory();
    let categoryId = createCategoryResponse.data.id;
    await CreateJoke({}, categoryId);
    let dtoIn = { categoryId: categoryId };
    let response = await TestHelper.executeGetCommand(
      "listCategoryJokes",
      dtoIn
    );
    expect(response.status).toEqual(200);
    expect(response.data.uuAppErrorMap).toEqual({});
    expect(response.data.uuAppErrorMap).toBeDefined();
    expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect(response.data.uuAppErrorMap).toMatchObject({});
    expect(Array.isArray(response.data.itemList)).toBe(true);
  });

  test("A1", async () => {
    await TestHelper.login("Readers");

    let createCategoryResponse = await CreateCategory();
    let categoryId = createCategoryResponse.data.id;
    await CreateJoke({}, categoryId);
    let dtoIn = {
      categoryId: categoryId,
      unsupportedKey: "unsupportedValue"
    };
    let response = await TestHelper.executeGetCommand(
      "listCategoryJokes",
      dtoIn
    );

    expect(response.status).toEqual(200);
    expect("warning").toEqual(
      response.data.uuAppErrorMap[
        "uu-jokesg01-main/listCategoryJokes/unsupportedKey"
      ].type
    );
    expect("DtoIn contains unsupported keys.").toEqual(
      response.data.uuAppErrorMap[
        "uu-jokesg01-main/listCategoryJokes/unsupportedKey"
      ].message
    );
    let invalidData =
      response.data.uuAppErrorMap[
        "uu-jokesg01-main/listCategoryJokes/unsupportedKey"
      ].paramMap["unsupportedKeyList"][0];
    expect(invalidData).toEqual("$.unsupportedKey");
  });

  test("A2", async () => {
    await TestHelper.login("Readers");
    let response;
    try {
      await TestHelper.executeGetCommand("listCategoryJokes", {});
    } catch (error) {
      response = error;
    }
    expect(response.status).toBe(400);
    expect(response).toHaveProperty("paramMap");
    expect(response.paramMap).toHaveProperty("invalidValueKeyMap");
    expect(response.paramMap).toHaveProperty("missingKeyMap");
    expect(response.dtoOut).toHaveProperty("uuAppErrorMap");
    expect(response).toHaveProperty("response");
    expect(response).toHaveProperty("status");
  });
});

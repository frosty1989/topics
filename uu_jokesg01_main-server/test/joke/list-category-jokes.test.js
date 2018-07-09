const { TestHelper } = require("uu_appg01_workspace-test");
const { CreateCategory, CreateJoke, InitApp } = require("../general-test-hepler");
const CMD = "listCategoryJokes";

beforeAll(async () => {
  await InitApp();
  await TestHelper.login("Reader");
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe("Test listCategoryJokes command", () => {
  test("HDS", async () => {
    let category = await CreateCategory();
    let categoryId = category.data.id;
    await CreateJoke({}, categoryId);
    let dtoIn = { categoryId: categoryId };
    let response = await TestHelper.executeGetCommand(CMD, dtoIn);
    expect(response.status).toEqual(200);
    expect(response.data.uuAppErrorMap).toBeDefined();
    expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect(response.data.uuAppErrorMap).toMatchObject({});
    expect(Array.isArray(response.data.itemList)).toBe(true);
  });

  test("A1", async () => {
    let createCategoryResponse = await CreateCategory();
    let categoryId = createCategoryResponse.data.id;
    await CreateJoke({}, categoryId);
    let dtoIn = {
      categoryId: categoryId,
      unsupportedKey: "unsupportedValue"
    };
    let response = await TestHelper.executeGetCommand(CMD, dtoIn);
    const code = `uu-jokes-main/${CMD}/unsupportedKeys`;

    expect(response.status).toEqual(200);
    expect("warning").toEqual(response.data.uuAppErrorMap[code].type);
    expect("DtoIn contains unsupported keys.").toEqual(response.data.uuAppErrorMap[code].message);
    let invalidData = response.data.uuAppErrorMap[code].paramMap["unsupportedKeyList"][0];
    expect(invalidData).toEqual("$.unsupportedKey");
  });

  test("A2", async () => {
    expect.assertions(7);
    try {
      await TestHelper.executeGetCommand(CMD, {});
    } catch (error) {
      expect(error.status).toBe(400);
      expect(error).toHaveProperty("paramMap");
      expect(error.paramMap).toHaveProperty("invalidValueKeyMap");
      expect(error.paramMap).toHaveProperty("missingKeyMap");
      expect(error.dtoOut).toHaveProperty("uuAppErrorMap");
      expect(error).toHaveProperty("response");
      expect(error).toHaveProperty("status");
    }
  });
});

const { TestHelper } = require("uu_appg01_workspace-test");
const { CreateJoke, CreateCategory, InitApp } = require("../general-test-hepler");
const CMD = "getJoke";

beforeAll(async () => {
  await InitApp();
  await TestHelper.login("Reader");
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe("Test getJoke command", () => {
  test("HDS", async () => {
    const category1 = await CreateCategory();
    const category2 = await CreateCategory();
    const categoryList = [category1.data.id, category2.data.id];
    const joke = await CreateJoke({
      name: "Joke HDS",
      text: "Text",
      categoryList: categoryList
    });
    const response = await TestHelper.executeGetCommand(CMD, { id: joke.data.id });

    expect(response.status).toEqual(200);
    expect(response.data).toBeDefined();
    expect(response.data.id).toEqual(joke.data.id);
    expect(response.data.categoryList).toMatchObject(categoryList);
    expect(response.data.awid).toEqual(TestHelper.awid);
    expect(response.data.uuAppErrorMap).toBeDefined();
    expect(response.data.uuAppErrorMap).toEqual({});
  });

  test("A1", async () => {
    const joke = await CreateJoke();
    const itemId = joke.data.id;
    const invalidDtoIn = {
      id: itemId,
      notvalid: "not valid key"
    };
    const response = await TestHelper.executeGetCommand(CMD, invalidDtoIn);
    const unsupportedKeys = `uu-jokes-main/${CMD}/unsupportedKeys`;

    expect(response.status).toEqual(200);
    expect(response.data.uuAppErrorMap).toBeDefined();
    expect(response.data.uuAppErrorMap[unsupportedKeys]).toBeDefined();
    expect(response.data.uuAppErrorMap[unsupportedKeys].type).toBeDefined();
    expect(response.data.uuAppErrorMap[unsupportedKeys].message).toBeDefined();
    expect(response.data.uuAppErrorMap[unsupportedKeys].paramMap).toBeDefined();
    expect(response.data.uuAppErrorMap[unsupportedKeys].paramMap.unsupportedKeyList).toBeDefined();
    expect(response.data.uuAppErrorMap[unsupportedKeys].type).toEqual("warning");
    expect(response.data.uuAppErrorMap[unsupportedKeys].message).toEqual("DtoIn contains unsupported keys.");
    expect(response.data.uuAppErrorMap[unsupportedKeys].paramMap.unsupportedKeyList).toContain("$.notvalid");
  });

  test("A2", async () => {
    expect.assertions(7);
    let invalidDtoIn = { id: "invalid string id" };
    try {
      await TestHelper.executeGetCommand(CMD, invalidDtoIn);
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
    let nonexistintId = "5a33ba462eb85507bcf0c444";
    let createCategoryResponse = await CreateCategory();
    let categoryId = createCategoryResponse.data.id;
    await CreateJoke({}, categoryId);
    let jokeDoesNotExistCode = `uu-jokes-main/${CMD}/jokeDoesNotExist`;

    expect.assertions(2);
    try {
      await TestHelper.executeGetCommand(CMD, {
        id: nonexistintId
      });
    } catch (error) {
      expect(error.status).toBe(400);
      expect(error.code).toBe(jokeDoesNotExistCode);
    }
  });

  test("A5", async () => {
    let category1 = await CreateCategory();
    let category2 = await CreateCategory();
    let joke = await CreateJoke({
      name: "Joke A5",
      text: "Text of funny joke",
      categoryList: [category1.data.id, category2.data.id]
    });
    let response = await TestHelper.executeGetCommand(CMD, { id: joke.data.id });

    expect(response.data.uuAppErrorMap).toBeDefined();
    expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect(response.data.uuAppErrorMap).toMatchObject({});
  });
});

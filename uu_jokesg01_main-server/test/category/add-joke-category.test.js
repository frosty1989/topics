const { TestHelper } = require("uu_appg01_workspace-test");
const { CreateJoke, CreateCategory, InitApp } = require("../general-test-hepler");
const CMD = "addJokeCategory";

let categories = {
  category1: null,
  category2: null,
  category3: null
};
let joke = null;

beforeAll(async () => {
  const dummyDesc = "Maecenas non libero nisl. Integer sed elit vitae eros.";

  await InitApp();
  await TestHelper.login("Executive");

  categories.category1 = await CreateCategory({ name: "Category 1", desc: dummyDesc });
  categories.category2 = await CreateCategory({ name: "Category 2", desc: dummyDesc });
  categories.category3 = await CreateCategory({ name: "Category 3", desc: dummyDesc });
  joke = await CreateJoke();
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe("Test addJokeCategory command", () => {
  test("HDS", async () => {
    let categoryList = [categories.category1.data.id, categories.category3.data.id];
    let response = await TestHelper.executePostCommand(CMD, {
      jokeId: joke.data.id,
      categoryList
    });

    expect(response.status).toEqual(200);
    expect(response.data).toBeDefined();
    expect(response.data.uuAppErrorMap).toMatchObject({});
    expect(response.data.categoryList).toBeDefined();
    expect(response.data.categoryList).toBeInstanceOf(Array);
    expect(response.data.categoryList).toEqual(categoryList);
    expect(response.data.categoryList.length).toBe(categoryList.length);
  });

  test("A1", async () => {
    let response = await TestHelper.executePostCommand(CMD, {
      jokeId: joke.data.id,
      categoryList: [categories.category2.data.id],
      unsupportedKey: "unsupportedValue"
    });
    const code = `uu-jokes-main/${CMD}/unsupportedKeys`;

    expect(response.status).toEqual(200);
    expect(response.data).toBeDefined();
    expect(response.data).toBeInstanceOf(Object);
    expect(response.data.categoryList).toBeDefined();
    expect(response.data.categoryList).toBeInstanceOf(Array);
    expect(response.data.uuAppErrorMap).toBeDefined();
    expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect(response.data.uuAppErrorMap[code]).toBeDefined();
    expect(response.data.uuAppErrorMap[code].paramMap).toBeDefined();
    expect(response.data.uuAppErrorMap[code].paramMap.unsupportedKeyList).toBeDefined();
    expect(response.data.uuAppErrorMap[code].paramMap.unsupportedKeyList).toContain("$.unsupportedKey");
  });

  test("A2", async () => {
    expect.assertions(8);
    try {
      await TestHelper.executePostCommand(CMD, {
        jokeId: 123,
        categoryList: 123
      });
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual(`uu-jokes-main/${CMD}/invalidDtoIn`);
      expect(e).toHaveProperty("paramMap");
      expect(e.paramMap).toHaveProperty("invalidValueKeyMap");
      expect(e.paramMap.invalidValueKeyMap["$"]).toBeDefined();
      expect(e.paramMap).toHaveProperty("invalidTypeKeyMap");
      expect(e.paramMap.invalidTypeKeyMap["$.jokeId"]).toBeDefined();
      expect(e.paramMap.invalidTypeKeyMap["$.categoryList"]).toBeDefined();
    }
  });

  test("A4", async () => {
    const code = `uu-jokes-main/${CMD}/jokeDoesNotExist`;
    const fakeJokeId = "5a33ba462eb85507bcf0c444";

    expect.assertions(4);

    try {
      await TestHelper.executePostCommand(CMD, {
        jokeId: fakeJokeId,
        categoryList: [categories.category2.data.id]
      });
    } catch (error) {
      expect(error.code).toBe(code);
      expect(error.status).toBe(400);
      expect(error.paramMap).toBeDefined();
      expect(error.paramMap.jokeId).toEqual(fakeJokeId);
    }
  });

  test("A6", async () => {
    const code = `uu-jokes-main/${CMD}/categoryDoesNotExist`;
    const categoryList = ["5a547c8e003628174cf9e1b9", "5a547c8e003628174cf9e1b8"];
    let response = await TestHelper.executePostCommand(CMD, {
      jokeId: joke.data.id,
      categoryList: categoryList
    });

    expect(response.status).toEqual(200);
    expect(response.data).toBeDefined();
    expect(response.data).toBeInstanceOf(Object);
    expect(response.data.categoryList).toBeDefined();
    expect(response.data.categoryList).toBeInstanceOf(Array);
    expect(response.data.uuAppErrorMap).toBeDefined();
    expect(response.data.uuAppErrorMap[code]).toBeDefined();
    expect(response.data.uuAppErrorMap[code]).toBeInstanceOf(Object);
    expect(response.data.uuAppErrorMap[code].type).toEqual("warning");
    expect(response.data.uuAppErrorMap[code].paramMap).toBeDefined();
    expect(response.data.uuAppErrorMap[code].paramMap.categoryIds).toEqual(categoryList);
  });

  test("A8", async () => {
    const dupDtoIn = {
      jokeId: joke.data.id,
      categoryList: [categories.category1.data.id, categories.category2.data.id]
    };
    await TestHelper.executePostCommand(CMD, dupDtoIn);
    const response = await TestHelper.executePostCommand(CMD, dupDtoIn);
    const code = `uu-jokes-main/${CMD}/jokeCategoryAlreadyExists`;

    expect(response.status).toEqual(200);
    expect(response.data).toBeDefined();
    expect(response.data).toBeInstanceOf(Object);
    expect(response.data.categoryList).toBeDefined();
    expect(response.data.categoryList).toEqual([]);
    expect(response.data.categoryList.length).toBe(0);
    expect(response.data.joke.id).toEqual(joke.data.id);
    expect(response.data.uuAppErrorMap).toBeDefined();
    expect(response.data.uuAppErrorMap[code]).toBeDefined();
    expect(response.data.uuAppErrorMap[code].type).toBe("warning");
    expect(response.data.uuAppErrorMap[code].paramMap).toEqual([
      {
        jokeId: joke.data.id,
        categoryId: categories.category1.data.id
      },
      {
        jokeId: joke.data.id,
        categoryId: categories.category2.data.id
      }
    ]);
  });
});

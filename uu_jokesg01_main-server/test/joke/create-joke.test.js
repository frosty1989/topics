const { TestHelper } = require("uu_appg01_workspace-test");
const { CreateJoke, CreateCategory, InitApp } = require("../general-test-hepler");

beforeAll(async () => {
  await InitApp();
  await TestHelper.login("Executive");
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe("Test createJoke command", () => {
  test("HDS", async () => {
    const category1 = await CreateCategory();
    const category2 = await CreateCategory();
    const result = await CreateJoke({
      name: "Joke",
      text: "Text",
      categoryList: [category1.data.id, category2.data.id]
    });

    expect(result.status).toEqual(200);
    expect(result.data).toBeDefined();
    expect(result.data).toBeInstanceOf(Object);
    expect(result.data.id).toBeDefined();
    expect(typeof result.data.id === "string").toBeTruthy();
    expect(result.data.name).toBeDefined();
    expect(result.data.text).toBeDefined();
    expect(result.data.awid).toBeDefined();
    expect(result.data.awid).toBe(TestHelper.awid);
    expect(result.data.averageRating).toBeDefined();
    expect(result.data.ratingCount).toBeDefined();
    expect(result.data.uuAppErrorMap).toBeDefined();
    expect(result.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect(result.data.uuAppErrorMap).toMatchObject({});
    expect(result.data.categoryList).toBeDefined();
    expect(result.data.categoryList).toBeInstanceOf(Array);
    expect(result.data.categoryList).toEqual([category1.data.id, category2.data.id]);
  });

  test("A1", async () => {
    const result = await CreateJoke({ unsupportedKey: "unsupportedValue" });
    const unsupportedKeys = "uu-jokes-main/createJoke/unsupportedKeys";

    expect(result.status).toEqual(200);
    expect(result.data).toBeDefined();
    expect(result.data).toBeInstanceOf(Object);
    expect(result.data.id).toBeDefined();
    expect(result.data.uuAppErrorMap).toBeDefined();
    expect(result.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect(result.data.uuAppErrorMap[unsupportedKeys]).toBeDefined();
    expect(result.data.uuAppErrorMap[unsupportedKeys]).toBeInstanceOf(Object);
    expect(result.data.uuAppErrorMap[unsupportedKeys].type).toBeDefined();
    expect(result.data.uuAppErrorMap[unsupportedKeys].type).toEqual("warning");
    expect(result.data.uuAppErrorMap[unsupportedKeys].paramMap).toBeDefined();
    expect(result.data.uuAppErrorMap[unsupportedKeys].paramMap["unsupportedKeyList"]).toBeDefined();
    expect(result.data.uuAppErrorMap[unsupportedKeys].paramMap["unsupportedKeyList"]).toContain("$.unsupportedKey");
  });

  test("A2", async () => {
    expect.assertions(13);
    const invalidDtoIn = "uu-jokes-main/createJoke/invalidDtoIn";

    try {
      await TestHelper.executePostCommand("createJoke", {});
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual(invalidDtoIn);
      expect(e.paramMap).toBeDefined();
      expect(e.paramMap.invalidValueKeyMap).toBeDefined();
      expect(e.paramMap.invalidValueKeyMap).toBeInstanceOf(Object);
      expect(e.paramMap.invalidValueKeyMap["$"]).toBeDefined();
      expect(e.paramMap.invalidValueKeyMap["$"]).toBeInstanceOf(Object);
      expect(e.paramMap.missingKeyMap).toBeDefined();
      expect(e.paramMap.missingKeyMap).toBeInstanceOf(Object);
      expect(e.paramMap.missingKeyMap["$.name"]).toBeDefined();
      expect(e.paramMap.missingKeyMap["$.name"]).toBeInstanceOf(Object);
      expect(e.paramMap.missingKeyMap["$.text"]).toBeDefined();
      expect(e.paramMap.missingKeyMap["$.text"]).toBeInstanceOf(Object);
    }
  });

  test("A3 and A4 and A6 - createJoke method that works. Always.", async () => {
    let result = await CreateJoke({
      name: "Joke that never ever will be tested",
      text: "The text that never will be read",
      categoryList: ["5a3a5bfe85d5a73f585c2d50"]
    });

    expect(result.status).toBe(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });

  test("A5", async () => {
    const fakeCategoryId1 = "5a3a5bfe85d5a73f585c2d50";
    const fakeCategoryId2 = "6a3a5bfe85d5a73f585c2d50";
    const result = await CreateJoke({
      name: "Joke A5",
      text: "Text",
      categoryList: [fakeCategoryId1, fakeCategoryId2]
    });
    const categoryDoesNotExist = "uu-jokes-main/createJoke/categoryDoesNotExist";

    expect(result.status).toEqual(200);
    expect(result.data).toBeDefined();
    expect(result.data).toBeInstanceOf(Object);
    expect(result.data.categoryList).toBeDefined();
    expect(result.data.categoryList).toEqual([]);
    expect(result.data).toHaveProperty("id");
    expect(result.data).toHaveProperty("uuAppErrorMap");
    expect(result.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect(result.data.uuAppErrorMap[categoryDoesNotExist]).toBeDefined();
    expect(result.data.uuAppErrorMap[categoryDoesNotExist]).toBeInstanceOf(Object);
    expect(result.data.uuAppErrorMap[categoryDoesNotExist].type).toEqual("warning");
    expect(result.data.uuAppErrorMap[categoryDoesNotExist].paramMap).toBeDefined();
    expect(result.data.uuAppErrorMap[categoryDoesNotExist].paramMap.categoryIds).toEqual([
      fakeCategoryId1,
      fakeCategoryId2
    ]);
  });
});

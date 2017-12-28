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

describe("Test createJoke command", () => {
  test("HDS", async () => {
    await TestHelper.login("Readers", true);
    let createCategoryResponse = await CreateCategory();
    let categoryId = createCategoryResponse.data.id;
    let result = await CreateJoke({}, categoryId);

    expect(result.status).toEqual(200);
    expect(result.data).toBeDefined();
    expect(result.data).toBeInstanceOf(Object);
    expect(result.data.id).toBeDefined();
    expect(typeof result.data.id == "string").toBeTruthy();
    expect(result.data.uuAppErrorMap).toBeDefined();
    expect(result.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect(result.data.uuAppErrorMap).toMatchObject({});
    expect(result.data.categoryList).toBeDefined();
    expect(result.data.categoryList).toBeInstanceOf(Array);
    expect(result.data.categoryList).toContain(categoryId);
  });

  test("A1", async () => {
    await TestHelper.login("Readers", true);

    let result = await CreateJoke({ unsupportedKey: "unsupportedValue" });
    const unsupportedKeysWarn = "uu-jokesg01-main/createJoke/unsupportedKey";

    expect(result.status).toEqual(200);
    expect(result.data).toBeDefined();
    expect(result.data).toBeInstanceOf(Object);
    expect(result.data).toHaveProperty("id");
    expect(result.data).toHaveProperty("uuAppErrorMap");
    expect(result.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect(result.data.uuAppErrorMap).toHaveProperty(unsupportedKeysWarn);
    expect(result.data.uuAppErrorMap[unsupportedKeysWarn]).toBeInstanceOf(
      Object
    );
  });

  test("A2", async () => {
    await TestHelper.login("Readers", true);
    let result;

    try {
      await TestHelper.executePostCommand("createJoke", {});
    } catch (err) {
      result = err;
    }

    expect(result).toHaveProperty("paramMap");
    expect(result.paramMap).toHaveProperty("invalidValueKeyMap");
    expect(result.paramMap).toHaveProperty("missingKeyMap");
    expect(result.paramMap.missingKeyMap.hasOwnProperty("$.name")).toBeTruthy();
    expect(result.paramMap.missingKeyMap.hasOwnProperty("$.text")).toBeTruthy();
    expect(result.dtoOut).toHaveProperty("uuAppErrorMap");
    expect(result).toHaveProperty("response");
    expect(result).toHaveProperty("status");
    expect(result.status).toEqual(400);
  });

  test("A3 and A4 and A6 - createJoke method that works. Always.", async () => {
    await TestHelper.login("Readers", true);

    let result = await CreateJoke({
      name: "Joke that never ever will be tested",
      text: "The text that never will be read",
      categoryList: ["5a3a5bfe85d5a73f585c2d50"]
    });

    expect(result.status).toBe(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });

  test("A5", async () => {
    await TestHelper.login("Readers", true);

    let fakeCategoryId = "5a3a5bfe85d5a73f585c2d50";
    let result = await CreateJoke({
      name: "BAD joke",
      text: "good text",
      categoryList: [fakeCategoryId]
    });
    let categoryDoesNotExist =
      "uu-jokesg01-main/createJoke/categoryDoesNotExist";

    expect(result.status).toEqual(200);
    expect(result.data).toBeDefined();
    expect(result.data).toBeInstanceOf(Object);
    expect(result.data).toHaveProperty("id");
    expect(result.data).toHaveProperty("uuAppErrorMap");
    expect(result.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect(result.data.uuAppErrorMap[categoryDoesNotExist]).toBeDefined();
    expect(result.data.uuAppErrorMap[categoryDoesNotExist]).toBeInstanceOf(
      Object
    );
    expect(
      result.data.uuAppErrorMap[categoryDoesNotExist].paramMap
    ).toBeDefined();
    expect(
      result.data.uuAppErrorMap[categoryDoesNotExist].paramMap
    ).toHaveProperty("categoryId");
    expect(
      result.data.uuAppErrorMap[categoryDoesNotExist].paramMap.categoryId
    ).toEqual(fakeCategoryId);
  });
});

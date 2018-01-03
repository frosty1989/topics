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

describe("Test addJokeCategory command", () => {
  test("HDS", async () => {
    await TestHelper.login("Readers");
    let createCategoryResponse = await CreateCategory();
    let categoryId = createCategoryResponse.data.id;
    let result = await CreateJoke({}, categoryId);
    let jokeId = result.data.id;

    let dtoIn = { jokeId: jokeId, categoryList: [categoryId] };
    let response = await TestHelper.executePostCommand(
      "addJokeCategory",
      dtoIn
    );
    expect(response.status).toEqual(200);
    expect(response.data).toBeDefined();
    expect(response.data).toBeInstanceOf(Object);
    expect(response.data.categoryList).toBeDefined();
    expect(response.data.categoryList).toBeInstanceOf(Array);
    expect(response.data.uuAppErrorMap).toBeDefined();
    expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect(response.data.uuAppErrorMap).toMatchObject({});
  });

  test("A1", async () => {
    await TestHelper.login("Readers");
    const unsupportedKeysWarn =
      "uu-jokesg01-main/addJokeCategory/unsupportedKey";
    let createCategoryResponse = await CreateCategory();
    let categoryId = createCategoryResponse.data.id;
    let result = await CreateJoke({}, categoryId);
    let jokeId = result.data.id;

    let dtoIn = {
      jokeId: jokeId,
      categoryList: [categoryId],
      unsupportedKey: "unsupportedValue"
    };
    let response = await TestHelper.executePostCommand(
      "addJokeCategory",
      dtoIn
    );
    expect(response.status).toEqual(200);
    expect(response.data).toBeDefined();
    expect(response.data).toBeInstanceOf(Object);
    expect(response.data).toHaveProperty("uuAppErrorMap");
    expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect(response.data.uuAppErrorMap[unsupportedKeysWarn]).toBeDefined();
    expect(response.data.uuAppErrorMap[unsupportedKeysWarn]).toBeInstanceOf(
      Object
    );
  });

  test("A2", async () => {
    await TestHelper.login("Readers");

    expect.assertions(9);

    try {
      await TestHelper.executePostCommand("addJokeCategory", {});
    } catch (error) {
      expect(error).toHaveProperty("paramMap");
      expect(error.paramMap).toHaveProperty("invalidValueKeyMap");
      expect(error.paramMap).toHaveProperty("missingKeyMap");
      expect(
        error.paramMap.missingKeyMap.hasOwnProperty("$.jokeId")
      ).toBeTruthy();
      expect(
        error.paramMap.missingKeyMap.hasOwnProperty("$.categoryList")
      ).toBeTruthy();
      expect(error.dtoOut).toHaveProperty("uuAppErrorMap");
      expect(error).toHaveProperty("response");
      expect(error).toHaveProperty("status");
      expect(error.status).toEqual(400);
    }
  });

  test("A4", async () => {
    await TestHelper.login("Readers");

    const jokeDoesNotExistCode =
      "uu-jokesg01-main/addJokeCategory/jokeDoesNotExist";
    const fakeJokeId = "5a33ba462eb85507bcf0c444";

    expect.assertions(2);
    try {
      let createCategoryResponse = await CreateCategory();
      let categoryId = createCategoryResponse.data.id;

      await TestHelper.executePostCommand("addJokeCategory", {
        jokeId: fakeJokeId,
        categoryList: [categoryId]
      });
    } catch (error) {
      expect(error.code).toBe(jokeDoesNotExistCode);
      expect(error.status).toBe(500);
    }
  });
});

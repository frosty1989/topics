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

describe("Test removeJokeCategory command", () => {
  test("HDS", async () => {
    await TestHelper.login("Readers");
    let category = await CreateCategory();
    let categoryId = category.id;
    let joke = await CreateJoke({}, categoryId);
    let jokeId = joke.data.id;
    let dtoInForAddJokeCategory = {
      jokeId: jokeId,
      categoryList: [categoryId]
    };
    let newJokeCategory = await TestHelper.executePostCommand(
      "addJokeCategory",
      dtoInForAddJokeCategory
    );
    let categories = newJokeCategory.data.categoryList;
    let response = await TestHelper.executePostCommand("removeJokeCategory", {
      jokeId: jokeId,
      categoryList: categories
    });

    expect(response.status).toEqual(200);
    expect(response.data).toBeDefined();
    expect(response.data.uuAppErrorMap).toBeDefined();
    expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect(response.data.uuAppErrorMap).toEqual({});
  });

  test("A1", async () => {
    await TestHelper.login("Readers");

    let category = await CreateCategory();
    let categoryId = category.id;
    let joke = await CreateJoke({}, categoryId);
    let jokeId = joke.data.id;
    let dtoInForAddJokeCategory = {
      jokeId: jokeId,
      categoryList: [categoryId]
    };
    let newJokeCategory = await TestHelper.executePostCommand(
      "addJokeCategory",
      dtoInForAddJokeCategory
    );
    let categories = newJokeCategory.data.categoryList;
    let response = await TestHelper.executePostCommand("removeJokeCategory", {
      jokeId: jokeId,
      categoryList: categories,
      unsupportedKey: "unsupportedValue"
    });
    expect(response.status).toEqual(200);
    expect(typeof response.data.uuAppErrorMap).toBe("object");
    expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect("warning").toEqual(
      response.data.uuAppErrorMap[
        "uu-jokesg01-main/removeJokeCategory/unsupportedKey"
      ].type
    );
    expect("DtoIn contains unsupported keys.").toEqual(
      response.data.uuAppErrorMap[
        "uu-jokesg01-main/removeJokeCategory/unsupportedKey"
      ].message
    );
    let invalidData =
      response.data.uuAppErrorMap[
        "uu-jokesg01-main/removeJokeCategory/unsupportedKey"
      ].paramMap["unsupportedKeyList"][0];
    expect(invalidData).toEqual("$.invalid");
  });

  test("if joke category does not exist", async () => {
    await TestHelper.login("Readers");
    expect.assertions(6);
    let category = await CreateCategory();
    let categoryId = category.id;
    let joke = await CreateJoke({}, categoryId);
    let jokeId = joke.data.id;
    let dtoInForAddJokeCategory = {
      jokeId: jokeId,
      categoryList: [categoryId]
    };
    let newJokeCategory = await TestHelper.executePostCommand(
      "addJokeCategory",
      dtoInForAddJokeCategory
    );
    let categories = newJokeCategory.data.categoryList;
    await TestHelper.executePostCommand("removeJokeCategory", {
      jokeId: jokeId,
      categoryList: categories,
      invalid: "invalid"
    });
    try {
      await TestHelper.executePostCommand("removeJokeCategory", {
        wrongKey: 123,
        categoryList: "Wrong value"
      });
    } catch (error) {
      expect(error.status).toEqual(400);
      expect(error.code).toBeDefined();
      expect(error.code).toBe(
        "uu-jokesg01-main/removeJokeCategory/invalidDtoIn"
      );
      expect(error.paramMap).toBeDefined();
      expect(error.paramMap.invalidValueKeyMap).toBeDefined();
      expect(error.paramMap.missingKeyMap).toBeDefined();
    }
  });
});

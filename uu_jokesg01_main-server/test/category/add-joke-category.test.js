const { TestHelper } = require("uu_appg01_workspace-test");
const { CreateJoke } = require("../general-test-hepler");
const { CreateCategory } = require("../general-test-hepler");

beforeEach(async done => {
  await TestHelper.setup();
  await TestHelper.initAppWorkspace();
  await TestHelper.login("SysOwner");
  await TestHelper.executePostCommand("init", {
    uuAppProfileAuthorities: "urn:uu:GGALL"
  });
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
    let category1 = await CreateCategory({
      name: "Very funny jokes",
      desc: "Category description"
    });
    let category2 = await CreateCategory({
      name: "Another one category",
      desc: "Category description"
    });
    let categoryList = [category1.data.id, category2.data.id];
    let joke = await CreateJoke({
      name: "Very funny joke",
      text: "Text"
    });
    let jokeId = joke.data.id;
    let dtoIn = {
      jokeId: jokeId,
      categoryList
    };
    let response = await TestHelper.executePostCommand(
      "addJokeCategory",
      dtoIn
    );

    expect(response.status).toEqual(200);
    expect(response.data).toBeDefined();
    expect(response.data).toBeInstanceOf(Object);
    expect(response.data.uuAppErrorMap).toBeDefined();
    expect(response.data.uuAppErrorMap).toMatchObject({});
    expect(response.data.categoryList).toBeDefined();
    expect(response.data.categoryList).toBeInstanceOf(Array);
    expect(response.data.categoryList).toEqual(categoryList);
    expect(response.data.categoryList.length).toBe(categoryList.length);
  });

  test("A1", async () => {
    await TestHelper.login("Readers");
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
    const unsupportedKeysWarn = "uu-jokes-main/addJokeCategory/unsupportedKeys";

    expect(response.status).toEqual(200);
    expect(response.data).toBeDefined();
    expect(response.data).toBeInstanceOf(Object);
    expect(response.data.categoryList).toBeDefined();
    expect(response.data.categoryList).toBeInstanceOf(Array);
    expect(response.data.uuAppErrorMap).toBeDefined();
    expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect(response.data.uuAppErrorMap[unsupportedKeysWarn]).toBeDefined();
    expect(response.data.uuAppErrorMap[unsupportedKeysWarn]).toBeInstanceOf(
      Object
    );
  });

  test("A2", async () => {
    await TestHelper.login("Readers");

    expect.assertions(9);

    await CreateCategory();

    const dtoInInvalid = {
      jokeId: 123,
      categoryList: 123
    };

    try {
      await TestHelper.executePostCommand("addJokeCategory", dtoInInvalid);
    } catch (error) {
      expect(error).toHaveProperty("paramMap");
      expect(error.paramMap).toHaveProperty("invalidValueKeyMap");
      expect(error.paramMap).toHaveProperty("invalidTypeKeyMap");
      expect(
        error.paramMap.invalidTypeKeyMap.hasOwnProperty("$.jokeId")
      ).toBeTruthy();
      expect(
        error.paramMap.invalidTypeKeyMap.hasOwnProperty("$.categoryList")
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
      "uu-jokes-main/addJokeCategory/jokeDoesNotExist";
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
      expect(error.status).toBe(400);
    }
  });

  test("A6", async () => {
    await TestHelper.login("Readers");
    let category1 = await CreateCategory({
      name: "Very funny jokes",
      desc: "Category description"
    });
    let category2 = await CreateCategory({
      name: "Another one category",
      desc: "Category description"
    });
    const code = "uu-jokes-main/addJokeCategory/categoryDoesNotExist";
    const fakeCategory1 = "5a547c8e003628174cf9e1b9";
    const fakeCategory2 = "5a547c8e003628174cf9e1b8";
    let categoryList = [category1.data.id, category2.data.id];
    let categoryListDtoIn = [].concat(categoryList, [fakeCategory1, fakeCategory2]);
    let joke = await CreateJoke({
      name: "Very funny joke",
      text: "Text"
    });
    let jokeId = joke.data.id;
    let dtoIn = {
      jokeId: jokeId,
      categoryList: categoryListDtoIn
    };
    let response = await TestHelper.executePostCommand(
      "addJokeCategory",
      dtoIn
    );

    expect(response.status).toEqual(200);
    expect(response.data).toBeDefined();
    expect(response.data).toBeInstanceOf(Object);
    expect(response.data.categoryList).toBeDefined();
    expect(response.data.categoryList).toBeInstanceOf(Array);
    expect(response.data.categoryList).toEqual(categoryList);
    expect(response.data.categoryList.length).toBe(categoryList.length);
    expect(response.data.uuAppErrorMap).toBeDefined();
    expect(response.data.uuAppErrorMap[code]).toBeDefined();
    expect(response.data.uuAppErrorMap[code]).toBeInstanceOf(Object);
    expect(response.data.uuAppErrorMap[code].type).toEqual("warning");
    expect(response.data.uuAppErrorMap[code].paramMap).toBeDefined();
    expect(response.data.uuAppErrorMap[code].paramMap.categoryIds).toEqual([
      fakeCategory1,
      fakeCategory2
    ]);
  });

  test("A8", async () => {
    const category1 = await CreateCategory({
      name: "Very funny jokes",
      desc: "Category description"
    });
    const category2 = await CreateCategory({
      name: "Another one category",
      desc: "Category description"
    });
    const joke = await CreateJoke({
      name: "Very funny joke",
      text: "Text"
    });
    await TestHelper.executePostCommand("addJokeCategory", {
      jokeId: joke.data.id,
      categoryList: [category1.data.id, category2.data.id]
    });
    let response = await TestHelper.executePostCommand("addJokeCategory", {
      jokeId: joke.data.id,
      categoryList: [category1.data.id, category2.data.id]
    });
    const code = "uu-jokes-main/addJokeCategory/jokeCategoryAlreadyExists";

    expect(response.status).toEqual(200);
    expect(response.data).toBeDefined();
    expect(response.data).toBeInstanceOf(Object);
    expect(response.data.categoryList).toBeDefined();
    expect(response.data.categoryList).toEqual([]);
    expect(response.data.categoryList.length).toBe(0);
    expect(response.data.uuAppErrorMap).toBeDefined();
    expect(response.data.uuAppErrorMap[code]).toBeDefined();
    expect(response.data.uuAppErrorMap[code].type).toBe("warning");
    expect(response.data.uuAppErrorMap[code].paramMap).toEqual([
      {
        jokeId: joke.data.id,
        categoryId: category1.data.id
      },
      {
        jokeId: joke.data.id,
        categoryId: category2.data.id
      }
    ]);
  });
});

const { TestHelper } = require("uu_appg01_workspace-test");
const { CreateCategory } = require("../general-test-hepler");
const { CreateJoke } = require("../general-test-hepler");
const CMD = "deleteCategory";

beforeAll(() => {
  return TestHelper.setup()
    .then(() => {
      return TestHelper.initAppWorkspace();
    })
    .then(() => {
      return TestHelper.login("SysOwner").then(() => {
        return TestHelper.executePostCommand("init", {
          uuAppProfileAuthorities: "urn:uu:GGALL"
        });
      });
    })
    .then(() => {
      return TestHelper.login("Executive");
    });
});

afterAll(() => {
  TestHelper.teardown();
});

describe("Test deleteCategory command", () => {
  test("HDS - forceDelete equals true", async () => {
    let category = await CreateCategory({
      name: "Category 1 HDS",
      desc: "Category 1 desc"
    });
    let joke1 = await CreateJoke({
      name: "Joke 1 HDS",
      text: "Text 1",
      categoryList: [category.data.id]
    });
    let joke2 = await CreateJoke({
      name: "Joke 2 HDS",
      text: "Text 2",
      categoryList: [category.data.id]
    });
    let joke3 = await CreateJoke({
      name: "Joke 3 HDS",
      text: "Text 3",
      categoryList: [category.data.id]
    });
    let categoryJokes = await TestHelper.executeGetCommand("listCategoryJokes", {
      categoryId: category.data.id
    });
    let result = await TestHelper.executePostCommand(CMD, {
      id: category.data.id,
      forceDelete: true
    });
    let noCategoryJokes = await TestHelper.executeGetCommand("listCategoryJokes", {
      categoryId: category.data.id
    });
    let noCategories = await TestHelper.executeGetCommand("listCategories");

    expect(result.status).toBe(200);
    expect(result.data).toBeDefined();
    expect(result.data.uuAppErrorMap).toBeDefined();
    expect(result.data.uuAppErrorMap).toMatchObject({});
    expect(categoryJokes.status).toBe(200);
    expect(categoryJokes.data).toBeDefined();
    expect(categoryJokes.data.itemList).toBeDefined();
    expect(categoryJokes.data.itemList).toHaveProperty("length");
    expect(categoryJokes.data.itemList.length).toBe(3);
    expect(noCategories.status).toBe(200);
    expect(noCategories.data).toBeDefined();
    expect(noCategories.data.itemList).toBeDefined();
    expect(noCategories.data.itemList.length).toBe(0);
  });

  test("HDS - forceDelete equals false", async () => {
    const relatedJokesExist = "uu-jokes-main/deleteCategory/relatedJokesExist";
    let category = await CreateCategory({
      name: "Category 1 HDS forceDelete",
      desc: "Category 1 desc"
    });
    let joke1 = await CreateJoke({
      name: "Joke 1 HDS forceDelete",
      text: "Text 1",
      categoryList: [category.data.id]
    });
    let joke2 = await CreateJoke({
      name: "Joke 2 HDS forceDelete",
      text: "Text 2",
      categoryList: [category.data.id]
    });
    let joke3 = await CreateJoke({
      name: "Joke 3 HDS forceDelete",
      text: "Text 3",
      categoryList: [category.data.id]
    });
    expect.assertions(2);

    try {
      await TestHelper.executePostCommand(CMD, {
        id: category.data.id,
        forceDelete: false
      });
    } catch (error) {
      expect(error.status).toBe(400);
      expect(error.code).toBe(relatedJokesExist);
    }
  });

  test("A1", async () => {
    await CreateCategory();
    let listResponce = await TestHelper.executeGetCommand("listCategories");
    let itemId = listResponce.data.itemList[0].id;
    let dtoIn = {
      id: itemId,
      forceDelete: true,
      unsupportedKey: "unsupportedValue"
    };
    let unsupportedKey = "uu-jokes-main/deleteCategory/unsupportedKeys";
    let response = await TestHelper.executePostCommand("deleteCategory", dtoIn);
    expect(response.status).toEqual(200);
    expect("warning").toEqual(response.data.uuAppErrorMap[unsupportedKey].type);
    expect("DtoIn contains unsupported keys.").toEqual(response.data.uuAppErrorMap[unsupportedKey].message);
    let invalidData = response.data.uuAppErrorMap[unsupportedKey].paramMap["unsupportedKeyList"][0];
    expect(invalidData).toEqual("$.unsupportedKey");
  });

  test("A2", async () => {
    expect.assertions(7);
    try {
      await TestHelper.executePostCommand("deleteCategory", {});
    } catch (error) {
      expect(error).toHaveProperty("paramMap");
      expect(error.paramMap).toHaveProperty("invalidValueKeyMap");
      expect(error.paramMap).toHaveProperty("missingKeyMap");
      expect(error.dtoOut).toHaveProperty("uuAppErrorMap");
      expect(error).toHaveProperty("response");
      expect(error).toHaveProperty("status");
      expect(error.status).toEqual(400);
    }
  });

  test("A4 related jokes exists", async () => {
    let createCategoryResponse = await CreateCategory();
    let categoryId = createCategoryResponse.data.id;
    await CreateJoke({}, categoryId);
    expect.assertions(6);
    try {
      await TestHelper.executePostCommand("deleteCategory", {
        id: createCategoryResponse.data.id
      });
    } catch (error) {
      expect(error).toHaveProperty("id");
      expect(error).toHaveProperty("status");
      expect(error.status).toEqual(400);
      expect(error.code).toEqual("uu-jokes-main/deleteCategory/relatedJokesExist");
      expect(error).toBeInstanceOf(Object);
      expect(error).toHaveProperty("response");
    }
  });
});

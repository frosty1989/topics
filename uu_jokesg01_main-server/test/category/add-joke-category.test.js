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
    // TODO: category list empty
    // expect(response.data.categoryList).toContain(categoryId);
    expect(response.data.uuAppErrorMap).toBeDefined();
    expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect(response.data.uuAppErrorMap).toMatchObject({});
  });

  // test("A1", async () => {
  //   await TestHelper.login("Readers");
  //   let createCategoryResponse = await CreateCategory();
  //   let categoryId = createCategoryResponse.data.id;
  //   let result = await CreateJoke({}, categoryId);
  //   let jokeId = result.data.id;
  //
  //   let dtoIn = {
  //     jokeId: jokeId,
  //     categoryList: [categoryId],
  //     unsupportedKey: "unsupportedValue"
  //   };
  //   let response = await TestHelper.executePostCommand(
  //     "addJokeCategory",
  //     dtoIn
  //   );
  //   const unsupportedKeysWarn =
  //     "uu-jokesg01-main/addJokeCategory/unsupportedKey";
  //
  //   expect(response.status).toEqual(200);
  //   expect(response.data).toBeDefined();
  //   expect(response.data).toBeInstanceOf(Object);
  //   expect(response.data).toHaveProperty("uuAppErrorMap");
  //   expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
  //   expect(response.data.uuAppErrorMap[unsupportedKeysWarn]).toBeDefined();
  //   expect(response.data.uuAppErrorMap[unsupportedKeysWarn]).toBeInstanceOf(
  //     Object
  //   );
  // });

  // test("A2", async () => {
  //   await TestHelper.login("Readers");
  //
  //   let response;
  //
  //   try {
  //     await TestHelper.executePostCommand("addJokeCategory", {});
  //   } catch (error) {
  //     response = error;
  //   }
  //
  //   expect(response).toHaveProperty("paramMap");
  //   expect(response.paramMap).toHaveProperty("invalidValueKeyMap");
  //   expect(response.paramMap).toHaveProperty("missingKeyMap");
  //   expect(
  //     response.paramMap.missingKeyMap.hasOwnProperty("$.jokeId")
  //   ).toBeTruthy();
  //   expect(
  //     response.paramMap.missingKeyMap.hasOwnProperty("$.categoryList")
  //   ).toBeTruthy();
  //   expect(response.dtoOut).toHaveProperty("uuAppErrorMap");
  //   expect(response).toHaveProperty("response");
  //   expect(response).toHaveProperty("status");
  //   expect(response.status).toEqual(400);
  // });

  // test("A4", async () => {
  //   await TestHelper.login("Readers");
  //
  //   const jokeDoesNotExistCode =
  //     "uu-jokesg01-main/addJokeCategory/jokeDoesNotExist";
  //   const fakeJokeId = "5a33ba462eb85507bcf0c444";
  //   let createCategoryResponse = await CreateCategory();
  //   let categoryId = createCategoryResponse.data.id;
  //   let response;
  //
  //   try {
  //     await TestHelper.executePostCommand("addJokeCategory", {
  //       jokeId: fakeJokeId,
  //       categoryList: [categoryId]
  //     });
  //   } catch (error) {
  //     response = error;
  //   }
  //
  //   expect(response.code).toBe(jokeDoesNotExistCode);
  //   expect(response.status).toBe(500);
  // });
});

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

// describe("Test addJokeCategory command", () => {
//   test("HDS", async () => {
//     await TestHelper.login("Readers");
//     let createCategoryResponse = await CreateCategory();
//     let categoryId = createCategoryResponse.data.id;
//     let result = await CreateJoke({}, categoryId);
//     let jokeId = result.data.id;
//
//     let dtoIn = { jokeId: jokeId, categoryList: [categoryId] };
//     let response = await TestHelper.executePostCommand(
//       "addJokeCategory",
//       dtoIn
//     );
//     expect(response.status).toEqual(200);
//     expect(response.data).toBeDefined();
//     expect(response.data).toBeInstanceOf(Object);
//     expect(response.data.id).toBeDefined();
//     expect(typeof response.data.id === "string").toBeTruthy();
//     expect(response.data.uuAppErrorMap).toBeDefined();
//     expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
//     expect(response.data.uuAppErrorMap).toMatchObject({});
//     expect(response.data.categoryList).toBeDefined();
//     expect(response.data.categoryList).toBeInstanceOf(Array);
//     expect(response.data.categoryList).toContain(categoryId);
//     expect(response.data.awid).toEqual(
//       Utils.Config.get("sysAppWorkspace")["awid"]
//     );
//   });
// });

// describe("Test addJokeCategory command", () => {
//   test("A1", async () => {
//     await TestHelper.login("Readers");
//     let createCategoryResponse = await CreateCategory();
//     let categoryId = createCategoryResponse.data.id;
//     let result = await CreateJoke({}, categoryId);
//     let jokeId = result.data.id;
//
//     let dtoIn = {
//       jokeId: jokeId,
//       categoryList: [categoryId],
//       unsupportedKey: "unsupportedValue"
//     };
//     let response = await TestHelper.executePostCommand(
//       "addJokeCategory",
//       dtoIn
//     );
//     const unsupportedKeysWarn = "uu-jokesg01-main/addJokeCategory/unsupportedKey";
//
//     expect(response.status).toEqual(200);
//     expect(response.data).toBeDefined();
//     expect(response.data).toBeInstanceOf(Object);
//     expect(response.data).toHaveProperty("id");
//     expect(response.data).toHaveProperty("uuAppErrorMap");
//     expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
//     expect(response.data.uuAppErrorMap).toHaveProperty(unsupportedKeysWarn);
//     expect(result.data.uuAppErrorMap[unsupportedKeysWarn]).toBeInstanceOf(
//       Object
//     );
//   });
// });

// describe("Test addJokeCategory command", () => {
//   test("A2", async () => {
//     await TestHelper.login("Readers");
//     let response;
//     try {
//       await TestHelper.executePostCommand("addJokeCategory", {});
//     } catch (error) {
//       response = error;
//       console.log(error);
//     }
//
//     expect(response).toHaveProperty("paramMap");
//     expect(response.paramMap).toHaveProperty("invalidValueKeyMap");
//     expect(response.paramMap).toHaveProperty("missingKeyMap");
//     expect(response.paramMap.missingKeyMap.hasOwnProperty("$.jokeId")).toBeTruthy();
//     expect(response.paramMap.missingKeyMap.hasOwnProperty("$.categoryList")).toBeTruthy();
//     expect(response.dtoOut).toHaveProperty("uuAppErrorMap");
//     expect(response).toHaveProperty("response");
//     expect(response).toHaveProperty("status");
//     expect(response.status).toEqual(400);
//   });
// });


describe("Test addJokeCategory command", () => {
  test("A4 - jokeDoesNotExist", async () => {
    await TestHelper.login("Readers");
    let nonexistintId = "5a33ba462eb85507bcf0c444";
    let createCategoryResponse = await CreateCategory();
    let categoryId = createCategoryResponse.data.id;
    let result = await CreateJoke({}, categoryId);
    let jokeId = result.data.id;

    let dtoIn = { jokeId: nonexistintId, categoryList: [categoryId] };
    let response = await TestHelper.executePostCommand(
      "addJokeCategory",
      dtoIn
    );
    console.log(response);
    try {
      await TestHelper.executePostCommand("addJokeCategory", dtoIn);
    } catch (error) {
      // error;
      console.log(error);
    }
  });
});

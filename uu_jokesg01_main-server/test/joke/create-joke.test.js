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

// start happy day scenario

// A1
describe("Test createJoke command HDS A1", () => {
  test("createJoke method", async () => {
    await TestHelper.login("Readers", true);
    let createCategoryResponse = await CreateCategory();
    let categoryId = createCategoryResponse.data.id;
    let result = await CreateJoke({categoryList: [categoryId], unsupportedKey);

    await expect(Array.isArray(result.data.categoryList)).toBe(true);
    await expect(result.data.categoryList.length).toBe(1);
    await expect(Object.keys(result).length).toBe(3);
  });
});

// A2
describe("Test createJoke command HDS A2", () => {
  test("createJoke method", async () => {
    await TestHelper.login("Readers", true);
    let createCategoryResponse = await CreateCategory();
    let categoryId = createCategoryResponse.data.id;
    let result = await CreateJoke(categoryId);
    await expect(result.data.name).toEqual("test name");
    await expect(result.data.text).toEqual("test desc");
    await expect(result.data.categoryList).toEqual([categoryId]);
    await expect(result.data.awid).toEqual(
      Utils.Config.get("sysAppWorkspace")["awid"]
    );
  });
});

// A3
describe("Test createJoke command HDS A3", () => {
  test("createJoke method", async () => {
    await TestHelper.login("Readers", true);
    let createCategoryResponse = await CreateCategory();
    let categoryId = createCategoryResponse.data.id;
    let result = await CreateJoke(categoryId);
    await expect(result.status).toBe(200);
    await expect(result.data.uuAppErrorMap).toEqual({});
  });
});

// A4
describe("Test createJoke command HDS A4", () => {
  test("createJoke method", async () => {
    await TestHelper.login("Readers", true);
    let createCategoryResponse = await CreateCategory();
    let categoryId = createCategoryResponse.data.id;
    let result = await CreateJoke(categoryId);

    let foundJoke = await TestHelper.executeGetCommand(
      "getJoke",
      { id: result.data.id }
      );
    let categoryOfFounedJoke = foundJoke.data.categoryList[0];

    await expect(result.data.categoryList[0]).toBe(categoryOfFounedJoke);
    await expect(result.status).toBe(200);
    await expect(result.data.uuAppErrorMap).toEqual({});
  });
});

// end happy day scenario

// Start alternative scenario
// A1
describe("Test createJoke Alternative scenario", () => {
  test("keys are entered into dtoIn beyond the dtoIn type A1", async () => {
    await TestHelper.login("Readers");
    let createCategoryResponse = await CreateCategory();
    let categoryId = createCategoryResponse.data.id;
    let invaliddtoIn = {
      name: "test name",
      text: "test desc",
      categoryList: [categoryId],
      notvalid: "not valid key"
    };
    console.log("FOO");
    let responce = await TestHelper.executePostCommand(
      "createJoke",
      invaliddtoIn
    );
    console.log("FOO");
    expect(typeof responce.data.uuAppErrorMap).toBe("object");
    expect("warning").toEqual(
      responce.data.uuAppErrorMap["uu-jokesg01-main/createJoke/unsupportedKey"]
        .type
    );
    expect("DtoIn contains unsupported keys.").toEqual(
      responce.data.uuAppErrorMap["uu-jokesg01-main/createJoke/unsupportedKey"]
        .message
    );
    let invalidData =
      responce.data.uuAppErrorMap["uu-jokesg01-main/createJoke/unsupportedKey"]
        .paramMap["unsupportedKeyList"][0];
    expect(invalidData).toEqual("$.notvalid");
  });
});

describe("unsuccessful dtoIn validation A2", () => {
  test("unsuccessful dtoIn validation A2", async () => {
    await TestHelper.login("Readers");
    let invalidDtoIn = {
      name: 123,
      text: 123,
      categoryList: 123
    };
    let status;
    try {
      await TestHelper.executePostCommand("createJoke", invalidDtoIn);
    } catch (error) {
      status = error.response.status;
    }
    expect(status).toBe(400);
  });
});

describe("uuObject Joke fails A3", () => {
  test("It throws out the jokeDaoCreateFailed exception, which writes this error into dtoOut.uuAppErrorMap and ends. A3", async () => {
    await TestHelper.login("Readers");
    let status;
    try {
      await TestHelper.executePostCommand("createJoke");
    } catch (error) {
      console.log(error.response.data.uuAppErrorMap);
      status = error.response.status;
    }
    expect(status).toBe(400);
  });
});

// End Alternative scenario

const { TestHelper } = require("uu_appg01_workspace-test");
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

describe("Test listCategories command", () => {
  test("HDS", async () => {
    await TestHelper.login("Readers");
    let createCategoryResponse = await CreateCategory();
    let response = await TestHelper.executeGetCommand("listCategories");
    expect(Array.isArray(response.data.itemList)).toBe(true);
    expect(response.data.itemList[0].name).toEqual("test name");
    expect(response.data.itemList[0].desc).toEqual("test desc");
    expect(response.data.itemList[0].glyphicon).toEqual("http://test.jpg");
    expect(response.data.itemList[0].id).toEqual(
      createCategoryResponse.data.id
    );
    expect(response.status).toEqual(200);
    expect(response.data.uuAppErrorMap).toEqual({});
    expect(response.data.uuAppErrorMap).toBeDefined();
    expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect(response.data.uuAppErrorMap).toMatchObject({});
  });
});

describe("Test listCategories command", () => {
  test("A1", async () => {
    await TestHelper.login("Readers");
    await CreateCategory();
    let invalidDtoIn = {
      pageIndex: 0,
      pageSize: 100,
      unsupportedKey: "unsupportedValue"
    };
    let code = "uu-jokesg01-main/listCategories/unsupportedKey";
    let unsupportedKey = "unsupportedKeyList";
    let response = await TestHelper.executeGetCommand(
      "listCategories",
      invalidDtoIn
    );
    console.log(response);
    expect(typeof response.data.uuAppErrorMap).toBe("object");
    expect("warning").toEqual(response.data.uuAppErrorMap[code].type);
    expect("DtoIn contains unsupported keys.").toEqual(
      response.data.uuAppErrorMap[code].message
    );
    expect(
      response.data.uuAppErrorMap[code].paramMap[unsupportedKey][0]
    ).toEqual("$.pageIndex");
    expect(
      response.data.uuAppErrorMap[code].paramMap[unsupportedKey][1]
    ).toEqual("$.pageSize");
    expect(
      response.data.uuAppErrorMap[code].paramMap[unsupportedKey][2]
    ).toEqual("$.unsupportedKey");
  });
});

describe("Test listCategoryJokes command", () => {
  test("A2", async () => {
    await TestHelper.login("Readers");
    let response;
    try {
      await TestHelper.executeGetCommand("listCategoryJokes", {});
    } catch (error) {
      response = error;
    }
    expect(response.status).toBe(400);
    expect(response).toHaveProperty("paramMap");
    expect(response.paramMap).toHaveProperty("invalidValueKeyMap");
    expect(response.paramMap).toHaveProperty("missingKeyMap");
    expect(response.dtoOut).toHaveProperty("uuAppErrorMap");
    expect(response).toHaveProperty("response");
    expect(response).toHaveProperty("status");
  });
});

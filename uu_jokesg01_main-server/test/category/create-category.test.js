const { TestHelper } = require("uu_appg01_workspace-test");
const { CreateCategory, InitApp } = require("../general-test-hepler");

beforeAll(async () => {
  await InitApp();
  await TestHelper.login("Executive");
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe("Test createCategory command", () => {
  test("HDS", async () => {
    let response = await CreateCategory();
    expect(response.data.name).toBeDefined();
    expect(response.data.desc).toBeDefined();
    expect(typeof response.data.name).toBe("string");
    expect(typeof response.data.desc).toBe("string");
    expect(response.data.uuAppErrorMap).toBeDefined();
    expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect(response.data.uuAppErrorMap).toMatchObject({});
    expect(response.data.awid).toEqual(TestHelper.awid);
  });

  test("A1", async () => {
    let invalidDtoIn = {
      name: "test name",
      desc: "test desc",
      glyphicon: "http://test.jpg",
      unsupportedKey: "unsupported value"
    };
    let response = await CreateCategory(invalidDtoIn);
    let unsupportedKey = "uu-jokes-main/createCategory/unsupportedKeys";
    expect(response.status).toEqual(200);
    expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect(response.data).toHaveProperty("id");
    expect(response.data).toHaveProperty("name");
    expect(response.data).toHaveProperty("desc");
    expect(response.data).toHaveProperty("glyphicon");
    expect(response.data).toHaveProperty("uuAppErrorMap");
    expect("warning").toEqual(response.data.uuAppErrorMap[unsupportedKey].type);
    expect("DtoIn contains unsupported keys.").toEqual(response.data.uuAppErrorMap[unsupportedKey].message);
    expect(response.data.uuAppErrorMap["uu-jokes-main/createCategory/unsupportedKeys"]).toBeInstanceOf(Object);
  });

  test("A2", async () => {
    expect.assertions(9);
    try {
      let invalidDtoIn = { name: 123, desc: 123, glyphicon: 123 };
      await CreateCategory(invalidDtoIn);
    } catch (e) {
      expect(e).toHaveProperty("paramMap");
      expect(e.paramMap).toHaveProperty("invalidValueKeyMap");
      expect(e.paramMap.invalidTypeKeyMap.hasOwnProperty("$.name")).toBeTruthy();
      expect(e.paramMap.invalidTypeKeyMap.hasOwnProperty("$.desc")).toBeTruthy();
      expect(e.paramMap.invalidTypeKeyMap.hasOwnProperty("$.glyphicon")).toBeTruthy();
      expect(e.dtoOut).toHaveProperty("uuAppErrorMap");
      expect(e).toHaveProperty("response");
      expect(e).toHaveProperty("status");
      expect(e.status).toBe(400);
    }
  });

  test("A3 - uuObject Category with the specified name already exists", async () => {
    let errorCode = "uu-jokes-main/createCategory/categoryNameNotUnique";
    expect.assertions(4);
    try {
      const categoryName = "Category 1";
      let category1 = await CreateCategory({
        name: categoryName,
        desc: "Desc"
      });
      await TestHelper.executePostCommand("createCategory", {
        name: category1.data.name,
        desc: "test desc",
        glyphicon: "http://test.jpg"
      });
    } catch (error) {
      expect(error.code).toBeDefined();
      expect(error.id).toBeDefined();
      expect(error.status).toEqual(400);
      expect(error.code).toBe(errorCode);
    }
  });
});

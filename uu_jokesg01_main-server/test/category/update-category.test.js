const { TestHelper } = require("uu_appg01_workspace-test");
const { CreateCategory, InitApp } = require("../general-test-hepler");
const CMD = "updateCategory";

let category = null;

beforeAll(async () => {
  await InitApp();
  category = await CreateCategory();
  await TestHelper.login("Executive");
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe("Test updateCategory command", () => {
  test("HDS", async () => {
    const newName = "Update name HDS";
    const newDesc = "Update text";
    const response = await TestHelper.executePostCommand(CMD, {
      id: category.data.id,
      name: newName,
      desc: newDesc
    });

    expect(response.status).toEqual(200);
    expect(response.data).toBeDefined();
    expect(response.data).toBeInstanceOf(Object);
    expect(response.data.id).toBeDefined();
    expect(response.data.id).toEqual(category.data.id);
    expect(response.data.name).toEqual(newName);
    expect(response.data.desc).toEqual(newDesc);
  });

  test("A1", async () => {
    const code = `uu-jokes-main/${CMD}/unsupportedKeys`;
    const response = await TestHelper.executePostCommand(CMD, {
      id: category.data.id,
      name: "Update name A1",
      desc: "Update text",
      invalidKey: "invalid data value"
    });

    expect(response.status).toEqual(200);
    expect(response.data.uuAppErrorMap[code].type).toEqual("warning");
    expect(response.data.uuAppErrorMap[code].message).toEqual("DtoIn contains unsupported keys.");
    expect(response.data.uuAppErrorMap[code].paramMap).toBeDefined();
    expect(response.data.uuAppErrorMap[code].paramMap.unsupportedKeyList).toContain("$.invalidKey");
  });

  test("A2", async () => {
    expect.assertions(7);
    try {
      await TestHelper.executePostCommand(CMD, {
        id: 123,
        name: "test name",
        desc: "test desc",
        glyphicon: "http://test.jpg"
      });
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual(`uu-jokes-main/${CMD}/invalidDtoIn`);
      expect(e).toHaveProperty("paramMap");
      expect(e.paramMap).toHaveProperty("invalidTypeKeyMap");
      expect(e.paramMap["invalidTypeKeyMap"]["$.id"]).toBeDefined();
      expect(e.paramMap).toHaveProperty("invalidValueKeyMap");
      expect(e.paramMap["invalidValueKeyMap"]["$"]).toBeDefined();
    }
  });

  test("A3", async () => {
    const categoryName = "Category...";

    await CreateCategory({
      name: categoryName,
      desc: "Desc..."
    });
    expect.assertions(5);

    try {
      await TestHelper.executePostCommand(CMD, {
        id: category.data.id,
        name: categoryName,
        desc: "Absolutely unique description but the same name."
      });
    } catch (error) {
      expect(error.status).toEqual(400);
      expect(error.code).toEqual(`uu-jokes-main/${CMD}/categoryNameNotUnique`);
      expect(error.paramMap).toBeDefined();
      expect(error.paramMap.name).toBeDefined();
      expect(error.paramMap.name).toEqual(categoryName);
    }
  });
});

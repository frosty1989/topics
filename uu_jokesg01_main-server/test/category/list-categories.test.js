const { TestHelper } = require("uu_appg01_workspace-test");
const { CreateCategory, InitApp } = require("../general-test-hepler");
const CMD = "listCategories";

let categoryList = [];

describe("Test listCategories command", () => {
  beforeAll(async () => {
    await InitApp();

    for (let i = 1; i < 11; i++) {
      let category = await CreateCategory({
        name: `Name of category ${i}`,
        desc: "Just a description..."
      });

      categoryList.push(category.data);
    }

    await TestHelper.login("Reader");
  });

  afterAll(async () => {
    await TestHelper.teardown();
  });

  test("HDS", async () => {
    let response = await TestHelper.executeGetCommand(CMD);
    expect(response.status).toEqual(200);
    expect(response).toHaveProperty("data");
    expect(response.data).toHaveProperty("itemList");
    expect(response.data.itemList.length).toEqual(categoryList.length);
    expect(response.data).toHaveProperty("pageInfo");
    expect(response.data.pageInfo).toEqual({
      pageIndex: 0,
      pageSize: 100,
      total: categoryList.length
    });
    expect(response.data).toHaveProperty("uuAppErrorMap");
    expect(response.data.uuAppErrorMap).toEqual({});
    expect(response.data.uuAppErrorMap).toBeDefined();
    expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect(response.data.uuAppErrorMap).toMatchObject({});
  });

  test("HDS_OrderByDefault", async () => {
    const response = await TestHelper.executeGetCommand(CMD);
    const categoriesSortedByAsc = categoryList.map(m => m.name).sort((a, b) => a.localeCompare(b));
    const itemListCategories = response.data.itemList.map(m => m.name);

    expect(response.status).toEqual(200);
    expect(itemListCategories).toEqual(categoriesSortedByAsc);
  });

  test("HDS_OrderByDesc", async () => {
    const response = await TestHelper.executeGetCommand(CMD, {
      order: "desc"
    });
    const categoriesSortedByDesc = categoryList.map(m => m.name).sort((a, b) => b.localeCompare(a));
    const itemListCategories = response.data.itemList.map(m => m.name);

    expect(response.status).toEqual(200);
    expect(itemListCategories).toEqual(categoriesSortedByDesc);
  });

  test("HDS_Paging", async () => {
    // skip it for now, remove "skip" once the new version of uuAppServer is released
    const pageSize = 5;
    const response = await TestHelper.executeGetCommand(CMD, {
      pageInfo: {
        pageSize: pageSize
      }
    });
    expect(response.status).toEqual(200);
    expect(response.data.itemList.length).toEqual(pageSize);
    expect(response.data.pageInfo).toEqual({
      pageIndex: 0,
      pageSize: pageSize,
      total: categoryList.length
    });
  });

  test("A1", async () => {
    let code = `uu-jokes-main/${CMD}/unsupportedKeys`;
    let response = await TestHelper.executeGetCommand(CMD, {
      unsupportedKey: "unsupportedValue"
    });
    expect(response.status).toEqual(200);
    expect(response.data.itemList.length).toEqual(categoryList.length);
    expect(response.data.uuAppErrorMap[code].type).toEqual("warning");
    expect(response.data.uuAppErrorMap[code].message).toEqual("DtoIn contains unsupported keys.");
    expect(response.data.uuAppErrorMap[code].paramMap.unsupportedKeyList).toContain("$.unsupportedKey");
  });

  test("A2 - missing required key", async () => {
    const code = `uu-jokes-main/${CMD}/invalidDtoIn`;
    expect.assertions(6);
    try {
      await TestHelper.executeGetCommand(CMD, {
        order: false
      });
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual(code);
      expect(e).toHaveProperty("paramMap");
      expect(e.paramMap).toHaveProperty("invalidValueKeyMap");
      expect(e.paramMap.invalidValueKeyMap["$"]).toBeDefined();
      expect(e.paramMap.invalidValueKeyMap["$.order"]).toBeDefined();
    }
  });
});

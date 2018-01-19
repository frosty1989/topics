const { TestHelper } = require("uu_appg01_workspace-test");
const { CreateCategory } = require("../general-test-hepler");
const CMD = "listCategories";

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
    let response = await TestHelper.executeGetCommand(CMD);
    expect(Array.isArray(response.data.itemList)).toBe(true);
    expect(response.data.itemList[0].name).toEqual("test name");
    expect(response.data.itemList[0].desc).toEqual("test desc");
    expect(response.data.itemList[0].glyphicon).toEqual("http://test.jpg");
    expect(response.data.itemList[0].id).toEqual(createCategoryResponse.data.id);
    expect(response.status).toEqual(200);
    expect(response.data.uuAppErrorMap).toEqual({});
    expect(response.data.uuAppErrorMap).toBeDefined();
    expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect(response.data.uuAppErrorMap).toMatchObject({});
  });

  test("HDS_OrderByDefault", async () => {
    const category1Name = "Category 1";
    const category2Name = "Category 2";
    const category3Name = "Category 3";

    await CreateCategory({ name: category1Name, desc: "Desc" });
    await CreateCategory({ name: category2Name, desc: "Desc" });
    await CreateCategory({ name: category3Name, desc: "Desc" });

    const response = await TestHelper.executeGetCommand(CMD);

    expect(response.status).toEqual(200);
    expect(response.data.itemList).toBeDefined();
    expect(Array.isArray(response.data.itemList)).toBe(true);
    expect(response.data.itemList.length).toBe(3);
    expect(response.data.itemList[0].name).toEqual(category1Name);
    expect(response.data.itemList[1].name).toEqual(category2Name);
    expect(response.data.itemList[2].name).toEqual(category3Name);
  });

  test("HDS_OrderByDesc", async () => {
    const category1Name = "Category 1";
    const category2Name = "Category 2";
    const category3Name = "Category 3";

    await CreateCategory({ name: category1Name, desc: "Desc" });
    await CreateCategory({ name: category2Name, desc: "Desc" });
    await CreateCategory({ name: category3Name, desc: "Desc" });

    const response = await TestHelper.executeGetCommand(CMD, {
      order: "desc"
    });

    expect(response.status).toEqual(200);
    expect(response.data.itemList).toBeDefined();
    expect(Array.isArray(response.data.itemList)).toBe(true);
    expect(response.data.itemList.length).toBe(3);
    expect(response.data.itemList[0].name).toEqual(category3Name);
    expect(response.data.itemList[1].name).toEqual(category2Name);
    expect(response.data.itemList[2].name).toEqual(category1Name);
  });

  test("A1", async () => {
    await TestHelper.login("Readers");
    await CreateCategory();
    let invalidDtoIn = {
      pageIndex: 0,
      pageSize: 100,
      unsupportedKey: "unsupportedValue"
    };
    let code = "uu-jokes-main/listCategories/unsupportedKeys";
    let unsupportedKey = "unsupportedKeyList";
    let response = await TestHelper.executeGetCommand(CMD, invalidDtoIn);
    expect(typeof response.data.uuAppErrorMap).toBe("object");
    expect("warning").toEqual(response.data.uuAppErrorMap[code].type);
    expect("DtoIn contains unsupported keys.").toEqual(response.data.uuAppErrorMap[code].message);
    expect(response.data.uuAppErrorMap[code].paramMap[unsupportedKey][0]).toEqual("$.pageIndex");
    expect(response.data.uuAppErrorMap[code].paramMap[unsupportedKey][1]).toEqual("$.pageSize");
    expect(response.data.uuAppErrorMap[code].paramMap[unsupportedKey][2]).toEqual("$.unsupportedKey");
  });

  test("A2", async () => {
    await TestHelper.login("Readers");
    expect.assertions(7);
    try {
      await TestHelper.executeGetCommand("listCategoryJokes", {});
    } catch (error) {
      expect(error.status).toBe(400);
      expect(error).toHaveProperty("paramMap");
      expect(error.paramMap).toHaveProperty("invalidValueKeyMap");
      expect(error.paramMap).toHaveProperty("missingKeyMap");
      expect(error.dtoOut).toHaveProperty("uuAppErrorMap");
      expect(error).toHaveProperty("response");
      expect(error).toHaveProperty("status");
    }
  });
});

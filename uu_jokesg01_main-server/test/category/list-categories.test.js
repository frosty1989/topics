const { TestHelper } = require("uu_appg01_workspace-test");
const { CreateCategory } = require("../general-test-hepler");
const CMD = "listCategories";

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
      return TestHelper.login("Reader");
    });
});

afterAll(() => {
  TestHelper.teardown();
});

describe("Test listCategories command", () => {
  test("HDS", async () => {
    let category = await CreateCategory();
    let response = await TestHelper.executeGetCommand(CMD);
    expect(response.status).toEqual(200);
    expect(Array.isArray(response.data.itemList)).toBe(true);
    expect(response.data.itemList[0].name).toEqual(category.data.name);
    expect(response.data.itemList[0].desc).toEqual(category.data.desc);
    expect(response.data.itemList[0].id).toEqual(category.data.id);
    expect(response.data.uuAppErrorMap).toEqual({});
    expect(response.data.uuAppErrorMap).toBeDefined();
    expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect(response.data.uuAppErrorMap).toMatchObject({});
  });

  test("HDS_OrderByDefault", async () => {
    const category1Name = "Category 2";
    const category2Name = "Category 3";
    const category3Name = "Category 4";

    await CreateCategory({ name: category1Name, desc: "Desc" });
    await CreateCategory({ name: category2Name, desc: "Desc" });
    await CreateCategory({ name: category3Name, desc: "Desc" });

    const response = await TestHelper.executeGetCommand(CMD);

    expect(response.status).toEqual(200);
    expect(response.data.itemList).toBeDefined();
    expect(Array.isArray(response.data.itemList)).toBe(true);
    expect(
      response.data.itemList.map(v => v.name).some(q => [category1Name, category2Name, category3Name].indexOf(q) >= 0)
    ).toBeTruthy();
  });

  test("HDS_OrderByDesc", async () => {
    const category1Name = "Category 5";
    const category2Name = "Category 6";
    const category3Name = "Category 7";

    await CreateCategory({ name: category1Name, desc: "Desc" });
    await CreateCategory({ name: category2Name, desc: "Desc" });
    await CreateCategory({ name: category3Name, desc: "Desc" });

    const response = await TestHelper.executeGetCommand(CMD, {
      order: "desc"
    });

    expect(response.status).toEqual(200);
    expect(response.data.itemList).toBeDefined();
    expect(Array.isArray(response.data.itemList)).toBe(true);
    expect(
      response.data.itemList.map(v => v.name).some(q => [category1Name, category2Name, category3Name].indexOf(q) >= 0)
    ).toBeTruthy();
  });

  test("A1", async () => {
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

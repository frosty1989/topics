const { TestHelper } = require("uu_appg01_workspace-test");
const { CreateCategory } = require("../general-test-hepler");

beforeAll(async () => {
  await TestHelper.setup();
});

beforeEach(async done => {
  await TestHelper.dropDatabase();
  await TestHelper.initAppWorkspace();
  await TestHelper.login("SysOwner");
  await TestHelper.executePostCommand("init", {
    uuAppProfileAuthorities: "urn:uu:GGALL"
  });
  await TestHelper.createPermission("Readers");
  done();
});

afterAll(() => {
  TestHelper.teardown();
});

describe("Test updateCategory command", () => {
  test("HDS", async () => {
    await TestHelper.login("Authorities");
    await CreateCategory();
    let listResponce = await TestHelper.executeGetCommand("listCategories");
    let itemId = listResponce.data.itemList[0].id;
    let dtoIn = {
      id: itemId,
      name: "Update name",
      desc: "Update text",
      glyphicon: "http://update_test.jpg"
    };
    let response = await TestHelper.executePostCommand("updateCategory", dtoIn);

    expect(response.data.name).toEqual("Update name");
    expect(response.data.desc).toEqual("Update text");
    expect(response.data.glyphicon).toEqual("http://update_test.jpg");
    expect(typeof response.data.id === "string").toBeTruthy();
    expect(typeof response.data.name === "string").toBeTruthy();
    expect(typeof response.data.desc === "string").toBeTruthy();
    expect(typeof response.data.glyphicon === "string").toBeTruthy();
    expect(response.status).toEqual(200);
    expect(response.data).toBeDefined();
    expect(response.data).toBeInstanceOf(Object);
    expect(response.data.id).toBeDefined();
  });

  test("A1", async () => {
    await TestHelper.login("Authorities");
    await CreateCategory();
    let listResponce = await TestHelper.executeGetCommand("listCategories");
    let itemId = listResponce.data.itemList[0].id;
    let dtoInInvalid = {
      id: itemId,
      name: "Update name",
      desc: "Update text",
      glyphicon: "http://update_test.jpg",
      invalidKey: "invalid data value"
    };
    let unsupportedKey = "uu-jokes-main/updateCategory/unsupportedKeys";
    let response = await TestHelper.executePostCommand(
      "updateCategory",
      dtoInInvalid
    );

    expect(response.status).toEqual(200);
    expect(typeof response.data.uuAppErrorMap).toBe("object");
    expect("warning").toEqual(response.data.uuAppErrorMap[unsupportedKey].type);
    expect("DtoIn contains unsupported keys.").toEqual(
      response.data.uuAppErrorMap[unsupportedKey].message
    );
    let invalidData =
      response.data.uuAppErrorMap[unsupportedKey].paramMap[
        "unsupportedKeyList"
      ][0];
    expect(invalidData).toEqual("$.invalidKey");
  });

  test("A2", async () => {
    await TestHelper.login("Authorities");
    expect.assertions(8);
    await CreateCategory();
    let invalidDtoIn = {
      id: 123,
      name: "test name",
      desc: "test desc",
      glyphicon: "http://test.jpg"
    };
    try {
      await TestHelper.executePostCommand("updateCategory", invalidDtoIn);
    } catch (error) {
      expect(error).toHaveProperty("paramMap");
      expect(error.paramMap).toHaveProperty("invalidValueKeyMap");
      expect(error.paramMap).toHaveProperty("invalidTypeKeyMap");
      expect(error.dtoOut).toHaveProperty("uuAppErrorMap");
      expect(error.code).toEqual(
        "uu-jokes-main/updateCategory/invalidDtoIn"
      );
      expect(error).toHaveProperty("response");
      expect(error).toHaveProperty("status");
      expect(error.status).toEqual(400);
    }
  });

  test("A3", async () => {
    await TestHelper.login("Authorities");

    expect.assertions(7);

    const categoryName = "Category 2";
    let category1 = await CreateCategory({ name: "Category 1", desc: "Desc" });
    await CreateCategory({ name: categoryName, desc: "Desc" });

    try {
      await TestHelper.executePostCommand("updateCategory", {
        id: category1.data.id,
        name: categoryName
      });
    } catch (error) {
      expect(error).toBeInstanceOf(Object);
      expect(error).toHaveProperty("code");
      expect(error.dtoOut).toHaveProperty("uuAppErrorMap");
      expect(error).toHaveProperty("response");
      expect(error).toHaveProperty("status");
      expect(error.code).toEqual(
        "uu-jokes-main/updateCategory/categoryNameNotUnique"
      );
      expect(error.status).toEqual(400);
    }
  });
});

const { TestHelper } = require("uu_appg01_workspace-test");
const { CreateCategory } = require("../general-test-hepler");

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
    }).then(() => {
      return TestHelper.login("Executive");
    });
});

afterAll(() => {
  TestHelper.teardown();
});

describe("Test updateCategory command", () => {
  test("HDS", async () => {
    const category = await CreateCategory();
    const newName = "Update name HDS";
    const newDesc = "Update text";
    let dtoIn = {
      id: category.data.id,
      name: newName,
      desc: newDesc
    };
    let response = await TestHelper.executePostCommand("updateCategory", dtoIn);

    expect(response.status).toEqual(200);
    expect(response.data.name).toEqual(newName);
    expect(response.data.desc).toEqual(newDesc);
    expect(typeof response.data.id === "string").toBeTruthy();
    expect(typeof response.data.name === "string").toBeTruthy();
    expect(typeof response.data.desc === "string").toBeTruthy();
    expect(response.data).toBeDefined();
    expect(response.data).toBeInstanceOf(Object);
    expect(response.data.id).toBeDefined();
  });

  test("A1", async () => {
    const category = await CreateCategory();
    let dtoInInvalid = {
      id: category.data.id,
      name: "Update name A1",
      desc: "Update text",
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
    expect.assertions(8);
    try {
      await TestHelper.executePostCommand("updateCategory", {
        id: 123,
        name: "test name",
        desc: "test desc",
        glyphicon: "http://test.jpg"
      });
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

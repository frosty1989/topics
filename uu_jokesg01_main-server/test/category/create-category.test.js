const { Utils } = require("uu_appg01_server");
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

describe("Test createCategory command - HDS", () => {
  test("Test createCategory command", async () => {
    await TestHelper.login("Readers");
    let response = await CreateCategory();
    expect(response.data.name).toBeDefined();
    expect(response.data.desc).toBeDefined();
    expect(response.data.glyphicon).toBeDefined();
    expect(typeof response.data.name).toBe("string");
    expect(typeof response.data.desc).toBe("string");
    expect(typeof response.data.glyphicon).toBe("string");
    expect(response.data.uuAppErrorMap).toBeDefined();
    expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect(response.data.uuAppErrorMap).toMatchObject({});
    expect(response.data.awid).toEqual(Utils.Config.get("sysAppWorkspace")["awid"]);
  });
});

describe("Test createCategory command - A1", () => {
  test("Test createCategory", async () => {
    await TestHelper.login("Readers");
    let invalidDtoIn = {
      name: "test name",
      desc: "test desc",
      glyphicon: "http://test.jpg",
      unsupportedKey: "unsupported value"
    };
    let response = await CreateCategory(invalidDtoIn);

    expect(response.status).toEqual(200);
    expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect(response.data).toHaveProperty("id");
    expect(response.data).toHaveProperty("name");
    expect(response.data).toHaveProperty("desc");
    expect(response.data).toHaveProperty("glyphicon");
    expect(response.data).toHaveProperty("uuAppErrorMap");
    expect(response.data.uuAppErrorMap['uu-jokesg01-main/createCategory/unsupportedKey']).toBeInstanceOf(
      Object
    );
  });
});

describe("Test createCategory command - A2", () => {
  test("unsuccessful dtoIn validation", async () => {
    await TestHelper.login("Readers");
    let invalidDtoIn = { name: 123, desc: 123, glyphicon: 123 };
    let response;
    try {
      await CreateCategory(invalidDtoIn);
    } catch (error) {
      response = error;
    }

    expect(response).toHaveProperty("paramMap");
    expect(response.paramMap).toHaveProperty("invalidValueKeyMap");
    console.log(response.paramMap);
    expect(response.paramMap.invalidTypeKeyMap.hasOwnProperty("$.name")).toBeTruthy();
    expect(response.paramMap.invalidTypeKeyMap.hasOwnProperty("$.desc")).toBeTruthy();
    expect(response.paramMap.invalidTypeKeyMap.hasOwnProperty("$.glyphicon")).toBeTruthy();
    expect(response.dtoOut).toHaveProperty("uuAppErrorMap");
    expect(response).toHaveProperty("response");
    expect(response).toHaveProperty("status");
    expect(response.status).toBe(400);
  });
});

describe("Test createCategory command - A3", () => {
  test("uuObject Category with the specified name already exists", async () => {
    await TestHelper.login("Readers");
    let status;
    let errorCode = "uu-jokesg01-main/createCategory/categoryNameNotUnique";
    try {
      await TestHelper.executePostCommand("createCategory", {
        name: "test name",
        desc: "test desc",
        glyphicon: "http://test.jpg"
      });

      await TestHelper.executePostCommand("createCategory", {
        name: "test name",
        desc: "test desc",
        glyphicon: "http://test.jpg"
      });
    } catch (error) {
      console.log(error);
      status = error;
    }

    expect(status.code).toBeDefined();
    expect(status).toHaveProperty("id");
    expect(status.status).toEqual(500);
    expect(status.code).toBe(errorCode);
  });
});

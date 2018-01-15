const { TestHelper } = require("uu_appg01_workspace-test");

beforeEach(async done => {
  await TestHelper.setup();
  await TestHelper.initAppWorkspace();
  await TestHelper.login("SysOwner");
  await TestHelper.createPermission("Readers");
  done();
});

afterEach(async done => {
  await TestHelper.teardown();
  done();
});

describe("Test init command", () => {
  test("HDS", async () => {
    await TestHelper.login("Readers");
    let response = await TestHelper.executePostCommand("init", {
      uuAppProfileAuthorities: "urn:uu:GGALL"
    });
    expect(response.status).toEqual(200);
    expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect(response.data).toHaveProperty("uuAppErrorMap");
    expect(response.data.uuAppErrorMap).toMatchObject({});
    expect(response.data.uuAppErrorMap).toBeDefined();
  });

  test("A1", async () => {
    await TestHelper.login("Readers");
    let invalidDtoIn = {
      uuAppProfileAuthorities: "urn:uu:GGALL",
      unsupportedKey: "unsupported value"
    };
    let response = await TestHelper.executePostCommand("init", invalidDtoIn);
    let unsupportedKey = "uu-jokes-main/initunsupportedKeys";
    expect(response.status).toEqual(200);
    expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect(response.data).toHaveProperty("uuAppErrorMap");
    expect(response.data.uuAppErrorMap[unsupportedKey].type).toEqual("warning");
    expect(response.data.uuAppErrorMap[unsupportedKey].message).toEqual("DtoIn contains unsupported keys.");
    expect(response.data.uuAppErrorMap[unsupportedKey]).toBeInstanceOf(Object);
  });

  test("A2", async () => {
    await TestHelper.login("Readers");
    expect.assertions(8);
    try {
      let invalidDtoIn = { uuAppProfileAuthorities: 123 };
      await TestHelper.executePostCommand("init", invalidDtoIn);
    } catch (e) {
      expect(e).toHaveProperty("paramMap");
      expect(e.paramMap).toHaveProperty("invalidValueKeyMap");
      expect(e.paramMap.invalidTypeKeyMap.hasOwnProperty("$.uuAppProfileAuthorities")).toBeTruthy();
      expect(e.code).toEqual("uu-jokes-main/init/invalidDtoIn");
      expect(e.dtoOut).toHaveProperty("uuAppErrorMap");
      expect(e).toHaveProperty("response");
      expect(e).toHaveProperty("status");
      expect(e.status).toBe(400);
    }
  });
});

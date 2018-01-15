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
    expect(response.data).toHaveProperty("uuAppErrorMap");
    expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect(response.data.uuAppErrorMap).toMatchObject({});
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
    expect(response.data).toHaveProperty("uuAppErrorMap");
    expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect(response.data.uuAppErrorMap[unsupportedKey]).toBeInstanceOf(Object);
    expect(response.data.uuAppErrorMap[unsupportedKey].type).toEqual("warning");
    expect(response.data.uuAppErrorMap[unsupportedKey].message).toEqual("DtoIn contains unsupported keys.");
    expect(response.data.uuAppErrorMap[unsupportedKey].paramMap).toBeDefined();
    expect(response.data.uuAppErrorMap[unsupportedKey].paramMap).toHaveProperty("unsupportedKeyList");
    expect(response.data.uuAppErrorMap[unsupportedKey].paramMap.unsupportedKeyList).toContain("$.unsupportedKey");
  });

  test("A2", async () => {
    expect.assertions(10);
    try {
      await TestHelper.login("Readers");
      await TestHelper.executePostCommand("init", { uuAppProfileAuthorities: 123 });
    } catch (e) {
      expect(e.status).toBe(400);
      expect(e).toHaveProperty("paramMap");
      expect(e.paramMap).toHaveProperty("invalidValueKeyMap");
      expect(e.paramMap.invalidValueKeyMap.hasOwnProperty("$")).toBeTruthy();
      expect(e.paramMap).toHaveProperty("invalidTypeKeyMap");
      expect(e.paramMap.invalidTypeKeyMap.hasOwnProperty("$.uuAppProfileAuthorities")).toBeTruthy();
      expect(e.code).toEqual("uu-jokes-main/init/invalidDtoIn");
      expect(e.dtoOut).toHaveProperty("uuAppErrorMap");
      expect(e).toHaveProperty("response");
      expect(e).toHaveProperty("status");
    }
  });
});

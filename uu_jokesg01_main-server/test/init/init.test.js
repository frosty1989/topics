const { TestHelper } = require("uu_appg01_workspace-test");
const authErrorCode = "authorization/userIsNotAuthorized";

beforeAll(() => {
  return TestHelper.setup()
    .then(() => {
      return TestHelper.initAppWorkspace();
    })
    .then(() => {
      return TestHelper.login("SysOwner");
    })
    .then(() => {
      return TestHelper.login("Authority");
    })
    .then(() => {
      return TestHelper.login("Executive");
    })
    .then(() => {
      return TestHelper.login("Reader");
    });
});

afterAll(() => {
  TestHelper.teardown();
});

describe("Test init command", () => {
  test("HDS", async () => {
    TestHelper.authHeader = `Bearer ${TestHelper.authTokens.SysOwner}`;
    const response = await TestHelper.executePostCommand("init", { uuAppProfileAuthorities: "urn:uu:GGALL" });

    expect(response.status).toEqual(200);
    expect(response.data).toHaveProperty("uuAppErrorMap");
    expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect(response.data.uuAppErrorMap).toMatchObject({});
  });

  test("HDS as a Authority", async () => {
    expect.assertions(9);

    try {
      TestHelper.authHeader = `Bearer ${TestHelper.authTokens.Authority}`;
      await TestHelper.executePostCommand("init", { uuAppProfileAuthorities: "urn:uu:GGALL" });
    } catch (e) {
      expect(e.status).toBe(403);
      expect(e).toHaveProperty("name");
      expect(e.name).toEqual("ApplicationError");
      expect(e).toHaveProperty("code");
      expect(e.code).toEqual(authErrorCode);
      expect(e).toHaveProperty("dtoOut");
      expect(e.dtoOut).toHaveProperty("uuAppErrorMap");
      expect(e.dtoOut.uuAppErrorMap[authErrorCode]).toBeDefined();
      expect(e.dtoOut.uuAppErrorMap[authErrorCode].type).toEqual("error");
    }
  });

  test("HDS as a Executive", async () => {
    expect.assertions(9);

    try {
      TestHelper.authHeader = `Bearer ${TestHelper.authTokens.Executive}`;
      await TestHelper.executePostCommand("init", { uuAppProfileAuthorities: "urn:uu:GGALL" });
    } catch (e) {
      expect(e.status).toBe(403);
      expect(e).toHaveProperty("name");
      expect(e.name).toEqual("ApplicationError");
      expect(e).toHaveProperty("code");
      expect(e.code).toEqual(authErrorCode);
      expect(e).toHaveProperty("dtoOut");
      expect(e.dtoOut).toHaveProperty("uuAppErrorMap");
      expect(e.dtoOut.uuAppErrorMap[authErrorCode]).toBeDefined();
      expect(e.dtoOut.uuAppErrorMap[authErrorCode].type).toEqual("error");
    }
  });

  test("HDS as a Reader", async () => {
    expect.assertions(9);

    try {
      TestHelper.authHeader = `Bearer ${TestHelper.authTokens.Reader}`;
      await TestHelper.executePostCommand("init", { uuAppProfileAuthorities: "urn:uu:GGALL" });
    } catch (e) {
      expect(e.status).toBe(403);
      expect(e).toHaveProperty("name");
      expect(e.name).toEqual("ApplicationError");
      expect(e).toHaveProperty("code");
      expect(e.code).toEqual(authErrorCode);
      expect(e).toHaveProperty("dtoOut");
      expect(e.dtoOut).toHaveProperty("uuAppErrorMap");
      expect(e.dtoOut.uuAppErrorMap[authErrorCode]).toBeDefined();
      expect(e.dtoOut.uuAppErrorMap[authErrorCode].type).toEqual("error");
    }
  });

  test("A1", async () => {
    TestHelper.authHeader = `Bearer ${TestHelper.authTokens.SysOwner}`;
    const invalidDtoIn = { uuAppProfileAuthorities: "urn:uu:GGALL", unsupportedKey: "unsupported value" };
    const response = await TestHelper.executePostCommand("init", invalidDtoIn);
    const unsupportedKey = "uu-jokes-main/initunsupportedKeys";

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
      TestHelper.authHeader = `Bearer ${TestHelper.authTokens.SysOwner}`;
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

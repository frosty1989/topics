const { TestHelper } = require("uu_appg01_workspace-test");
const DtoIn = require("../general-test-hepler").DefaultInitDtoIn;
const CMD = "init";
const NotAuthorizedCheck = e => {
  let authErrorCode = "authorization/userIsNotAuthorized";
  expect(e.status).toBe(403);
  expect(e).toHaveProperty("name");
  expect(e.name).toEqual("ApplicationError");
  expect(e).toHaveProperty("code");
  expect(e.code).toEqual(authErrorCode);
  expect(e).toHaveProperty("dtoOut");
  expect(e.dtoOut).toHaveProperty("uuAppErrorMap");
  expect(e.dtoOut.uuAppErrorMap[authErrorCode]).toBeDefined();
  expect(e.dtoOut.uuAppErrorMap[authErrorCode].type).toEqual("error");
};

describe("Test init command", () => {
  beforeAll(async () => {
    await TestHelper.setup();
    await TestHelper.initAppWorkspace();
  });

  afterAll(async () => {
    await TestHelper.teardown();
  });

  describe("As SysOwner", () => {
    beforeAll(async () => {
      await TestHelper.login("SysOwner");
    });

    test("HDS", async () => {
      const response = await TestHelper.executePostCommand(CMD, DtoIn);

      expect(response.status).toEqual(200);
      expect(response.data).toHaveProperty("uuAppErrorMap");
      expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
      expect(response.data.uuAppErrorMap).toMatchObject({});
    });

    test("A1", async () => {
      const response = await TestHelper.executePostCommand(
        CMD,
        Object.assign(
          {
            unsupportedKey: "unsupported value"
          },
          DtoIn
        )
      );
      const unsupportedKey = `uu-jokes-main/${CMD}/unsupportedKeys`;

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

    test("A2 with wrong type of value", async () => {
      expect.assertions(10);
      try {
        await TestHelper.executePostCommand(CMD, { uuAppProfileAuthorities: 123 });
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

    test("A2 with absent required field", async () => {
      expect.assertions(10);
      try {
        await TestHelper.executePostCommand(CMD, { wrongKey: true });
      } catch (e) {
        expect(e.status).toBe(400);
        expect(e).toHaveProperty("paramMap");
        expect(e.paramMap).toHaveProperty("invalidValueKeyMap");
        expect(e.paramMap.invalidValueKeyMap.hasOwnProperty("$")).toBeTruthy();
        expect(e.paramMap).toHaveProperty("missingKeyMap");
        expect(e.paramMap.missingKeyMap.hasOwnProperty("$.uuAppProfileAuthorities")).toBeTruthy();
        expect(e.code).toEqual("uu-jokes-main/init/invalidDtoIn");
        expect(e.dtoOut).toHaveProperty("uuAppErrorMap");
        expect(e).toHaveProperty("response");
        expect(e).toHaveProperty("status");
      }
    });
  });

  describe("As not SysOwner", () => {
    test("Not so happy Authority", async () => {
      expect.assertions(9);
      try {
        await TestHelper.login("Authority");
        await TestHelper.executePostCommand(CMD, DtoIn);
      } catch (e) {
        NotAuthorizedCheck(e);
      }
    });

    test("Not so happy Executive", async () => {
      expect.assertions(9);
      try {
        await TestHelper.login("Executive");
        await TestHelper.executePostCommand(CMD, DtoIn);
      } catch (e) {
        NotAuthorizedCheck(e);
      }
    });

    test("Not so happy Reader", async () => {
      expect.assertions(9);
      try {
        await TestHelper.login("Reader");
        await TestHelper.executePostCommand(CMD, DtoIn);
      } catch (e) {
        NotAuthorizedCheck(e);
      }
    });
  });
});

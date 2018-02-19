const { TestHelper } = require("uu_appg01_workspace-test");
const { CreateCategory, CreateJoke, InitApp } = require("../general-test-hepler");
const CMD = "removeJokeCategory";

beforeAll(async () => {
  await InitApp();
  await TestHelper.login("Executive");
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe("Test removeJokeCategory command", () => {
  test("HDS", async () => {
    let category = await CreateCategory();
    let joke = await CreateJoke({
      name: "Joke HDS",
      text: "Text",
      categoryList: [category.data.id]
    });
    let response = await TestHelper.executePostCommand(CMD, {
      jokeId: joke.data.id,
      categoryList: [category.data.id]
    });

    expect(response.status).toEqual(200);
    expect(response.data).toBeDefined();
    expect(response.data.uuAppErrorMap).toBeDefined();
    expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect(response.data.uuAppErrorMap).toEqual({});
  });

  test("A1", async () => {
    let category = await CreateCategory();
    let joke = await CreateJoke({
      name: "Joke A1",
      text: "Text",
      categoryList: [category.data.id]
    });
    let response = await TestHelper.executePostCommand(CMD, {
      jokeId: joke.data.id,
      categoryList: [category.data.id],
      invalid: "invalid"
    });
    const code = `uu-jokes-main/${CMD}/unsupportedKeys`;

    expect(response.status).toEqual(200);
    expect(typeof response.data.uuAppErrorMap).toBe("object");
    expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect(response.data.uuAppErrorMap[code].type).toEqual("warning");
    expect(response.data.uuAppErrorMap[code].message).toEqual("DtoIn contains unsupported keys.");
    let invalidData = response.data.uuAppErrorMap[code].paramMap["unsupportedKeyList"];
    expect(invalidData).toContain("$.invalid");
  });

  test("A2", async () => {
    expect.assertions(10);
    try {
      await TestHelper.executePostCommand(CMD, {});
    } catch (e) {
      const code = `uu-jokes-main/${CMD}/invalidDtoIn`;

      expect(e.status).toEqual(400);
      expect(e.code).toBeDefined();
      expect(e.code).toBe(code);
      expect(e.paramMap).toBeDefined();
      expect(e.paramMap.invalidValueKeyMap).toBeDefined();
      expect(e.paramMap.invalidValueKeyMap["$"]).toBeDefined();
      expect(e.paramMap.invalidValueKeyMap["$"]["shape.e002"]).toBeDefined();
      expect(e.paramMap.missingKeyMap).toBeDefined();
      expect(e.paramMap.missingKeyMap["$.jokeId"]).toBeDefined();
      expect(e.paramMap.missingKeyMap["$.jokeId"]["isRequired.001"]).toBeDefined();
    }
  });
});

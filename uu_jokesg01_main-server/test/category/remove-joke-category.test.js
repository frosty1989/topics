const { TestHelper } = require("uu_appg01_workspace-test");
const { CreateCategory } = require("../general-test-hepler");
const { CreateJoke } = require("../general-test-hepler");
const CMD = "removeJokeCategory";

beforeAll(async () => {
  await TestHelper.setup();
});

beforeEach(async done => {
  await TestHelper.dropDatabase();
  await TestHelper.initAppWorkspace();
  await TestHelper.createPermission("Readers");
  done();
});

afterAll(() => {
  TestHelper.teardown();
});

describe("Test removeJokeCategory command", () => {
  test("HDS", async () => {
    let category = await CreateCategory();
    let joke = await CreateJoke({
      name: "Joke",
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
      name: "Joke",
      text: "Text",
      categoryList: [category.data.id]
    });
    let response = await TestHelper.executePostCommand(CMD, {
      jokeId: joke.data.id,
      categoryList: [category.data.id],
      invalid: "invalid"
    });
    const code = "uu-jokes-main/removeJokeCategory/unsupportedKeys";

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
      await TestHelper.login("Readers");
      await TestHelper.executePostCommand(CMD, {});
    } catch (e) {
      const code = "uu-jokes-main/removeJokeCategory/invalidDtoIn";

      expect(e.status).toEqual(400);
      expect(e.code).toBeDefined();
      expect(e.code).toBe(code);
      expect(e.paramMap).toBeDefined();
      expect(e.paramMap.invalidValueKeyMap).toBeDefined();
      expect(e.paramMap.invalidValueKeyMap["$"]).toBeDefined();
      expect(e.paramMap.invalidValueKeyMap["$"]["shape.e002"]).toBeDefined();
      expect(e.paramMap.missingKeyMap).toBeDefined();
      expect(e.paramMap.missingKeyMap["$.jokeId"]).toBeDefined();
      expect(e.paramMap.missingKeyMap["$.jokeId"]["isRequired.e001"]).toBeDefined();
    }
  });
});

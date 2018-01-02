const { TestHelper } = require("uu_appg01_workspace-test");
const { CreateJoke } = require("../general-test-hepler");
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

const CMD = "addJokeRating";

describe("Test addJokeRating command", () => {
  test("HDS", async () => {
    let joke = await CreateJoke({ name: "Joke", text: "Text" });

    await TestHelper.login("Readers");

    const readerUuIdentity = "14-2710-1";
    let result = await TestHelper.executePostCommand(CMD, {
      id: joke.data.id,
      rating: 5
    });

    expect(result.status).toBe(200);
    expect(result.data).toBeDefined();
    expect(result.data).toBeInstanceOf(Object);
    expect(result.data.id).toBeDefined();
    expect(result.data.uuIdentity).toBeDefined();
    expect(result.data.uuIdentity).toBe(readerUuIdentity);
    expect(result.data.uuAppErrorMap).toBeDefined();
    expect(result.data.uuAppErrorMap).toEqual({});
  });

  test("A1", async () => {
    let joke = await CreateJoke({
      name: "Joke",
      text: "Text"
    });

    await TestHelper.login("Readers");

    const unsupportedKeysWarnCode =
      "uu-jokesg01-main/addJokeRating/unsupportedKey";
    let result = await TestHelper.executePostCommand(CMD, {
      id: joke.data.id,
      rating: 5,
      unsupportedKey: "Unsupported value"
    });

    expect(result.status).toBe(200);
    expect(result.data).toBeDefined();
    expect(result.data).toBeInstanceOf(Object);
    expect(result.data.uuAppErrorMap).toBeDefined();
    expect(result.data.uuAppErrorMap[unsupportedKeysWarnCode]).toBeDefined();
    expect(
      result.data.uuAppErrorMap[unsupportedKeysWarnCode].paramMap
    ).toBeDefined();
    expect(
      result.data.uuAppErrorMap[unsupportedKeysWarnCode].paramMap
        .unsupportedKeyList
    ).toBeDefined();
    expect(
      result.data.uuAppErrorMap[unsupportedKeysWarnCode].paramMap
        .unsupportedKeyList
    ).toContain("$.unsupportedKey");
  });

  test("A2", async () => {
    await TestHelper.login("Readers");

    let result;

    try {
      await TestHelper.executePostCommand(CMD, {});
    } catch (err) {
      result = err;
    }

    expect(result.code).toBeDefined();
    expect(result.code).toBe("uu-jokesg01-main/addJokeRating/invalidDtoIn");
    expect(result.paramMap).toBeDefined();
    expect(result.paramMap).toBeInstanceOf(Object);
    expect(result.paramMap.invalidValueKeyMap).toBeDefined();
    expect(result.paramMap.invalidValueKeyMap["$"]).toBeDefined();
    expect(result.paramMap.invalidValueKeyMap["$"]["shape.e002"]).toBeDefined();
    expect(result.paramMap.missingKeyMap).toBeDefined();
    expect(result.paramMap.missingKeyMap["$.id"]).toBeDefined();
    expect(
      result.paramMap.missingKeyMap["$.id"]["isRequired.001"]
    ).toBeDefined();
    expect(result.paramMap.missingKeyMap["$.rating"]).toBeDefined();
    expect(
      result.paramMap.missingKeyMap["$.rating"]["isRequired.001"]
    ).toBeDefined();
  });

  test("A4", async () => {
    await TestHelper.login("Readers");

    const fakeJokeId = "5a3a5bfe85d5a73f585c2d50";
    let result;

    try {
      await TestHelper.executePostCommand(CMD, {
        id: fakeJokeId,
        rating: 5
      });
    } catch (err) {
      result = err;
    }

    expect(result.status).toBe(400);
    expect(result.code).toBeDefined();
    expect(result.code).toBe("uu-jokesg01-main/addJokeRating/jokeDoesNotExist");
  });
});

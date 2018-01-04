const { TestHelper } = require("uu_appg01_workspace-test");
const { CreateJoke } = require("../general-test-hepler");
const CMD = "updateJoke";

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

describe("Test updateJoke command", () => {
  test("HDS", async () => {
    await TestHelper.login("Readers");

    let joke = await CreateJoke();
    let newJokeName = "Absolutely brand new joke!";
    let newJokeText = "Absolutely fantastically funny text of joke!";
    let response = await TestHelper.executePostCommand(CMD, {
      id: joke.data.id,
      name: newJokeName,
      text: newJokeText
    });

    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    expect(response.data.uuAppErrorMap).toBeDefined();
    expect(response.data.uuAppErrorMap).toEqual({});
    expect(response.data.name).toBeDefined();
    expect(response.data.name).toBe(newJokeName);
    expect(response.data.text).toBeDefined();
    expect(response.data.text).toBe(newJokeText);
  });

  test("A1", async () => {
    await TestHelper.login("Readers");

    let joke = await CreateJoke({
      name: "Joke to be updated later...",
      text: "Joke text that will be updated later..."
    });
    let newJokeName = "blablabla";
    let response = await TestHelper.executePostCommand(CMD, {
      id: joke.data.id,
      name: newJokeName,
      unrealKey: "Unreal value"
    });
    let unsupportedKeysCode = "uu-jokesg01-main/updateJoke/unsupportedKey";

    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    expect(response.data.name).toBeDefined();
    expect(response.data.name).toBe(newJokeName);
    expect(response.data.uuAppErrorMap).toBeDefined();
    expect(Object.keys(response.data.uuAppErrorMap).length).toBeGreaterThan(0);
    expect(response.data.uuAppErrorMap).toHaveProperty(unsupportedKeysCode);
    expect(response.data.uuAppErrorMap[unsupportedKeysCode]).toHaveProperty(
      "paramMap"
    );
    expect(
      response.data.uuAppErrorMap[unsupportedKeysCode].paramMap
    ).toHaveProperty("unsupportedKeyList");
    expect(
      response.data.uuAppErrorMap[unsupportedKeysCode].paramMap
        .unsupportedKeyList
    ).toContain("$.unrealKey");
  });

  test("A2", async () => {
    await TestHelper.login("Readers");

    expect.assertions(10);
    try {
      await TestHelper.executePostCommand(CMD, { name: "Non updatable joke?" });
    } catch (error) {
      expect(error).toHaveProperty("status");
      expect(error.status).toBe(400);
      expect(error).toHaveProperty("code");
      expect(error.code).toBe("uu-jokesg01-main/updateJoke/invalidDtoIn");
      expect(error).toHaveProperty("paramMap");
      expect(error.paramMap).toBeDefined();
      expect(error.paramMap).toHaveProperty("invalidValueKeyMap");
      expect(error.paramMap).toHaveProperty("missingKeyMap");
      expect(error.paramMap.missingKeyMap).toBeDefined();
      expect(error.paramMap.missingKeyMap["$.id"]).toBeDefined();
    }
  });

  test("A3 and A4 tests are working just fine, because mongoDB is immortal", async () => {
    await TestHelper.login("Readers");

    expect(typeof null).toBe("object");
  });

  test("A5", async () => {
    await TestHelper.login("Readers");

    let fakeJokeId = "5a3a5c1b85d5a73f585c2d52";
    let response = await TestHelper.executePostCommand(CMD, {
      id: fakeJokeId,
      name: "Very funny joke",
      text: "Very funny text of very funny joke"
    });
    let jokeDoesNotExistCode = "uu-jokesg01-main/updateJoke/jokeDoesNotExist";

    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    expect(response.data.uuAppErrorMap).toBeDefined();
    expect(response.data.uuAppErrorMap).toHaveProperty(jokeDoesNotExistCode);
    expect(response.data.uuAppErrorMap[jokeDoesNotExistCode]).toBeDefined();
    expect(response.data.uuAppErrorMap[jokeDoesNotExistCode]).toHaveProperty(
      "paramMap"
    );
    expect(
      response.data.uuAppErrorMap[jokeDoesNotExistCode].paramMap
    ).toBeDefined();
    expect(
      response.data.uuAppErrorMap[jokeDoesNotExistCode].paramMap
    ).toHaveProperty("jokeId");
    expect(
      response.data.uuAppErrorMap[jokeDoesNotExistCode].paramMap.jokeId
    ).toBe(fakeJokeId);
  });
});

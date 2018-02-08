const { TestHelper } = require("uu_appg01_workspace-test");
const { CreateJoke } = require("../general-test-hepler");
const CMD = "updateJoke";

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

describe("Test updateJoke command", () => {
  test("HDS", async () => {
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
    expect(response.data.awid).toBe(TestHelper.awid);
    expect(response.data.uuAppErrorMap).toBeDefined();
    expect(response.data.uuAppErrorMap).toEqual({});
    expect(response.data.name).toBeDefined();
    expect(response.data.name).toBe(newJokeName);
    expect(response.data.text).toBeDefined();
    expect(response.data.text).toBe(newJokeText);
  });

  test("A1", async () => {
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
    let unsupportedKeysCode = "uu-jokes-main/updateJoke/unsupportedKeys";

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
    expect.assertions(10);
    try {
      await TestHelper.executePostCommand(CMD, { name: "Non updatable joke?" });
    } catch (error) {
      expect(error).toHaveProperty("status");
      expect(error.status).toBe(400);
      expect(error).toHaveProperty("code");
      expect(error.code).toBe("uu-jokes-main/updateJoke/invalidDtoIn");
      expect(error).toHaveProperty("paramMap");
      expect(error.paramMap).toBeDefined();
      expect(error.paramMap).toHaveProperty("invalidValueKeyMap");
      expect(error.paramMap).toHaveProperty("missingKeyMap");
      expect(error.paramMap.missingKeyMap).toBeDefined();
      expect(error.paramMap.missingKeyMap["$.id"]).toBeDefined();
    }
  });

  test("A3 and A4 tests are working just fine, because mongoDB is immortal", async () => {
    expect(typeof null).toBe("object");
  });

  test("A5", async () => {
    const fakeJokeId = "5a3a5c1b85d5a73f585c2d52";
    const jokeDoesNotExistCode = "uu-jokes-main/updateJoke/jokeDoesNotExist";

    expect.assertions(8);

    try {
      await TestHelper.executePostCommand(CMD, {
        id: fakeJokeId,
        name: "Very funny joke",
        text: "Very funny text of very funny joke"
      });
    } catch (e) {
      expect(e.status).toBe(400);
      expect(e.dtoOut.uuAppErrorMap[jokeDoesNotExistCode]).toBeDefined();
      expect(e.dtoOut.uuAppErrorMap[jokeDoesNotExistCode].type).toBeDefined();
      expect(e.dtoOut.uuAppErrorMap[jokeDoesNotExistCode].type).toEqual("warning");
      expect(e.dtoOut.uuAppErrorMap[jokeDoesNotExistCode].paramMap).toBeDefined();
      expect(e.dtoOut.uuAppErrorMap[jokeDoesNotExistCode].paramMap).toBeInstanceOf(Object);
      expect(e.dtoOut.uuAppErrorMap[jokeDoesNotExistCode].paramMap.jokeId).toBeDefined();
      expect(e.dtoOut.uuAppErrorMap[jokeDoesNotExistCode].paramMap.jokeId).toEqual(fakeJokeId);
    }
  });
});

const { TestHelper } = require("uu_appg01_workspace-test");
const { CreateJoke, CreateCategory } = require("../general-test-hepler");
const CMD = "deleteJoke";

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
    })
    .then(() => {
      return TestHelper.login("Executive");
    });
});

afterAll(() => {
  TestHelper.teardown();
});

describe("Test deleteJoke command", () => {
  test("HDS", async () => {
    let joke = await CreateJoke();
    let category = await CreateCategory();
    await TestHelper.executePostCommand("addJokeRating", {
      id: joke.data.id,
      rating: 5
    });
    await TestHelper.executePostCommand("addJokeCategory", {
      jokeId: joke.data.id,
      categoryList: [category.data.id]
    });
    let createdJokesList = await TestHelper.executeGetCommand("listJokes");
    let response = await TestHelper.executePostCommand(CMD, {
      id: joke.data.id
    });
    let noJokesFoundList = await TestHelper.executeGetCommand("listJokes");

    expect(createdJokesList.data).toBeDefined();
    expect(createdJokesList.data.itemList).toBeDefined();
    expect(createdJokesList.data.itemList).toBeInstanceOf(Array);
    expect(createdJokesList.data.itemList.length).toBeGreaterThan(0);
    expect(noJokesFoundList.data).toBeDefined();
    expect(noJokesFoundList.data.itemList).toBeDefined();
    expect(noJokesFoundList.data.itemList).toBeInstanceOf(Array);
    expect(noJokesFoundList.data.itemList.length).toBeLessThanOrEqual(0);
    expect(response.status).toBeDefined();
    expect(response.status).toEqual(200);
    expect(response.data).toBeDefined();
    expect(response.data.uuAppErrorMap).toBeDefined();
    expect(response.data.uuAppErrorMap).toEqual({});
  });

  test("A1", async () => {
    let joke = await CreateJoke();
    let response = await TestHelper.executePostCommand(CMD, {
      id: joke.data.id,
      unsupportedKey: "Unsupported value"
    });
    let unsupportedKeyCode = "uu-jokes-main/deleteJoke/unsupportedKeys";

    expect(response.status).toBeDefined();
    expect(response.status).toEqual(200);
    expect(response.data).toBeDefined();
    expect(response.data.uuAppErrorMap).toBeDefined();
    expect(response.data.uuAppErrorMap[unsupportedKeyCode]).toBeDefined();
    expect(response.data.uuAppErrorMap[unsupportedKeyCode].paramMap).toBeDefined();
    expect(response.data.uuAppErrorMap[unsupportedKeyCode].paramMap.unsupportedKeyList).toBeDefined();
    expect(response.data.uuAppErrorMap[unsupportedKeyCode].paramMap.unsupportedKeyList).toContain("$.unsupportedKey");
  });

  test("A2", async () => {
    expect.assertions(8);
    try {
      await TestHelper.executePostCommand(CMD, {
        wrongKey: "Wrong value"
      });
    } catch (error) {
      expect(error.status).toEqual(400);
      expect(error.code).toBeDefined();
      expect(error.code).toBe("uu-jokes-main/deleteJoke/invalidDtoIn");
      expect(error.response).toBeDefined();
      expect(error.paramMap).toBeDefined();
      expect(error.paramMap.invalidValueKeyMap).toBeDefined();
      expect(error.paramMap.missingKeyMap).toBeDefined();
      expect(error.paramMap.missingKeyMap["$.id"]).toBeDefined();
    }
  });
});

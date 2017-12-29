const { TestHelper } = require("uu_appg01_workspace-test");
const { CreateJoke, CreateCategory } = require("../general-test-hepler");
const CMD = "deleteJoke";

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

//Happy day scenario
describe("Test deleteJoke command", () => {
  test("HDS", async () => {
    await TestHelper.login("Readers");

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
    await TestHelper.login("Readers");

    let joke = await CreateJoke({
      name: "Funny joke",
      text: "Funny text"
    });
    let response = await TestHelper.executePostCommand(CMD, {
      id: joke.data.id,
      unsupportedKey: "Unsupported value"
    });
    let unsupportedKeyCode = "uu-jokesg01-main/createJoke/unsupportedKey";

    expect(response.status).toBeDefined();
    expect(response.status).toEqual(200);
    expect(response.data).toBeDefined();
    expect(response.data.uuAppErrorMap).toBeDefined();
    expect(response.data.uuAppErrorMap[unsupportedKeyCode]).toBeDefined();
    expect(
      response.data.uuAppErrorMap[unsupportedKeyCode].paramMap
    ).toBeDefined();
    expect(
      response.data.uuAppErrorMap[unsupportedKeyCode].paramMap
        .unsupportedKeyList
    ).toBeDefined();
    expect(
      response.data.uuAppErrorMap[unsupportedKeyCode].paramMap
        .unsupportedKeyList
    ).toContain("$.unsupportedKey");
  });

  test("A2", async () => {
    await TestHelper.login("Readers");

    let response;

    try {
      await TestHelper.executePostCommand(CMD, {
        wrongKey: "Wrong value"
      });
    } catch (err) {
      response = err;
    }

    expect(response.status).toEqual(400);
    expect(response.code).toBeDefined();
    expect(response.code).toBe("uu-jokesg01-main/deleteJoke/invalidDtoIn");
    expect(response.response).toBeDefined();
    expect(response.response.data).toBeDefined();
    expect(response.response.data.uuAppErrorMap).toBeDefined();
    expect(
      response.response.data.uuAppErrorMap.invalidValueKeyMap
    ).toBeDefined();
    expect(
      response.response.data.uuAppErrorMap.invalidValueKeyMap.missingKeyMap
    ).toBeDefined();
    expect(
      response.response.data.uuAppErrorMap.invalidValueKeyMap.missingKeyMap["$"]
    ).toBeInstanceOf(Object);
    expect(
      response.response.data.uuAppErrorMap.invalidValueKeyMap.missingKeyMap[
        "$.id"
      ]
    ).toBeInstanceOf(Object);
  });
});

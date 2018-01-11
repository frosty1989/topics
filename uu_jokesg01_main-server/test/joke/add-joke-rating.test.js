const { TestHelper } = require("uu_appg01_workspace-test");
const { CreateJoke } = require("../general-test-hepler");
const CMD = "addJokeRating";

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

describe("Test addJokeRating command", () => {
  test("HDS", async () => {
    const joke = await CreateJoke({ name: "Joke", text: "Text" });
    const readerUuIdentity = "14-2710-1";
    const goodRating = 5;
    const badRating = 1;
    const createdRating = await TestHelper.executePostCommand(CMD, { id: joke.data.id, rating: goodRating });
    const updatedRating = await TestHelper.executePostCommand(CMD, { id: joke.data.id, rating: badRating });
    const updatedJoke = await TestHelper.executeGetCommand("getJoke", { id: joke.data.id });

    expect(createdRating.status).toBe(200);
    expect(createdRating.data).toBeDefined();
    expect(createdRating.data).toBeInstanceOf(Object);
    expect(createdRating.data.id).toBeDefined();
    expect(createdRating.data.awid).toBe(TestHelper.awid);
    expect(createdRating.data.jokeId).toBe(joke.data.id);
    expect(createdRating.data.rating).toBe(goodRating);
    expect(createdRating.data.uuIdentity).toBe(readerUuIdentity);
    expect(createdRating.data.uuAppErrorMap).toBeDefined();
    expect(createdRating.data.uuAppErrorMap).toEqual({});

    expect(updatedRating.status).toBe(200);
    expect(updatedRating.data).toBeDefined();
    expect(updatedRating.data).toBeInstanceOf(Object);
    expect(updatedRating.data.id).toBeDefined();
    expect(updatedRating.data.awid).toBe(TestHelper.awid);
    expect(updatedRating.data.jokeId).toBe(joke.data.id);
    expect(updatedRating.data.rating).toBe(badRating);
    expect(updatedRating.data.uuIdentity).toBe(readerUuIdentity);
    expect(updatedRating.data.uuAppErrorMap).toBeDefined();
    expect(updatedRating.data.uuAppErrorMap).toEqual({});

    expect(updatedJoke.status).toBe(200);
    expect(updatedJoke.data).toBeDefined();
    expect(updatedJoke.data.id).toBe(joke.data.id);
    expect(updatedJoke.data.awid).toBe(TestHelper.awid);
    expect(updatedJoke.data.averageRating).toBe(5);
    expect(updatedJoke.data.ratingCount).toBe(1);
  });

  test("A1", async () => {
    const joke = await CreateJoke({ name: "Joke", text: "Text" });
    const code = "uu-jokes-main/addJokeRating/unsupportedKeys";
    const result = await TestHelper.executePostCommand(CMD, {
      id: joke.data.id,
      rating: 5,
      unsupportedKey: "Unsupported value"
    });

    expect(result.status).toBe(200);
    expect(result.data).toBeDefined();
    expect(result.data).toBeInstanceOf(Object);
    expect(result.data.uuAppErrorMap).toBeDefined();
    expect(result.data.uuAppErrorMap[code]).toBeDefined();
    expect(result.data.uuAppErrorMap[code].paramMap).toBeDefined();
    expect(result.data.uuAppErrorMap[code].paramMap.unsupportedKeyList).toBeDefined();
    expect(result.data.uuAppErrorMap[code].paramMap.unsupportedKeyList).toContain("$.unsupportedKey");
  });

  test("A2", async () => {
    expect.assertions(13);

    try {
      await TestHelper.login("Readers");
      await TestHelper.executePostCommand(CMD, {});
    } catch (error) {
      expect(error.status).toEqual(400);
      expect(error.code).toBeDefined();
      expect(error.code).toBe("uu-jokes-main/addJokeRating/invalidDtoIn");
      expect(error.paramMap).toBeDefined();
      expect(error.paramMap).toBeInstanceOf(Object);
      expect(error.paramMap.invalidValueKeyMap).toBeDefined();
      expect(error.paramMap.invalidValueKeyMap["$"]).toBeDefined();
      expect(error.paramMap.invalidValueKeyMap["$"]["shape.e002"]).toBeDefined();
      expect(error.paramMap.missingKeyMap).toBeDefined();
      expect(error.paramMap.missingKeyMap["$.id"]).toBeDefined();
      expect(error.paramMap.missingKeyMap["$.id"]["isRequired.001"]).toBeDefined();
      expect(error.paramMap.missingKeyMap["$.rating"]).toBeDefined();
      expect(error.paramMap.missingKeyMap["$.rating"]["isRequired.001"]).toBeDefined();
    }
  });

  test("A4", async () => {
    const fakeJokeId = "5a3a5bfe85d5a73f585c2d50";

    expect.assertions(5);

    try {
      await TestHelper.login("Readers");
      await TestHelper.executePostCommand(CMD, { id: fakeJokeId, rating: 5 });
    } catch (error) {
      expect(error.status).toBe(400);
      expect(error.code).toBeDefined();
      expect(error.code).toBe("uu-jokes-main/addJokeRating/jokeDoesNotExist");
      expect(error.paramMap).toBeDefined();
      expect(error.paramMap).toHaveProperty("jokeId", fakeJokeId);
    }
  });
});

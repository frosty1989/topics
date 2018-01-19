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
    const moderateRating = 3;
    const badRating = 1;
    const goodJokeRating = await TestHelper.executePostCommand(CMD, { id: joke.data.id, rating: goodRating });
    const goodJoke = await TestHelper.executeGetCommand("getJoke", { id: joke.data.id });
    const badJokeRating = await TestHelper.executePostCommand(CMD, { id: joke.data.id, rating: badRating });
    const badJoke = await TestHelper.executeGetCommand("getJoke", { id: joke.data.id });
    const moderateJokeRating = await TestHelper.executePostCommand(CMD, {
      id: joke.data.id,
      rating: moderateRating
    });
    const moderateJoke = await TestHelper.executeGetCommand("getJoke", { id: joke.data.id });

    expect(goodJokeRating.status).toBe(200);
    expect(goodJokeRating.data).toBeDefined();
    expect(goodJokeRating.data).toBeInstanceOf(Object);
    expect(goodJokeRating.data.id).toBeDefined();
    expect(goodJokeRating.data.awid).toBe(TestHelper.awid);
    expect(goodJokeRating.data.jokeId).toBe(joke.data.id);
    expect(goodJokeRating.data.rating).toBe(goodRating);
    expect(goodJokeRating.data.uuIdentity).toBe(readerUuIdentity);
    expect(goodJokeRating.data.uuAppErrorMap).toBeDefined();
    expect(goodJokeRating.data.uuAppErrorMap).toEqual({});
    expect(goodJoke.status).toBe(200);
    expect(goodJoke.data).toBeDefined();
    expect(goodJoke.data.id).toBe(joke.data.id);
    expect(goodJoke.data.awid).toBe(TestHelper.awid);
    expect(goodJoke.data.averageRating).toBe(goodRating);
    expect(goodJoke.data.ratingCount).toBe(1);

    expect(badJokeRating.status).toBe(200);
    expect(badJokeRating.data).toBeDefined();
    expect(badJokeRating.data).toBeInstanceOf(Object);
    expect(badJokeRating.data.id).toBeDefined();
    expect(badJokeRating.data.awid).toBe(TestHelper.awid);
    expect(badJokeRating.data.jokeId).toBe(joke.data.id);
    expect(badJokeRating.data.rating).toBe(badRating);
    expect(badJokeRating.data.uuIdentity).toBe(readerUuIdentity);
    expect(badJokeRating.data.uuAppErrorMap).toBeDefined();
    expect(badJokeRating.data.uuAppErrorMap).toEqual({});
    expect(badJoke.status).toBe(200);
    expect(badJoke.data).toBeDefined();
    expect(badJoke.data.id).toBe(joke.data.id);
    expect(badJoke.data.awid).toBe(TestHelper.awid);
    expect(badJoke.data.averageRating).toBe(badRating);
    expect(badJoke.data.ratingCount).toBe(1);

    expect(moderateJokeRating.status).toBe(200);
    expect(moderateJokeRating.data).toBeDefined();
    expect(moderateJokeRating.data).toBeInstanceOf(Object);
    expect(moderateJokeRating.data.id).toBeDefined();
    expect(moderateJokeRating.data.awid).toBe(TestHelper.awid);
    expect(moderateJokeRating.data.jokeId).toBe(joke.data.id);
    expect(moderateJokeRating.data.rating).toBe(moderateRating);
    expect(moderateJokeRating.data.uuIdentity).toBe(readerUuIdentity);
    expect(moderateJokeRating.data.uuAppErrorMap).toBeDefined();
    expect(moderateJokeRating.data.uuAppErrorMap).toEqual({});
    expect(moderateJoke.status).toBe(200);
    expect(moderateJoke.data).toBeDefined();
    expect(moderateJoke.data.id).toBe(joke.data.id);
    expect(moderateJoke.data.awid).toBe(TestHelper.awid);
    expect(moderateJoke.data.averageRating).toBe(moderateRating);
    expect(moderateJoke.data.ratingCount).toBe(1);
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

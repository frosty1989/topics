const {Utils} = require("uu_appg01_server");
const {TestHelper} = require("uu_appg01_workspace-test");

beforeEach(async (done) => {
  await TestHelper.setup();
  await TestHelper.initAppWorkspace();
  await TestHelper.createPermission("Readers");
  done();
});

afterEach(async (done) => {
  await TestHelper.teardown();
  done();
});

//Happy day scenario
describe("Test removeJokeCategory command", () => {
  test("test the deleteCategory method", async () => {
    await TestHelper.login("Readers");

    let newJoke = await TestHelper.executePostCommand("createJoke", {
      name: "test name",
      text: "test desc",
      categoryList: ["e001", "e001"]
    });
    let dtoInForAddJokeCategory = { jokeId: newJoke.data.id, categoryList: ["e001", "e003"] };
    let newJokeCategory = await TestHelper.executePostCommand("addJokeCategory", dtoInForAddJokeCategory);
    let jokeId = newJokeCategory.data.jokeId;
    let categories = newJokeCategory.data.categoryList;
    let response = await TestHelper.executePostCommand("removeJokeCategory", {
      jokeId: jokeId,
      categoryList: categories
    });
    expect(response.status).toEqual(200);
    expect(response.data).toBeDefined();
    expect(response.data.uuAppErrorMap).toBeDefined();
    expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect(response.data.uuAppErrorMap).toEqual({});
  });
});

describe("Test removeJokeCategory command", () => {
  test("test for invalid keys", async () => {
    await TestHelper.login("Readers");

    let newJoke = await TestHelper.executePostCommand("createJoke", {
      name: "test name",
      text: "test desc",
      categoryList: ["e001", "e001"]
    });
    let dtoInForAddJokeCategory = { jokeId: newJoke.data.id, categoryList: ["e001", "e003"] };
    let newJokeCategory = await TestHelper.executePostCommand("addJokeCategory", dtoInForAddJokeCategory);
    let jokeId = newJokeCategory.data.jokeId;
    let categories = newJokeCategory.data.categoryList;
    let response = await TestHelper.executePostCommand("removeJokeCategory", {
      jokeId: jokeId,
      categoryList: categories,
      invalid: "invalid"
    });
    expect(typeof(response.data.uuAppErrorMap)).toBe("object");
    expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect("warning").toEqual(response.data.uuAppErrorMap['uu-jokesg01-main/removeJokeCategory/unsupportedKey'].type);
    expect("DtoIn contains unsupported keys.").toEqual(response.data.uuAppErrorMap['uu-jokesg01-main/removeJokeCategory/unsupportedKey'].message);
    let invalidData = response.data.uuAppErrorMap['uu-jokesg01-main/removeJokeCategory/unsupportedKey'].paramMap['unsupportedKeyList'][0];
    expect(invalidData).toEqual('$.invalid');
  });
});

describe("Test removeJokeCategory command", () => {
  test("if joke category does not exist", async () => {
    await TestHelper.login("Readers");
    let newJoke = await TestHelper.executePostCommand("createJoke", {
      name: "test name",
      text: "test desc",
      categoryList: ["e001", "e001"]
    });
    let dtoInForAddJokeCategory = { jokeId: newJoke.data.id, categoryList: ["e001", "e003"] };
    let newJokeCategory = await TestHelper.executePostCommand("addJokeCategory", dtoInForAddJokeCategory);
    let categories = newJokeCategory.data.categoryList;
    let status;
    try{
      await TestHelper.executePostCommand("removeJokeCategory", {
        jokeId: 123,
        categoryList: categories,
      });
    } catch(error) {
      status = error.response.status;
    }
    expect(status).toBe(500);
  });
});

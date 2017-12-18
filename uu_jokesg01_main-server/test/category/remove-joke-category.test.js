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
describe("Test deleteCategory command", () => {
  test("test the deleteCategory method", async () => {
    await TestHelper.login("Readers");

    let newJoke = await TestHelper.executePostCommand("createJoke", {
      name: "test name",
      text: "test desc",
      categoryList: ["e001", "e001"]
    });
    let dtoInForAddJokeCategory = { jokeId: newJoke.data.id, categoryList: ["e001", "e003"] };
    let newJokeCategory = await TestHelper.executePostCommand("addJokeCategory", dtoInForAddJokeCategory);
    let itemId = newJokeCategory.data.id;
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

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
    let dtoInForAddJokeCategory = {jokeId: "5a3683b73b0c7d2270979cdd", categoryList: ["e001", "e003"]};
    await TestHelper.executePostCommand("addJokeCategory", dtoInForAddJokeCategory);
    let itemId = dtoInForAddJokeCategory.jokeId;
    let dtoIn = {id: "5a3683b73b0c7d2270979ccc", categoryList: ["e001", "e003"]};
    let responce = await TestHelper.executePostCommand("removeJokeCategory", dtoIn);

    expect(responce.data.uuAppErrorMap).toEqual({});
    expect(typeof(responce.data.uuAppErrorMap)).toBe("object");
  });
});

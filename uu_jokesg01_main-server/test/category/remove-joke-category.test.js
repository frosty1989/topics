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
describe("Test removeCategory command", () => {
  test("test the removeCategory method", async () => {
    await TestHelper.login("Readers");
    let dtoInForAddJokeCategory = {jokeId: "5a3683b73b0c7d2270979cdd", categoryList: ["e001", "e003"]};
    await TestHelper.executePostCommand("addJokeCategory", dtoInForAddJokeCategory);
    let itemId = dtoInForAddJokeCategory.jokeId;
    let dtoIn = {id: "5a3683b73b0c7d2270979ccc", categoryList: ["e001", "e003"]};
    let response = await TestHelper.executePostCommand("removeJokeCategory", dtoIn);

    expect(response.data.uuAppErrorMap).toEqual({});
    expect(typeof(response.data.uuAppErrorMap)).toBe("object");
  });
});

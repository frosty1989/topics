const {Utils} = require("uu_appg01_server");
const {TestHelper} = require("uu_appg01_workspace-test");
const {InitTestEnv} = require("./init-test-env");

beforeEach(async (done) => {
  InitTestEnv();
  done();
});

afterEach(async (done) => {
  await TestHelper.teardown();
  done();
});

describe("Test the Echo command", () => {

  // Test using GET request, parameters will be sent in query-string.
  test("test the echo method", async () => {
    let result = await TestHelper.executeGetCommand("echo", {text: "test"});
    expect(result.data.echoText).toEqual("test");
    expect(result.data.awid).toEqual(Utils.Config.get("sysAppWorkspace")["awid"]);
  });

  // Test using POST request, parameters will be sent in body.
  test("test the echo method using body", async () => {
    let result = await TestHelper.executePostCommand("echo", {text: "test body"});
    expect(result.data.echoText).toEqual("test body");
    expect(result.data.awid).toEqual(Utils.Config.get("sysAppWorkspace")["awid"]);
  });

});

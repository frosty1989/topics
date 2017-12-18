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
describe("Test addJokeCategory command", () => {
  test("test the addJokeCategory method", async () => {
    await TestHelper.login("Readers");
    let dtoIn = {jokeId: "5a3683b73b0c7d2270979ccc", categoryList: ["e001", "e003"]};
    let dtoInObjectSize = Object.keys(dtoIn).length;
    let response = await TestHelper.executePostCommand("addJokeCategory", dtoIn);

    expect(response.data.jokeId).toEqual("5a3683b73b0c7d2270979ccc");
    expect(response.data.categoryList).toEqual(["e001", "e003"]);
    expect(typeof (response.data.jokeId)).toBe("string");
    expect(Array.isArray(response.data.categoryList)).toEqual(true);
    expect(response.data.awid).toEqual(Utils.Config.get("sysAppWorkspace")["awid"]);
    expect(dtoInObjectSize).toBe(2);
    expect(response.data.uuAppErrorMap).toEqual({});
    console.log(response.data.uuAppErrorMap);
  });
});

//Alternative scenarios
describe("Test addJokeCategory command", () => {
  test("tests for invalid keys", async () => {
    await TestHelper.login("Readers");
    let invalidDtoIn = {jokeId: "5a3683b73b0c7d2270979ccc", categoryList: ["e001", "e003"], notvalid: "not valid key"};
    let response = await TestHelper.executePostCommand("addJokeCategory", invalidDtoIn);
    console.log(response.data.uuAppErrorMap);

    expect(typeof(response.data.uuAppErrorMap)).toBe("object");
    expect("warning").toEqual(response.data.uuAppErrorMap['uu-demoappg01-main/addJokeCategory/unsupportedKey'].type);
    expect("DtoIn contains unsupported keys.").toEqual(response.data.uuAppErrorMap['uu-demoappg01-main/addJokeCategory/unsupportedKey'].message);
    let invalidData = response.data.uuAppErrorMap['uu-demoappg01-main/addJokeCategory/unsupportedKey'].paramMap['unsupportedKeyList'][0];
    expect(invalidData).toEqual('$.notvalid');
  });
});

describe("Test addJokeCategory command", () => {
  test("unsuccessful dtoIn validation", async () => {
    await TestHelper.login("Readers");
    let invalidDtoIn = {jokeId: "string", categoryList: 123};
    let status;
    try{
      await TestHelper.executePostCommand("addJokeCategory", invalidDtoIn);
    } catch(error) {
      status = error.response.status;
      // console.log(error);
    }
    expect(status).toBe(500);
  });
});

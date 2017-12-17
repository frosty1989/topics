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
    let responce = await TestHelper.executePostCommand("addJokeCategory", dtoIn);

    expect(responce.data.jokeId).toEqual("5a3683b73b0c7d2270979ccc");
    expect(responce.data.categoryList).toEqual(["e001", "e003"]);
    expect(typeof (responce.data.jokeId)).toBe("string");
    expect(Array.isArray(responce.data.categoryList)).toEqual(true);
    expect(responce.data.awid).toEqual(Utils.Config.get("sysAppWorkspace")["awid"]);
    expect(dtoInObjectSize).toBe(2);
    expect(responce.data.uuAppErrorMap).toEqual({});
    console.log(responce.data.uuAppErrorMap);
  });
});

//Alternative scenarios
describe("Test addJokeCategory command", () => {
  test("tests for invalid keys", async () => {
    await TestHelper.login("Readers");
    let invalidDtoIn = {jokeId: "5a3683b73b0c7d2270979ccc", categoryList: ["e001", "e003"], notvalid: "not valid key"};
    let responce = await TestHelper.executePostCommand("addJokeCategory", invalidDtoIn);
    console.log(responce.data.uuAppErrorMap);

    expect(typeof(responce.data.uuAppErrorMap)).toBe("object");
    expect("warning").toEqual(responce.data.uuAppErrorMap['uu-demoappg01-main/addJokeCategory/unsupportedKey'].type);
    expect("DtoIn contains unsupported keys.").toEqual(responce.data.uuAppErrorMap['uu-demoappg01-main/addJokeCategory/unsupportedKey'].message);
    let invalidData = responce.data.uuAppErrorMap['uu-demoappg01-main/addJokeCategory/unsupportedKey'].paramMap['unsupportedKeyList'][0];
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

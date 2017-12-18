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
describe("Test createCategory command", () => {
  test("test the createCategory method", async () => {
    await TestHelper.login("Readers");
    let dtoIn = {name: "test name", desc: "test desc", glyphicon: "http://test.jpg"};
    let dtoInObjectSize = Object.keys(dtoIn).length;
    let response = await TestHelper.executePostCommand("createCategory", dtoIn);

    expect(response.data.name).toEqual("test name");
    expect(response.data.desc).toEqual("test desc");
    expect(response.data.glyphicon).toEqual("http://test.jpg");
    expect(typeof (response.data.name)).toBe("string");
    expect(typeof (response.data.desc)).toBe("string");
    expect(typeof (response.data.glyphicon)).toBe("string");
    expect(response.data.awid).toEqual(Utils.Config.get("sysAppWorkspace")["awid"]);

    expect(dtoInObjectSize).toBe(3);
    console.log(response.data.uuAppErrorMap);
  });
});

//Alternative scenarios
describe("Test createCategory command", () => {
  test("tests for invalid keys", async () => {
    await TestHelper.login("Readers");
    let invalidDtoIn = {name: "test name", desc: "test desc", glyphicon: "http://test.jpg", notvalid: "not valid key"};
    let response = await TestHelper.executePostCommand("createCategory", invalidDtoIn);
    console.log(response.data.uuAppErrorMap);
    for(let key in response.data.uuAppErrorMap){
      if (response.data.uuAppErrorMap.hasOwnProperty(key)) {
        console.log(key + " -> " + response.data.uuAppErrorMap[key].type);
        console.log(key + " -> " + response.data.uuAppErrorMap[key].message);
        console.log(key + " -> " + response.data.uuAppErrorMap[key].paramMap.unsupportedKeyList);
      }
    }
    expect(typeof(response.data.uuAppErrorMap)).toBe("object");
    expect("warning").toEqual(response.data.uuAppErrorMap['uu-demoappg01-main/createCategory/unsupportedKey'].type);
    expect("DtoIn contains unsupported keys.").toEqual(response.data.uuAppErrorMap['uu-demoappg01-main/createCategory/unsupportedKey'].message);
    let invalidData = response.data.uuAppErrorMap['uu-demoappg01-main/createCategory/unsupportedKey'].paramMap['unsupportedKeyList'][0];
    expect(invalidData).toEqual('$.notvalid');
  });
});

describe("Test createCategory command", () => {
  test("unsuccessful dtoIn validation", async () => {
    await TestHelper.login("Readers");
    let invalidDtoIn = {name: 123, desc: 123, glyphicon: 123};
    let status;
    try{
      await TestHelper.executePostCommand("createCategory", invalidDtoIn);
    } catch(error) {
      status = error.response.status;
      // console.log(error);
    }
    expect(status).toBe(400);
  });
});

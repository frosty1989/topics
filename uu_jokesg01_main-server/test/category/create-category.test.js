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
    let responce = await TestHelper.executePostCommand("createCategory", dtoIn);
    console.log("GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG");
    console.log(responce.data);
    expect(responce.data.name).toEqual("test name");
    expect(responce.data.desc).toEqual("test desc");
    expect(responce.data.glyphicon).toEqual("http://test.jpg");
    expect(typeof (responce.data.name)).toBe("string");
    expect(typeof (responce.data.desc)).toBe("string");
    expect(typeof (responce.data.glyphicon)).toBe("string");
    expect(responce.data.awid).toEqual(Utils.Config.get("sysAppWorkspace")["awid"]);

    expect(dtoInObjectSize).toBe(3);
    console.log(responce.data.uuAppErrorMap);
  });
});

//Alternative scenarios
describe("Test createCategory command", () => {
  test("tests for invalid keys", async () => {
    await TestHelper.login("Readers");
    let invalidDtoIn = {name: "test name", desc: "test desc", glyphicon: "http://test.jpg", notvalid: "not valid key"};
    let responce = await TestHelper.executePostCommand("createCategory", invalidDtoIn);
    console.log(responce.data.uuAppErrorMap);
    for(let key in responce.data.uuAppErrorMap){
      if (responce.data.uuAppErrorMap.hasOwnProperty(key)) {
        console.log(key + " -> " + responce.data.uuAppErrorMap[key].type);
        console.log(key + " -> " + responce.data.uuAppErrorMap[key].message);
        console.log(key + " -> " + responce.data.uuAppErrorMap[key].paramMap.unsupportedKeyList);
      }
    }
    expect(typeof(responce.data.uuAppErrorMap)).toBe("object");
    expect("warning").toEqual(responce.data.uuAppErrorMap['uu-demoappg01-main/createCategory/unsupportedKey'].type);
    expect("DtoIn contains unsupported keys.").toEqual(responce.data.uuAppErrorMap['uu-demoappg01-main/createCategory/unsupportedKey'].message);
    let invalidData = responce.data.uuAppErrorMap['uu-demoappg01-main/createCategory/unsupportedKey'].paramMap['unsupportedKeyList'][0];
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

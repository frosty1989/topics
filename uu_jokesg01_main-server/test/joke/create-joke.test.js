const {Utils} = require("uu_appg01_server");
const {TestHelper} = require("uu_appg01_workspace-test");
const {CreateJoke} = require("../general-test-hepler");

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
describe("Test createJoke command", () => {
  test("test the createJoke method", async () => {
    await TestHelper.login("Readers");
    let result = await CreateJoke();
    console.log(result);
    expect(result.data.name).toEqual("test name");
    expect(result.data.text).toEqual("test desc");
    expect(result.data.categoryList).toEqual(["e001", "e001"]);
    expect(Array.isArray(result.data.categoryList)).toBe(true);
    expect(result.data.awid).toEqual(Utils.Config.get("sysAppWorkspace")["awid"]);

    expect(Object.keys(result).length).toBe(3);
    console.log(result.data.uuAppErrorMap);
  });
});

//Alternative scenarios
describe("Test createJoke command", () => {
  test("creates object store object in uuAppObjectStore", async () => {
    await TestHelper.login("Readers");
    let invaliddtoIn = {name: "test name", text: "test desc", categoryList: ["e001", "e001"], notvalid: "not valid key"};
    let responce = await TestHelper.executePostCommand("createJoke", invaliddtoIn);
    console.log(responce.data.uuAppErrorMap);
    for(let key in responce.data.uuAppErrorMap){
      if (responce.data.uuAppErrorMap.hasOwnProperty(key)) {
        console.log(key + " -> " + responce.data.uuAppErrorMap[key].type);
        console.log(key + " -> " + responce.data.uuAppErrorMap[key].message);
        console.log(key + " -> " + responce.data.uuAppErrorMap[key].paramMap.unsupportedKeyList);
      }
    }
    expect(typeof(responce.data.uuAppErrorMap)).toBe("object");
    expect("warning").toEqual(responce.data.uuAppErrorMap['uu-jokesg01-main/createJoke/unsupportedKey'].type);
    expect("DtoIn contains unsupported keys.").toEqual(responce.data.uuAppErrorMap['uu-jokesg01-main/createJoke/unsupportedKey'].message);
    let invalidData = responce.data.uuAppErrorMap['uu-jokesg01-main/createJoke/unsupportedKey'].paramMap['unsupportedKeyList'][0];
    expect(invalidData).toEqual('$.notvalid');
  });
});

describe("Test createJoke command", () => {
  test("unsuccessful dtoIn validation", async () => {
    await TestHelper.login("Readers");
    let invalidDtoIn = {name: 123, text: 123, categoryList: 123};
    let status;
    try{
      await TestHelper.executePostCommand("createJoke", invalidDtoIn);
    } catch(error) {
      status = error.response.status;
      // console.log(error);
    }
    expect(status).toBe(400);
  });
});

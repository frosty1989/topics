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
describe("Test createJoke command", () => {
  test("test the createJoke method", async () => {
    await TestHelper.login("Readers");
    let dtoIn = {name: "test name", text: "test desc", categoryList: ["e001", "e001"]};
    let dtoInObjectSize = Object.keys(dtoIn).length;
    let result = await TestHelper.executePostCommand("createJoke", dtoIn);
    expect(result.data.name).toEqual("test name");
    expect(result.data.text).toEqual("test desc");
    expect(result.data.categoryList).toEqual(["e001", "e001"]);
    expect(Array.isArray(result.data.categoryList)).toBe(true);
    expect(result.data.awid).toEqual(Utils.Config.get("sysAppWorkspace")["awid"]);

    expect(dtoInObjectSize).toBe(3);
    console.log(result.data.uuAppErrorMap);
  });
});

//Alternative scenarios
describe("Test createJoke command", () => {
  test("creates object store object in uuAppObjectStore", async () => {
    await TestHelper.login("Readers");
    let invaliddtoIn = {name: "test name", text: "test desc", categoryList: ["e001", "e001"], notvalid: "not valid key"};
    let responce = await TestHelper.executePostCommand("createJoke", invaliddtoIn);
    let key = 'uu-demoappg01-main/createJoke/unsupportedKey';
    console.log(responce.data.uuAppErrorMap);
    for(let key in responce.data.uuAppErrorMap){
      if (responce.data.uuAppErrorMap.hasOwnProperty(key)) {
        console.log(key + " -> " + responce.data.uuAppErrorMap[key].type);
        console.log(key + " -> " + responce.data.uuAppErrorMap[key].message);
        console.log(key + " -> " + responce.data.uuAppErrorMap[key].paramMap.unsupportedKeyList);
      }
    }
    expect(responce.data.name).toEqual("test name");
  });
});

describe("Test createJoke command", () => {
  test("fails to verify the existence of Object Category", async () => {
    await TestHelper.login("Readers");
    let invaliddtoIn = {name: "test name", text: "test desc", categoryList: ["e001", "e001", "invalid category name"]};
    let responce = await TestHelper.executePostCommand("createJoke", invaliddtoIn);
  });
});

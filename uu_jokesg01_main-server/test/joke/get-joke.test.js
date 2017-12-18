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
describe("Test getJoke command", () => {
  test("test the getJoke method", async () => {
    await TestHelper.login("Readers");

    let dtoInForCreateJoke = {name: "test name", text: "test desc", categoryList: ["e001", "e001"]};
    await TestHelper.executePostCommand("createJoke", dtoInForCreateJoke);
    let listResponce = await TestHelper.executeGetCommand("listJokes");
    let itemId = listResponce.data.itemList[0].id;
    let dtoIn = {id: itemId};

    let response = await TestHelper.executeGetCommand("getJoke", dtoIn);

    expect(response.data.name).toEqual("test name");
    expect(response.data.text).toEqual("test desc");
    expect(response.data.categoryList).toEqual(["e001", "e001"]);
    expect(response.data.id).toEqual(itemId);
    expect(Array.isArray(response.data.categoryList)).toBe(true);
    expect(response.data.awid).toEqual(Utils.Config.get("sysAppWorkspace")["awid"]);

    expect(response.data.uuAppErrorMap).toEqual({});
    console.log(response.data.uuAppErrorMap);
  });
});

//Alternative scenarios
describe("Test jokeJoke command", () => {
  test("creates object store object in uuAppObjectStore", async () => {
    await TestHelper.login("Readers");

    let dtoInForCreateJoke = {name: "test name", text: "test desc", categoryList: ["e001", "e001"]};
    await TestHelper.executePostCommand("createJoke", dtoInForCreateJoke);
    let listResponce = await TestHelper.executeGetCommand("listJokes");
    let itemId = listResponce.data.itemList[0].id;
    let dtoIn = {id: itemId};

    let invalidDtoIn = {id: itemId, notvalid: "not valid key"};
    let response = await TestHelper.executeGetCommand("getJoke", invalidDtoIn);
    console.log(response.data.uuAppErrorMap);
    for(let key in response.data.uuAppErrorMap){
      if (response.data.uuAppErrorMap.hasOwnProperty(key)) {
        console.log(key + " -> " + response.data.uuAppErrorMap[key].type);
        console.log(key + " -> " + response.data.uuAppErrorMap[key].message);
        console.log(key + " -> " + response.data.uuAppErrorMap[key].paramMap.unsupportedKeyList);
      }
    }
    expect(typeof(response.data.uuAppErrorMap)).toBe("object");
    expect("warning").toEqual(response.data.uuAppErrorMap['uu-demoappg01-main/getJoke/unsupportedKey'].type);
    expect("DtoIn contains unsupported keys.").toEqual(response.data.uuAppErrorMap['uu-demoappg01-main/getJoke/unsupportedKey'].message);
    let invalidData = response.data.uuAppErrorMap['uu-demoappg01-main/getJoke/unsupportedKey'].paramMap['unsupportedKeyList'][0];
    expect(invalidData).toEqual('$.notvalid');
  });
});

describe("Test createJoke command", () => {
  test("unsuccessful dtoIn validation", async () => {
    await TestHelper.login("Readers");
    let invalidDtoIn = {id: "invalid string id"};
    let status;
    try{
      await TestHelper.executeGetCommand("getJoke", invalidDtoIn);
    } catch(error) {
      status = error.response.status;
      // console.log(error);
    }
    expect(status).toBe(400);
  });
});

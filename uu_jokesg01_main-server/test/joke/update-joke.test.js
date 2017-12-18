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
describe("Test updateJoke command", () => {
  test("test the updateJoke method that keys not out of dtoInType", async () => {
    await TestHelper.login("Readers");

    let dtoInForCreateJoke = {name: "test name", text: "test desc", categoryList: ["e001", "e001"]};
    let responceFromCreateJoke = await TestHelper.executePostCommand("createJoke", dtoInForCreateJoke);

    let listResponce = await TestHelper.executeGetCommand("listJokes");

    console.log(listResponce.data);

    let itemId = listResponce.data.itemList[0].id;

    let dtoIn = {id: itemId, name: "Update name", text: "Update text"};

    let response = await TestHelper.executePostCommand("updateJoke", dtoIn);
    console.log(response.data);

    expect(response.data.name).toEqual("Update name");
    expect(response.data.text).toEqual("Update text");
    expect(response.data.uuAppErrorMap).toEqual({});
  });
});

describe("Test updateJoke command", () => {
  test("invalid optional keys", async () => {
    await TestHelper.login("Readers");

    let dtoInForCreateJoke = {name: "test name", text: "test desc", categoryList: ["e001", "e001"]};
    let responceFromCreateJoke = await TestHelper.executePostCommand("createJoke", dtoInForCreateJoke);

    let listResponce = await TestHelper.executeGetCommand("listJokes");

    console.log(listResponce.data);

    let itemId = listResponce.data.itemList[0].id;

    let invalidDtoIn = {id: itemId, name: "Update name", text: "Update text", invalid_key: "invalid key data"};

    let response = await TestHelper.executePostCommand("updateJoke", invalidDtoIn);

    for(let key in response.data.uuAppErrorMap){
      if (response.data.uuAppErrorMap.hasOwnProperty(key)) {
        console.log(key + " -> " + response.data.uuAppErrorMap[key].type);
        console.log(key + " -> " + response.data.uuAppErrorMap[key].message);
        console.log(key + " -> " + response.data.uuAppErrorMap[key].paramMap.unsupportedKeyList);
      }
    }
    expect(typeof(response.data.uuAppErrorMap)).toBe("object");
    expect("warning").toEqual(response.data.uuAppErrorMap['uu-demoappg01-main/updateJoke/unsupportedKey'].type);
    expect("DtoIn contains unsupported keys.").toEqual(response.data.uuAppErrorMap['uu-demoappg01-main/updateJoke/unsupportedKey'].message);
    let invalidData = response.data.uuAppErrorMap['uu-demoappg01-main/updateJoke/unsupportedKey'].paramMap['unsupportedKeyList'][0];
    expect(invalidData).toEqual('$.invalid_key');
  });
});


describe("Test updateJoke command", () => {
  test("joke does not exist", async () => {
    await TestHelper.login("Readers");

    let invalidDtoIn = {id: 123, name: "Update name", text: "Update text"};
    let status;
    try{
      await TestHelper.executePostCommand("updateJoke", invalidDtoIn);
    } catch(error) {
      status = error.response.status;
      // console.log(error);
    }
    expect(status).toBe(400);
  });
});

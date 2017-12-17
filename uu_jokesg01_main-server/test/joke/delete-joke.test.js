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

const USE_CASE = "deleteJoke";

//Happy day scenario
describe("Test deleteJoke command", () => {
  test("test the deleteJoke method", async () => {
    await TestHelper.login("Readers");
    let dtoInForCreateJoke = {name: "test name", text: "test desc", categoryList: ["e001", "e001"]};
    let responceFromCreateJoke = await TestHelper.executePostCommand("createJoke", dtoInForCreateJoke);
    let listResponce = await TestHelper.executeGetCommand("listJokes");
    let itemId = listResponce.data.itemList[0].id;
    console.log(itemId);
    let dtoIn = {id: itemId};
    let responce = await TestHelper.executePostCommand("deleteJoke", dtoIn);
    console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz")
    console.log(responce.data);
    expect(responce.data.uuAppErrorMap).toEqual({});
    expect(typeof(responce.data.uuAppErrorMap)).toBe("object");
  });
});

//Alternative scenario
describe("Test deleteJoke command", () => {
  test("invalid keys test", async () => {
    await TestHelper.login("Readers");
    let dtoInForCreateJoke = {name: "test name", text: "test desc", categoryList: ["e001", "e001"]};
    let responceFromCreateJoke = await TestHelper.executePostCommand("createJoke", dtoInForCreateJoke);
    let listResponce = await TestHelper.executeGetCommand("listJokes");
    let itemId = listResponce.data.itemList[0].id;
    let dtoInInvalid = {id: itemId, invalidKey: "invalid key value"};
    console.log(itemId);
    // let dtoIn = {id: itemId};
    let responce = await TestHelper.executePostCommand("deleteJoke", dtoInInvalid);
    console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz")
    console.log(responce.data);
    expect(typeof(responce.data.uuAppErrorMap)).toBe("object");
    expect("warning").toEqual(responce.data.uuAppErrorMap['uu-demoappg01-main/deleteJoke/unsupportedKey'].type);
    expect("DtoIn contains unsupported keys.").toEqual(responce.data.uuAppErrorMap['uu-demoappg01-main/deleteJoke/unsupportedKey'].message);
    let invalidData = responce.data.uuAppErrorMap['uu-demoappg01-main/deleteJoke/unsupportedKey'].paramMap['unsupportedKeyList'][0];
    expect(invalidData).toEqual('$.invalidKey');
  });
});

describe("Test deleteJoke command", () => {
  test("if joke does not exist", async () => {
    await TestHelper.login("Readers");
    let dtoInInvalid = {id: 123};
    let status;
    try{
      await TestHelper.executePostCommand("updateJoke", dtoInInvalid);
    } catch(error) {
      status = error.response.status;
    }
    expect(status).toBe(400);
  });
});

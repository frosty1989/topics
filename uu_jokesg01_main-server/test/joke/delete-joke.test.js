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
describe("Test deleteJoke command", () => {
  test("test the deleteJoke method", async () => {
    await TestHelper.login("Readers");
    await CreateJoke();
    let listResponse = await TestHelper.executeGetCommand("listJokes");
    let itemId = listResponse.data.itemList[0].id;
    let dtoIn = {id: itemId};
    let response = await TestHelper.executePostCommand("deleteJoke", dtoIn);
    expect(response.data.uuAppErrorMap).toEqual({});
    expect(response.status).toEqual(200);
    expect(response.data).toBeDefined();
    expect(response.data.uuAppErrorMap).toBeDefined();
    expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
  });
});

//Alternative scenario
describe("Test deleteJoke command", () => {
  test("invalid keys test", async () => {
    await TestHelper.login("Readers");

    let dtoInForCreateJoke = {name: "test name", text: "test desc", categoryList: ["e001", "e001"]};
    await TestHelper.executePostCommand("createJoke", dtoInForCreateJoke);
    let listResponce = await TestHelper.executeGetCommand("listJokes");
    let itemId = listResponce.data.itemList[0].id;
    let dtoInInvalid = {id: itemId, invalidKey: "invalid key value"};
    let response = await TestHelper.executePostCommand("deleteJoke", dtoInInvalid);

    expect(typeof(response.data.uuAppErrorMap)).toBe("object");
    expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect("warning").toEqual(response.data.uuAppErrorMap['uu-jokesg01-main/deleteJoke/unsupportedKey'].type);
    expect("DtoIn contains unsupported keys.").toEqual(response.data.uuAppErrorMap['uu-jokesg01-main/deleteJoke/unsupportedKey'].message);
    let invalidData = response.data.uuAppErrorMap['uu-jokesg01-main/deleteJoke/unsupportedKey'].paramMap['unsupportedKeyList'][0];
    expect(invalidData).toEqual('$.invalidKey');
    expect(response.status).toEqual(200);
  });
});

describe("Test deleteJoke command", () => {
  test("if joke does not exist", async () => {
    await TestHelper.login("Readers");
    let dtoInInvalid = {id: 123};
    let status;
    try{
      await TestHelper.executePostCommand("deleteJoke", dtoInInvalid);
    } catch(error) {
      status = error.response.status;
    }
    expect(status).toBe(400);
  });
});

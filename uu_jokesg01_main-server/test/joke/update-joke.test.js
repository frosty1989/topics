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
describe("Test updateJoke command", () => {
  test("test the updateJoke method that keys not out of dtoInType", async () => {
    await TestHelper.login("Readers");
    await CreateJoke();
    let listResponce = await TestHelper.executeGetCommand("listJokes");
    let itemId = listResponce.data.itemList[0].id;
    let dtoIn = {id: itemId, name: "Update name", text: "Update text"};
    let responce = await TestHelper.executePostCommand("updateJoke", dtoIn);

    expect(responce.data.name).toEqual("Update name");
    expect(responce.data.text).toEqual("Update text");
    expect(responce.data.uuAppErrorMap).toEqual({});
  });
});

describe("Test updateJoke command", () => {
  test("invalid optional keys", async () => {
    await TestHelper.login("Readers");
    await CreateJoke();
    let listResponce = await TestHelper.executeGetCommand("listJokes");
    let itemId = listResponce.data.itemList[0].id;
    let invalidDtoIn = {id: itemId, name: "Update name", text: "Update text", invalid_key: "invalid key data"};
    let responce = await TestHelper.executePostCommand("updateJoke", invalidDtoIn);

    expect(typeof(responce.data.uuAppErrorMap)).toBe("object");
    expect("warning").toEqual(responce.data.uuAppErrorMap['uu-jokesg01-main/updateJoke/unsupportedKey'].type);
    expect("DtoIn contains unsupported keys.").toEqual(responce.data.uuAppErrorMap['uu-jokesg01-main/updateJoke/unsupportedKey'].message);
    let invalidData = responce.data.uuAppErrorMap['uu-jokesg01-main/updateJoke/unsupportedKey'].paramMap['unsupportedKeyList'][0];
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
    }
    expect(status).toBe(400);
  });
});

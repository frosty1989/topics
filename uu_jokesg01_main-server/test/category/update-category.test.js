const {Utils} = require("uu_appg01_server");
const {TestHelper} = require("uu_appg01_workspace-test");
const {CreateCategory} = require("../general-test-hepler");

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
describe("Test updateCategory command", () => {
  test("update category test HDS", async () => {
    await TestHelper.login("Readers");
    await CreateCategory();
    let listResponce = await TestHelper.executeGetCommand("listCategories");
    let itemId = listResponce.data.itemList[0].id;
    let dtoIn = {id: itemId, name: "Update name", desc: "Update text", glyphicon: "http://update_test.jpg"};
    let responce = await TestHelper.executePostCommand("updateCategory", dtoIn);

    expect(responce.data.name).toEqual("Update name");
    expect(responce.data.desc).toEqual("Update text");
    expect(responce.data.glyphicon).toEqual("http://update_test.jpg");
    expect(responce.data.uuAppErrorMap).toEqual({});
  });
});

describe("Test updateCategory command", () => {
  test("invalid optional keys", async () => {
    await TestHelper.login("Readers");
    await CreateCategory();
    let listResponce = await TestHelper.executeGetCommand("listCategories");
    let itemId = listResponce.data.itemList[0].id;
    let dtoInInvalid = {
      id: itemId,
      name: "Update name",
      desc: "Update text",
      glyphicon: "http://update_test.jpg",
      invalidKey: "invalid data value"
    };
    let responce = await TestHelper.executePostCommand("updateCategory", dtoInInvalid);

    expect(typeof(responce.data.uuAppErrorMap)).toBe("object");
    expect("warning").toEqual(responce.data.uuAppErrorMap['uu-jokesg01-main/updateCategory/unsupportedKey'].type);
    expect("DtoIn contains unsupported keys.").toEqual(responce.data.uuAppErrorMap['uu-jokesg01-main/updateCategory/unsupportedKey'].message);
    let invalidData = responce.data.uuAppErrorMap['uu-jokesg01-main/updateCategory/unsupportedKey'].paramMap['unsupportedKeyList'][0];
    expect(invalidData).toEqual('$.invalidKey');
  });
});

describe("Test updateCategory command", () => {
  test("category does not exist", async () => {
    await TestHelper.login("Readers");
    let invalidDtoIn = {id: 123, name: "test name", desc: "test desc", glyphicon: "http://test.jpg"};
    let status;
    try{
      await TestHelper.executePostCommand("updateCategory", invalidDtoIn);
    } catch(error) {
      status = error.response.status;
    }
    expect(status).toBe(400);
  });
});

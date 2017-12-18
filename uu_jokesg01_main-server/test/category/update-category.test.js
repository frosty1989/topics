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
describe("Test updateCategory command", () => {
  test("update category test HDS", async () => {
    await TestHelper.login("Readers");

    let dtoInForCreateCategory = {name: "test name", desc: "test desc", glyphicon: "http://test.jpg"};
    let responceFromCreateCategory = await TestHelper.executePostCommand("createCategory", dtoInForCreateCategory);

    let listResponce = await TestHelper.executeGetCommand("listCategories");
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    console.log(listResponce.data);

    let itemId = listResponce.data.itemList[0].id;

    let dtoIn = {id: itemId, name: "Update name", desc: "Update text", glyphicon: "http://update_test.jpg"};

    let response = await TestHelper.executePostCommand("updateCategory", dtoIn);
    console.log(response.data);

    expect(response.data.name).toEqual("Update name");
    expect(response.data.desc).toEqual("Update text");
    expect(response.data.glyphicon).toEqual("http://update_test.jpg");
    expect(response.data.uuAppErrorMap).toEqual({});
  });
});

describe("Test updateCategory command", () => {
  test("invalid optional keys", async () => {
    await TestHelper.login("Readers");

    let dtoInForCreateCategory = {name: "test name", desc: "test desc", glyphicon: "http://test.jpg"};
    let responceFromCreateCategory = await TestHelper.executePostCommand("createCategory", dtoInForCreateCategory);
    let listResponce = await TestHelper.executeGetCommand("listCategories");
    let itemId = listResponce.data.itemList[0].id;

    let dtoInInvalid = {
      id: itemId,
      name: "Update name",
      desc: "Update text",
      glyphicon: "http://update_test.jpg",
      invalidKey: "invalid data value"
    };

    let response = await TestHelper.executePostCommand("updateCategory", dtoInInvalid);

    expect(typeof(response.data.uuAppErrorMap)).toBe("object");
    expect("warning").toEqual(response.data.uuAppErrorMap['uu-demoappg01-main/updateCategory/unsupportedKey'].type);
    expect("DtoIn contains unsupported keys.").toEqual(response.data.uuAppErrorMap['uu-demoappg01-main/updateCategory/unsupportedKey'].message);
    let invalidData = response.data.uuAppErrorMap['uu-demoappg01-main/updateCategory/unsupportedKey'].paramMap['unsupportedKeyList'][0];
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
      // console.log(error);
    }
    expect(status).toBe(400);
  });
});

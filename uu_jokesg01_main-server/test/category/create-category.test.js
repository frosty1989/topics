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
describe("Test createCategory command", () => {
  test("test the createCategory method", async () => {
    await TestHelper.login("Readers");
    let response = await CreateCategory();
    expect(response.data.name).toEqual("test name");
    expect(response.data.desc).toEqual("test desc");
    expect(response.data.glyphicon).toEqual("http://test.jpg");
    expect(typeof (response.data.name)).toBe("string");
    expect(typeof (response.data.desc)).toBe("string");
    expect(typeof (response.data.glyphicon)).toBe("string");
    expect(response.data.awid).toEqual(Utils.Config.get("sysAppWorkspace")["awid"]);
  });
});

//Alternative scenarios
describe("Test createCategory command", () => {
  test("tests for invalid keys", async () => {
    await TestHelper.login("Readers");
    let invalidDtoIn = {
      name: "test name",
      desc: "test desc",
      glyphicon: "http://test.jpg",
      notvalid: "not valid key"
    };
    let response = await CreateCategory(invalidDtoIn);

    expect(typeof(response.data.uuAppErrorMap)).toBe("object");
    expect("warning").toEqual(response.data.uuAppErrorMap['uu-jokesg01-main/createCategory/unsupportedKey'].type);
    expect("DtoIn contains unsupported keys.").toEqual(response.data.uuAppErrorMap['uu-jokesg01-main/createCategory/unsupportedKey'].message);
    let invalidData = response.data.uuAppErrorMap['uu-jokesg01-main/createCategory/unsupportedKey'].paramMap['unsupportedKeyList'][0];
    expect(invalidData).toEqual('$.notvalid');
  });
});

describe("Test createCategory command", () => {
  test("unsuccessful dtoIn validation", async () => {
    await TestHelper.login("Readers");
    let invalidDtoIn = {name: 123, desc: 123, glyphicon: 123};
    let status;
    try{
      await CreateCategory(invalidDtoIn);
    } catch(error) {
      status = error.response.status;
    }
    expect(status).toBe(400);
  });
});

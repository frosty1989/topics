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
describe("Test listJokes command", () => {
  test("test the listJoke method", async () => {
    await TestHelper.login("Readers");

    let dtoInForCreateJoke = {
      name: "test name",
      text: "test desc",
      categoryList: ["e001", "e001"]
    };
    await TestHelper.executePostCommand("createJoke", dtoInForCreateJoke);

    let listResponce = await TestHelper.executeGetCommand("listJokes");
    let itemId = listResponce.data.itemList[0].id;


    let response = await TestHelper.executeGetCommand("listJokes");
    console.log(response.data.itemList[0].name);
    expect(response.data.itemList[0].name).toEqual("test name");
    expect(response.data.itemList[0].text).toEqual("test desc");
    expect(response.data.itemList[0].categoryList).toEqual(["e001", "e001"]);
    expect(response.data.itemList[0].id).toEqual(itemId);
    expect(Array.isArray(response.data.itemList[0].categoryList)).toBe(true);
    expect(response.data.itemList[0].awid).toEqual(Utils.Config.get("sysAppWorkspace")["awid"]);

    expect(response.data.uuAppErrorMap).toEqual({});
    expect(response.data.pageInfo.total).toEqual(1);
    console.log(response.data.uuAppErrorMap);
  });
});

//Alternative scenarios
describe("Test listJokes command", () => {
  test("tests for unsupported keys", async () => {
    await TestHelper.login("Readers");

    let dtoInForCreateJoke = {
      name: "test name",
      text: "test desc",
      categoryList: ["e001", "e001"]
    };
    await TestHelper.executePostCommand("createJoke", dtoInForCreateJoke);

    let listResponce = await TestHelper.executeGetCommand("listJokes");
    let itemId = listResponce.data.itemList[0].id;

    let invalidDtoIn = {
      notvalid: "not valid key"
    };
    let response = await TestHelper.executeGetCommand("listJokes", invalidDtoIn);

    expect(typeof(response.data.uuAppErrorMap)).toBe("object");
    expect("warning").toEqual(response.data.uuAppErrorMap['uu-demoappg01-main/listJokes/unsupportedKey'].type);
    expect("DtoIn contains unsupported keys.").toEqual(response.data.uuAppErrorMap['uu-demoappg01-main/listJokes/unsupportedKey'].message);
    let invalidData = response.data.uuAppErrorMap['uu-demoappg01-main/listJokes/unsupportedKey'].paramMap['unsupportedKeyList'][0];
    expect(invalidData).toEqual('$.notvalid');
  });
});

describe("Test createJoke command", () => {
  test("unsuccessful dtoIn validation", async () => {
    await TestHelper.login("Readers");
    let invalidDtoIn = {
      sortBy: 123,
      order: 123,
      pageInfo: {
        pageIndex: "string",
        pageSize: "string"
      }
    };
    let status;
    try{
      await TestHelper.executeGetCommand("listJokes", invalidDtoIn);
    } catch(error) {
      status = error.response.status;
    }
    expect(status).toBe(400);
  });
});

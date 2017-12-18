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
describe("Test listCategories command", () => {
  test("test the listCategories method", async () => {
    await TestHelper.login("Readers");

    let dtoInForCreateCategory = {
      name: "test name",
      desc: "test desc",
      glyphicon: "http://test.jpg"
    };
    let responseFromCreate = await TestHelper.executePostCommand("createCategory", dtoInForCreateCategory);
    let itemId = responseFromCreate.data.id;

    let response = await TestHelper.executeGetCommand("listCategories");
    expect(Array.isArray(response.data.itemList)).toBe(true);
    expect(response.data.itemList[0].name).toEqual("test name");
    expect(response.data.itemList[0].desc).toEqual("test desc");
    expect(response.data.itemList[0].glyphicon).toEqual("http://test.jpg");
    expect(response.data.itemList[0].id).toEqual(itemId);
    expect(response.data.uuAppErrorMap).toEqual({});
    console.log(response.data.uuAppErrorMap);
  });
});

//Alternative scenarios
describe("Test listCategories command", () => {
  test("creates object store object in uuAppObjectStore", async () => {
    await TestHelper.login("Readers");

    let dtoInForCreateCategory = {
      name: "test name",
      desc: "test desc",
      glyphicon: "http://test.jpg"
    };
    let responseFromCreate = await TestHelper.executePostCommand("createCategory", dtoInForCreateCategory);
    let itemId = responseFromCreate.data.id;

    let invalidDtoIn = {
        pageIndex: 0,
        pageSize: 100,
        notvalid: "notvalid"
    };

    let response = await TestHelper.executeGetCommand("listCategories", invalidDtoIn);
    console.log(response);
    // expect(typeof(response.data.uuAppErrorMap)).toBe("object");
    // expect("warning").toEqual(response.data.uuAppErrorMap['uu-demoappg01-main/listCategories/unsupportedKey'].type);
    // expect("DtoIn contains unsupported keys.").toEqual(response.data.uuAppErrorMap['uu-demoappg01-main/listCategories/unsupportedKey'].message);
    // let invalidData = response.data.uuAppErrorMap['uu-demoappg01-main/listCategories/unsupportedKey'].paramMap['unsupportedKeyList'][0];
    // expect(invalidData).toEqual('$.notvalid');
  });
});

// describe("Test listCategoryJokes command", () => {
//   test("unsuccessful dtoIn validation", async () => {
//     await TestHelper.login("Readers");
//     let invalidDtoIn = {categoryId: "invalid string id"};
//     let status;
//     try{
//       await TestHelper.executeGetCommand("listCategoryJokes", invalidDtoIn);
//     } catch(error) {
//       status = error.response.status;
//     }
//     expect(status).toBe(400);
//   });
// });

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
describe("Test deleteCategory command", () => {
  test("test the deleteCategory method", async () => {
    await TestHelper.login("Readers");
    await CreateCategory();
    let listResponce = await TestHelper.executeGetCommand("listCategories");
    console.log(listResponce);
    let itemId = listResponce.data.itemList[0];
    console.log(itemId);
    console.log(itemId.id);
    let dtoIn = {categoryId: itemId};
    let response = await TestHelper.executePostCommand("deleteCategory", dtoIn);
    expect(response.data.uuAppErrorMap).toEqual({});
    expect(typeof(response.data.uuAppErrorMap)).toBe("object");
  });
});

//Alternative scenario
// describe("Test deleteJoke command", () => {
//   test("invalid keys test", async () => {
//     await TestHelper.login("Readers");
//     let dtoInForCreateJoke = {name: "test name", text: "test desc", categoryList: ["e001", "e001"]};
//     let responceFromCreateJoke = await TestHelper.executePostCommand("createJoke", dtoInForCreateJoke);
//     let listResponce = await TestHelper.executeGetCommand("listJokes");
//     let itemId = listResponce.data.itemList[0].id;
//     let dtoInInvalid = {id: itemId, invalidKey: "invalid key value"};
//     console.log(itemId);
//     // let dtoIn = {id: itemId};
//     let responce = await TestHelper.executePostCommand("deleteJoke", dtoInInvalid);
//     expect(typeof(responce.data.uuAppErrorMap)).toBe("object");
//     expect("warning").toEqual(responce.data.uuAppErrorMap['uu-jokesg01-main/deleteJoke/unsupportedKey'].type);
//     expect("DtoIn contains unsupported keys.").toEqual(responce.data.uuAppErrorMap['uu-jokesg01-main/deleteJoke/unsupportedKey'].message);
//     let invalidData = responce.data.uuAppErrorMap['uu-jokesg01-main/deleteJoke/unsupportedKey'].paramMap['unsupportedKeyList'][0];
//     expect(invalidData).toEqual('$.invalidKey');
//   });
// });
//
// describe("Test deleteJoke command", () => {
//   test("if joke does not exist", async () => {
//     await TestHelper.login("Readers");
//     let dtoInInvalid = {id: 123};
//     let status;
//     try{
//       await TestHelper.executePostCommand("updateJoke", dtoInInvalid);
//     } catch(error) {
//       status = error.response.status;
//     }
//     expect(status).toBe(400);
//   });
// });

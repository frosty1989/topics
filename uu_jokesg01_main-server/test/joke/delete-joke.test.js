const { Utils } = require("uu_appg01_server");
const { TestHelper } = require("uu_appg01_workspace-test");
const { CreateJoke, CreateCategory } = require("../general-test-hepler");
const CMD = "deleteJoke";

beforeEach(async done => {
  await TestHelper.setup();
  await TestHelper.initAppWorkspace();
  await TestHelper.createPermission("Readers");
  done();
});

afterEach(async done => {
  await TestHelper.teardown();
  done();
});

//Happy day scenario
describe("Test deleteJoke command", () => {
  test("HDS", async () => {
    await TestHelper.login("Readers");

    let joke = await CreateJoke();
    let category = await CreateCategory();
    let jokeRating = await TestHelper.executePostCommand("addJokeRating", {
      id: joke.data.id,
      rating: 5
    });
    let jokeCategory = await TestHelper.executePostCommand("addJokeCategory", {
      jokeId: joke.data.id,
      categoryList: [category.data.id]
    });
    let response = await TestHelper.executePostCommand(CMD, {
      id: joke.data.id
    });
    let foundJoke;

    try {
      foundJoke = await TestHelper.executeGetCommand("listJokes");
      //  {
      //   id: joke.data.id
      // });
      // console.log(foundJoke);
    } catch (err) {
      foundJoke = err;
    }

    // console.log(response);

    // let itemId = listResponse.data.itemList[0].id;
    // let dtoIn = { id: itemId };
    // let response = await TestHelper.executePostCommand(CMD, dtoIn);

    expect(response.data.uuAppErrorMap).toEqual({});
    expect(response.status).toEqual(200);
    expect(response.data).toBeDefined();
    expect(response.data.uuAppErrorMap).toBeDefined();
    expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
  });
});

//Alternative scenario
// describe("Test deleteJoke command", () => {
//   test("invalid keys test", async () => {
//     await TestHelper.login("Readers");

//     let dtoInForCreateJoke = {name: "test name", text: "test desc", categoryList: ["e001", "e001"]};
//     await TestHelper.executePostCommand("createJoke", dtoInForCreateJoke);
//     let listResponce = await TestHelper.executeGetCommand("listJokes");
//     let itemId = listResponce.data.itemList[0].id;
//     let dtoInInvalid = {id: itemId, invalidKey: "invalid key value"};
//     let response = await TestHelper.executePostCommand("deleteJoke", dtoInInvalid);

//     expect(typeof(response.data.uuAppErrorMap)).toBe("object");
//     expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
//     expect("warning").toEqual(response.data.uuAppErrorMap['uu-jokesg01-main/deleteJoke/unsupportedKey'].type);
//     expect("DtoIn contains unsupported keys.").toEqual(response.data.uuAppErrorMap['uu-jokesg01-main/deleteJoke/unsupportedKey'].message);
//     let invalidData = response.data.uuAppErrorMap['uu-jokesg01-main/deleteJoke/unsupportedKey'].paramMap['unsupportedKeyList'][0];
//     expect(invalidData).toEqual('$.invalidKey');
//     expect(response.status).toEqual(200);
//   });
// });

// describe("Test deleteJoke command", () => {
//   test("if joke does not exist", async () => {
//     await TestHelper.login("Readers");
//     let dtoInInvalid = {id: 123};
//     let status;
//     try{
//       await TestHelper.executePostCommand("deleteJoke", dtoInInvalid);
//     } catch(error) {
//       status = error.response.status;
//     }
//     expect(status).toBe(400);
//   });
// });

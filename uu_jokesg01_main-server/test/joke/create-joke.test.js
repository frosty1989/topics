const { Utils } = require("uu_appg01_server");
const { TestHelper } = require("uu_appg01_workspace-test");
const { CreateJoke } = require("../general-test-hepler");
const { CreateCategory } = require("../general-test-hepler");

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

describe("Test createJoke command - HDS", () => {
  test("createJoke method", async () => {
    await TestHelper.login("Readers", true);
    let createCategoryResponse = await CreateCategory();
    let categoryId = createCategoryResponse.data.id;
    let result = await CreateJoke({}, categoryId);

    expect(result.status).toEqual(200);
    expect(result.data).toBeDefined();
    expect(result.data).toBeInstanceOf(Object);
    expect(result.data.id).toBeDefined();
    expect(typeof result.data.id == "string").toBeTruthy();
    expect(result.data.uuAppErrorMap).toBeDefined();
    expect(result.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect(result.data.uuAppErrorMap).toMatchObject({});
    expect(result.data.categoryList).toBeDefined();
    expect(result.data.categoryList).toBeInstanceOf(Array);
    expect(result.data.categoryList).toContain(categoryId);
  });
});

describe("Test createJoke command - A1", () => {
  test("createJoke method", async () => {
    await TestHelper.login("Readers", true);

    let result = await CreateJoke({ unsupportedKey: "unsupportedValue" });
    const unsupportedKeysWarn = "uu-jokesg01-main/createJoke/unsupportedKey";

    expect(result.status).toEqual(200);
    expect(result.data).toBeDefined();
    expect(result.data).toBeInstanceOf(Object);
    expect(result.data).toHaveProperty("id");
    expect(result.data).toHaveProperty("uuAppErrorMap");
    expect(result.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect(result.data.uuAppErrorMap).toHaveProperty(unsupportedKeysWarn);
    expect(result.data.uuAppErrorMap[unsupportedKeysWarn]).toBeInstanceOf(
      Object
    );
  });
});

describe("Test createJoke command - A2", () => {
  test("createJoke method", async () => {
    await TestHelper.login("Readers", true);
    let result;

    try {
      await TestHelper.executePostCommand("createJoke", {});
    } catch (err) {
      result = err;
    }

    expect(result).toHaveProperty("paramMap");
    expect(result.paramMap).toHaveProperty("invalidValueKeyMap");
    expect(result.paramMap).toHaveProperty("missingKeyMap");
    expect(result.paramMap.missingKeyMap.hasOwnProperty("$.name")).toBeTruthy();
    expect(result.paramMap.missingKeyMap.hasOwnProperty("$.text")).toBeTruthy();
    expect(result.dtoOut).toHaveProperty("uuAppErrorMap");
    expect(result).toHaveProperty("response");
    expect(result).toHaveProperty("status");
    expect(result.status).toEqual(400);
  });
});

describe("Test createJoke command - A3", () => {
  test("createJoke method that works always", async () => {
    await TestHelper.login("Readers", true);

    let result = await CreateJoke({
      name: "Joke that never ever will be tested",
      text: "The text that never will be read"
    });

    expect(result.status).toBe(200);
    expect(result.data.uuAppErrorMap).toEqual({});
  });
});

describe("Test createJoke command - A4", () => {
  test("createJoke method", async () => {
    await TestHelper.login("Readers", true);

    let fakeCategoryId = "5a3a5bfe85d5a73f585c2d50";
    let category1 = await CreateCategory();
    let category2 = await CreateCategory({
      name: "Category 2",
      desc: "Description of the category 2"
    });
    let joke = await CreateJoke({
      name: "BAD joke",
      text: "good text",
      categoryList: [fakeCategoryId]
    });
    let goodJoke = await CreateJoke({
      name: "GOOD joke",
      text: "bad text",
      categoryList: [category1.data.id, category2.data.id]
    });
    console.log("Bad joke: ", joke);
    console.log("Good joke: ", goodJoke);
    // Promise.all([category1, category2]).then(result => {
    //   console.log("----------------------------------------");
    //   console.log(result);
    //   console.log("----------------------------------------");
    // });

    // joke();

    // Promise.all([category1, category2]).then(() => {
    //   result = Promise.resolve(result);

    //   console.log(result);
    //   expect(result.status).toBe(200);
    //   expect(result.data.uuAppErrorMap).toEqual({});
    // });
  });
});

// // end happy day scenario

// // Start alternative scenario
// // A1
// describe("Test createJoke Alternative scenario", () => {
//   test("keys are entered into dtoIn beyond the dtoIn type A1", async () => {
//     await TestHelper.login("Readers");
//     let createCategoryResponse = await CreateCategory();
//     let categoryId = createCategoryResponse.data.id;
//     let invaliddtoIn = {
//       name: "test name",
//       text: "test desc",
//       categoryList: [categoryId],
//       notvalid: "not valid key"
//     };
//     console.log("FOO");
//     let responce = await TestHelper.executePostCommand(
//       "createJoke",
//       invaliddtoIn
//     );
//     console.log("FOO");
//     expect(typeof responce.data.uuAppErrorMap).toBe("object");
//     expect("warning").toEqual(
//       responce.data.uuAppErrorMap["uu-jokesg01-main/createJoke/unsupportedKey"]
//         .type
//     );
//     expect("DtoIn contains unsupported keys.").toEqual(
//       responce.data.uuAppErrorMap["uu-jokesg01-main/createJoke/unsupportedKey"]
//         .message
//     );
//     let invalidData =
//       responce.data.uuAppErrorMap["uu-jokesg01-main/createJoke/unsupportedKey"]
//         .paramMap["unsupportedKeyList"][0];
//     expect(invalidData).toEqual("$.notvalid");
//   });
// });

// describe("unsuccessful dtoIn validation A2", () => {
//   test("unsuccessful dtoIn validation A2", async () => {
//     await TestHelper.login("Readers");
//     let invalidDtoIn = {
//       name: 123,
//       text: 123,
//       categoryList: 123
//     };
//     let status;
//     try {
//       await TestHelper.executePostCommand("createJoke", invalidDtoIn);
//     } catch (error) {
//       status = error.response.status;
//     }
//     expect(status).toBe(400);
//   });
// });

// describe("uuObject Joke fails A3", () => {
//   test("It throws out the jokeDaoCreateFailed exception, which writes this error into dtoOut.uuAppErrorMap and ends. A3", async () => {
//     await TestHelper.login("Readers");
//     let status;
//     try {
//       await TestHelper.executePostCommand("createJoke");
//     } catch (error) {
//       console.log(error.response.data.uuAppErrorMap);
//       status = error.response.status;
//     }
//     expect(status).toBe(400);
//   });
// });

// End Alternative scenario

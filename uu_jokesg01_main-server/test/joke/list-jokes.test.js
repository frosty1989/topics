const { TestHelper } = require("uu_appg01_workspace-test");
const { CreateJoke } = require("../general-test-hepler");
const { CreateCategory } = require("../general-test-hepler");

beforeAll(() => {
  return TestHelper.setup()
    .then(() => {
      return TestHelper.initAppWorkspace();
    })
    .then(() => {
      return TestHelper.login("SysOwner").then(() => {
        return TestHelper.executePostCommand("init", {
          uuAppProfileAuthorities: "urn:uu:GGALL"
        });
      });
    })
    .then(() => {
      return TestHelper.login("Reader");
    });
});

afterAll(() => {
  TestHelper.teardown();
});

describe("Test listJokes command", () => {
  test("HDS", async () => {
    let createCategoryResponse = await CreateCategory();
    let categoryId = createCategoryResponse.data.id;
    const joke = await CreateJoke({}, categoryId);
    let response = await TestHelper.executeGetCommand("listJokes");
    expect(response.data.itemList[0].name).toEqual(joke.data.name);
    expect(response.data.itemList[0].text).toEqual(joke.data.text);
    expect(response.data.itemList[0].id).toEqual(joke.data.id);
    expect(response.data.itemList[0].awid).toEqual(TestHelper.awid);
    expect(response.data.uuAppErrorMap).toEqual({});
  });

  test("A1", async () => {
    let createCategoryResponse = await CreateCategory();
    let categoryId = createCategoryResponse.data.id;
    await CreateJoke({}, categoryId);
    await TestHelper.executeGetCommand("listJokes");
    let invalidDtoIn = {
      notvalid: "not valid key"
    };
    let response = await TestHelper.executeGetCommand("listJokes", invalidDtoIn);
    expect(typeof response.data.uuAppErrorMap).toBe("object");
    expect("warning").toEqual(response.data.uuAppErrorMap["uu-jokes-main/listJokes/unsupportedKeys"].type);
    expect("DtoIn contains unsupported keys.").toEqual(
      response.data.uuAppErrorMap["uu-jokes-main/listJokes/unsupportedKeys"].message
    );
    let invalidData =
      response.data.uuAppErrorMap["uu-jokes-main/listJokes/unsupportedKeys"].paramMap["unsupportedKeyList"][0];
    expect(invalidData).toEqual("$.notvalid");
  });

  test("A2", async () => {
    let invalidDtoIn = {
      sortBy: 123,
      order: 123,
      pageInfo: {
        pageIndex: "string",
        pageSize: "string"
      }
    };
    expect.assertions(1);
    try {
      await TestHelper.executeGetCommand("listJokes", invalidDtoIn);
    } catch (error) {
      expect(error.status).toBe(400);
    }
  });
});

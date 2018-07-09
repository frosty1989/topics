const { TestHelper } = require("uu_appg01_workspace-test");
const { CreateJoke, CreateCategory, InitApp } = require("../general-test-hepler");
const CMD = "listJokes";

let jokeList = [];

beforeAll(async () => {
  await InitApp();

  for (let i = 1; i < 11; i++) {
    let joke = await CreateJoke({
      name: `Name of category ${i}`,
      text: "Just a text..."
    });

    jokeList.push(joke.data);
  }

  await TestHelper.login("Reader");
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe("Test listJokes command", () => {
  test("HDS", async () => {
    const response = await TestHelper.executeGetCommand(CMD);
    expect(response.status).toEqual(200);
    expect(response.data).toBeDefined();
    expect(response.data.itemList).toBeDefined();
    expect(response.data.itemList.length).toEqual(jokeList.length);
    expect(response.data).toHaveProperty("pageInfo");
    expect(response.data.pageInfo).toEqual({
      pageIndex: 0,
      pageSize: 100,
      total: jokeList.length
    });
    expect(response.data).toHaveProperty("uuAppErrorMap");
    expect(response.data.uuAppErrorMap).toEqual({});
    expect(response.data.uuAppErrorMap).toBeDefined();
    expect(response.data.uuAppErrorMap).toBeInstanceOf(Object);
    expect(response.data.uuAppErrorMap).toMatchObject({});
  });

  test("HDS_OrderByDefault", async () => {
    const response = await TestHelper.executeGetCommand(CMD);
    const jokesByAsc = jokeList.map(m => m.name).sort((a, b) => a.localeCompare(b));
    const jokes = response.data.itemList.map(m => m.name);

    expect(response.status).toEqual(200);
    expect(jokes).toEqual(jokesByAsc);
  });

  test("HDS_OrderByDesc", async () => {
    const response = await TestHelper.executeGetCommand(CMD, {
      order: "desc"
    });
    const jokesByDesc = jokeList.map(m => m.name).sort((a, b) => b.localeCompare(a));
    const jokes = response.data.itemList.map(m => m.name);

    expect(response.status).toEqual(200);
    expect(jokes).toEqual(jokesByDesc);
  });

  test("HDS_Paging", async () => {
    // skip it for now, remove "skip" once the new version of uuAppServer is released
    const pageSize = 5;
    const response = await TestHelper.executeGetCommand(CMD, {
      pageInfo: {
        pageSize: pageSize
      }
    });

    expect(response.status).toEqual(200);
    expect(response.data.itemList.length).toEqual(pageSize);
    expect(response.data.pageInfo).toEqual({
      pageIndex: 0,
      pageSize: pageSize,
      total: jokeList.length
    });
  });

  test("A1", async () => {
    let createCategoryResponse = await CreateCategory();
    let categoryId = createCategoryResponse.data.id;
    await CreateJoke({}, categoryId);
    await TestHelper.executeGetCommand(CMD);
    let invalidDtoIn = {
      notvalid: "not valid key"
    };
    let response = await TestHelper.executeGetCommand(CMD, invalidDtoIn);
    expect(typeof response.data.uuAppErrorMap).toBe("object");
    expect("warning").toEqual(response.data.uuAppErrorMap[`uu-jokes-main/${CMD}/unsupportedKeys`].type);
    expect("DtoIn contains unsupported keys.").toEqual(
      response.data.uuAppErrorMap[`uu-jokes-main/${CMD}/unsupportedKeys`].message
    );
    let invalidData =
      response.data.uuAppErrorMap[`uu-jokes-main/${CMD}/unsupportedKeys`].paramMap["unsupportedKeyList"][0];
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
      await TestHelper.executeGetCommand(CMD, invalidDtoIn);
    } catch (error) {
      expect(error.status).toBe(400);
    }
  });
});

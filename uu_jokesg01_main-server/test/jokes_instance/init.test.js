const { TestHelper } = require("uu_appg01_workspace-test");
const USE_CASE = "jokesInstance/init";
const path = require("path");
const fs = require("fs");

beforeAll(async () => {
  await TestHelper.setup();
});

afterAll(() => {
  TestHelper.teardown();
});

beforeEach(async () => {
  await TestHelper.dropDatabase();
  await TestHelper.initApp();
  await TestHelper.initAppWorkspace();
  await TestHelper.login("AwidOwner");
});

test("HDS with minimal dtoIn and without logo", async () => {
  let roleUri = "kedluben"; //almost any string can pass as uri
  let result = await TestHelper.executePostCommand(USE_CASE, { uuAppProfileAuthorities: roleUri });
  expect(result.status).toBe(200);
  let dtoOut = result.data;
  expect(dtoOut.state).toEqual("underConstruction");
  expect(dtoOut.name).toEqual("uuJokes");
  expect(dtoOut.logo).toBeUndefined();

  result = await TestHelper.executeGetCommand("sys/getProfile", { code: "Authorities" });
  expect(result.status).toBe(200);
  expect(result.data.roleUri).toEqual(roleUri);
});

test("HDS with minimal dtoIn and logo", async () => {
  let dtoIn = {
    uuAppProfileAuthorities: "kombajn",
    logo: fs.createReadStream(path.resolve(__dirname, "logo.png"))
  };
  let result = await TestHelper.executePostCommand(USE_CASE, dtoIn);
  expect(result.status).toBe(200);
  let dtoOut = result.data;
  expect(dtoOut.state).toEqual("underConstruction");
  expect(dtoOut.name).toEqual("uuJokes");
  expect(dtoOut.logo).toEqual("logo");
});

test("HDS with more complete dtoIn", async () => {
  let name = "dzouks";
  let state = "active";
  let dtoIn = {
    uuAppProfileAuthorities: "kombajn",
    name,
    state
  };
  let result = await TestHelper.executePostCommand(USE_CASE, dtoIn);
  expect(result.status).toBe(200);
  let dtoOut = result.data;
  expect(dtoOut.state).toEqual(state);
  expect(dtoOut.name).toEqual(name);
  expect(dtoOut.logo).toBeUndefined();
});

test("A1 - jokesInstance already exists", async () => {
  expect.assertions(3);
  let dtoIn = { uuAppProfileAuthorities: "mrkev" };
  let result = await TestHelper.executePostCommand(USE_CASE, dtoIn);
  expect(result.status).toBe(200);

  try {
    await TestHelper.executePostCommand(USE_CASE, dtoIn);
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/jokesInstance/init/jokesInstanceAlreadyInitialized");
    expect(e.message).toEqual("JokesInstance is already initialized.");
  }
});

test("A2 - unsupported keys", async () => {
  let dtoIn = { uuAppProfileAuthorities: "mrkev", something: "something more" };
  let result = await TestHelper.executePostCommand(USE_CASE, dtoIn);
  expect(result.status).toBe(200);

  let errorMap = result.data.uuAppErrorMap;
  expect(errorMap).toBeTruthy();
  let warning = errorMap["uu-jokes-main/jokesInstance/init/unsupportedKeys"];
  expect(warning).toBeTruthy();
  expect(warning.type).toEqual("warning");
  expect(warning.message).toEqual("DtoIn contains unsupported keys.");
});

test("A3 - invalid dtoIn", async () => {
  expect.assertions(2);
  try {
    await TestHelper.executePostCommand(USE_CASE, {});
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/jokesInstance/init/invalidDtoIn");
    expect(e.message).toEqual("DtoIn is not valid.");
  }
});

// A4, A5, A6 can't be reasonably tested

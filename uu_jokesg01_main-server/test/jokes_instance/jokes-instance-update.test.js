const { TestHelper } = require("uu_appg01_workspace-test");
const { ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const {
  JOKES_INSTANCE_INIT,
  JOKES_INSTANCE_UPDATE,
  getImageStream,
  mockDaoFactory
} = require("../general-test-hepler");

beforeAll(async () => {
  await TestHelper.setup(null, { authEnabled: false });
});

afterAll(() => {
  TestHelper.teardown();
});

beforeEach(async () => {
  await TestHelper.dropDatabase();
  await TestHelper.initApp();
  await TestHelper.initAppWorkspace();
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("HDS - without logo machinations", async () => {
  let result = await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "." });
  expect(result.state).toEqual("underConstruction");

  let closed = "closed";
  result = await TestHelper.executePostCommand(JOKES_INSTANCE_UPDATE, { state: closed });
  expect(result.status).toEqual(200);
  expect(result.state).toEqual(closed);
});

test("HDS - create logo", async () => {
  let result = await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "." });
  expect(result.logo).toBeUndefined();
  // there are no binaries yet
  result = await TestHelper.executeGetCommand("uu-app-binarystore/listBinaries");
  expect(result.pageInfo.total).toEqual(0);

  let dtoIn = { logo: getImageStream() };
  result = await TestHelper.executePostCommand(JOKES_INSTANCE_UPDATE, dtoIn);
  expect(result.status).toEqual(200);
  expect(result.logo).toEqual("logo");

  // check if binary was really created
  result = await TestHelper.executeGetCommand("uu-app-binarystore/listBinaries");
  expect(result.pageInfo.total).toEqual(1);
});

test("HDS - update logo", async () => {
  let dtoIn = { uuAppProfileAuthorities: ".", logo: getImageStream() };
  let result = await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, dtoIn);
  expect(result.logo).toEqual("logo");

  // the binary has been just created, its revision is 0
  result = await TestHelper.executeGetCommand("uu-app-binarystore/getBinary", { code: result.logo });
  expect(result.sys.rev).toEqual(0);

  dtoIn = { logo: getImageStream() };
  result = await TestHelper.executePostCommand(JOKES_INSTANCE_UPDATE, dtoIn);
  expect(result.status).toEqual(200);
  expect(result.logo).toEqual("logo");

  // the binary was updated, i.e. revision increased
  result = await TestHelper.executeGetCommand("uu-app-binarystore/getBinary", { code: result.logo });
  expect(result.sys.rev).toEqual(1);
});

test("A1 - unsupported keys", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "." });

  let result = await TestHelper.executePostCommand(JOKES_INSTANCE_UPDATE, { something: "something" });
  expect(result.status).toBe(200);
  let errorMap = result.uuAppErrorMap;
  expect(errorMap).toBeTruthy();
  let warning = errorMap["uu-jokes-main/jokesInstance/update/unsupportedKeys"];
  expect(warning).toBeTruthy();
  expect(warning.type).toEqual("warning");
  expect(warning.message).toEqual("DtoIn contains unsupported keys.");
});

test("A2 - invalid dtoIn", async () => {
  expect.assertions(2);
  try {
    await TestHelper.executePostCommand(JOKES_INSTANCE_UPDATE, { state: "Czech Republic" });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/jokesInstance/update/invalidDtoIn");
    expect(e.message).toEqual("DtoIn is not valid.");
  }
});

test("A3 - updating logo, but jokes instance does not exist", async () => {
  expect.assertions(2);
  let dtoIn = { logo: getImageStream() };
  try {
    await TestHelper.executePostCommand(JOKES_INSTANCE_UPDATE, dtoIn);
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/jokesInstance/update/jokesInstanceDoesNotExist");
    expect(e.message).toEqual("JokesInstance does not exist.");
  }
});

test("A4 - creating logo fails", async () => {
  expect.assertions(2);

  let { JokesInstanceModel, UuBinaryModel } = mockModels();
  jest.spyOn(UuBinaryModel, "createBinary").mockImplementation(() => {
    throw new Error("it failed");
  });
  JokesInstanceModel.dao.getByAwid = () => {
    return {};
  };

  let dtoIn = { logo: getImageStream() };
  try {
    await JokesInstanceModel.update("awid", dtoIn);
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/jokesInstance/update/uuBinaryCreateFailed");
    expect(e.message).toEqual("Creating uuBinary failed.");
  }
});

test("A5 - updating logo fails", async () => {
  expect.assertions(2);

  let { JokesInstanceModel, UuBinaryModel } = mockModels();
  jest.spyOn(UuBinaryModel, "updateBinary").mockImplementation(() => {
    throw new Error("it failed");
  });
  JokesInstanceModel.dao.getByAwid = () => {
    return { logo: "code" };
  };

  let dtoIn = { logo: getImageStream() };
  try {
    await JokesInstanceModel.update("awid", dtoIn);
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/jokesInstance/update/uuBinaryUpdateBinaryDataFailed");
    expect(e.message).toEqual("Updating uuBinary data failed.");
  }
});

test("A6 - updating joke instance fails", async () => {
  expect.assertions(2);

  let { JokesInstanceModel } = mockModels();
  JokesInstanceModel.dao.update = () => {
    throw new ObjectStoreError("it failed.");
  };

  let dtoIn = { state: "active" };
  try {
    await JokesInstanceModel.update("awid", dtoIn);
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/jokesInstance/update/jokesInstanceDaoUpdateByAwidFailed");
    expect(e.message).toEqual("Update jokesInstance by jokesInstance Dao updateByAwid failed.");
  }
});

function mockModels() {
  mockDaoFactory();
  const JokesInstanceModel = require("../../app/models/jokes-instance-model");
  const { UuBinaryModel } = require("uu_appg01_binarystore-cmd");
  return { JokesInstanceModel, UuBinaryModel };
}

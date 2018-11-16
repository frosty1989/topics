const { TestHelper } = require("uu_appg01_workspace-test");
const path = require("path");
const fs = require("fs");
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;

const USE_CASE = "jokesInstance/init";

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

  //check if binary really exists
  result = await TestHelper.executeGetCommand("uu-app-binarystore/getBinary", { code: dtoOut.logo });
  expect(result.status).toBe(200);
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

test("A4 - setProfile fails", async () => {
  expect.assertions(2);

  let { JokesInstanceModel, SysProfileModel } = mockModels();
  jest.spyOn(SysProfileModel, "setProfile").mockImplementation(() => {
    throw new Error("kolobezka");
  });

  let dtoIn = {
    uuAppProfileAuthorities: "bicykl"
  };
  try {
    await JokesInstanceModel.init("awid", dtoIn);
  } catch (e) {
    expect(e.message).toEqual("Create uuAppProfile failed.");
    expect(e.code).toEqual("uu-jokes-main/jokesInstance/init/sys/setProfileFailed");
  }
});

test("A5 - creating uuBinary fails", async () => {
  expect.assertions(2);

  let { JokesInstanceModel, SysProfileModel, UuBinaryModel } = mockModels();
  jest.spyOn(SysProfileModel, "setProfile").mockImplementation(() => {});
  jest.spyOn(UuBinaryModel, "createBinary").mockImplementation(() => {
    throw new Error("kotrmelec");
  });

  let dtoIn = {
    uuAppProfileAuthorities: "holomajzna",
    logo: fs.createReadStream(path.resolve(__dirname, "logo.png"))
  };
  try {
    await JokesInstanceModel.init("awid", dtoIn);
  } catch (e) {
    expect(e.message).toEqual("Create uuBinary logo failed.");
    expect(e.code).toEqual("uu-jokes-main/jokesInstance/init/uu-app-binarystore/createBinaryFailed");
  }
});

test("A6 - storing jokes instance fails", async () => {
  expect.assertions(2);

  let { JokesInstanceModel, SysProfileModel, UuBinaryModel } = mockModels();
  JokesInstanceModel.dao.create = () => {
    throw new ObjectStoreError("it failed");
  };
  jest.spyOn(SysProfileModel, "setProfile").mockImplementation(() => {});
  jest.spyOn(UuBinaryModel, "createBinary").mockImplementation(() => {});

  let dtoIn = {
    uuAppProfileAuthorities: "someUri"
  };
  try {
    await JokesInstanceModel.init("awid", dtoIn);
  } catch (e) {
    expect(e.message).toEqual("Create jokesInstance by jokesInstance DAO create failed.");
    expect(e.code).toEqual("uu-jokes-main/jokesInstance/init/jokesInstanceDaoCreateFailed");
  }
});

function mockModels() {
  // this mock ensures that all of the models can be required
  jest.spyOn(DaoFactory, "getDao").mockImplementation(() => {
    let dao = {};
    dao.createSchema = () => {};
    return dao;
  });

  const JokesInstanceModel = require("../../app/models/jokes-instance-model");
  const { SysProfileModel } = require("uu_appg01_server").Workspace;
  const { UuBinaryModel } = require("uu_appg01_binarystore-cmd");

  JokesInstanceModel.dao.getByAwid = () => null;

  return { JokesInstanceModel, SysProfileModel, UuBinaryModel };
}

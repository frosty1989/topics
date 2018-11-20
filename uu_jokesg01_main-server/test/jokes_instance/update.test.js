const { TestHelper } = require("uu_appg01_workspace-test");
const path = require("path");
const fs = require("fs");
const { DaoFactory } = require("uu_appg01_server").ObjectStore;

const INIT = "jokesInstance/init";
const UPDATE = "jokesInstance/update";
const ROLE_URI = "roleUri";

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
  let result = await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: ROLE_URI });
  expect(result.data.state).toEqual("underConstruction");

  let closed = "closed";
  result = await TestHelper.executePostCommand(UPDATE, { state: closed });
  expect(result.status).toEqual(200);
  expect(result.data.state).toEqual(closed);
});

test("HDS - create logo", async () => {
  let result = await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: ROLE_URI });
  expect(result.data.logo).toBeUndefined();
  //there are no binaries yet
  result = await TestHelper.executeGetCommand("uu-app-binarystore/listBinaries");
  expect(result.pageInfo.total).toEqual(0);

  let dtoIn = {
    logo: getLogoStream()
  };
  result = await TestHelper.executePostCommand(UPDATE, dtoIn);
  expect(result.status).toEqual(200);
  expect(result.data.logo).toEqual("logo");

  //check if binary was really created
  result = await TestHelper.executeGetCommand("uu-app-binarystore/getBinary", { code: result.data.logo });
  expect(result.status).toBe(200);
});

test("HDS - update logo", async () => {
  let dtoIn = {
    uuAppProfileAuthorities: ROLE_URI,
    logo: getLogoStream()
  };
  let result = await TestHelper.executePostCommand(INIT, dtoIn);
  expect(result.data.logo).toEqual("logo");

  // the binary has been just created, its revision is 0
  result = await TestHelper.executeGetCommand("uu-app-binarystore/getBinary", { code: result.data.logo });
  expect(result.status).toBe(200);
  expect(result.data.sys.rev).toEqual(0);

  dtoIn = {
    logo: getLogoStream()
  };
  result = await TestHelper.executePostCommand(UPDATE, dtoIn);
  expect(result.status).toEqual(200);
  expect(result.data.logo).toEqual("logo");

  //the binary was updated, i.e. revision increased
  result = await TestHelper.executeGetCommand("uu-app-binarystore/getBinary", { code: result.data.logo });
  expect(result.status).toBe(200);
  expect(result.data.sys.rev).toEqual(1);
});

test("A1 - unsupported keys", async () => {
  await TestHelper.executePostCommand(INIT, { uuAppProfileAuthorities: ROLE_URI });

  let result = await TestHelper.executePostCommand(UPDATE, { something: "something" });
  expect(result.status).toBe(200);
  let errorMap = result.data.uuAppErrorMap;
  expect(errorMap).toBeTruthy();
  let warning = errorMap["uu-jokes-main/jokesInstance/update/unsupportedKeys"];
  expect(warning).toBeTruthy();
  expect(warning.type).toEqual("warning");
  expect(warning.message).toEqual("DtoIn contains unsupported keys.");
});

test("A2 - invalid dtoIn", async () => {
  expect.assertions(2);
  try {
    await TestHelper.executePostCommand(UPDATE, { state: "Czech Republic" });
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/jokesInstance/update/invalidDtoIn");
    expect(e.message).toEqual("DtoIn is not valid.");
  }
});

test("A3 - updating logo, but jokes instance does not exist", async () => {
  expect.assertions(2);
  let dtoIn = {
    logo: getLogoStream()
  };
  try {
    await TestHelper.executePostCommand(UPDATE, dtoIn);
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

  let dtoIn = {
    logo: getLogoStream()
  };
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

  let dtoIn = {
    logo: getLogoStream()
  };
  try {
    await JokesInstanceModel.update("awid", dtoIn);
  } catch (e) {
    expect(e.code).toEqual("uu-jokes-main/jokesInstance/update/uuBinaryUpdateBinaryDataFailed");
    expect(e.message).toEqual("Updating uuBinary data failed.");
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
  const { UuBinaryModel } = require("uu_appg01_binarystore-cmd");

  return { JokesInstanceModel, UuBinaryModel };
}

function getLogoStream() {
  return fs.createReadStream(path.resolve(__dirname, "..", "logo.png"));
}

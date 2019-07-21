const { TestHelper } = require("uu_appg01_workspace-test");
const { ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const {
  JOKES_INSTANCE_INIT,
  JOKES_INSTANCE_SET_ICONS,
  JOKES_INSTANCE_GET_UVE_META_DATA,
  JOKES_INSTANCE_LOAD
} = require("../general-test-hepler");

const Fs = require("fs");
const Path = require("path");

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

test("HDS - upload icons", async () => {
  await TestHelper.executePostCommand(JOKES_INSTANCE_INIT, { uuAppProfileAuthorities: "." });

  let dtoIn = { data: Fs.createReadStream(Path.join(__dirname, "icons-to-upload.zip")) };
  let result = await TestHelper.executePostCommand(JOKES_INSTANCE_SET_ICONS, dtoIn);
  expect(result.status).toEqual(200);
  expect(result.uveMetaData["android-chrome-512x512"]).toEqual("android_chrome_512x512");
  expect(result.uveMetaData["apple-touch-icon"]).toEqual("apple_touch_icon");
  expect(result.uveMetaData["favicon-16x16"]).toEqual("favicon_16x16");
  expect(result.uveMetaData["favicon-32"]).toEqual("favicon_32");
  expect(result.uveMetaData["favicon-32x32"]).toEqual("favicon_32x32");
  expect(result.uveMetaData["mstile-150x150"]).toEqual("mstile_150x150");
  expect(result.uveMetaData["safari-pinned-tab"]).toEqual("safari_pinned_tab");

  dtoIn = { type: "favicon-32" };
  result = await TestHelper.executeGetCommand(JOKES_INSTANCE_GET_UVE_META_DATA, dtoIn);
  expect(result.status).toEqual(200);
  expect(result.data.readable).toEqual(true);
});
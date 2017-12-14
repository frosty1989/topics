const {TestHelper} = require("uu_appg01_workspace-test");

const InitTestEnv = async () => {
  await TestHelper.setup();
  await TestHelper.initAppWorkspace();
  await TestHelper.executePostCommand("init");
};

module.exports = InitTestEnv;

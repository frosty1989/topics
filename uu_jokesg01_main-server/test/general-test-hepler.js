const {TestHelper} = require("uu_appg01_workspace-test");

const createJoke = async (dtoIn) => {
  if (!dtoIn) {
    dtoIn = {
      name: "test name",
      text: "test desc",
      categoryList: ["e001", "e001"]};
  }

  let result = await TestHelper.executePostCommand("createJoke", dtoIn);

  return result;
};

module.exports = {
  CreateJoke: createJoke
};

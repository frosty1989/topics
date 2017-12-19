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

const createCategory = async (dtoIn) => {
  await TestHelper.login("Readers");
  if (!dtoIn) {
    dtoIn = {
      name: "test name",
      desc: "test desc",
      glyphicon: "http://test.jpg"
    };
  }

  let response = await TestHelper.executePostCommand("createCategory", dtoIn);

  return response;
};

module.exports = {
  CreateJoke: createJoke,
  CreateCategory: createCategory
};

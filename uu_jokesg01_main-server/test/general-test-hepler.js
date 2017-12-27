const { TestHelper } = require("uu_appg01_workspace-test");

const createJoke = async categoryId => {
  let dtoIn = {
    name: "test name",
    text: "test desc",
    categoryList: [categoryId]
  };

  return await TestHelper.executePostCommand("createJoke", dtoIn);
};

const createCategory = async dtoIn => {
  await TestHelper.login("Readers");
  if (!dtoIn) {
    dtoIn = {
      name: "test name",
      desc: "test desc",
      glyphicon: "http://test.jpg"
    };
  }

  return await TestHelper.executePostCommand("createCategory", dtoIn);
};

module.exports = {
  CreateJoke: createJoke,
  CreateCategory: createCategory
};

const { TestHelper } = require("uu_appg01_workspace-test");

const createJoke = async (dtoIn, categoryId = null) => {
  if (!dtoIn.hasOwnProperty("name")) {
    dtoIn.name = "test joke";
  }
  if (!dtoIn.hasOwnProperty("text")) {
    dtoIn.text = "test joke text";
  }
  if (categoryId) {
    dtoIn.categoryList = [categoryId];
  }

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

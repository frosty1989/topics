const { TestHelper } = require("uu_appg01_workspace-test");

const createJoke = async (dtoIn = {}, categoryId = null) => {
  if (!dtoIn.hasOwnProperty("name")) {
    dtoIn.name = `The joke ${Math.random().toString(36).substr(2, 5)}`;
  }
  if (!dtoIn.hasOwnProperty("text")) {
    dtoIn.text = "test joke text";
  }
  if (categoryId) {
    dtoIn.categoryList = [categoryId];
  }

  return await TestHelper.executePostCommand("createJoke", dtoIn, {
    authorization: `Bearer ${await TestHelper.login("Authority", false, false)}`
  });
};

const createCategory = async dtoIn => {
  await TestHelper.login("Authority", false, false);

  if (!dtoIn) {
    dtoIn = {
      name: `Category ${Math.random().toString(36).substr(2, 5)}`,
      desc: "Test description of category",
    };
  }

  return await TestHelper.executePostCommand("createCategory", dtoIn, {
    authorization: `Bearer ${await TestHelper.login("Authority", false, false)}`
  });
};

module.exports = {
  CreateJoke: createJoke,
  CreateCategory: createCategory
};

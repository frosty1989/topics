const { TestHelper } = require("uu_appg01_workspace-test");

const CreateJoke = async (dtoIn = {}, categoryId = null) => {
  if (! dtoIn.hasOwnProperty("name")) {
    dtoIn.name = `The joke ${Math.random()
      .toString(36)
      .substr(2, 5)}`;
  }
  if (! dtoIn.hasOwnProperty("text")) {
    dtoIn.text = "test joke text";
  }
  if (categoryId) {
    dtoIn.categoryList = [categoryId];
  }

  return await TestHelper.executePostCommand("createJoke", dtoIn, await TestHelper.login("Authority", false, false));
};

const CreateCategory = async dtoIn => {
  await TestHelper.login("Authority", false, false);

  if (! dtoIn) {
    dtoIn = {
      name: `Category ${Math.random()
        .toString(36)
        .substr(2, 5)}`,
      desc: "Test description of category"
    };
  }

  return await TestHelper.executePostCommand(
    "createCategory",
    dtoIn,
    await TestHelper.login("Authority", false, false)
  );
};

const DefaultInitDtoIn = { uuAppProfileAuthorities: "urn:uu:GGALL" };

module.exports = {
  CreateJoke,
  CreateCategory,
  DefaultInitDtoIn
};

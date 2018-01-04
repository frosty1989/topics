"use strict";

const { prefix, jokesError } = require("./uu-jokes-error");

let addJokeCategory = {
  code: "addJokeCategory",
  invalidDtoInError: class AddJokeCategoryInvalidDtoInError extends jokesError {
    setParams() {
      return {
        code: `${addJokeCategory.code}/invalidDtoIn`,
        message: "DtoIn is not valid."
      };
    }
  },

  jokeDaoGetFailed: class JokeDaoGetFailed extends jokesError {
    setParams() {
      return {
        code: `${addJokeCategory.code}/jokeDaoGetFailed`,
        message: "Get joke by joke Dao get failed.",
        status: 500
      };
    }
  },

  jokeDoesNotExist: class JokeDoesNotExist extends jokesError {
    setParams() {
      return {
        code: `${addJokeCategory.code}/jokeDoesNotExist`,
        message: "Joke does not exist."
      };
    }
  },

  categoryDaoGetFailed: class CategoryDaoGetFailed extends jokesError {
    setParams() {
      return {
        code: `${addJokeCategory.code}/categoryDaoGetFailed`,
        message: "Get category by category Dao get failed.",
        status: 500
      };
    }
  },

  jokeCategoryDaoCreateFailed: class JokeCategoryDaoCreateFailed extends jokesError {
    setParams() {
      return {
        code: `${addJokeCategory.code}/jokeCategoryDaoCreateFailed`,
        message: "Create jokeCategory by jokeCategory Dao create failed.",
        status: 500
      };
    }
  }
};

let removeJokeCategory = {
  code: "removeJokeCategory",
  invalidDtoInError: class RemoveJokeCategoryInvalidDtoInError extends jokesError {
    setParams() {
      return {
        code: `${removeJokeCategory.code}/invalidDtoIn`,
        message: "DtoIn is not valid."
      };
    }
  },

  jokeCategoryDaoDeleteByJokeAndCategoryFailed: class JokeCategoryDaoDeleteByJokeAndCategoryFailed extends jokesError {
    setParams() {
      return {
        code: `${
          removeJokeCategory.code
        }/jokeCategoryDaoDeleteByJokeAndCategoryFailed`,
        message: "Delete jokeCategory by Dao deleteByJokeAndCategory failed.",
        status: 500
      };
    }
  }
};

module.exports = {
  prefix,
  addJokeCategory,
  removeJokeCategory
};

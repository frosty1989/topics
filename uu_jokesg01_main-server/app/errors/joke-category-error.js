"use strict";
const Errors = require("./uu-jokes-error");

let addJokeCategory = {
  Code: "addJokeCategory",
  InvalidDtoInError: class AddJokeCategoryInvalidDtoInError extends Errors.JokesError {
    setParams() {
      return {
        code: `${addJokeCategory.Code}/invalidDtoIn`,
        message: "DtoIn is not valid."
      };
    }
  },

  jokeDaoGetFailed: class JokeDaoGetFailed extends Errors.JokesError {
    setParams() {
      return {
        code: `${addJokeCategory.Code}/jokeDaoGetFailed`,
        message: "Get joke by joke Dao get failed.",
        status: 500
      };
    }
  },

  jokeDoesNotExist: class JokeDoesNotExist extends Errors.JokesError {
    setParams() {
      return {
        code: `${addJokeCategory.Code}/jokeDoesNotExist`,
        message: "Joke does not exist.",
        status: 500
      };
    }
  },

  categoryDaoGetFailed: class CategoryDaoGetFailed extends Errors.JokesError {
    setParams() {
      return {
        code: `${addJokeCategory.Code}/categoryDaoGetFailed`,
        message: "Get category by category Dao get failed.",
        status: 500
      };
    }
  },

  jokeCategoryDaoCreateFailed: class JokeCategoryDaoCreateFailed extends Errors.JokesError {
    setParams() {
      return {
        code: `${addJokeCategory.Code}/jokeCategoryDaoCreateFailed`,
        message: "Create jokeCategory by jokeCategory Dao create failed.",
        status: 500
      };
    }
  }
};

let removeJokeCategory = {
  Code: "removeJokeCategory",
  InvalidDtoInError: class RemoveJokeCategoryInvalidDtoInError extends Errors.JokesError {
    setParams() {
      return {
        code: `${removeJokeCategory.Code}/invalidDtoIn`,
        message: "DtoIn is not valid."
      };
    }
  },

  jokeCategoryDaoDeleteByJokeAndCategoryFailed: class JokeCategoryDaoDeleteByJokeAndCategoryFailed extends Errors.JokesError {
    setParams() {
      return {
        code: `${removeJokeCategory.Code}/jokeCategoryDaoDeleteByJokeAndCategoryFailed`,
        message: "Delete jokeCategory by Dao deleteByJokeAndCategory failed.",
        status: 500
      };
    }
  }
};

Errors.addJokeCategory = addJokeCategory;
Errors.removeJokeCategory = removeJokeCategory;

module.exports = { Errors };

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

  FailedError: class AddJokeCategoryFailedError extends Errors.JokesError {
    setParams() {
      return {
        code: `${addJokeCategory.Code}/failed`,
        message: "Add joke category is failed.",
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

  FailedError: class RemoveJokeCategoryFailedError extends Errors.JokesError {
    setParams() {
      return {
        code: `${removeJokeCategory.Code}/failed`,
        message: "Remove joke category is failed.",
        status: 500
      };
    }
  }
};

let jokeDaoGetFailed = {
  Code: "jokeDaoGetFailed",
  FailedError: class JokeDaoGetFailed extends Errors.JokesError {
    setParams() {
      return {
        code: `${jokeDaoGetFailed.Code}/jokeDaoGetFailed`,
        message: "Get joke by joke Dao get failed.",
        status: 500
      };
    }
  }
};

let jokeDoesNotExist = {
  Code: "jokeDoesNotExist",
  FailedError: class JokeDoesNotExist extends Errors.JokesError {
    setParams() {
      return {
        code: `${jokeDoesNotExist.Code}/jokeDoesNotExist`,
        message: "Joke does not exist.",
        status: 500
      };
    }
  }
};

let categoryDaoGetFailed = {
  Code: "categoryDaoGetFailed",
  FailedError: class JategoryDaoGetFailed extends Errors.JokesError {
    setParams() {
      return {
        code: `${categoryDaoGetFailed.Code}/categoryDaoGetFailed`,
        message: "Get category by category Dao get failed.",
        status: 500
      };
    }
  }
};

let jokeCategoryDaoCreateFailed = {
  Code: "jokeCategoryDaoCreateFailed",
  FailedError: class JokeCategoryDaoCreateFailed extends Errors.JokesError {
    setParams() {
      return {
        code: `${jokeCategoryDaoCreateFailed.Code}/jokeCategoryDaoCreateFailed`,
        message: "Create jokeCategory by jokeCategory Dao create failed.",
        status: 500
      };
    }
  }
};

let jokeCategoryDaoDeleteByJokeAndCategoryFailed = {
  Code: "jokeCategoryDaoDeleteByJokeAndCategoryFailed",
  FailedError: class JokeCategoryDaoDeleteByJokeAndCategoryFailed extends Errors.JokesError {
    setParams() {
      return {
        code: `${jokeCategoryDaoDeleteByJokeAndCategoryFailed.Code}/jokeCategoryDaoDeleteByJokeAndCategoryFailed`,
        message: "Delete jokeCategory by Dao deleteByJokeAndCategory failed.",
        status: 500
      };
    }
  }
};

Errors.jokeCategoryDaoDeleteByJokeAndCategoryFailed = jokeCategoryDaoDeleteByJokeAndCategoryFailed;
Errors.jokeCategoryDaoCreateFailed = jokeCategoryDaoCreateFailed;
Errors.categoryDaoGetFailed = categoryDaoGetFailed;
Errors.jokeDoesNotExist = jokeDoesNotExist;
Errors.jokeDaoGetFailed = jokeDaoGetFailed;
Errors.addJokeCategory = addJokeCategory;
Errors.removeJokeCategory = removeJokeCategory;

module.exports = { Errors };

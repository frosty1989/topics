"use strict";
const Errors = require("./uu-jokes-error");

let createJoke = {
  Code: "createJoke",
  InvalidDtoIn: class CreateJokeInvalidDtoInError extends Errors.JokesError {
    setParams() {
      return {
        code: `${createJoke.Code}/invalidDtoIn`,
        message: "DtoIn is not valid."
      };
    }
  },

  jokeDaoCreateFailed: class jokeDaoCreateFailed extends Errors.JokesError {
    setParams() {
      return {
        code: `${createJoke.Code}/jokeDaoCreateFailed`,
        message: "Create joke by joke Dao create failed.",
        status: 500
      };
    }
  },

  jokeCategoryDaoCreateFailed: class jokeCategoryDaoCreateFailed extends Errors.JokesError {
    setParams() {
      return {
        code: `${createJoke.Code}/jokeCategoryDaoCreateFailed`,
        message: "Create jokeCategory by jokeCategory Dao create failed.",
        status: 500
      };
    }
  }
};

let getJoke = {
  code: "getJoke",
  invalidDtoIn: class GetJokeInvalidDtoInError extends Errors.JokesError {
    setParams() {
      return {
        code: `${getJoke.code}/invalidDtoIn`,
        message: "DtoIn is not valid."
      };
    }
  },

  jokeDaoGetFailed: class GetJokeFailedError extends Errors.JokesError {
    setParams() {
      return {
        code: `${getJoke.code}/jokeDaoGetFailed`,
        message: "Get joke by joke Dao get failed.",
        status: 500
      };
    }
  },

  jokeDoesNotExist: class JokeDoesNotExist extends Errors.JokesError {
    setParams() {
      return {
        code: `${getJoke.code}/jokeDoesNotExist`,
        message: "Joke does not exist.",
        status: 500
      };
    }
  },

  jokeCategoryDaoListByJokeFailed: class jokeCategoryDaoListByJokeFailed extends Errors.JokesError {
    setParams() {
      return {
        code: `${getJoke.code}/jokeCategoryDaoListByJokeFailed`,
        message: "List jokeCategoty by joke Dao listByCategory failed.",
        status: 500
      };
    }
  }
};

let listJokes = {
  Code: "listJokes",
  InvalidDtoInError: class ListJokesInvalidDtoInError extends Errors.JokesError {
    setParams() {
      return {
        code: `${listJokes.Code}/invalidDtoIn`,
        message: "DtoIn is not valid."
      };
    }
  },

  jokeDaoListFailed: class jokeDaoListFailed extends Errors.JokesError {
    setParams() {
      return {
        code: `${listJokes.Code}/jokeDaoListFailed`,
        message: "List jokes by joke Dao list failed.",
        status: 500
      };
    }
  }
};

let deleteJoke = {
  Code: "deleteJoke",
  InvalidDtoInError: class DeleteJokeInvalidDtoInError extends Errors.JokesError {
    setParams() {
      return {
        code: `${deleteJoke.Code}/invalidDtoIn`,
        message: "DtoIn is not valid."
      };
    }
  },

  jokeRatingDaoDeleteByJokeFailed: class jokeRatingDaoDeleteByJokeFailed extends Errors.JokesError {
    setParams() {
      return {
        code: `${deleteJoke.Code}/jokeRatingDaoDeleteByJokeFailed`,
        message: "Delete jokeRating by Dao deleteByJoke failed.",
        status: 500
      };
    }
  },

  jokeCategoryDaoDeleteByJokeFailed: class jokeCategoryDaoDeleteByJokeFailed extends Errors.JokesError {
    setParams() {
      return {
        code: `${deleteJoke.Code}/jokeCategoryDaoDeleteByJokeFailed`,
        message: "Delete jokeCategory by Dao deleteByJoke failed.",
        status: 500
      };
    }
  },

  jokeDaoDeleteFailed: class jokeDaoDeleteFailed extends Errors.JokesError {
    setParams() {
      return {
        code: `${deleteJoke.Code}/jokeDaoDeleteFailed`,
        message: "Delete joke by Dao delete failed.",
        status: 500
      };
    }
  }
};

let updateJoke = {
  Code: "updateJoke",
  InvalidDtoInError: class UpdateJokeInvalidDtoInError extends Errors.JokesError {
    setParams() {
      return {
        code: `${updateJoke.Code}/invalidDtoIn`,
        message: "DtoIn is not valid."
      };
    }
  },

  jokeDaoUpdateFailed: class jokeDaoUpdateFailed extends Errors.JokesError {
    setParams() {
      return {
        code: `${updateJoke.Code}/jokeDaoUpdateFailed`,
        message: "Update joke by joke Dao update failed.",
        status: 500
      };
    }
  },

  jokeDaoGetFailed: class jokeDaoGetFailed extends Errors.JokesError {
    setParams() {
      return {
        code: `${updateJoke.Code}/jokeDaoGetFailed`,
        message: "Get joke by joke Dao get failed.",
        status: 500
      };
    }
  }
};

let listCategoryJokes = {
  Code: "listCategoryJokes",
  InvalidDtoInError: class ListCategoryJokesInvalidDtoInError extends Errors.JokesError {
    setParams() {
      return {
        code: `${listCategoryJokes.Code}/invalidDtoIn`,
        message: "DtoIn is not valid."
      };
    }
  },

  jokeCategoryDaoListByCategoryFailed: class jokeCategoryDaoListByCategoryFailed extends Errors.JokesError {
    setParams() {
      return {
        code: `${listCategoryJokes.Code}/jokeCategoryDaoListByCategoryFailed`,
        message: "List jokeCategory by jokeCategory Dao listByCategory failed.",
        status: 500
      };
    }
  },

  jokeDaoListByIdsFailed: class jokeDaoListByIdsFailed extends Errors.JokesError {
    setParams() {
      return {
        code: `${listCategoryJokes.Code}/jokeDaoListByIdsFailed`,
        message: "List jokes by joke Dao listByIds failed.",
        status: 500
      };
    }
  }
};

Errors.createJoke = createJoke;
Errors.getJoke = getJoke;
Errors.listJokes = listJokes;
Errors.deleteJoke = deleteJoke;
Errors.updateJoke = updateJoke;
Errors.listCategoryJokes = listCategoryJokes;

module.exports = { Errors };

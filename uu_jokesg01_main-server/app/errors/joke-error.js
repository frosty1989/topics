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

  FailedError: class CreateJokeFailedError extends Errors.JokesError {
    setParams() {
      return {
        code: `${createJoke.Code}/jokeDaoCreateFailed`,
        message: "Create joke by joke Dao create failed.",
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

  FailedError: class ListJokesFailedError extends Errors.JokesError {
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

  FailedError: class DeleteJokeFailedError extends Errors.JokesError {
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

  FailedError: class UpdateJokeFailedError extends Errors.JokesError {
    setParams() {
      return {
        code: `${updateJoke.Code}/jokeDaoUpdateFailed`,
        message: "Update joke by joke Dao update failed.",
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

  FailedError: class ListCategoryJokesFailedError extends Errors.JokesError {
    setParams() {
      return {
        code: `${listCategoryJokes.Code}/jokeCategoryDaoListByCategoryFailed`,
        message: "List jokeCategory by jokeCategory Dao listByCategory failed.",
        status: 500
      };
    }
  }
};

let jokeCategoryDaoCreateFailed = {
  Code: "jokeCategoryDaoCreateFailed",
  FailedError: class JokeCategoryDaoCreateFailedFailedError extends Errors.JokesError {
    setParams() {
      return {
        code: `${jokeCategoryDaoCreateFailed.Code}/jokeCategoryDaoCreateFailed`,
        message: "Create jokeCategory by jokeCategory Dao create failed.",
        status: 500
      };
    }
  }
};

let jokeRatingDaoDeleteByJokeFailed = {
  Code: "jokeRatingDaoDeleteByJokeFailed",
  FailedError: class JokeRatingDaoDeleteByJokeFailed extends Errors.JokesError {
    setParams() {
      return {
        code: `${jokeRatingDaoDeleteByJokeFailed.Code}/jokeRatingDaoDeleteByJokeFailed`,
        message: "Delete jokeRating by Dao deleteByJoke failed.",
        status: 500
      };
    }
  }
};

let jokeCategoryDaoDeleteByJokeFailed = {
  Code: "jokeCategoryDaoDeleteByJokeFailed",
  FailedError: class JokeCategoryDaoDeleteByJokeFailed extends Errors.JokesError {
    setParams() {
      return {
        code: `${jokeCategoryDaoDeleteByJokeFailed.Code}/jokeCategoryDaoDeleteByJokeFailed`,
        message: "Delete jokeCategory by Dao deleteByJoke failed.",
        status: 500
      };
    }
  }
};

let jokeDoesNotExist = {
  Code: "jokeDoesNotExist",

};

Errors.jokeDoesNotExist = jokeDoesNotExist;
Errors.jokeCategoryDaoDeleteByJokeFailed = jokeCategoryDaoDeleteByJokeFailed;
Errors.jokeRatingDaoDeleteByJokeFailed = jokeCategoryDaoCreateFailed;
Errors.jokeCategoryDaoCreateFailed = jokeCategoryDaoCreateFailed;
Errors.createJoke = createJoke;
Errors.getJoke = getJoke;
Errors.listJokes = listJokes;
Errors.deleteJoke = deleteJoke;
Errors.updateJoke = updateJoke;
Errors.listCategoryJokes = listCategoryJokes;

module.exports = { Errors };

"use strict";

const { jokesError } = require("./uu-jokes-error");

let createJoke = {
  code: "createJoke",
  invalidDtoIn: class CreateJokeInvalidDtoInError extends jokesError {
    setParams() {
      return {
        code: `${createJoke.code}/invalidDtoIn`,
        message: "DtoIn is not valid."
      };
    }
  },

  jokeDaoCreateFailed: class JokeDaoCreateFailed extends jokesError {
    setParams() {
      return {
        code: `${createJoke.code}/jokeDaoCreateFailed`,
        message: "Create joke by joke Dao create failed.",
        status: 500
      };
    }
  },

  jokeCategoryDaoCreateFailed: class JokeCategoryDaoCreateFailed extends jokesError {
    setParams() {
      return {
        code: `${createJoke.code}/jokeCategoryDaoCreateFailed`,
        message: "Create jokeCategory by jokeCategory Dao create failed.",
        status: 500
      };
    }
  }
};

let getJoke = {
  code: "getJoke",
  invalidDtoIn: class GetJokeInvalidDtoInError extends jokesError {
    setParams() {
      return {
        code: `${getJoke.code}/invalidDtoIn`,
        message: "DtoIn is not valid."
      };
    }
  },

  jokeDaoGetFailed: class GetJokeFailedError extends jokesError {
    setParams() {
      return {
        code: `${getJoke.code}/jokeDaoGetFailed`,
        message: "Get joke by joke Dao get failed.",
        status: 500
      };
    }
  },

  jokeDoesNotExist: class JokeDoesNotExist extends jokesError {
    setParams() {
      return {
        code: `${getJoke.code}/jokeDoesNotExist`,
        message: "Joke does not exist.",
        status: 500
      };
    }
  },

  jokeCategoryDaoListByJokeFailed: class JokeCategoryDaoListByJokeFailed extends jokesError {
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
  invalidDtoInError: class ListJokesInvalidDtoInError extends jokesError {
    setParams() {
      return {
        code: `${listJokes.code}/invalidDtoIn`,
        message: "DtoIn is not valid."
      };
    }
  },

  jokeDaoListFailed: class JokeDaoListFailed extends jokesError {
    setParams() {
      return {
        code: `${listJokes.code}/jokeDaoListFailed`,
        message: "List jokes by joke Dao list failed.",
        status: 500
      };
    }
  }
};

let deleteJoke = {
  code: "deleteJoke",
  invalidDtoIn: class InvalidDtoIn extends jokesError {
    setParams() {
      return {
        code: `${deleteJoke.code}/invalidDtoIn`,
        message: "DtoIn is not valid."
      };
    }
  },

  jokeRatingDaoDeleteByJokeFailed: class JokeRatingDaoDeleteByJokeFailed extends jokesError {
    setParams() {
      return {
        code: `${deleteJoke.code}/jokeRatingDaoDeleteByJokeFailed`,
        message: "Delete jokeRating by Dao deleteByJoke failed.",
        status: 500
      };
    }
  },

  jokeCategoryDaoDeleteByJokeFailed: class JokeCategoryDaoDeleteByJokeFailed extends jokesError {
    setParams() {
      return {
        code: `${deleteJoke.code}/jokeCategoryDaoDeleteByJokeFailed`,
        message: "Delete jokeCategory by Dao deleteByJoke failed.",
        status: 500
      };
    }
  },

  jokeDaoDeleteFailed: class JokeDaoDeleteFailed extends jokesError {
    setParams() {
      return {
        code: `${deleteJoke.code}/jokeDaoDeleteFailed`,
        message: "Delete joke by Dao delete failed.",
        status: 500
      };
    }
  }
};

let updateJoke = {
  code: "updateJoke",
  invalidDtoInError: class UpdateJokeInvalidDtoInError extends jokesError {
    setParams() {
      return {
        code: `${updateJoke.code}/invalidDtoIn`,
        message: "DtoIn is not valid."
      };
    }
  },

  jokeDaoUpdateFailed: class JokeDaoUpdateFailed extends jokesError {
    setParams() {
      return {
        code: `${updateJoke.code}/jokeDaoUpdateFailed`,
        message: "Update joke by joke Dao update failed.",
        status: 500
      };
    }
  },

  jokeDaoGetFailed: class JokeDaoGetFailed extends jokesError {
    setParams() {
      return {
        code: `${updateJoke.code}/jokeDaoGetFailed`,
        message: "Get joke by joke Dao get failed.",
        status: 500
      };
    }
  }
};

let listCategoryJokes = {
  code: "listCategoryJokes",
  invalidDtoInError: class ListCategoryJokesInvalidDtoInError extends jokesError {
    setParams() {
      return {
        code: `${listCategoryJokes.code}/invalidDtoIn`,
        message: "DtoIn is not valid."
      };
    }
  },

  jokeCategoryDaoListByCategoryFailed: class JokeCategoryDaoListByCategoryFailed extends jokesError {
    setParams() {
      return {
        code: `${listCategoryJokes.code}/jokeCategoryDaoListByCategoryFailed`,
        message: "List jokeCategory by jokeCategory Dao listByCategory failed.",
        status: 500
      };
    }
  },

  jokeDaoListByIdsFailed: class JokeDaoListByIdsFailed extends jokesError {
    setParams() {
      return {
        code: `${listCategoryJokes.code}/jokeDaoListByIdsFailed`,
        message: "List jokes by joke Dao listByIds failed.",
        status: 500
      };
    }
  }
};

module.exports = {
  createJoke,
  getJoke,
  listJokes,
  deleteJoke,
  updateJoke,
  listCategoryJokes
};

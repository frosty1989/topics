"use strict";
const DemoAppError = require("./uu-jokes-error");
const Errors = require("./uu-jokes-error");
const CreateJokeCode = "createJoke";
const GetJoke = "getJoke";

let createJoke = {
  InvalidDtoIn: class CreateJokeInvalidDtoInError extends Errors.JokesError {
    setParams() {
      return {
        code: `${CreateJokeCode}/invalidDtoIn`,
        message: "DtoIn is not valid."
      };
    }
  },

  FailedError: class CreateJokeFailedError extends Errors.JokesError {
    setParams() {
      return {
        code: `${CreateJokeCode}/jokeDaoCreateFailed`,
        message: "Create joke by joke Dao create failed.",
        status: 500
      };
    }
  }
};

let getJoke = {
  InvalidDtoIn: class GetJokeInvalidDtoInError extends Errors.JokesError {
    setParams() {
      return {
        code: "getJoke/invalidDtoIn",
        message: "DtoIn is not valid."
      };
    }
    },

  FailedError: class GetJokeFailedError extends Errors.JokesError {
    setParams() {
      return {
        code: "jokeDaoGetFailed",
        message: "Get joke by joke Dao get failed.",
        status: 500
      };
    }
  }
};

Errors.createJoke = createJoke;

class ListJokesInvalidDtoInError extends Errors.JokesError {
  setParams() {
    return {
      code: "listJokes/invalidDtoIn",
      message: "DtoIn is not valid."
    };
  }
}

class ListJokesFailedError extends Errors.JokesError {
  setParams() {
    return {
      code: "listJokes/jokeDaoListFailed",
      message: "List jokes by joke Dao list failed.",
      status: 500
    };
  }
}

class DeleteJokeInvalidDtoInError extends Errors.JokesError {
  setParams() {
    return {
      code: "deleteJoke/invalidDtoIn",
      message: "DtoIn is not valid."
    };
  }
}

class DeleteJokeFailedError extends Errors.JokesError {
  setParams() {
    return {
      code: "deleteJoke/jokeDaoDeleteFailed",
      message: "Delete joke by Dao delete failed.",
      status: 500
    };
  }
}

class UpdateJokeInvalidDtoInError extends Errors.JokesError {
  setParams() {
    return {
      code: "updateJoke/invalidDtoIn",
      message: "DtoIn is not valid."
    };
  }
}

class UpdateJokeFailedError extends Errors.JokesError {
  setParams() {
    return {
      code: "updateJoke/jokeDaoUpdateFailed",
      message: "Update joke by joke Dao update failed.",
      status: 500
    };
  }
}

class ListCategoryJokesInvalidDtoInError extends Errors.JokesError {
  setParams() {
    return {
      code: "listCategoryJokes/invalidDtoIn",
      message: "DtoIn is not valid."
    };
  }
}

class ListCategoryJokesFailedError extends Errors.JokesError {
  setParams() {
    return {
      code: "listCategoryJokes/jokeCategoryDaoListByCategoryFailed",
      message: "List jokeCategory by jokeCategory Dao listByCategory failed.",
      status: 500
    };
  }
}
module.exports = {
  // CreateJokeInvalidDtoInError,
  // CreateJokeFailedError,
  // GetJokeInvalidDtoInError,
  // GetJokeFailedError,
  ListJokesInvalidDtoInError,
  ListJokesFailedError,
  DeleteJokeInvalidDtoInError,
  DeleteJokeFailedError,
  UpdateJokeFailedError,
  UpdateJokeInvalidDtoInError,
  ListCategoryJokesInvalidDtoInError,
  ListCategoryJokesFailedError,
  Errors,
  CreateJokeCode
};

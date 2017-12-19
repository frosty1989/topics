"use strict";
const DemoAppError = require("./uu-jokes-error");

class CreateJokeInvalidDtoInError extends DemoAppError {
  setParams() {
    return {
      code: "createJoke/invalidDtoIn",
      message: "DtoIn is not valid."
    };
  }
}

class CreateJokeFailedError extends DemoAppError {
  setParams() {
    return {
      code: "createJoke/jokeDaoCreateFailed",
      message: "Create joke by joke Dao create failed.",
      status: 500
    };
  }
}

class GetJokeInvalidDtoInError extends DemoAppError {
  setParams() {
    return {
      code: "getJoke/invalidDtoIn",
      message: "DtoIn is not valid."
    };
  }
}

class GetJokeFailedError extends DemoAppError {
  setParams() {
    return {
      code: "jokeDaoGetFailed",
      message: "Get joke by joke Dao get failed.",
      status: 500
    };
  }
}

class ListJokesInvalidDtoInError extends DemoAppError {
  setParams() {
    return {
      code: "listJokes/invalidDtoIn",
      message: "DtoIn is not valid."
    };
  }
}

class ListJokesFailedError extends DemoAppError {
  setParams() {
    return {
      code: "listJokes/jokeDaoListFailed",
      message: "List jokes by joke Dao list failed.",
      status: 500
    };
  }
}

class DeleteJokeInvalidDtoInError extends DemoAppError {
  setParams() {
    return {
      code: "deleteJoke/invalidDtoIn",
      message: "DtoIn is not valid."
    };
  }
}

class DeleteJokeFailedError extends DemoAppError {
  setParams() {
    return {
      code: "deleteJoke/jokeDaoDeleteFailed",
      message: "Delete joke by Dao delete failed.",
      status: 500
    };
  }
}

class UpdateJokeInvalidDtoInError extends DemoAppError {
  setParams() {
    return {
      code: "updateJoke/invalidDtoIn",
      message: "DtoIn is not valid."
    };
  }
}

class UpdateJokeFailedError extends DemoAppError {
  setParams() {
    return {
      code: "updateJoke/jokeDaoUpdateFailed",
      message: "Update joke by joke Dao update failed.",
      status: 500
    };
  }
}

class ListCategoryJokesInvalidDtoInError extends DemoAppError {
  setParams() {
    return {
      code: "listCategoryJokes/invalidDtoIn",
      message: "DtoIn is not valid."
    };
  }
}

class ListCategoryJokesFailedError extends DemoAppError {
  setParams() {
    return {
      code: "listCategoryJokes/jokeCategoryDaoListByCategoryFailed",
      message: "List jokeCategory by jokeCategory Dao listByCategory failed.",
      status: 500
    };
  }
}
module.exports = {
  CreateJokeInvalidDtoInError,
  CreateJokeFailedError,
  GetJokeInvalidDtoInError,
  GetJokeFailedError,
  ListJokesInvalidDtoInError,
  ListJokesFailedError,
  DeleteJokeInvalidDtoInError,
  DeleteJokeFailedError,
  UpdateJokeFailedError,
  UpdateJokeInvalidDtoInError,
  ListCategoryJokesInvalidDtoInError,
  ListCategoryJokesFailedError
};

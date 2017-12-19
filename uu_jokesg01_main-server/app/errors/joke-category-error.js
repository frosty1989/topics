"use strict";
const Errors = require("./uu-jokes-error");

class AddJokeCategoryInvalidDtoInError extends Errors.JokesError {
  setParams() {
    return {
      code: "addJokeCategory/invalidDtoIn",
      message: "DtoIn is not valid."
    };
  }
}

class AddJokeCategoryFailedError extends Errors.JokesError {
  setParams() {
    return {
      code: "addJokeCategory/failed",
      message: "Add joke category is failed.",
      status: 500
    };
  }
}

class RemoveJokeCategoryInvalidDtoInError extends Errors.JokesError {
  setParams() {
    return {
      code: "removeJokeCategory/invalidDtoIn",
      message: "DtoIn is not valid."
    };
  }
}

class RemoveJokeCategoryFailedError extends Errors.JokesError {
  setParams() {
    return {
      code: "removeJokeCategory/failed",
      message: "Remove joke category is failed.",
      status: 500
    };
  }
}

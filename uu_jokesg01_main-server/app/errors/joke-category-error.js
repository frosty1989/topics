"use strict";
const DemoAppError = require("./uu-jokes-error");

class AddJokeCategoryInvalidDtoInError extends DemoAppError {
  setParams() {
    return {
      code: "addJokeCategory/invalidDtoIn",
      message: "DtoIn is not valid."
    };
  }
}

class AddJokeCategoryFailedError extends DemoAppError {
  setParams() {
    return {
      code: "addJokeCategory/failed",
      message: "Add joke category is failed.",
      status: 500
    };
  }
}

class RemoveJokeCategoryInvalidDtoInError extends DemoAppError {
  setParams() {
    return {
      code: "removeJokeCategory/invalidDtoIn",
      message: "DtoIn is not valid."
    };
  }
}

class RemoveJokeCategoryFailedError extends DemoAppError {
  setParams() {
    return {
      code: "removeJokeCategory/failed",
      message: "Remove joke category is failed.",
      status: 500
    };
  }
}

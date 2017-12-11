"use strict";
const DemoAppError = require("./uu-demoapp-error");

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
      code: "createJoke/failed",
      message: "Create joke failed.",
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
      code: "getJoke/failed",
      message: "Get joke failed.",
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
      code: "listJokes/failed",
      message: "List joke failed.",
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
      code: "deleteJoke/failed",
      message: "Delete joke failed.",
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
  DeleteJokeFailedError
};

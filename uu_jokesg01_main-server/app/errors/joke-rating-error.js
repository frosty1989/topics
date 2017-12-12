"use strict";
const DemoAppError = require("./uu-demoapp-error");

class AddJokeRatingInvalidDtoInError extends DemoAppError {
  setParams() {
    return {
      code: "addJokeRating/invalidDtoIn",
      message: "DtoIn is not valid."
    };
  }
}

class AddJokeRatingFailedError extends DemoAppError {
  setParams() {
    return {
      code: "addJokeRating/failed",
      message: "Add joke rating is failed.",
      status: 500
    };
  }
}

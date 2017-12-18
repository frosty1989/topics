"use strict";
const DemoAppError = require("./uu-jokes-error");
const Code = "addJokeRating/";

class InvalidDtoInError extends DemoAppError {
  setParams() {
    return {
      code: `${Code}/invalidDtoIn`,
      message: "DtoIn is not valid."
    };
  }
}

class DaoGetByJokeAndIdentityFailed extends DemoAppError {
  setParams() {
    return {
      code: `${Code}/jokeRatingDaoGetByJokeAndIdentityFailed`,
      message: "Get jokeRating by Dao getByJokeAndIdentity failed."
    };
  }
}

class DaoUpdateFailed extends DemoAppError {
  setParams() {
    return {
      code: `${Code}/jokeRatingDaoUpdateFailed`,
      message: "Update jokeRating by Dao update failed."
    };
  }
}

class DaoCreateFailed extends DemoAppError {
  setParams() {
    return {
      code: `${Code}/jokeRatingDaoCreateFailed`,
      message: "Create jokeRating by Dao create failed."
    };
  }
}

module.exports = {
  Code,
  InvalidDtoInError,
  DaoGetByJokeAndIdentityFailed,
  DaoUpdateFailed,
  DaoCreateFailed
};

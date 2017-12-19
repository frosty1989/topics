"use strict";
const Errors = require("./uu-jokes-error");
let addJokeCategory = {
  Code: "addJokeCategory",
  InvalidDtoInError: class AddJokeCategoryInvalidDtoInError extends Errors.JokesError {
    setParams() {
      return {
        code: `${addJokeCategory.Code}/invalidDtoIn`,
        message: "DtoIn is not valid."
      };
    }
  },

  FailedError: class AddJokeCategoryFailedError extends Errors.JokesError {
    setParams() {
      return {
        code: `${addJokeCategory.Code}/failed`,
        message: "Add joke category is failed.",
        status: 500
      };
    }
  }
};

let removeJokeCategory = {
  Code: "removeJokeCategory",
  InvalidDtoInError: class RemoveJokeCategoryInvalidDtoInError extends Errors.JokesError {
    setParams() {
      return {
        code: `${removeJokeCategory.Code}/invalidDtoIn`,
        message: "DtoIn is not valid."
      };
    }
  },

  FailedError: class RemoveJokeCategoryFailedError extends Errors.JokesError {
    setParams() {
      return {
        code: `${removeJokeCategory.Code}/failed`,
        message: "Remove joke category is failed.",
        status: 500
      };
    }
  }
};

Errors.addJokeCategory = addJokeCategory;
Errors.removeJokeCategory = removeJokeCategory;

module.exports = { Errors };

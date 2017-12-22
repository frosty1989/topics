"use strict";
const Errors = require("./uu-jokes-error");

let addJokeRating = {
  code: "addJokeRating",
  invalidDtoIn: class extends Errors.JokesError {
    setParams() {
      return {
        code: `${addJokeRating.code}/invalidDtoIn`,
        message: "DtoIn is not valid."
      };
    }
  },
  jokeDaoGetFailed: class extends Errors.JokesError {
    setParams() {
      return {
        code: `${addJokeRating.code}/jokeDaoGetFailed`,
        message: "Get joke by Dao get failed."
      };
    }
  },
  jokeDoesNotExist: class extends Errors.JokesError {
    setParams() {
      return {
        code: `${addJokeRating.code}/jokeDoesNotExist`,
        message: "Joke does not exist."
      };
    }
  },
  jokeRatingDaoGetByJokeAndIdentityFailed: class extends Errors.JokesError {
    setParams() {
      return {
        code: `${addJokeRating.code}/jokeRatingDaoGetByJokeAndIdentityFailed`,
        message: "Get jokeRating by Dao getByJokeAndIdentity failed."
      };
    }
  },
  jokeRatingDaoUpdateFailed: class extends Errors.JokesError {
    setParams() {
      return {
        code: `${addJokeRating.code}/jokeRatingDaoUpdateFailed`,
        message: "Update jokeRating by Dao update failed."
      };
    }
  },
  jokeRatingDaoCreateFailed: class extends Errors.JokesError {
    setParams() {
      return {
        code: `${addJokeRating.code}/jokeRatingDaoCreateFailed`,
        message: "Create jokeRating by Dao create failed."
      };
    }
  },
  jokeDaoUpdateFailed: class extends Errors.JokesError {
    setParams() {
      return {
        code: `${addJokeRating.code}/jokeDaoUpdateFailed`,
        message: "Update joke by Dao update failed."
      };
    }
  }
};

Errors.addJokeRating = addJokeRating;

module.exports = {
  Errors
};

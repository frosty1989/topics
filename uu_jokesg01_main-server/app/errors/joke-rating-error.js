"use strict";
const Errors = require("./uu-jokes-error");

Errors.addJokeRating = {
  code: "addJokeRating",
  invalidDtoIn: class InvalidDtoInError extends Errors.JokesError {
    setParams() {
      return {
        code: `${addJokeRating.Code}/invalidDtoIn`,
        message: "DtoIn is not valid."
      };
    }
  },
  jokeDaoGetFailed: class JokeDaoGetFailed extends Errors.JokesError {
    setParams() {
      return {
        code: `${addJokeRating.Code}/jokeDaoGetFailed`,
        message: "Get joke by Dao get failed."
      };
    }
  },
  jokeDoesNotExist: class JokeDoesNotExist extends Errors.JokesError {
    setParams() {
      return {
        code: `${addJokeRating.Code}/jokeDoesNotExist`,
        message: "Joke does not exist."
      };
    }
  },
  jokeRatingDaoGetByJokeAndIdentityFailed: class JokeRatingDaoGetByJokeAndIdentityFailed extends Errors.JokesError {
    setParams() {
      return {
        code: `${addJokeRating.Code}/jokeRatingDaoGetByJokeAndIdentityFailed`,
        message: "Get jokeRating by Dao getByJokeAndIdentity failed."
      };
    }
  },
  jokeRatingDaoUpdateFailed: class JokeRatingDaoUpdateFailed extends Errors.JokesError {
    setParams() {
      return {
        code: `${addJokeRating.Code}/jokeRatingDaoUpdateFailed`,
        message: "Update jokeRating by Dao update failed."
      };
    }
  },
  jokeRatingDaoCreateFailed: class JokeRatingDaoCreateFailed extends Errors.JokesError {
    setParams() {
      return {
        code: `${addJokeRating.Code}/jokeRatingDaoCreateFailed`,
        message: "Create jokeRating by Dao create failed."
      };
    }
  },
  jokeDaoUpdateFailed: class JokeDaoUpdateFailed extends Errors.JokesError {
    setParams() {
      return {
        code: `${addJokeRating.Code}/jokeDaoUpdateFailed`,
        message: "Update joke by Dao update failed."
      };
    }
  }
};

module.exports = {
  Errors
};

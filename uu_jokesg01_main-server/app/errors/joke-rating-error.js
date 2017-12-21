"use strict";
const Errors = require("./uu-jokes-error");

let addJokeRating = {
  code: "addJokeRating",
  invalidDtoIn: class invalidDtoInError extends Errors.JokesError {
    setParams() {
      return {
        code: `${addJokeRating.code}/invalidDtoIn`,
        message: "DtoIn is not valid."
      };
    }
  },
  jokeDaoGetFailed: class JokeDaoGetFailed extends Errors.JokesError {
    setParams() {
      return {
        code: `${addJokeRating.code}/jokeDaoGetFailed`,
        message: "Get joke by Dao get failed."
      };
    }
  },
  jokeDoesNotExist: class JokeDoesNotExist extends Errors.JokesError {
    setParams() {
      return {
        code: `${addJokeRating.code}/jokeDoesNotExist`,
        message: "Joke does not exist."
      };
    }
  },
  jokeRatingDaoGetByJokeAndIdentityFailed: class JokeRatingDaoGetByJokeAndIdentityFailed extends Errors.JokesError {
    setParams() {
      return {
        code: `${addJokeRating.code}/jokeRatingDaoGetByJokeAndIdentityFailed`,
        message: "Get jokeRating by Dao getByJokeAndIdentity failed."
      };
    }
  },
  jokeRatingDaoUpdateFailed: class JokeRatingDaoUpdateFailed extends Errors.JokesError {
    setParams() {
      return {
        code: `${addJokeRating.code}/jokeRatingDaoUpdateFailed`,
        message: "Update jokeRating by Dao update failed."
      };
    }
  },
  jokeRatingDaoCreateFailed: class JokeRatingDaoCreateFailed extends Errors.JokesError {
    setParams() {
      return {
        code: `${addJokeRating.code}/jokeRatingDaoCreateFailed`,
        message: "Create jokeRating by Dao create failed."
      };
    }
  },
  jokeDaoUpdateFailed: class JokeDaoUpdateFailed extends Errors.JokesError {
    setParams() {
      return {
        code: `${addJokeRating.code}/jokeDaoUpdateFailed`,
        message: "Update joke by Dao update failed."
      };
    }
  }
};

Errors.addJokeRating = addJokeRating;

module.exports = { Errors };

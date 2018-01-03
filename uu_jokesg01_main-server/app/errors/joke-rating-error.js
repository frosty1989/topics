"use strict";

const { prefix, jokesError } = require("./uu-jokes-error");

let addJokeRating = {
  code: "addJokeRating",
  invalidDtoIn: class extends jokesError {
    setParams() {
      return {
        code: `${addJokeRating.code}/invalidDtoIn`,
        message: "DtoIn is not valid."
      };
    }
  },
  jokeDaoGetFailed: class extends jokesError {
    setParams() {
      return {
        code: `${addJokeRating.code}/jokeDaoGetFailed`,
        message: "Get joke by Dao get failed."
      };
    }
  },
  jokeDoesNotExist: class extends jokesError {
    setParams() {
      return {
        code: `${addJokeRating.code}/jokeDoesNotExist`,
        message: "Joke does not exist."
      };
    }
  },
  jokeRatingDaoGetByJokeAndIdentityFailed: class extends jokesError {
    setParams() {
      return {
        code: `${addJokeRating.code}/jokeRatingDaoGetByJokeAndIdentityFailed`,
        message: "Get jokeRating by Dao getByJokeAndIdentity failed."
      };
    }
  },
  jokeRatingDaoUpdateFailed: class extends jokesError {
    setParams() {
      return {
        code: `${addJokeRating.code}/jokeRatingDaoUpdateFailed`,
        message: "Update jokeRating by Dao update failed."
      };
    }
  },
  jokeRatingDaoCreateFailed: class extends jokesError {
    setParams() {
      return {
        code: `${addJokeRating.code}/jokeRatingDaoCreateFailed`,
        message: "Create jokeRating by Dao create failed."
      };
    }
  },
  jokeDaoUpdateFailed: class extends jokesError {
    setParams() {
      return {
        code: `${addJokeRating.code}/jokeDaoUpdateFailed`,
        message: "Update joke by Dao update failed."
      };
    }
  }
};

module.exports = {
  prefix,
  addJokeRating
};

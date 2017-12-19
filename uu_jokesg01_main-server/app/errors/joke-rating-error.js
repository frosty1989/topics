"use strict";
const Errors = require("./uu-jokes-error");

let addJokeRating = {
  Code: "addJokeRating",
  InvalidDtoIn: class InvalidDtoInError extends Errors.JokesError {
    setParams() {
      return {
        code: `${addJokeRating.Code}/invalidDtoIn`,
        message: "DtoIn is not valid."
      };
    }
  }
};

let jokeDaoGetFailed = {
  Code: "jokeDaoGetFailed",
  FailedError: class jokeDaoGetFailedError extends Errors.JokesError {
    setParams() {
      return {
        code: `${jokeDaoGetFailed.Code}/jokeDaoGetFailed`,
        message: "Get joke by Dao get failed.",
        status: 500
      };
    }
  }
};

let jokeDoesNotExist = {
  Code: "jokeDoesNotExist",
  FailedError: class jokeDoesNotExistFailedError extends Errors.JokesError {
    setParams() {
      return {
        code: `${jokeDoesNotExist.Code}/jokeDoesNotExist`,
        message: "Joke does not exist.",
        status: 500
      };
    }
  }
};

let jokeRatingDaoGetByJokeAndIdentityFailed = {
  Code: "jokeRatingDaoGetByJokeAndIdentityFailed",
  FailedError: class jokeRatingDaoGetByJokeAndIdentityFailedError extends Errors.JokesError {
    setParams() {
      return {
        code: `${jokeRatingDaoGetByJokeAndIdentityFailed.Code}/jokeRatingDaoGetByJokeAndIdentityFailed`,
        message: "Get jokeRating by Dao getByJokeAndIdentity failed.",
        status: 500
      };
    }
  }
};

let jokeRatingDaoUpdateFailed = {
  Code: "jokeRatingDaoUpdateFailed",
  FailedError: class jokeRatingDaoUpdateFailedError extends Errors.JokesError {
    setParams() {
      return {
        code: `${jokeRatingDaoUpdateFailed.Code}/jokeRatingDaoUpdateFailed`,
        message: "Update jokeRating by Dao update failed.",
        status: 500
      };
    }
  }
};

let jokeRatingDaoCreateFailed = {
  Code: "jokeRatingDaoCreateFailed",
  FailedError: class jokeRatingDaoCreateFailedError extends Errors.JokesError {
    setParams() {
      return {
        code: `${jokeRatingDaoCreateFailed.Code}/jokeRatingDaoCreateFailed`,
        message: "Create jokeRating by Dao create failed.",
        status: 500
      };
    }
  }
};

let jokeDaoUpdateFailed = {
  Code: "jokeDaoUpdateFailed",
  FailedError: class jokeDaoUpdateFailedError extends Errors.JokesError {
    setParams() {
      return {
        code: `${jokeDaoUpdateFailed.Code}/jokeDaoUpdateFailed`,
        message: "Update joke by Dao update failed.",
        status: 500
      };
    }
  }
};

Errors.addJokeRating = addJokeRating;
Errors.jokeDaoGetFailed = jokeDaoGetFailed;
Errors.jokeDoesNotExist = jokeDoesNotExist;
Errors.jokeRatingDaoGetByJokeAndIdentityFailed = jokeRatingDaoGetByJokeAndIdentityFailed;
Errors.jokeRatingDaoUpdateFailed = jokeRatingDaoUpdateFailed;
Errors.jokeRatingDaoCreateFailed = jokeRatingDaoCreateFailed;
Errors.jokeDaoUpdateFailed = jokeDaoUpdateFailed;

module.exports = { Errors };

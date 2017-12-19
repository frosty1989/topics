"use strict";
const Errors = require("./uu-jokes-error");
const AddJokeRatingCode = "addJokeRating";

let addJokeRating = {
  InvalidDtoIn: class InvalidDtoInError extends Errors.JokesError {
    setParams() {
      return {
        code: `${AddJokeRatingCode}/invalidDtoIn`,
        message: "DtoIn is not valid."
      };
    }
  }
};

Errors.addJokeRating = addJokeRating;

module.exports = {
  Errors,
  AddJokeRatingCode
};

// ns.addJokeRating.JokeDaoGetFailed = class DaoGetByJokeAndIdentityFailed extends Errors {
//   setParams() {
//     return {
//       code: `${Code}/jokeRatingDaoGetByJokeAndIdentityFailed`,
//       message: "Get jokeRating by Dao getByJokeAndIdentity failed."
//     };
//   }
// };;

// class DaoUpdateFailed extends Errors {
//   setParams() {
//     return {
//       code: `${Code}/jokeRatingDaoUpdateFailed`,
//       message: "Update jokeRating by Dao update failed."
//     };
//   }
// }

// class DaoCreateFailed extends Errors {
//   setParams() {
//     return {
//       code: `${Code}/jokeRatingDaoCreateFailed`,
//       message: "Create jokeRating by Dao create failed."
//     };
//   }
// }


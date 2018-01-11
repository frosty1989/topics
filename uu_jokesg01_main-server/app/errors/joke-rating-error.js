"use strict";

const UuJokesError = require("./uu-jokes-error");

let AddJokeRating = {
  UC_CODE: `${UuJokesError.ERROR_PREFIX}addJokeRating/`,
  InvalidDtoIn: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${AddJokeRating.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  JokeDaoGetFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${AddJokeRating.UC_CODE}jokeDaoGetFailed`;
      this.message = "Get joke by Dao get failed.";
    }
  },
  JokeDoesNotExist: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${AddJokeRating.UC_CODE}jokeDoesNotExist`;
      this.message = "Joke does not exist.";
    }
  },
  JokeRatingDaoGetByJokeAndIdentityFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${AddJokeRating.UC_CODE}jokeRatingDaoGetByJokeAndIdentityFailed`;
      this.message = "Get jokeRating by Dao getByJokeAndIdentity failed.";
    }
  },
  JokeRatingDaoUpdateFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${AddJokeRating.UC_CODE}jokeRatingDaoUpdateFailed`;
      this.message = "Update jokeRating by Dao update failed.";
    }
  },
  JokeRatingDaoCreateFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${AddJokeRating.UC_CODE}jokeRatingDaoCreateFailed`;
      this.message = "Create jokeRating by Dao create failed.";
    }
  },
  JokeDaoUpdateFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${AddJokeRating.UC_CODE}jokeDaoUpdateFailed`;
      this.message = "Update joke by Dao update failed.";
    }
  }
};

module.exports = {
  AddJokeRating
};

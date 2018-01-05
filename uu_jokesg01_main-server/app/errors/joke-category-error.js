"use strict";

const UuJokesError = require("./uu-jokes-error");

const AddJokeCategory = {
  UC_CODE: `${UuJokesError.ERROR_PREFIX}addJokeCategory/`,

  InvalidDtoInError: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${AddJokeCategory.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  JokeDaoGetFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${AddJokeCategory.UC_CODE}jokeDaoGetFailed`;
      this.message = "Get joke by joke Dao get failed.";
      this.status = 500;
    }
  },

  JokeDoesNotExist: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${AddJokeCategory.UC_CODE}jokeDoesNotExist`;
      this.message = "Joke does not exist.";
    }
  },

  CategoryDaoGetFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${AddJokeCategory.UC_CODE}categoryDaoGetFailed`;
      this.message = "Get category by category Dao get failed.";
      this.status = 500;
    }
  },

  JokeCategoryDaoCreateFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${AddJokeCategory.UC_CODE}jokeCategoryDaoCreateFailed`;
      this.message = "Create jokeCategory by jokeCategory Dao create failed.";
      this.status = 500;
    }
  }
};

let RemoveJokeCategory = {
  UC_CODE: `${UuJokesError.ERROR_PREFIX}removeJokeCategory/`,

  InvalidDtoInError: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${RemoveJokeCategory.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  JokeCategoryDaoDeleteByJokeAndCategoryFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${RemoveJokeCategory.UC_CODE}jokeCategoryDaoDeleteByJokeAndCategoryFailed`;
      this.message = "Delete jokeCategory by Dao deleteByJokeAndCategory failed.";
      this.status = 500;
    }
  }
};

module.exports = {
  AddJokeCategory,
  RemoveJokeCategory
};

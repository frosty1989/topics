"use strict";

const UuJokesError = require("./uu-jokes-error");

let CreateJoke = {
  UC_CODE: `${UuJokesError.ERROR_PREFIX}createJoke/`,
  InvalidDtoIn: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${CreateJoke.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  JokeDaoCreateFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${CreateJoke.UC_CODE}jokeDaoCreateFailed`;
      this.message = "Create joke by joke Dao create failed.";
      this.status = 500;
    }
  },

  JokeCategoryDaoCreateFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${CreateJoke.UC_CODE}jokeCategoryDaoCreateFailed`;
      this.message = "Create jokeCategory by jokeCategory Dao create failed.";
      this.status = 500;
    }
  }
};

let GetJoke = {
  UC_CODE: `${UuJokesError.ERROR_PREFIX}getJoke/`,
  InvalidDtoIn: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${GetJoke.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  JokeDaoGetFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${GetJoke.UC_CODE}jokeDaoGetFailed`;
      this.message = "Get joke by joke Dao get failed.";
      this.status = 500;
    }
  },

  JokeDoesNotExist: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${GetJoke.UC_CODE}jokeDoesNotExist`;
      this.message = "Joke does not exist.";
    }
  },

  JokeCategoryDaoListByJokeFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${GetJoke.UC_CODE}jokeCategoryDaoListByJokeFailed`;
      this.message = "List jokeCategoty by joke Dao listByCategory failed.";
      this.status = 500;
    }
  }
};

let ListJokes = {
  UC_CODE: `${UuJokesError.ERROR_PREFIX}listJokes/`,
  InvalidDtoInError: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${ListJokes.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  JokeDaoListFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${ListJokes.UC_CODE}jokeDaoListFailed`;
      this.message = "List jokes by joke Dao list failed.";
      this.status = 500;
    }
  }
};

let DeleteJoke = {
  UC_CODE: `${UuJokesError.ERROR_PREFIX}deleteJoke/`,
  InvalidDtoIn: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${DeleteJoke.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  JokeRatingDaoDeleteByJokeFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${DeleteJoke.UC_CODE}jokeRatingDaoDeleteByJokeFailed`;
      this.message = "Delete jokeRating by Dao deleteByJoke failed.";
      this.status = 500;
    }
  },

  JokeCategoryDaoDeleteByJokeFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${DeleteJoke.UC_CODE}jokeCategoryDaoDeleteByJokeFailed`;
      this.message = "Delete jokeCategory by Dao deleteByJoke failed.";
      this.status = 500;
    }
  },

  JokeDaoDeleteFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${DeleteJoke.UC_CODE}jokeDaoDeleteFailed`;
      this.message = "Delete joke by Dao delete failed.";
      this.status = 500;
    }
  }
};

let UpdateJoke = {
  UC_CODE: `${UuJokesError.ERROR_PREFIX}updateJoke/`,
  InvalidDtoIn: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${UpdateJoke.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  JokeDaoUpdateFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${UpdateJoke.UC_CODE}jokeDaoUpdateFailed`;
      this.message = "Update joke by joke Dao update failed.";
      this.status = 500;
    }
  },

  JokeDaoGetFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${UpdateJoke.UC_CODE}jokeDaoGetFailed`;
      this.message = "Get joke by joke Dao get failed.";
      this.status = 500;
    }
  }
};

module.exports = {
  CreateJoke,
  GetJoke,
  ListJokes,
  DeleteJoke,
  UpdateJoke
};

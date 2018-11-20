"use strict";

const UuJokesError = require("./uu-jokes-error");
const JOKE_ERROR_PREFIX = `${UuJokesError.ERROR_PREFIX}joke/`;

const Create = {
  UC_CODE: `${JOKE_ERROR_PREFIX}create/`,
  JokesInstanceDoesNotExist: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}jokesInstanceDoesNotExist`;
      this.message = "JokesInstance does not exist.";
    }
  },
  JokesInstanceNotInProperState: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}jokesInstanceNotInProperState`;
      this.message = "JokesInstance is not in proper state [active|underConstruction].";
    }
  },
  InvalidDtoIn: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  UuBinaryCreateFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}uuBinaryCreateFailed`;
      this.message = "Creating uuBinary failed.";
    }
  },
  JokeDaoCreateFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}jokeDaoCreateFailed`;
      this.message = "Create joke by joke DAO create failed.";
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
    }
  }
};

let ListJokes = {
  UC_CODE: `${UuJokesError.ERROR_PREFIX}listJokes/`,
  InvalidDtoIn: class extends UuJokesError {
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
    }
  },
  JokeCategoryDaoDeleteByJokeFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${DeleteJoke.UC_CODE}jokeCategoryDaoDeleteByJokeFailed`;
      this.message = "Delete jokeCategory by Dao deleteByJoke failed.";
    }
  },
  JokeDaoDeleteFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${DeleteJoke.UC_CODE}jokeDaoDeleteFailed`;
      this.message = "Delete joke by Dao delete failed.";
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
    }
  },
  JokeDaoGetFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${UpdateJoke.UC_CODE}jokeDaoGetFailed`;
      this.message = "Get joke by joke Dao get failed.";
    }
  }
};

module.exports = {
  Create,
  GetJoke,
  ListJokes,
  DeleteJoke,
  UpdateJoke
};

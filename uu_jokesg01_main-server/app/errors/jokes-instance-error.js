"use strict";

const UuJokesError = require("./uu-jokes-error");
const JOKES_INSTANCE_ERROR_PREFIX = `${UuJokesError.ERROR_PREFIX}jokesInstance/`;

const Init = {
  UC_CODE: `${JOKES_INSTANCE_ERROR_PREFIX}init/`,
  JokesInstanceAlreadyInitialized: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}jokesInstanceAlreadyInitialized`;
      this.message = "JokesInstance is already initialized.";
    }
  },
  InvalidDtoIn: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  SysSetProfileFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}sys/setProfileFailed`;
      this.message = "Create uuAppProfile failed.";
    }
  },
  CreateBinaryFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}uu-app-binarystore/createBinaryFailed`;
      this.message = "Create uuBinary logo failed.";
    }
  },
  JokesInstanceDaoCreateFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}jokesInstanceDaoCreateFailed`;
      this.message = "Create jokesInstance by jokesInstance DAO create failed.";
    }
  }
};

module.exports = {
  Init
};

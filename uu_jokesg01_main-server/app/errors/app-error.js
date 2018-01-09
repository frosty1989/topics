"use strict";

const UuJokesError = require("./uu-jokes-error");

const Init = {
  UC_CODE: `${UuJokesError.ERROR_PREFIX}init`,
  InvalidDtoIn: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}/invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  SchemaDaoCreateSchemaFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}/schemaDaoCreateSchemaFailed`;
      this.message = "Create schema by Dao createSchema failed.";
    }
  },
  SysSetProfileFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}/sys/setProfileFailed`;
      this.message = "Create uuAppProfile failed.";
    }
  }
};

module.exports = {
  Init
};

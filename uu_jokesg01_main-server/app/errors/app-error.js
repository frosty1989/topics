"use strict";

const UuJokesError = require("./uu-jokes-error");

let init = {
  code: "init",
  invalidDtoIn: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${init.code}/invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  schemaDaoCreateSchemaFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${init.code}/schemaDaoCreateSchemaFailed`;
      this.message = "Create schema by Dao createSchema failed.";
    }
  },
  sysSetProfileFailed: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${init.code}/sys/setProfileFailed`;
      this.message = "Create uuAppProfile failed.";
    }
  }
};

module.exports = {
  init
};

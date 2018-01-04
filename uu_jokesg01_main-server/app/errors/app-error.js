"use strict";

const { prefix, jokesError } = require("./uu-jokes-error");

let init = {
  code: "init",
  invalidDtoIn: class extends jokesError {
    setParams() {
      return {
        code: `${init.code}/invalidDtoIn`,
        message: "DtoIn is not valid."
      };
    }
  },
  schemaDaoCreateSchemaFailed: class extends jokesError {
    setParams() {
      return {
        code: `${init.code}/schemaDaoCreateSchemaFailed`,
        message: "Create schema by Dao createSchema failed."
      };
    }
  },
  sysSetProfileFailed: class extends jokesError {
    setParams() {
      return {
        code: `${init.code}/sys/setProfileFailed`,
        message: "Create uuAppProfile failed."
      };
    }
  }
};

module.exports = {
  prefix,
  init
};

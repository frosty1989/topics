"use strict";

const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper, SysProfile } = require("uu_appg01_server").Workspace;
const Path = require("path");
const { prefix, init } = require("../errors/app-error");

class AppModel {
  constructor() {
    this.validator = new Validator(
      Path.join(__dirname, "..", "validation_types", "app-types.js")
    );
  }

  async init(awid, dtoIn) {
    let schemas = ["joke", "jokeRating", "category", "jokeCategory"];
    let validationResult = this.validator.validate("initDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      {},
      `${prefix}/${init.code}/unsupportedKey`,
      init.invalidDtoIn
    );
    let dtoOut = {};

    for (let index = 0; index < schemas.length; index++) {
      const schema = schemas[index];

      try {
        await DaoFactory.getDao(schema).createSchema();
      } catch (cause) {
        throw new init.schemaDaoCreateSchemaFailed(
          { uuAppErrorMap },
          { schema },
          cause
        );
      }
    }

    try {
      await SysProfile.setProfile(awid, {
        code: "Authorities",
        roleUri: dtoIn.uuAppProfileAuthorities
      });
    } catch (cause) {
      throw new init.sysSetProfileFailed(
        { uuAppErrorMap },
        { role: dtoIn.uuAppProfileAuthorities },
        cause
      );
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;

    return dtoOut;
  }
}

module.exports = new AppModel();

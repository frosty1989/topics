"use strict";

const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper, SysProfile } = require("uu_appg01_server").Workspace;
const Path = require("path");
const Errors = require("../errors/app-error");

const WARNINGS = {
  initUnsupportedKeys: {
    code: `${Errors.Init.UC_CODE}unsupportedKeys`
  }
};

class AppModel {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "validation_types", "app-types.js"));
  }

  async init(awid, dtoIn) {
    const schemas = ["joke", "jokeRating", "category", "jokeCategory"];
    //HDS 1
    let validationResult = this.validator.validate("initDtoInType", dtoIn);
    //A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.initUnsupportedKeys.code,
      Errors.Init.InvalidDtoIn
    );
    let dtoOut = {};

    for (let index = 0; index < schemas.length; index++) {
      const schema = schemas[index];

      try {
        //HDS 2
        await DaoFactory.getDao(schema).createSchema();
      } catch (e) {
        //A3
        if (e instanceof ObjectStoreError) {
          throw new Errors.Init.SchemaDaoCreateSchemaFailed({ uuAppErrorMap }, { schema }, e);
        }
        throw e;
      }
    }

    try {
      //HDS 3
      await SysProfile.setProfile(awid, { code: "Authorities", roleUri: dtoIn.uuAppProfileAuthorities });
    } catch (e) {
      //A4
      if (e instanceof ObjectStoreError) {
        throw new Errors.Init.SysSetProfileFailed({uuAppErrorMap}, { role: dtoIn.uuAppProfileAuthorities}, e);
      }
      throw e;
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;

    //HDS 4
    return dtoOut;
  }
}

module.exports = new AppModel();

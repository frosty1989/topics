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
    //HDS 1
    let validationResult = this.validator.validate("initDtoInType", dtoIn);
    //A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.initUnsupportedKeys.code,
      Errors.Init.InvalidDtoIn
    );

    //HDS 2
    const schemas = ["joke", "jokeRating", "category", "jokeCategory"];
    let schemaCreateResults = schemas.map(async schema => {
      try {
        //HDS 2.1
        return await DaoFactory.getDao(schema).createSchema();
      } catch (e) {
        //A3
        if (e instanceof ObjectStoreError) {
          throw new Errors.Init.SchemaDaoCreateSchemaFailed({ uuAppErrorMap }, { schema }, e);
        }
        throw e;
      }
    });

    await Promise.all(schemaCreateResults);

    try {
      //HDS 3
      await SysProfile.setProfile(awid, { code: "Authorities", roleUri: dtoIn.uuAppProfileAuthorities });
    } catch (e) {
      //A4
      if (e instanceof ObjectStoreError) {
        throw new Errors.Init.SysSetProfileFailed({ uuAppErrorMap }, { role: dtoIn.uuAppProfileAuthorities }, e);
      }
      throw e;
    }

    //HDS 4
    return {
      uuAppErrorMap: uuAppErrorMap
    };
  }
}

module.exports = new AppModel();

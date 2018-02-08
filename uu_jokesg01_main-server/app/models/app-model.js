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
    let dtoOut = {};
    function schemaDaoCreateErr(schema, e) {
      //A3
      if (e instanceof ObjectStoreError) {
        throw new Errors.Init.SchemaDaoCreateSchemaFailed({ uuAppErrorMap }, { schema }, e);
      }
      throw e;
    }
    function sysSetProfileErr(e) {
      //A4
      if (e instanceof ObjectStoreError) {
        throw new Errors.Init.SysSetProfileFailed({ uuAppErrorMap }, { role: dtoIn.uuAppProfileAuthorities }, e);
      }
      throw e;
    }

    //HDS 2
    let makeInitPromises = ["joke", "jokeRating", "category", "jokeCategory"].map(schema => {
      return DaoFactory.getDao(schema).createSchema().then(undefined, e => schemaDaoCreateErr(schema, e));
    });

    //HDS 3
    const setProfileDtoIn = { code: "Authorities", roleUri: dtoIn.uuAppProfileAuthorities };
    makeInitPromises.push(SysProfile.setProfile(awid, setProfileDtoIn).then(undefined, e => sysSetProfileErr(e)))

    await Promise.all(makeInitPromises);

    //HDS 4
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new AppModel();

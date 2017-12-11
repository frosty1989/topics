"use strict";
const {Validator} = require("uu_appg01_server").Validation;
const {DaoFactory} = require("uu_appg01_server").ObjectStore;
const {ValidationHelper} = require("uu_appg01_server").Workspace;

const Path = require("path");
const JokeError = require("../errors/joke-error.js");

class JokeModel {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "validation_types", "joke-types.js"));
    this.dao = DaoFactory.getDao("joke");
    this.dao.createSchema();
  }

  async createJoke(awid, dtoIn) {
    let validationResult = this.validator.validate("createJokeDtoInType", dtoIn);
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(dtoIn, validationResult, uuAppErrorMap, "uu-demoappg01-main/createJoke/unsupportedKey", JokeError.CreateJokeInvalidDtoInError);

    dtoIn.awid = awid;
    let dtoOut;
    try {
      dtoOut = await this.dao.create(dtoIn);
    } catch (e) {
      throw new JokeError.CreateJokeFailedError({uuAppErrorMap}, null, e);
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async update(awid, dtoIn) {
    let validationResult = this.validator.validate("updateJokeDtoInType", dtoIn);
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(dtoIn, validationResult, uuAppErrorMap, "uu-demoappg01-main/updateJoke/unsupportedKey", JokeError.UpdateJokeInvalidDtoInError);

    dtoIn.awid = awid;
    let dtoOut;
    try {
      dtoOut = await this.dao.update({id: dtoIn.id}, {awid: awid, id: dtoIn.id, name: dtoIn.name, text: dtoIn.text, });
    } catch (e) {
      throw new JokeError.UpdateJokeFailedError({uuAppErrorMap}, null, e);
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async delete(awid, dtoIn) {
    let validationResult = this.validator.validate("deleteJokeDtoInType", dtoIn);
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(dtoIn, validationResult, uuAppErrorMap, "uu-demoappg01-main/deleteJoke/unsupportedKey", JokeError.DeleteJokeInvalidDtoInError);

    let dtoOut;
    try {
      dtoOut = await this.dao.remove(awid, dtoIn.id);
    } catch (e) {
      throw new JokeError.DeleteJokeFailedError({uuAppErrorMap}, null, e);
    }

    dtoOut = dtoOut || {};
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new JokeModel();

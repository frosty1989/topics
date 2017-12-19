"use strict";
const {Validator} = require("uu_appg01_server").Validation;
const {DaoFactory} = require("uu_appg01_server").ObjectStore;
const {ValidationHelper} = require("uu_appg01_server").Workspace;

const {Errors, CreateJokeCode} = require("../errors/joke-error");
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

    ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      `uu-jokesg01-main/${CreateJokeCode}/unsupportedKey`,
      Errors.createJoke.CreateJokeInvalidDtoInError
    );

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

    ValidationHelper.processValidationResult(dtoIn, validationResult, uuAppErrorMap, "uu-jokesg01-main/updateJoke/unsupportedKey", JokeError.UpdateJokeInvalidDtoInError);

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

  async remove(awid, dtoIn) {
    let validationResult = this.validator.validate("deleteJokeDtoInType", dtoIn);
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(dtoIn, validationResult, uuAppErrorMap, "uu-jokesg01-main/deleteJoke/unsupportedKey", JokeError.DeleteJokeInvalidDtoInError);

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

  async getJoke(awid, dtoIn) {
    let validationResult = this.validator.validate("getJokeDtoInType", dtoIn);
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(dtoIn, validationResult, uuAppErrorMap, "uu-jokesg01-main/getJoke/unsupportedKey", JokeError.GetJokeInvalidDtoInError);

    let dtoOut;
    try {
      dtoOut = await this.dao.get(awid, dtoIn.id);
    } catch (e) {
      throw new JokeError.GetJokeFailedError({uuAppErrorMap}, null, e);
    }

    dtoOut = dtoOut || {};
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async listJokes(awid, dtoIn) {
    let validationResult = this.validator.validate("listJokesDtoInType", dtoIn);
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(dtoIn, validationResult, uuAppErrorMap, "uu-jokesg01-main/listJokes/unsupportedKey", JokeError.ListJokesInvalidDtoInError);

    dtoIn.pageInfo = dtoIn.pageInfo || {
      pageIndex: 0,
      pageSize: 100
    };
    dtoIn.pageInfo.pageSize = dtoIn.pageInfo.pageSize || 100;
    let sort = (dtoIn.sortBy === "name"
      ? "name"
      : "rating");
    let order = (dtoIn.order === "desc"
      ? -1
      : 1);

    let dtoOut;
    try {
      dtoOut = await this.dao.list(awid, dtoIn.pageInfo, {[sort]: order});
    } catch (e) {
      throw new JokeError.ListJokesFailedError({uuAppErrorMap}, null, e);
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async listCategoryJokes(awid, dtoIn) {
    let validationResult = this.validator.validate("listCategoryJokesDtoInType", dtoIn);
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(dtoIn, validationResult, uuAppErrorMap, "uu-jokesg01-main/listCategoryJokes/unsupportedKey", JokeError.ListCategoryJokesInvalidDtoInError);

    let dtoOut;
    try {
      dtoOut = await this.dao.listCategoryJokes(awid, dtoIn.id);
    } catch (e) {
      throw new JokeError.ListCategoryJokesFailedError({uuAppErrorMap}, null, e);
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new JokeModel();

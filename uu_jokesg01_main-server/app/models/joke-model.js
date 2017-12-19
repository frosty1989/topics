"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").Workspace;

const { Errors } = require("../errors/joke-error");
const Path = require("path");

class JokeModel {
  constructor() {
    this.validator = new Validator(
      Path.join(__dirname, "..", "validation_types", "joke-types.js")
    );
    this.dao = DaoFactory.getDao("joke");
    this.dao.createSchema();
  }

  async createJoke(awid, dtoIn) {
    let validationResult = this.validator.validate(
      "createJokeDtoInType",
      dtoIn
    );
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      `uu-jokesg01-main/${Errors.createJoke.Code}/unsupportedKey`,
      Errors.createJoke.InvalidDtoIn
    );

    dtoIn.awid = awid;
    let dtoOut;
    try {
      dtoOut = await this.dao.create(dtoIn);
    } catch (e) {
      throw new Errors.createJoke.FailedError({ uuAppErrorMap }, null, e);
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async update(awid, dtoIn) {
    let validationResult = this.validator.validate(
      "updateJokeDtoInType",
      dtoIn
    );
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      `uu-jokesg01-main/${Errors.updateJoke.Code}/unsupportedKey`,
      Errors.updateJoke.InvalidDtoInError
    );

    dtoIn.awid = awid;
    let dtoOut;
    try {
      dtoOut = await this.dao.update(
        { id: dtoIn.id },
        { awid: awid, id: dtoIn.id, name: dtoIn.name, text: dtoIn.text }
      );
    } catch (e) {
      throw new Errors.updateJoke.FailedError({ uuAppErrorMap }, null, e);
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async remove(awid, dtoIn) {
    let validationResult = this.validator.validate(
      "deleteJokeDtoInType",
      dtoIn
    );
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      `uu-jokesg01-main/${Errors.deleteJoke.Code}/unsupportedKey`,
      Errors.deleteJoke.InvalidDtoInError
    );

    let dtoOut;
    try {
      dtoOut = await this.dao.remove(awid, dtoIn.id);
    } catch (e) {
      throw new Errors.deleteJoke.FailedError({ uuAppErrorMap }, null, e);
    }

    dtoOut = dtoOut || {};
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async getJoke(awid, dtoIn) {
    let validationResult = this.validator.validate("getJokeDtoInType", dtoIn);
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      `uu-jokesg01-main/${Errors.getJoke.Code}/unsupportedKey`,
      Errors.getJoke.InvalidDtoIn
    );

    let dtoOut;
    try {
      dtoOut = await this.dao.get(awid, dtoIn.id);
    } catch (e) {
      throw new Errors.getJoke.FailedError({ uuAppErrorMap }, null, e);
    }

    dtoOut = dtoOut || {};
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async listJokes(awid, dtoIn) {
    let validationResult = this.validator.validate("listJokesDtoInType", dtoIn);
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      `uu-jokesg01-main/${Errors.listJokes.Code}/unsupportedKey`,
      Errors.listJokes.InvalidDtoInError
    );

    dtoIn.pageInfo = dtoIn.pageInfo || {
      pageIndex: 0,
      pageSize: 100
    };
    dtoIn.pageInfo.pageSize = dtoIn.pageInfo.pageSize || 100;
    let sort = dtoIn.sortBy === "name" ? "name" : "rating";
    let order = dtoIn.order === "desc" ? -1 : 1;

    let dtoOut;
    try {
      dtoOut = await this.dao.list(awid, dtoIn.pageInfo, { [sort]: order });
    } catch (e) {
      throw new Errors.listJokes.FailedError({ uuAppErrorMap }, null, e);
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async listCategoryJokes(awid, dtoIn) {
    let validationResult = this.validator.validate(
      "listCategoryJokesDtoInType",
      dtoIn
    );
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      `uu-jokesg01-main/${Errors.listCategoryJokes.Code}/unsupportedKey`,
      Errors.listCategoryJokes.InvalidDtoInError
    );

    let dtoOut;
    try {
      dtoOut = await this.dao.listCategoryJokes(awid, dtoIn.id);
    } catch (e) {
      throw new Errors.listCategoryJokes.FailedError(
        { uuAppErrorMap },
        null,
        e
      );
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new JokeModel();

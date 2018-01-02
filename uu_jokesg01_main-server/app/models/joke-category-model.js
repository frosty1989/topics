"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").Workspace;

const Path = require("path");
const JokeModel = require("./joke-model");
const { Errors } = require("../errors/joke-category-error");

class JokeCategoryModel {
  constructor() {
    this.validator = new Validator(
      Path.join(__dirname, "..", "validation_types", "joke-category-types.js")
    );
    this.dao = DaoFactory.getDao("jokeCategory");
    this.dao.createSchema();
  }

  async addJokeCategory(awid, dtoIn) {
    let validationResult = this.validator.validate(
      "addJokeCategoryDtoInType",
      dtoIn
    );
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      `uu-jokesg01-main/${Errors.addJokeCategory.code}/unsupportedKey`,
      Errors.addJokeCategory.invalidDtoInError
    );

    // A4
    // let foundJoke;
    let res;
    try {
      res = await JokeModel.dao.get(awid, dtoIn.jokeId);
    } catch (e){
      throw new Errors.getJoke.jokeDaoGetFailed(
        {
          uuAppErrorMap
        },
        null,
        e
      );
    }

    if (Object.keys(res).length === 0) {
      throw new Errors.getJoke.jokeDoesNotExist({ uuAppErrorMap }, null, e);
    }
    console.log(res);
    console.log("foo");

    dtoIn.awid = awid;
    let dtoOut;
    try {
      dtoOut = await this.dao.create(dtoIn);
    } catch (e) {
      throw new Errors.addJokeCategory.jokeCategoryDaoCreateFailed(
        { uuAppErrorMap },
        null,
        e
      );
    }
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async removeJokeCategory(awid, dtoIn) {
    let validationResult = this.validator.validate(
      "removeJokeCategoryDtoInType",
      dtoIn
    );
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      `uu-jokesg01-main/${Errors.removeJokeCategory.code}/unsupportedKey`,
      Errors.removeJokeCategory.invalidDtoInError
    );

    dtoIn.id = dtoIn.jokeId;
    let dtoOut = {};
    try {
      await this.dao.deleteByJokeAndCategory(
        awid,
        dtoIn.jokeId,
        dtoIn.categoryList
      );
    } catch (e) {
      throw new Errors.removeJokeCategory.jokeCategoryDaoDeleteByJokeAndCategoryFailed(
        { uuAppErrorMap },
        null,
        e
      );
    }
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async listByCategory(awid, dtoIn) {
    let validationResult = this.validator.validate(
      "removeJokeCategoryDtoInType",
      dtoIn
    );
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      `uu-jokesg01-main/${Errors.removeJokeCategory.code}/unsupportedKey`,
      Errors.removeJokeCategory.invalidDtoInError
    );

    dtoIn.id = dtoIn.jokeId;
    let dtoOut = {};
    try {
      await this.dao.listByCategory(awid, dtoIn.categoryId);
    } catch (e) {
      throw new Errors.removeJokeCategory.categoryDaoGetFailed(
        { uuAppErrorMap },
        null,
        e
      );
    }
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new JokeCategoryModel();

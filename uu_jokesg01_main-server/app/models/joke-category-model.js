"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").Workspace;

const Path = require("path");
const JokeModel = require("./joke-model");
const CategoryModel = require("./category-model");
const { Errors } = require("../errors/joke-category-error");
const WARNINGS = {
  addJokeCategory: {
    categoryDoesNotExist: {
      code: `uu-jokesg01-main/${
        Errors.addJokeCategory.code
      }/categoryDoesNotExist`,
      message: "Category does not exist."
    },
    jokeCategoryAlreadyExists: {
      code: `uu-jokesg01-main/${
        Errors.addJokeCategory.code
      }/jokeCategoryAlreadyExists`,
      message: "uuObject jokeCategory already exists."
    }
  }
};

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
    let dtoOut;
    let foundJoke;
    dtoIn.awid = awid;
    try {
      foundJoke = await JokeModel.dao.get(awid, dtoIn.jokeId);
    } catch (e) {
      throw new Errors.addJokeCategory.jokeDaoGetFailed(
        {
          uuAppErrorMap
        },
        null,
        {
          cause: e
        }
      );
    }

    if (Object.keys(foundJoke).length === 0) {
      throw new Errors.addJokeCategory.jokeDoesNotExist(
        { uuAppErrorMap },
        null,
        {
          jokeId: dtoIn.jokeId
        }
      );
    }

    // A6, A8 - categoryDoesNotExist, jokeCategoryAlreadyExists, Warnings
    let foundCategory;
    let categoryIdList = dtoIn.categoryList;
    categoryIdList.forEach(async (elem, i) => {
      foundCategory = await CategoryModel.dao.get(awid, elem);
      if (Object.keys(foundCategory).length === 0) {
        ValidationHelper.addWarning(
          uuAppErrorMap,
          WARNINGS.addJokeCategory.categoryDoesNotExist.code,
          WARNINGS.addJokeCategory.categoryDoesNotExist.message,
          {
            categoryId: dtoIn.categoryList.elem
          }
        );
      } else if (foundCategory.id.toString() === categoryIdList[i]) {
        ValidationHelper.addWarning(
          uuAppErrorMap,
          WARNINGS.addJokeCategory.jokeCategoryAlreadyExists.code,
          WARNINGS.addJokeCategory.jokeCategoryAlreadyExists.message,
          {
            categoryId: dtoIn.categoryList.elem
          }
        );
      }
    });
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

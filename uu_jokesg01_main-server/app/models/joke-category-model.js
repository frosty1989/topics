"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").Workspace;
const Path = require("path");
const JokeModel = require("./joke-model");
const CategoryModel = require("./category-model");
const Errors = require("../errors/joke-category-error");

const WARNINGS = {
  addJokeCategoryUnsupportedKeys: {
    code: `${Errors.AddJokeCategory.UC_CODE}unsupportedKeys`
  },
  removeJokeCategoryUnsupportedKeys: {
    code: `${Errors.RemoveJokeCategory.UC_CODE}unsupportedKeys`
  },
  categoryDoesNotExist: {
    code: `${Errors.AddJokeCategory.UC_CODE}/categoryDoesNotExist`,
    message: "Category does not exist."
  },
  jokeCategoryAlreadyExists: {
    code: `${Errors.AddJokeCategory.UC_CODE}/jokeCategoryAlreadyExists`,
    message: "uuObject jokeCategory already exists."
  }
};

class JokeCategoryModel {
  constructor() {
    this.validator = new Validator(
      Path.join(__dirname, "..", "validation_types", "joke-category-types.js")
    );
    this.dao = DaoFactory.getDao("jokeCategory");
  }

  async addJokeCategory(awid, dtoIn) {
    let validationResult = this.validator.validate(
      "addJokeCategoryDtoInType",
      dtoIn
    );
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.addJokeCategoryUnsupportedKeys.code,
      Errors.AddJokeCategory.InvalidDtoInError
    );
    let dtoOut = {
      categoryList: []
    };
    let foundJoke;

    try {
      foundJoke = await JokeModel.dao.get(awid, dtoIn.jokeId);
    } catch (e) {
      throw new Errors.AddJokeCategory.JokeDaoGetFailed({ uuAppErrorMap }, e);
    }

    if (Object.keys(foundJoke).length === 0) {
      throw new Errors.AddJokeCategory.JokeDoesNotExist(
        { uuAppErrorMap },
        {
          jokeId: dtoIn.jokeId
        }
      );
    }

    for (let index = 0; index < dtoIn.categoryList.length; index++) {
      const dtoInCategoryId = dtoIn.categoryList[index];
      let foundCategory;

      try {
        foundCategory = await CategoryModel.dao.get(awid, dtoInCategoryId);
      } catch (err) {
        throw new Errors.AddJokeCategory.CategoryDaoGetFailed(
          { uuAppErrorMap },
          err
        );
      }

      if (Object.keys(foundCategory).length === 0) {
        ValidationHelper.addWarning(
          uuAppErrorMap,
          WARNINGS.categoryDoesNotExist.code,
          WARNINGS.categoryDoesNotExist.message,
          {
            categoryId: dtoInCategoryId
          }
        );
      } else {
        try {
          await this.dao.create({
            awid: awid,
            jokeId: dtoIn.jokeId,
            categoryId: dtoInCategoryId
          });
          dtoOut.categoryList.push(dtoInCategoryId);
        } catch (e) {
          if (e.code === "uu-app-objectstore/duplicateKey") {
            ValidationHelper.addWarning(
              uuAppErrorMap,
              WARNINGS.jokeCategoryAlreadyExists.code,
              WARNINGS.jokeCategoryAlreadyExists.message,
              {
                jokeId: dtoIn.jokeId,
                categoryId: foundCategory.data.id
              }
            );
          } else {
            throw new Errors.AddJokeCategory.JokeCategoryDaoCreateFailed(
              { uuAppErrorMap },
              e
            );
          }
        }
      }
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async removeJokeCategory(awid, dtoIn) {
    let validationResult = this.validator.validate(
      "removeJokeCategoryDtoInType",
      dtoIn
    );
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.removeJokeCategoryUnsupportedKeys,
      Errors.RemoveJokeCategory.InvalidDtoInError
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
      throw new Errors.RemoveJokeCategory.JokeCategoryDaoDeleteByJokeAndCategoryFailed(
        { uuAppErrorMap },
        e
      );
    }
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new JokeCategoryModel();

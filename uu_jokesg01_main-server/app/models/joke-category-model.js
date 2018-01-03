"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").Workspace;
const Path = require("path");
const JokeModel = require("./joke-model");
const CategoryModel = require("./category-model");
const {
  prefix,
  addJokeCategory,
  removeJokeCategory
} = require("../errors/errors");
const WARNINGS = {
  addJokeCategory: {
    categoryDoesNotExist: {
      code: `${prefix}/${addJokeCategory.code}/categoryDoesNotExist`,
      message: "Category does not exist."
    },
    jokeCategoryAlreadyExists: {
      code: `${prefix}/${addJokeCategory.code}/jokeCategoryAlreadyExists`,
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
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      {},
      `${prefix}/${addJokeCategory.code}/unsupportedKey`,
      addJokeCategory.invalidDtoInError
    );
    let dtoOut = {
      categoryList: []
    };
    let foundJoke;

    try {
      foundJoke = await JokeModel.dao.get(awid, dtoIn.jokeId);
    } catch (e) {
      throw new addJokeCategory.jokeDaoGetFailed({ uuAppErrorMap }, null, {
        cause: e
      });
    }

    if (Object.keys(foundJoke).length === 0) {
      throw new addJokeCategory.jokeDoesNotExist({ uuAppErrorMap }, null, {
        jokeId: dtoIn.jokeId
      });
    }

    for (let index = 0; index < dtoIn.categoryList.length; index++) {
      const dtoInCategoryId = dtoIn.categoryList[index];
      let foundCategory;

      try {
        foundCategory = await CategoryModel.dao.get(awid, dtoInCategoryId);
      } catch (err) {
        throw new addJokeCategory.categoryDaoGetFailed(
          { uuAppErrorMap },
          null,
          {
            cause: err
          }
        );
      }

      if (Object.keys(foundCategory).length === 0) {
        ValidationHelper.addWarning(
          uuAppErrorMap,
          WARNINGS.addJokeCategory.categoryDoesNotExist.code,
          WARNINGS.addJokeCategory.categoryDoesNotExist.message,
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
              WARNINGS.addJokeCategory.jokeCategoryAlreadyExists.code,
              WARNINGS.addJokeCategory.jokeCategoryAlreadyExists.message,
              {
                jokeId: dtoIn.jokeId,
                categoryId: foundCategory.data.id
              }
            );
          } else {
            throw new addJokeCategory.jokeCategoryDaoCreateFailed(
              { uuAppErrorMap },
              null,
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
      {},
      `${prefix}/${removeJokeCategory.code}/unsupportedKey`,
      removeJokeCategory.invalidDtoInError
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
      throw new removeJokeCategory.jokeCategoryDaoDeleteByJokeAndCategoryFailed(
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

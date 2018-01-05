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
  },
  listCategoryJokesUnsupportedKeys: {
    code: `${Errors.ListCategoryJokes.UC_CODE}/unsupportedKeys`
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
      Errors.AddJokeCategory.InvalidDtoIn
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
      Errors.RemoveJokeCategory.InvalidDtoIn
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

  async listByCategory(awid, dtoIn) {
    //HDS 1
    let validationResult = this.validator.validate("listCategoryJokesDtoInType", dtoIn);
    //A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.listCategoryJokesUnsupportedKeys.code,
      Errors.ListCategoryJokes.InvalidDtoIn
    );
    let jokeIds = [];
    let dtoOut;

    try {
      //HDS 2
      jokeIds = await this.dao.listByCategory(awid, dtoIn.categoryId).itemList.map(x => x.jokeId);
    } catch (e) {
      //A3
      throw new Errors.ListCategoryJokes.JokeCategoryDaoListByCategoryFailed({ uuAppErrorMap }, e);
    }

    try {
      //HDS 3
      dtoOut = JokeModel.dao.listByIds(awid, jokeIds);
    } catch (e) {
      throw new Errors.ListCategoryJokes.JokeDaoListByIdsFailed({ uuAppErrorMap }, e);
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;

    //HDS 4
    return dtoOut;
  }
}

module.exports = new JokeCategoryModel();

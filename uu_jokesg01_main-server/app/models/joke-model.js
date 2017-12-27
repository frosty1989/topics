"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").Workspace;

const { Errors } = require("../errors/joke-error");
const CategoryModel = require("./category-model");
const JokeCategoryModel = require("./joke-category-model");
const Path = require("path");
const WARNINGS = {
  categoryDaoGetFailed: {
    code: `${Errors.createJoke.code}/categoryDaoGetFailed`,
    message: "Get category by category Dao get failed,"
  },
  categoryDoesNotExist: {
    code: `${Errors.createJoke.code}/categoryDoesNotExist`,
    message: "Category with given categoryId does not exist."
  }
};

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
    let dtoOut;
    let validJokeCategories = [];

    ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      `uu-jokesg01-main/${Errors.createJoke.code}/unsupportedKey`,
      Errors.createJoke.invalidDtoIn
    );

    dtoIn.awid = awid;

    if (dtoIn.categoryList && dtoIn.categoryList.length > 0) {
      dtoIn.categoryList.forEach(async categoryId => {
        try {
          let foundCategory = await CategoryModel.dao.get(awid, categoryId);

          if (!foundCategory || !foundCategory.hasOwnProperty("id")) {
            ValidationHelper.addWarning(
              uuAppErrorMap,
              WARNINGS.categoryDoesNotExist.code,
              WARNINGS.categoryDoesNotExist.message,
              {
                categoryId: categoryId
              }
            );
          } else {
            validJokeCategories.push(categoryId);
          }
        } catch (err) {
          ValidationHelper.addWarning(
            uuAppErrorMap,
            WARNINGS.categoryDaoGetFailed.code,
            WARNINGS.categoryDaoGetFailed.message,
            {
              cause: err
            }
          );
        }
      });
    }

    try {
      dtoIn.categoryList = validJokeCategories;
      dtoOut = await this.dao.create(dtoIn);
    } catch (e) {
      throw new Errors.createJoke.jokeDaoCreateFailed(
        { uuAppErrorMap },
        null,
        e
      );
    }

    try {
      JokeCategoryModel.dao.create({
        awid: awid,
        jokeId: dtoOut.id,
        categoryList: validJokeCategories
      });
    } catch (err) {
      throw new Errors.createJoke.jokeCategoryDaoCreateFailed(
        { uuAppErrorMap },
        null,
        err
      );
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
      `uu-jokesg01-main/${Errors.updateJoke.code}/unsupportedKey`,
      Errors.updateJoke.invalidDtoInError
    );

    dtoIn.awid = awid;
    let dtoOut;
    try {
      dtoOut = await this.dao.update(
        { id: dtoIn.id },
        { awid: awid, id: dtoIn.id, name: dtoIn.name, text: dtoIn.text }
      );
    } catch (e) {
      throw new Errors.updateJoke.jokeDaoUpdateFailed(
        { uuAppErrorMap },
        null,
        e
      );
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
      `uu-jokesg01-main/${Errors.deleteJoke.code}/unsupportedKey`,
      Errors.deleteJoke.invalidDtoInError
    );

    let dtoOut;
    try {
      dtoOut = await this.dao.remove(awid, dtoIn.id);
    } catch (e) {
      throw new Errors.deleteJoke.jokeDaoDeleteFailed(
        { uuAppErrorMap },
        null,
        e
      );
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
      `uu-jokesg01-main/${Errors.getJoke.code}/unsupportedKey`,
      Errors.getJoke.invalidDtoIn
    );

    let dtoOut;
    try {
      dtoOut = await this.dao.get(awid, dtoIn.id);
    } catch (e) {
      throw new Errors.getJoke.jokeDaoGetFailed({ uuAppErrorMap }, null, e);
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
      `uu-jokesg01-main/${Errors.listJokes.code}/unsupportedKey`,
      Errors.listJokes.invalidDtoInError
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
      throw new Errors.listJokes.jokeDaoListFailed({ uuAppErrorMap }, null, e);
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
      `uu-jokesg01-main/${Errors.listCategoryJokes.code}/unsupportedKey`,
      Errors.listCategoryJokes.invalidDtoInError
    );

    let dtoOut;
    try {
      dtoOut = await this.dao.listCategoryJokes(awid, dtoIn.id);
    } catch (e) {
      throw new Errors.listCategoryJokes.jokeCategoryDaoListByCategoryFailed(
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

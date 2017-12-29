"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").Workspace;

const Path = require("path");
const { Errors } = require("../errors/category-error");
const JokeCategoryModel = require("./joke-category-model");

class CategoryModel {
  constructor() {
    this.validator = new Validator(
      Path.join(__dirname, "..", "validation_types", "category-types.js")
    );
    this.dao = DaoFactory.getDao("category");
    this.dao.createSchema();
  }

  async createCategory(awid, dtoIn) {
    let validationResult = this.validator.validate(
      "createCategoryDtoInType",
      dtoIn
    );
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      `uu-jokesg01-main/${Errors.createCategory.code}/unsupportedKey`,
      Errors.createCategory.invalidDtoInError
    );

    dtoIn.awid = awid;
    let dtoOut;
    try {
      dtoOut = await this.dao.create(dtoIn);
    } catch (e) {
      console.log(e);
      if (e.code === "uu-app-objectstore/duplicateKey") {
        throw new Errors.createCategory.categoryNameNotUnique(
          { uuAppErrorMap },
          null,
          e
        );
      }
      throw new Errors.createCategory.categoryDaoCreateFailed(
        { uuAppErrorMap },
        null,
        e
      );
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async updateCategory(awid, dtoIn) {
    let validationResult = this.validator.validate(
      "updateCategoryDtoInType",
      dtoIn
    );
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      `uu-jokesg01-main/${Errors.updateCategory.code}/unsupportedKey`,
      Errors.updateCategory.invalidDtoInError
    );

    dtoIn.awid = awid;
    let dtoOut = {};

    try {
      dtoOut = await this.dao.getByName(
        awid,
        dtoIn.name
      );
    } catch (error) {
      throw new Errors.listCategories.categoryDaoListFailed(
        { uuAppErrorMap },
        null,
        error
      );
    }

    if (dtoIn.name === dtoOut.name) {
      console.log(dtoIn.name);
      throw new Errors.updateCategory.categoryNameNotUnique(
        { uuAppErrorMap },
        null,
        {
          name: dtoIn.name
        }
      );
    } else {
      try {
        dtoOut = await this.dao.update(
          { id: dtoIn.id },
          {
            awid: awid,
            id: dtoIn.id,
            name: dtoIn.name,
            desc: dtoIn.desc,
            glyphicon: dtoIn.glyphicon
          }
        );
      } catch (e) {
        throw new Errors.updateCategory.categoryDaoUpdateFailed(
          { uuAppErrorMap },
          null,
          e
        );
      }
    }
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async deleteCategory(awid, dtoIn) {
    let validationResult = this.validator.validate(
      "deleteCategoryDtoInType",
      dtoIn
    );
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      `uu-jokesg01-main/${Errors.deleteCategory.code}/unsupportedKey`,
      Errors.deleteCategory.invalidDtoInError
    );

    let dtoOut = {};
    let foundJokeCategories;

    if (dtoIn.forceDelete === true) {
      try {
        await JokeCategoryModel.dao.deleteByCategory(awid, dtoIn.id);
        dtoOut = await this.dao.remove(awid, dtoIn.id);
      } catch (e) {
        throw new Errors.deleteCategory.categoryDaoDeleteFailed(
          { uuAppErrorMap },
          null,
          e
        );
      }
    } else {
      try {
        foundJokeCategories = await JokeCategoryModel.dao.listByCategory(
          awid,
          dtoIn.id
        );
      } catch (error) {
        throw new Errors.deleteCategory.jokeCategoryDaoListByCategoryFailed(
          { uuAppErrorMap },
          null,
          { cause: error }
        );
      }

      if (foundJokeCategories.itemList.length < 1) {
        throw new Errors.deleteCategory.relatedJokesExist(
          { uuAppErrorMap },
          null,
          {
            relatedJokes: foundJokeCategories.itemList
          }
        );
      }
    }
    dtoOut = dtoOut || {};
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async listCategories(awid, dtoIn) {
    let validationResult = this.validator.validate(
      "listCategoriesDtoInType",
      dtoIn
    );
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      `uu-jokesg01-main/${Errors.listCategories.code}/unsupportedKey`,
      Errors.listCategories.invalidDtoInError
    );

    dtoIn.pageInfo = dtoIn.pageInfo || {
      pageIndex: 0,
      pageSize: 100
    };
    dtoIn.pageInfo.pageSize = dtoIn.pageInfo.pageSize || 100;

    let dtoOut;
    try {
      dtoOut = await this.dao.list(awid, dtoIn.pageInfo);
    } catch (e) {
      throw new Errors.listCategories.categoryDaoListFailed(
        { uuAppErrorMap },
        null,
        e
      );
    }

    dtoOut = dtoOut || {};
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new CategoryModel();

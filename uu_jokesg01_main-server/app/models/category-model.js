"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").Workspace;

const Path = require("path");
const Errors = require("../errors/category-error");
const WARNINGS = {
  createCategory: {
    code: `${Errors.CreateCategory.UC_CODE}unsupportedKeys`
  },
  updateCategory: {
    code: `${Errors.UpdateCategory.UC_CODE}unsupportedKeys`
  },
  deleteCategory: {
    code: `${Errors.DeleteCategory.UC_CODE}unsupportedKeys`
  },
  listCategories: {
    code: `${Errors.ListCategories.UC_CODE}unsupportedKeys`
  }
};

class CategoryModel {
  constructor() {
    this.validator = new Validator(
      Path.join(__dirname, "..", "validation_types", "category-types.js")
    );
    this.dao = DaoFactory.getDao("category");
  }

  async createCategory(awid, dtoIn) {
    let validationResult = this.validator.validate(
      "createCategoryDtoInType",
      dtoIn
    );
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      {},
      WARNINGS.createCategory.code,
      Errors.CreateCategory.InvalidDtoInError
    );

    dtoIn.awid = awid;
    let dtoOut;
    try {
      dtoOut = await this.dao.create(dtoIn);
    } catch (e) {
      if (e.code === "uu-app-objectstore/duplicateKey") {
        throw new Errors.CreateCategory.CategoryNameNotUnique(
          { uuAppErrorMap },
          { name: dtoIn.name },
          e
        );
      }
      throw new Errors.CreateCategory.CategoryDaoCreateFailed(
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
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      {},
      WARNINGS.updateCategory.code,
      Errors.UpdateCategory.InvalidDtoInError
    );
    let uuObject = Object.assign({}, dtoIn);
    let dtoOut = {};

    uuObject.awid = awid;

    try {
      dtoOut = await this.dao.update(uuObject);
    } catch (e) {
      if (e.code === "uu-app-objectstore/duplicateKey") {
        throw new Errors.UpdateCategory.CategoryNameNotUnique(
          { uuAppErrorMap },
          { name: dtoIn.name },
          e
        );
      }
      throw new Errors.UpdateCategory.CategoryDaoUpdateFailed(
        { uuAppErrorMap },
        null,
        e
      );
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async deleteCategory(awid, dtoIn) {
    let validationResult = this.validator.validate(
      "deleteCategoryDtoInType",
      dtoIn
    );
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      {},
      WARNINGS.deleteCategory.code,
      Errors.DeleteCategory.InvalidDtoInError
    );
    let dtoOut = {};
    let foundJokeCategories;
    const JokeCategoryModel = require("./joke-category-model");

    if (dtoIn.forceDelete) {
      try {
        await JokeCategoryModel.dao.deleteByCategory(awid, dtoIn.id);
      } catch (e) {
        throw new Errors.DeleteCategory.CategoryDaoDeleteFailed(
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
        throw new Errors.DeleteCategory.JokeCategoryDaoListByCategoryFailed(
          { uuAppErrorMap },
          null,
          error
        );
      }

      if (foundJokeCategories.itemList.length > 0) {
        throw new Errors.DeleteCategory.RelatedJokesExist(
          { uuAppErrorMap },
          null,
          {
            relatedJokes: foundJokeCategories.itemList
          }
        );
      }
    }

    await this.dao.remove(awid, dtoIn.id);

    dtoOut.uuAppErrorMap = uuAppErrorMap;

    return dtoOut;
  }

  async listCategories(awid, dtoIn) {
    let validationResult = this.validator.validate(
      "listCategoriesDtoInType",
      dtoIn
    );
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      {},
      WARNINGS.listCategories.code,
      Errors.ListCategories.InvalidDtoInError
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
      throw new Errors.ListCategories.CategoryDaoListFailed(
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

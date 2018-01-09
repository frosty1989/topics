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
      //HDS 2
      dtoOut = await this.dao.create(dtoIn);
    } catch (e) {
      // A3
      if (e.code === "uu-app-objectstore/duplicateKey") {
        throw new Errors.CreateCategory.CategoryNameNotUnique(
          { uuAppErrorMap },
          { name: dtoIn.name },
          e
        );
      }
      // A4
      throw new Errors.CreateCategory.CategoryDaoCreateFailed(
        { uuAppErrorMap },
        e
      );
    }
    // HDS 3
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async updateCategory(awid, dtoIn) {
    let validationResult = this.validator.validate(
      "updateCategoryDtoInType",
      dtoIn
    );
    //HDS 1.3 //A2
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
      //HDS 2
      dtoOut = await this.dao.update(uuObject);
    } catch (e) {
      // A3
      if (e.code === "uu-app-objectstore/duplicateKey") {
        throw new Errors.UpdateCategory.CategoryNameNotUnique(
          { uuAppErrorMap },
          { name: dtoIn.name },
          e
        );
      }
      // A4
      throw new Errors.UpdateCategory.CategoryDaoUpdateFailed(
        { uuAppErrorMap },
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
    // HDS 3
    if (dtoIn.forceDelete) {
      try {
        //HDS 3.1
        await JokeCategoryModel.dao.deleteByCategory(awid, dtoIn.id);
      } catch (e) {
        //A5
        throw new Errors.DeleteCategory.JokeCategoryDaoDeleteByCategoryFailed(
          { uuAppErrorMap },
          e
        );
      }
    } else {
      //HDS 2
      try {
        // HDS 2.1
        foundJokeCategories = await JokeCategoryModel.dao.listByCategory(
          awid,
          dtoIn.id
        );
      } catch (error) {
        //A3
        throw new Errors.DeleteCategory.JokeCategoryDaoListByCategoryFailed(
          { uuAppErrorMap },
          error
        );
      }
      // HDS 2.1
      if (foundJokeCategories.itemList.length > 0) {
        // A4
        throw new Errors.DeleteCategory.RelatedJokesExist(
          { uuAppErrorMap },
          {
            relatedJokes: foundJokeCategories.itemList
          }
        );
      }
    }

    try {
      //HDS 4
      await this.dao.remove(awid, dtoIn.id);
    } catch (e) {
      //A6
      throw new Errors.DeleteCategory.CategoryDaoDeleteFailed(
        { uuAppErrorMap },
        e
      );
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;

    return dtoOut;
  }

  async listCategories(awid, dtoIn) {
    let validationResult = this.validator.validate(
      "listCategoriesDtoInType",
      dtoIn
    );
    // HDS 1.3 // A2
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
      // HDS 2
      dtoOut = await this.dao.list(awid, dtoIn.pageInfo);
    } catch (e) {
      // A3
      throw new Errors.ListCategories.CategoryDaoListFailed(
        { uuAppErrorMap },
        e
      );
    }
    // HDS 3
    dtoOut = dtoOut || {};
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new CategoryModel();

"use strict";

const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;

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
    this.validator = new Validator(Path.join(__dirname, "..", "validation_types", "category-types.js"));
    this.dao = DaoFactory.getDao("category");
  }

  async createCategory(awid, dtoIn) {
    // HDS 1 // A1
    let validationResult = this.validator.validate("createCategoryDtoInType", dtoIn);
    // A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.createCategory.code,
      Errors.CreateCategory.InvalidDtoIn
    );
    let dtoOut;

    dtoIn.awid = awid;

    try {
      //HDS 2
      dtoOut = await this.dao.create(dtoIn);
    } catch (e) {
      // A3
      if (e.code === "uu-app-objectstore/duplicateKey") {
        throw new Errors.CreateCategory.CategoryNameNotUnique({ uuAppErrorMap }, { name: dtoIn.name }, e);
      }
      // A4
      if (e instanceof ObjectStoreError) {
        throw new Errors.CreateCategory.CategoryDaoCreateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // HDS 3
    dtoOut.uuAppErrorMap = uuAppErrorMap;

    return dtoOut;
  }

  async updateCategory(awid, dtoIn) {
    // HDS 1 // A1
    let validationResult = this.validator.validate("updateCategoryDtoInType", dtoIn);
    //HDS 1.3 //A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.updateCategory.code,
      Errors.UpdateCategory.InvalidDtoIn
    );
    let uuObject = Object.assign({ awid }, dtoIn);
    let dtoOut = {};

    try {
      //HDS 2
      dtoOut = await this.dao.update(uuObject);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        if (e.code === "uu-app-objectstore/duplicateKey") {
          // A3
          throw new Errors.UpdateCategory.CategoryNameNotUnique({ uuAppErrorMap }, { name: dtoIn.name }, e);
        } else {
          // A4
          throw new Errors.UpdateCategory.CategoryDaoUpdateFailed({ uuAppErrorMap }, e);
        }
      }
      throw e;
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;

    return dtoOut;
  }

  async deleteCategory(awid, dtoIn) {
    // HDS 1 // A1
    let validationResult = this.validator.validate("deleteCategoryDtoInType", dtoIn);
    // A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.deleteCategory.code,
      Errors.DeleteCategory.InvalidDtoIn
    );
    let dtoOut = {};
    const JokeCategoryModel = require("./joke-category-model");

    // HDS 3
    if (dtoIn.forceDelete) {
      try {
        //HDS 3.1
        await JokeCategoryModel.dao.deleteByCategory(awid, dtoIn.id);
      } catch (e) {
        //A5
        if (e instanceof ObjectStoreError) {
          throw new Errors.DeleteCategory.JokeCategoryDaoDeleteByCategoryFailed({ uuAppErrorMap }, e);
        }
        throw e;
      }
    } else {
      //HDS 2
      let foundJokeCategories;

      try {
        // HDS 2.1
        foundJokeCategories = await JokeCategoryModel.dao.listByCategory(awid, dtoIn.id);
      } catch (e) {
        //A3
        if (e instanceof ObjectStoreError) {
          throw new Errors.DeleteCategory.JokeCategoryDaoListByCategoryFailed({ uuAppErrorMap }, e);
        }
        throw e;
      }

      if (foundJokeCategories.itemList.length > 0) {
        // A4
        throw new Errors.DeleteCategory.RelatedJokesExist(
          { uuAppErrorMap },
          { relatedJokes: foundJokeCategories.itemList }
        );
      }
    }

    try {
      //HDS 4
      await this.dao.remove(awid, dtoIn.id);
    } catch (e) {
      //A6
      if (e instanceof ObjectStoreError) {
        throw new Errors.DeleteCategory.CategoryDaoDeleteFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;

    return dtoOut;
  }

  async listCategories(awid, dtoIn) {
    // HDS 1 // A1
    let validationResult = this.validator.validate("listCategoriesDtoInType", dtoIn);
    // HDS 1.3 // A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.listCategories.code,
      Errors.ListCategories.InvalidDtoIn
    );
    let dtoOut;

    dtoIn.pageInfo = dtoIn.pageInfo || { pageIndex: 0, pageSize: 100 };
    dtoIn.pageInfo.pageSize = dtoIn.pageInfo.pageSize || 100;

    try {
      // HDS 2
      dtoOut = await this.dao.list(awid, dtoIn.pageInfo, dtoIn.order);
    } catch (e) {
      // A3
      if (e instanceof ObjectStoreError) {
        throw new Errors.ListCategories.CategoryDaoListFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // HDS 3
    dtoOut = dtoOut || {};
    dtoOut.uuAppErrorMap = uuAppErrorMap;

    return dtoOut;
  }
}

module.exports = new CategoryModel();

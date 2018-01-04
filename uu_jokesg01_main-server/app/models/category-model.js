"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").Workspace;

const Path = require("path");
const {
  prefix,
  createCategory,
  listCategories,
  deleteCategory,
  updateCategory
} = require("../errors/category-error");

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
      `${prefix}/${createCategory.code}/unsupportedKey`,
      createCategory.invalidDtoInError
    );

    dtoIn.awid = awid;
    let dtoOut;
    try {
      dtoOut = await this.dao.create(dtoIn);
    } catch (e) {
      if (e.code === "uu-app-objectstore/duplicateKey") {
        throw new createCategory.categoryNameNotUnique(
          { uuAppErrorMap },
          { name: dtoIn.name },
          e
        );
      }
      throw new createCategory.categoryDaoCreateFailed(
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
      `${prefix}/${updateCategory.code}/unsupportedKey`,
      updateCategory.invalidDtoInError
    );
    let uuObject = Object.assign({}, dtoIn);
    let dtoOut = {};

    uuObject.awid = awid;

    try {
      dtoOut = await this.dao.getByName(awid, dtoIn.name);
    } catch (error) {
      throw new listCategories.categoryDaoListFailed(
        { uuAppErrorMap },
        null,
        error
      );
    }

    if (dtoIn.name === dtoOut.name) {
      throw new updateCategory.categoryNameNotUnique({ uuAppErrorMap }, null, {
        name: dtoIn.name
      });
    } else {
      try {
        dtoOut = await this.dao.update(uuObject);
      } catch (e) {
        throw new updateCategory.categoryDaoUpdateFailed(
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
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      {},
      `${prefix}/${deleteCategory.code}/unsupportedKey`,
      deleteCategory.invalidDtoInError
    );
    let dtoOut = {};
    let foundJokeCategories;
    const JokeCategoryModel = require("./joke-category-model");

    if (dtoIn.forceDelete) {
      try {
        await JokeCategoryModel.dao.deleteByCategory(awid, dtoIn.id);
      } catch (e) {
        throw new deleteCategory.categoryDaoDeleteFailed(
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
        throw new deleteCategory.jokeCategoryDaoListByCategoryFailed(
          { uuAppErrorMap },
          null,
          error
        );
      }

      if (foundJokeCategories.itemList.length > 0) {
        throw new deleteCategory.relatedJokesExist({ uuAppErrorMap }, null, {
          relatedJokes: foundJokeCategories.itemList
        });
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
      `${prefix}/${listCategories.code}/unsupportedKey`,
      listCategories.invalidDtoInError
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
      throw new listCategories.categoryDaoListFailed(
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

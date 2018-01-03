"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").Workspace;

const Path = require("path");
const {
  prefix,
  createCategoryError,
  listCategoriesError,
  deleteCategoryError,
  updateCategoryError
} = require("../errors/errors");

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
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      {},
      `${prefix}/${createCategoryError.code}/unsupportedKey`,
      createCategoryError.invalidDtoInError
    );

    dtoIn.awid = awid;
    let dtoOut;
    try {
      dtoOut = await this.dao.create(dtoIn);
    } catch (e) {
      if (e.code === "uu-app-objectstore/duplicateKey") {
        throw new createCategoryError.categoryNameNotUnique(
          { uuAppErrorMap },
          null,
          e
        );
      }
      throw new createCategoryError.categoryDaoCreateFailed(
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
      `${prefix}/${updateCategoryError.code}/unsupportedKey`,
      updateCategoryError.invalidDtoInError
    );

    dtoIn.awid = awid;
    let dtoOut = {};

    try {
      dtoOut = await this.dao.getByName(awid, dtoIn.name);
    } catch (error) {
      throw new listCategoriesError.categoryDaoListFailed(
        { uuAppErrorMap },
        null,
        error
      );
    }

    if (dtoIn.name === dtoOut.name) {
      console.log(dtoIn.name);
      throw new updateCategoryError.categoryNameNotUnique(
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
        throw new updateCategoryError.categoryDaoUpdateFailed(
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
      `${prefix}/${deleteCategoryError.code}/unsupportedKey`,
      deleteCategoryError.invalidDtoInError
    );
    let dtoOut = {};
    let foundJokeCategories;
    const JokeCategoryModel = require("./joke-category-model");

    if (dtoIn.forceDelete) {
      try {
        await JokeCategoryModel.dao.deleteByCategory(awid, dtoIn.id);
      } catch (e) {
        throw new deleteCategoryError.categoryDaoDeleteFailed(
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
        throw new deleteCategoryError.jokeCategoryDaoListByCategoryFailed(
          { uuAppErrorMap },
          null,
          { cause: error }
        );
      }

      if (foundJokeCategories.itemList.length > 0) {
        throw new deleteCategoryError.relatedJokesExist(
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
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      `${prefix}/${listCategoriesError.code}/unsupportedKey`,
      listCategoriesError.invalidDtoInError
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
      throw new listCategoriesError.categoryDaoListFailed(
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

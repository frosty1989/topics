"use strict";
const {Validator} = require("uu_appg01_server").Validation;
const {DaoFactory} = require("uu_appg01_server").ObjectStore;
const {ValidationHelper} = require("uu_appg01_server").Workspace;

const Path = require("path");
const { Errors } = require("../errors/category-error");

class CategoryModel {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "validation_types", "category-types.js"));
    this.dao = DaoFactory.getDao("category");
    this.daoJoke = DaoFactory.getDao("jokeCategory");
    this.dao.createSchema();
  }

  async createCategory(awid, dtoIn) {
    let validationResult = this.validator.validate("createCategoryDtoInType", dtoIn);
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      `uu-jokesg01-main/${Errors.createCategory.Code}/unsupportedKey`,
      Errors.createCategory.InvalidDtoInError
    );

    dtoIn.awid = awid;
    let dtoOut;
    try {
      dtoOut = await this.dao.create(dtoIn);
    } catch (e) {
      throw new Errors.createCategory.FailedError({uuAppErrorMap}, null, e);
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async updateCategory(awid, dtoIn) {
    let validationResult = this.validator.validate("updateCategoryDtoInType", dtoIn);
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      `uu-jokesg01-main/${Errors.updateCategory.Code}/unsupportedKey`,
      Errors.updateCategory.InvalidDtoInError
    );

    dtoIn.awid = awid;
    let dtoOut;
    try {
      dtoOut = await this.dao.update( {id: dtoIn.id}, {awid: awid, id: dtoIn.id, name: dtoIn.name, desc: dtoIn.desc, glyphicon: dtoIn.glyphicon });
    } catch (e) {
      throw new Errors.updateCategory.FailedError({uuAppErrorMap}, null, e);
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async deleteCategory(awid, dtoIn) {
    let validationResult = this.validator.validate("deleteCategoryDtoInType", dtoIn);
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      `uu-jokesg01-main/${Errors.deleteCategory.Code}/unsupportedKey`,
      Errors.deleteCategory.InvalidDtoInError
    );

    let dtoOut;
    if(dtoIn.forceDelete === true) {
      try {
        dtoOut = await this.dao.remove(awid, dtoIn.id);
      } catch (e) {
        throw new Errors.deleteCategory.FailedError({uuAppErrorMap}, null, e);
      }

      dtoOut = dtoOut || {};
      dtoOut.uuAppErrorMap = uuAppErrorMap;
      return dtoOut;
    } else {
      try {
        dtoOut = await this.daoJoke.listByCategory(awid, dtoIn.id);
      } catch (e) {
        throw new Errors.deleteCategory.FailedError({uuAppErrorMap}, null, e);
      }

      dtoOut = dtoOut || {};
      dtoOut.uuAppErrorMap = uuAppErrorMap;
      return dtoOut;
    }
  }

  async listCategories(awid, dtoIn) {
    let validationResult = this.validator.validate("listCategoriesDtoInType", dtoIn);
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      `uu-jokesg01-main/${Errors.listCategories.Code}/unsupportedKey`,
      Errors.listCategories.InvalidDtoInError
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
      throw new Errors.listCategories.FailedError({uuAppErrorMap}, null, e);
    }

    dtoOut = dtoOut || {};
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new CategoryModel();

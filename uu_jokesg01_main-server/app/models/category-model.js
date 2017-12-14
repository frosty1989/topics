"use strict";
const {Validator} = require("uu_appg01_server").Validation;
const {DaoFactory} = require("uu_appg01_server").ObjectStore;
const {ValidationHelper} = require("uu_appg01_server").Workspace;

const Path = require("path");
const CategoryError = require("../errors/category-error.js");

class CategoryModel {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "validation_types", "category-types.js"));
    this.dao = DaoFactory.getDao("category");
    this.dao.createSchema();
  }

  async createCategory(awid, dtoIn) {
    let validationResult = this.validator.validate("createCategoryDtoInType", dtoIn);
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(dtoIn, validationResult, uuAppErrorMap, "uu-demoappg01-main/createCategory/unsupportedKey", CategoryError.CreateCategoryInvalidDtoInError);

    dtoIn.awid = awid;
    let dtoOut;
    try {
      dtoOut = await this.dao.create(dtoIn);
    } catch (e) {
      throw new CategoryError.CreateCategoryFailedError({uuAppErrorMap}, null, e);
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async updateCategory(awid, dtoIn) {
    let validationResult = this.validator.validate("updateCategoryDtoInType", dtoIn);
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(dtoIn, validationResult, uuAppErrorMap, "uu-demoappg01-main/updateCategory/unsupportedKey", CategoryError.UpdateCategoryInvalidDtoInError);

    dtoIn.awid = awid;
    let dtoOut;
    try {
      dtoOut = await this.dao.update( {id: dtoIn.id}, {awid: awid, id: dtoIn.id, name: dtoIn.name, desc: dtoIn.desc, glyphicon: dtoIn.glyphicon });
    } catch (e) {
      throw new CategoryError.UpdateCategoryFailedError({uuAppErrorMap}, null, e);
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async deleteCategory(awid, dtoIn) {
    let validationResult = this.validator.validate("deleteCategoryDtoInType", dtoIn);
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(dtoIn, validationResult, uuAppErrorMap, "uu-demoappg01-main/deleteCategory/unsupportedKey", CategoryError.DeleteCategoryInvalidDtoInError);

    //TODO: do it after update to 0.9.3
    // let validationResult = this.validator.validate("deleteCategoryDtoInType", dtoIn);
    // let uuAppErrorMap = ValidationHelper.processValidationResult(
    //   dtoIn, validationResult, {}, "uu-demoappg01-main/deleteCategory/unsupportedKey",
    //   CategoryError.DeleteCategoryInvalidDtoInError);


    let dtoOut;
    try {
      dtoOut = await this.dao.remove(awid, dtoIn.id, dtoIn.forceDelete);
    } catch (e) {
      throw new CategoryError.DeleteCategoryFailedError({uuAppErrorMap}, null, e);
    }

    dtoOut = dtoOut || {};
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async listCategories(awid, dtoIn) {
    let validationResult = this.validator.validate("listCategoriesDtoInType", dtoIn);
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(dtoIn, validationResult, uuAppErrorMap, "uu-demoappg01-main/listCategories/unsupportedKey", CategoryError.ListCategoriesInvalidDtoInError);

    dtoIn.pageInfo = dtoIn.pageInfo || {
      pageIndex: 0,
      pageSize: 100
    };
    dtoIn.pageInfo.pageSize = dtoIn.pageInfo.pageSize || 100;

    let dtoOut;
    try {
      dtoOut = await this.dao.list(awid, dtoIn.pageInfo);
    } catch (e) {
      throw new CategoryError.ListCategoriesFailedError({uuAppErrorMap}, null, e);
    }

    dtoOut = dtoOut || {};
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new CategoryModel();

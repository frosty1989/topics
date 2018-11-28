"use strict";

const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError, DuplicateKey } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const JokesInstanceModel = require("./jokes-instance-model");
const Errors = require("../errors/category-error");
const Path = require("path");

const WARNINGS = {
  createUnsupportedKeys: {
    code: `${Errors.Create.UC_CODE}unsupportedKeys`
  },
  getUnsupportedKeys: {
    code: `${Errors.Get.UC_CODE}unsupportedKeys`
  },
  updateUnsupportedKeys: {
    code: `${Errors.Update.UC_CODE}unsupportedKeys`
  },
  deleteUnsupportedKeys: {
    code: `${Errors.Delete.UC_CODE}unsupportedKeys`
  }
};
const DEFAULT_ICON = "mdi-label";

class CategoryModel {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "validation_types", "category-types.js"));
    this.dao = DaoFactory.getDao("category");
    this.jokeDao = DaoFactory.getDao("joke");
  }

  async create(awid, dtoIn) {
    // hds 1, A1, hds 1.1, A2
    await JokesInstanceModel.checkInstance(
      awid,
      Errors.Create.JokesInstanceDoesNotExist,
      Errors.Create.JokesInstanceNotInProperState
    );

    // hds 2, 2.1
    let validationResult = this.validator.validate("categoryCreateDtoInType", dtoIn);
    // hds 2.2, 2.3, A3, A4
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.createUnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );
    // hds 2.4
    if (!dtoIn.icon) dtoIn.icon = DEFAULT_ICON;
    dtoIn.awid = awid;

    // hds 3
    let category;
    try {
      category = await this.dao.create(dtoIn);
    } catch (e) {
      if (e instanceof DuplicateKey) {
        // A5
        throw new Errors.Create.CategoryNameNotUnique({ uuAppErrorMap }, { categoryName: dtoIn.name });
      }
      if (e instanceof ObjectStoreError) {
        // A6
        throw new Errors.Create.CategoryDaoCreateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // hds 4
    category.uuAppErrorMap = uuAppErrorMap;
    return category;
  }

  async get(awid, dtoIn) {
    // hds 1, A1, hds 1.1, A2
    let jokesInstance = await JokesInstanceModel.checkInstance(
      awid,
      Errors.Get.JokesInstanceDoesNotExist,
      Errors.Get.JokesInstanceNotInProperState
    );
    // A3
    if (jokesInstance.state === JokesInstanceModel.STATE_UNDER_CONSTRUCTION) {
      throw new Errors.Get.JokesInstanceIsUnderConstruction({}, { state: jokesInstance.state });
    }

    // hds 2, 2.1
    let validationResult = this.validator.validate("categoryGetDtoInType", dtoIn);
    // hds 2.2, 2.3, A4, A5
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.getUnsupportedKeys.code,
      Errors.Get.InvalidDtoIn
    );

    // hds 3
    let category;
    if (dtoIn.id) {
      category = await this.dao.get(awid, dtoIn.id);
    } else {
      category = await this.dao.getByName(awid, dtoIn.name);
    }
    // A6
    if (!category) {
      let paramMap = {};
      if (dtoIn.id) paramMap.categoryId = dtoIn.id;
      if (dtoIn.name) paramMap.categoryName = dtoIn.name;
      throw new Errors.Get.CategoryDoesNotExist({ uuAppErrorMap }, paramMap);
    }

    // hds 4
    category.uuAppErrorMap = uuAppErrorMap;
    return category;
  }

  async update(awid, dtoIn) {
    // hds 1, A1, hds 1.1, A2
    await JokesInstanceModel.checkInstance(
      awid,
      Errors.Update.JokesInstanceDoesNotExist,
      Errors.Update.JokesInstanceNotInProperState
    );

    // hds 2, 2.1
    let validationResult = this.validator.validate("categoryUpdateDtoInType", dtoIn);
    // hds 2.2, 2.3, A3, A4
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.updateUnsupportedKeys.code,
      Errors.Update.InvalidDtoIn
    );

    // hds 3
    let category;
    dtoIn.awid = awid;
    try {
      category = await this.dao.update(dtoIn);
    } catch (e) {
      if (e instanceof DuplicateKey) {
        // A5
        throw new Errors.Update.CategoryNameNotUnique({ uuAppErrorMap }, { categoryName: dtoIn.name });
      }
      if (e instanceof ObjectStoreError) {
        // A6
        throw new Errors.Update.CategoryDaoUpdateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // hds 4
    category.uuAppErrorMap = uuAppErrorMap;
    return category;
  }

  async delete(awid, dtoIn) {
    // hds 1, A1, hds 1.1, A2
    await JokesInstanceModel.checkInstance(
      awid,
      Errors.Delete.JokesInstanceDoesNotExist,
      Errors.Delete.JokesInstanceNotInProperState
    );

    // hds 2, 2.1
    let validationResult = this.validator.validate("categoryDeleteDtoInType", dtoIn);
    // hds 2.2, 2.3, A3, A4
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.deleteUnsupportedKeys.code,
      Errors.Delete.InvalidDtoIn
    );

    // hds 3
    if (!dtoIn.forceDelete) {
      // hds 3.1
      let count;
      try {
        count = await this.jokeDao.getCountByCategoryId(awid, dtoIn.id);
      } catch (e) {
        //  A5
        if (e instanceof ObjectStoreError) {
          throw new Errors.Delete.JokeDaoGetCountByCategoryFailed({ uuAppErrorMap }, e);
        }
        throw e;
      }
      if (count !== 0) {
        // A6
        throw new Errors.Delete.RelatedJokesExist({ uuAppErrorMap }, { relatedJokes: count });
      }
    } else {
      // hds 3.2
      try {
        await this.jokeDao.removeCategory(awid, dtoIn.id);
      } catch (e) {
        if (e instanceof ObjectStoreError) {
          // A7
          throw new Errors.Delete.JokeDaoRemoveCategoryFailed({ uuAppErrorMap }, e);
        }
        throw e;
      }
    }

    // hds 4
    await this.dao.delete(awid, dtoIn.id);

    // hds 5
    return { uuAppErrorMap };
  }
}

module.exports = new CategoryModel();

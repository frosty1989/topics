/*eslint-disable no-constant-condition*/

"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { UuBinaryModel } = require("uu_appg01_binarystore-cmd");
const JokesInstanceModel = require("./jokes-instance-model");
const Errors = require("../errors/joke-error");
const Path = require("path");

const WARNINGS = {
  Create: {
    unsupportedKeys: {
      code: `${Errors.Create.UC_CODE}unsupportedKeys`
    },
    categoryDoesNotExist: {
      code: `${Errors.Create.UC_CODE}categoryDoesNotExist`,
      message: "One or more categories with given categoryId do not exist."
    }
  },
  Get: {
    unsupportedKeys: {
      code: `${Errors.Get.UC_CODE}unsupportedKeys`
    }
  },
  Update: {
    unsupportedKeys: {
      code: `${Errors.Update.UC_CODE}unsupportedKeys`
    },
    categoryDoesNotExist: {
      code: `${Errors.Update.UC_CODE}categoryDoesNotExist`,
      message: "One or more categories with given categoryId do not exist."
    }
  }
};

class JokeModel {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "validation_types", "joke-types.js"));
    this.dao = DaoFactory.getDao("joke");
    this.jokesInstanceDao = DaoFactory.getDao("jokesInstance");
    this.categoryDao = DaoFactory.getDao("category");
  }

  async create(awid, dtoIn, session, authorizationResult) {
    // hds 1, A1, hds 1.1, A2
    await this._checkInstance(
      awid,
      Errors.Create.JokesInstanceDoesNotExist,
      Errors.Create.JokesInstanceNotInProperState
    );

    // hds 2, 2.1
    let validationResult = this.validator.validate("jokeCreateDtoInType", dtoIn);
    // hds 2.2, 2.3, A3, A4
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.Create.unsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );
    // hds 2.4
    dtoIn.averageRating = 0;
    dtoIn.ratingCount = 0;
    dtoIn.visibility = authorizationResult.getAuthorizedProfiles().includes(JokesInstanceModel.AUTHORITIES);
    dtoIn.uuIdentity = session.getIdentity().getUuIdentity();
    dtoIn.uuIdentityName = session.getIdentity().getName();
    dtoIn.awid = awid;

    // hds 3
    if (dtoIn.image) {
      try {
        let binary = await UuBinaryModel.createBinary(awid, { data: dtoIn.image });
        dtoIn.image = binary.code;
      } catch (e) {
        // A5
        throw new Errors.Create.UuBinaryCreateFailed({ uuAppErrorMap }, e);
      }
    }

    // hds 4
    if (dtoIn.categoryList) {
      let presentCategories = await this._checkCategoriesExistence(awid, dtoIn.categoryList);
      // A6
      if (dtoIn.categoryList.length > 0) {
        ValidationHelper.addWarning(
          uuAppErrorMap,
          WARNINGS.Create.categoryDoesNotExist.code,
          WARNINGS.Create.categoryDoesNotExist.message,
          { categoryList: [...new Set(dtoIn.categoryList)] }
        );
      }
      dtoIn.categoryList = [...new Set(presentCategories)];
    }

    // hds 5
    let joke;
    try {
      joke = await this.dao.create(dtoIn);
    } catch (e) {
      // A7
      if (e instanceof ObjectStoreError) {
        throw new Errors.Create.JokeDaoCreateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // hds 6
    joke.uuAppErrorMap = uuAppErrorMap;
    return joke;
  }

  async get(awid, dtoIn) {
    // hds 1, A1, hds 1.1, A2
    let jokesInstance = await this._checkInstance(
      awid,
      Errors.Get.JokesInstanceDoesNotExist,
      Errors.Get.JokesInstanceNotInProperState
    );
    // A3
    if (jokesInstance.state === JokesInstanceModel.STATE_UNDER_CONSTRUCTION) {
      throw new Errors.Get.JokesInstanceIsUnderConstruction(
        {},
        {
          state: jokesInstance.state,
          expectedStateList: [JokesInstanceModel.STATE_ACTIVE, JokesInstanceModel.STATE_UNDER_CONSTRUCTION]
        }
      );
    }

    // hds 2, 2.1
    let validationResult = this.validator.validate("jokeGetDtoInType", dtoIn);
    // hds 2.2, 2.3, A4, A5
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.Get.unsupportedKeys.code,
      Errors.Get.InvalidDtoIn
    );

    // hds 3
    let joke = await this.dao.get(awid, dtoIn.id);
    if (!joke) {
      // A6
      throw new Errors.Get.JokeDoesNotExist(uuAppErrorMap, { jokeId: dtoIn.id });
    }

    // hds 4
    joke.uuAppErrorMap = uuAppErrorMap;
    return joke;
  }

  async update(awid, dtoIn, session, authorizationResult) {
    // hds 1, A1, hds 1.1, A2
    await this._checkInstance(
      awid,
      Errors.Update.JokesInstanceDoesNotExist,
      Errors.Update.JokesInstanceNotInProperState
    );

    // hds 2, 2.1
    let validationResult = this.validator.validate("jokeUpdateDtoInType", dtoIn);
    // hds 2.2, 2.3, A3, A4
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.Update.unsupportedKeys.code,
      Errors.Update.InvalidDtoIn
    );

    // hds 3
    let joke = await this.dao.get(awid, dtoIn.id);
    // A5
    if (!joke) {
      throw new Errors.Update.JokeDoesNotExist({ uuAppErrorMap }, { jokeId: dtoIn.id });
    }

    // hds 4
    let uuId = session.getIdentity().getUuIdentity();
    // A6
    if (
      uuId !== joke.uuIdentity &&
      !authorizationResult.getAuthorizedProfiles().includes(JokesInstanceModel.AUTHORITIES)
    ) {
      throw new Errors.Update.UserNotAuthorized({ uuAppErrorMap });
    }

    // hds 5
    if (dtoIn.categoryList) {
      let presentCategories = await this._checkCategoriesExistence(awid, dtoIn.categoryList);
      // A7
      if (dtoIn.categoryList.length > 0) {
        ValidationHelper.addWarning(
          uuAppErrorMap,
          WARNINGS.Update.categoryDoesNotExist.code,
          WARNINGS.Update.categoryDoesNotExist.message,
          { categoryList: [...new Set(dtoIn.categoryList)] }
        );
      }
      dtoIn.categoryList = [...new Set(presentCategories)];
    }

    // hds 6
    if (dtoIn.image) {
      let binary;
      if (!joke.image) {
        // hds 6.1
        try {
          binary = await UuBinaryModel.createBinary(awid, { data: dtoIn.image });
        } catch (e) {
          // A8
          throw new Errors.Update.UuBinaryCreateFailed({ uuAppErrorMap }, e);
        }
      } else {
        // hds 6.2
        try {
          binary = await UuBinaryModel.updateBinaryData(awid, {
            data: dtoIn.image,
            code: joke.image,
            revisionStrategy: "NONE"
          });
        } catch (e) {
          // A9
          throw new Errors.Update.UuBinaryUpdateBinaryDataFailed({ uuAppErrorMap }, e);
        }
      }
      dtoIn.image = binary.code;
    }

    // hds 7
    try {
      dtoIn.awid = awid;
      joke = await this.dao.update(dtoIn);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        // A10
        throw new Errors.Update.JokeDaoUpdateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // hds 8
    joke.uuAppErrorMap = uuAppErrorMap;
    return joke;
  }

  /**
   * Checks whether jokes instance exists and that it is not in closed state.
   * @param {String} awid Used awid
   * @param {Error} notExistError Error thrown when jokes instance does not exist
   * @param {Error} closedStateError Error thrown when jokes instance is in closed state
   * @returns {Promise<{}>} jokes instance
   */
  async _checkInstance(awid, notExistError, closedStateError) {
    let jokesInstance = await this.jokesInstanceDao.getByAwid(awid);
    if (!jokesInstance) {
      throw new notExistError({});
    }
    if (jokesInstance.state === JokesInstanceModel.STATE_CLOSED) {
      throw new closedStateError(
        {},
        {
          state: jokesInstance.state,
          expectedStateList: [JokesInstanceModel.STATE_ACTIVE, JokesInstanceModel.STATE_UNDER_CONSTRUCTION]
        }
      );
    }
    return jokesInstance;
  }

  /**
   * Checks whether categories exist for specified awid and removes them from categoryList (so it, in the end, contains
   * only ids of categories, that do not exist).
   * @param {String} awid Used awid
   * @param {Array} categoryList An array with ids of categories
   * @returns {Promise<[]>} Ids of existing categories
   */
  async _checkCategoriesExistence(awid, categoryList) {
    let categories,
      pageInfo = { pageIndex: 0 },
      presentCategories = [],
      categoryIndex;
    while (true) {
      categories = await this.categoryDao.listByCategoryIdList(awid, categoryList, pageInfo);
      categories.itemList.forEach(category => {
        categoryIndex = categoryList.indexOf(category.id.toString());
        if (categoryIndex !== -1) {
          presentCategories.push(category.id.toString());
          categoryList.splice(categoryIndex, 1);
        }
      });
      if (categories.itemList < categories.pageInfo.pageSize || categoryList.length === 0) {
        break;
      }
      pageInfo.pageIndex += 1;
    }
    return presentCategories;
  }
}

module.exports = new JokeModel();

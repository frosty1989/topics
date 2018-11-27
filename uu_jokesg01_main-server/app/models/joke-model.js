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
  },
  UpdateVisibility: {
    unsupportedKeys: {
      code: `${Errors.UpdateVisibility.UC_CODE}unsupportedKeys`
    }
  },
  Delete: {
    unsupportedKeys: {
      code: `${Errors.Delete.UC_CODE}unsupportedKeys`
    }
  },
  List: {
    unsupportedKeys: {
      code: `${Errors.List.UC_CODE}unsupportedKeys`
    }
  },
  AddRating: {
    unsupportedKeys: {
      code: `${Errors.AddRating.UC_CODE}unsupportedKeys`
    }
  }
};
const DEFAULTS = {
  sortBy: "name",
  order: "asc",
  pageIndex: 0,
  pageSize: 100
};

class JokeModel {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "validation_types", "joke-types.js"));
    this.dao = DaoFactory.getDao("joke");
    this.jokesInstanceDao = DaoFactory.getDao("jokesInstance");
    this.categoryDao = DaoFactory.getDao("category");
    this.jokeRatingDao = DaoFactory.getDao("jokeRating");
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
      throw new Errors.Get.JokesInstanceIsUnderConstruction({}, { state: jokesInstance.state });
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

  async updateVisibility(awid, dtoIn) {
    // hds 1, A1, hds 1.1, A2
    await this._checkInstance(
      awid,
      Errors.UpdateVisibility.JokesInstanceDoesNotExist,
      Errors.UpdateVisibility.JokesInstanceNotInProperState
    );

    // hds 2, 2.1
    let validationResult = this.validator.validate("jokeUpdateVisibilityDtoInType", dtoIn);
    // hds 2.2, 2.3, A3, A4
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.UpdateVisibility.unsupportedKeys.code,
      Errors.UpdateVisibility.InvalidDtoIn
    );

    // hds 3
    let joke;
    try {
      joke = await this.dao.updateVisibility(awid, dtoIn.id, dtoIn.visibility);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        // A5
        throw new Errors.UpdateVisibility.JokeDaoUpdateVisibilityFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // hds 4
    joke.uuAppErrorMap = uuAppErrorMap;
    return joke;
  }

  async delete(awid, dtoIn, session, authorizationResult) {
    // hds 1, A1, hds 1.1, A2
    await this._checkInstance(
      awid,
      Errors.Delete.JokesInstanceDoesNotExist,
      Errors.Delete.JokesInstanceNotInProperState
    );

    // hds 2, 2.1
    let validationResult = this.validator.validate("jokeDeleteDtoInType", dtoIn);
    // hds 2.2, 2.3, A3, A4
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.Delete.unsupportedKeys.code,
      Errors.Delete.InvalidDtoIn
    );

    // hds 3
    let joke = await this.dao.get(awid, dtoIn.id);
    // A5
    if (!joke) {
      throw new Errors.Delete.JokeDoesNotExist({ uuAppErrorMap }, { jokeId: dtoIn.id });
    }

    // hds 4, A6
    if (
      session.getIdentity().getUuIdentity() !== joke.uuIdentity &&
      !authorizationResult.getAuthorizedProfiles().includes(JokesInstanceModel.AUTHORITIES)
    ) {
      throw new Errors.Delete.UserNotAuthorized({ uuAppErrorMap });
    }

    // hds 5
    try {
      await this.jokeRatingDao.deleteByJokeId(awid, joke.id);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        // A7
        throw new Errors.Delete.JokeRatingDaoDeleteByJokeIdFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // hds 6
    if (joke.image) {
      try {
        await UuBinaryModel.deleteBinary(awid, { code: joke.image });
      } catch (e) {
        // A8
        throw new Errors.Delete.UuBinaryDeleteFailed({ uuAppErrorMap }, e);
      }
    }

    // hds 7
    await this.dao.delete(awid, dtoIn.id);

    // hds 8
    return { uuAppErrorMap };
  }

  async list(awid, dtoIn) {
    // hds 1, A1, hds 1.1, A2
    let jokesInstance = await this._checkInstance(
      awid,
      Errors.List.JokesInstanceDoesNotExist,
      Errors.List.JokesInstanceNotInProperState
    );
    // A3
    if (jokesInstance.state === JokesInstanceModel.STATE_UNDER_CONSTRUCTION) {
      throw new Errors.List.JokesInstanceIsUnderConstruction({}, { state: jokesInstance.state });
    }

    // hds 2, 2.1
    let validationResult = this.validator.validate("jokeListDtoInType", dtoIn);
    // hds 2.2, 2.3, A4, A5
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.List.unsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );
    // hds 2.4
    if (!dtoIn.sortBy) dtoIn.sortBy = DEFAULTS.sortBy;
    if (!dtoIn.order) dtoIn.order = DEFAULTS.order;
    if (!dtoIn.pageInfo) {
      dtoIn.pageInfo = {
        pageSize: DEFAULTS.pageSize,
        pageIndex: DEFAULTS.pageIndex
      };
    } else {
      if (!dtoIn.pageInfo.pageSize) dtoIn.pageInfo.pageSize = DEFAULTS.pageSize;
      if (!dtoIn.pageInfo.pageIndex) dtoIn.pageInfo.pageIndex = DEFAULTS.pageIndex;
    }

    // hds 3
    let list;
    if (dtoIn.categoryList) {
      list = await this.dao.listByCategoryIdList(awid, dtoIn.categoryList, dtoIn.sortBy, dtoIn.order, dtoIn.pageInfo);
    } else {
      list = await this.dao.list(awid, dtoIn.sortBy, dtoIn.order, dtoIn.pageInfo);
    }

    // hds 4
    list.uuAppErrorMap = uuAppErrorMap;
    return list;
  }

  async addRating(awid, dtoIn, session) {
    // hds 1, A1, hds 1.1, A2
    await this._checkInstance(
      awid,
      Errors.AddRating.JokesInstanceDoesNotExist,
      Errors.AddRating.JokesInstanceNotInProperState
    );

    // hds 2, 2.1
    let validationResult = this.validator.validate("jokeAddRatingDtoInType", dtoIn);
    // hds 2.2, 2.3, A3, A4
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.AddRating.unsupportedKeys.code,
      Errors.AddRating.InvalidDtoIn
    );

    // hds 3
    let joke;
    let jokeId = dtoIn.id;
    joke = await this.dao.get(awid, jokeId);
    // A5
    if (!joke) throw new Errors.AddRating.JokeDoesNotExist({ uuAppErrorMap }, { jokeId: jokeId });
    jokeId = joke.id;

    // hds 4, A6
    let uuIdentity = session.getIdentity().getUuIdentity();
    if (uuIdentity === joke.uuIdentity) {
      throw new Errors.AddRating.UserNotAuthorized({ uuAppErrorMap });
    }

    // hds 5
    let rating = dtoIn.rating;
    let ratingUuObject = await this.jokeRatingDao.getByJokeIdAndUuIdentity(awid, jokeId, uuIdentity);
    let oldRating;
    if (ratingUuObject) {
      oldRating = ratingUuObject.value;
      // hds 5.1
      try {
        ratingUuObject.value = rating;
        await this.jokeRatingDao.update(ratingUuObject);
      } catch (e) {
        if (e instanceof ObjectStoreError) {
          // A7
          throw new Errors.AddRating.JokeRatingDaoUpdateFailed({ uuAppErrorMap }, e);
        }
        throw e;
      }
    } else {
      // hds 5.2
      try {
        await this.jokeRatingDao.create({ awid, jokeId, uuIdentity, value: rating });
      } catch (e) {
        if (e instanceof ObjectStoreError) {
          // A8
          throw new Errors.AddRating.JokeRatingDaoCreateFailed({ uuAppErrorMap }, e);
        }
        throw e;
      }
    }

    // hds 6
    let newRating;
    if (oldRating) {
      newRating = (joke.averageRating * joke.ratingCount - oldRating + rating) / joke.ratingCount;
    } else {
      newRating = (joke.averageRating * joke.ratingCount + rating) / (joke.ratingCount + 1);
      // hds 7
      joke.ratingCount += 1;
    }
    joke.averageRating = newRating;

    // hds 8
    try {
      joke = await this.dao.update(joke);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.AddRating.JokeDaoUpdateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // hds 9
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

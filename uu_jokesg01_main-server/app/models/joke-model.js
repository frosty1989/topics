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
      code: `${Errors.Create.UC_CODE}unsupportedKeys`,
      message: "DtoIn contains unsupported keys."
    },
    categoryDoesNotExist: {
      code: `${Errors.Create.UC_CODE}categoryDoesNotExist`,
      message: "One or more categories with given categoryId do not exist."
    }
  },
  Get: {
    unsupportedKeys: {
      code: `${Errors.Get.UC_CODE}unsupportedKeys`,
      message: "DtoIn contains unsupported keys."
    }
  },
  updateJoke: {
    unsupportedKeys: {
      code: `${Errors.UpdateJoke.UC_CODE}unsupportedKeys`,
      message: "DtoIn contains unsupported keys."
    },
    jokeDoesNotExist: {
      code: `${Errors.UpdateJoke.UC_CODE}jokeDoesNotExist`,
      message: "Joke does not exist."
    }
  },
  removeJoke: {
    unsupportedKeys: {
      code: `${Errors.DeleteJoke.UC_CODE}unsupportedKeys`,
      message: "DtoIn contains unsupported keys."
    }
  },
  listJokes: {
    unsupportedKeys: {
      code: `${Errors.ListJokes.UC_CODE}unsupportedKeys`,
      message: "DtoIn contains unsupported keys."
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
    // hds 1
    let jokesInstance = await this.jokesInstanceDao.getByAwid(awid);
    if (!jokesInstance) {
      // A1
      throw new Errors.Create.JokesInstanceDoesNotExist({});
    }
    // hds 1.1
    if (jokesInstance.state === JokesInstanceModel.STATE_CLOSED) {
      // A2
      throw new Errors.Create.JokesInstanceNotInProperState(
        {},
        {
          state: jokesInstance.state,
          expectedStateList: [JokesInstanceModel.STATE_ACTIVE, JokesInstanceModel.STATE_UNDER_CONSTRUCTION]
        }
      );
    }

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
    dtoIn.visibility = authorizationResult.getAuthorizedProfiles().includes("Authorities");
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
      let categories,
        pageInfo = { pageIndex: 0 },
        presentCategories = [],
        categoryIndex;
      while (true) {
        categories = await this.categoryDao.listByCategoryIdList(awid, dtoIn.categoryList, pageInfo);
        categories.itemList.forEach(category => {
          categoryIndex = dtoIn.categoryList.indexOf(category.id.toString());
          if (categoryIndex !== -1) {
            presentCategories.push(category.id.toString());
            dtoIn.categoryList.splice(categoryIndex, 1);
          }
        });
        if (categories.itemList < categories.pageInfo.pageSize || dtoIn.categoryList.length === 0) {
          break;
        }
        pageInfo.pageIndex += 1;
      }
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
    // hds 1
    let jokesInstance = await this.jokesInstanceDao.getByAwid(awid);
    if (!jokesInstance) {
      // A1
      throw new Errors.Get.JokesInstanceDoesNotExist({});
    }
    // hds 1.1
    if (jokesInstance.state === JokesInstanceModel.STATE_CLOSED) {
      // A2
      throw new Errors.Get.JokesInstanceNotInProperState(
        {},
        {
          state: jokesInstance.state,
          expectedStateList: [JokesInstanceModel.STATE_ACTIVE, JokesInstanceModel.STATE_UNDER_CONSTRUCTION]
        }
      );
    } else if (jokesInstance.state === JokesInstanceModel.STATE_UNDER_CONSTRUCTION) {
      // A3
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

  async updateJoke(awid, dtoIn) {
    //HDS 1
    let validationResult = this.validator.validate("updateJokeDtoInType", dtoIn);
    //A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.updateJoke.unsupportedKeys.code,
      Errors.UpdateJoke.InvalidDtoIn
    );
    let dtoOut = {};

    //HDS 2
    try {
      let foundJoke = await this.dao.get(awid, dtoIn.id);

      if (!foundJoke) {
        //A5
        ValidationHelper.addWarning(
          uuAppErrorMap,
          WARNINGS.updateJoke.jokeDoesNotExist.code,
          WARNINGS.updateJoke.jokeDoesNotExist.message,
          {
            jokeId: dtoIn.id
          }
        );
      }
    } catch (e) {
      //A4
      if (e instanceof ObjectStoreError) {
        throw new Errors.UpdateJoke.JokeDaoGetFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    try {
      dtoIn.awid = awid;
      //HDS 3
      dtoOut = await this.dao.update(dtoIn);
    } catch (e) {
      //A3
      if (e instanceof ObjectStoreError) {
        throw new Errors.UpdateJoke.JokeDaoUpdateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;

    //HDS 4
    return dtoOut;
  }

  async deleteJoke(awid, dtoIn) {
    //HDS 1
    let validationResult = this.validator.validate("deleteJokeDtoInType", dtoIn);
    //A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.removeJoke.unsupportedKeys.code,
      Errors.DeleteJoke.InvalidDtoIn
    );
    let dtoOut = {};

    try {
      const JokeRatingModel = require("./joke-rating-model");

      //HDS 2
      await JokeRatingModel.dao.deleteByJoke(awid, dtoIn.id);
    } catch (e) {
      //A3
      if (e instanceof ObjectStoreError) {
        throw new Errors.DeleteJoke.JokeRatingDaoDeleteByJokeFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    try {
      const JokeCategoryModel = require("./joke-category-model");
      //HDS 3
      await JokeCategoryModel.dao.deleteByJoke(awid, dtoIn.id);
    } catch (e) {
      //A4
      if (e instanceof ObjectStoreError) {
        throw new Errors.DeleteJoke.JokeCategoryDaoDeleteByJokeFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    try {
      //HDS 4
      await this.dao.remove(awid, dtoIn.id);
    } catch (e) {
      //A5
      if (e instanceof ObjectStoreError) {
        throw new Errors.DeleteJoke.JokeDaoDeleteFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;

    //HDS 5
    return dtoOut;
  }

  async listJokes(awid, dtoIn) {
    //HDS 1
    let validationResult = this.validator.validate("listJokesDtoInType", dtoIn);
    //A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.listJokes.unsupportedKeys.code,
      Errors.ListJokes.InvalidDtoIn
    );
    let sort = dtoIn.hasOwnProperty("sortBy") ? (dtoIn.sortBy === "name" ? "name" : "rating") : "name";
    let order = dtoIn.hasOwnProperty("order") ? (dtoIn.order === "asc" ? 1 : -1) : 1;
    let dtoOut = {};

    //HDS 1.4
    dtoIn.pageInfo = dtoIn.pageInfo || { pageIndex: 0, pageSize: 100 };
    dtoIn.pageInfo.pageSize = dtoIn.pageInfo.pageSize || 100;

    try {
      //HDS 2
      dtoOut = await this.dao.list(awid, dtoIn.pageInfo, sort, order);
    } catch (e) {
      //A3
      if (e instanceof ObjectStoreError) {
        throw new Errors.ListJokes.JokeDaoListFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;

    //HDS 3
    return dtoOut;
  }
}

module.exports = new JokeModel();

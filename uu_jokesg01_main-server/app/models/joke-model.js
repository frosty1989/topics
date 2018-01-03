"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").Workspace;
const {
  prefix,
  createJoke,
  getJoke,
  listJokes,
  deleteJoke,
  updateJoke,
  listCategoryJokes
} = require("../errors/joke-error");
const CategoryModel = require("./category-model");
const Path = require("path");
const WARNINGS = {
  createJoke: {
    categoryDaoGetFailed: {
      code: `${prefix}/${createJoke.code}/categoryDaoGetFailed`,
      message: "Get category by category Dao get failed,"
    },
    categoryDoesNotExist: {
      code: `${prefix}/${createJoke.code}/categoryDoesNotExist`,
      message: "Category with given categoryId does not exist."
    }
  },
  updateJoke: {
    jokeDoesNotExist: {
      code: `${prefix}/${updateJoke.code}/jokeDoesNotExist`,
      message: "Joke does not exist."
    }
  }
};

class JokeModel {
  constructor() {
    this.validator = new Validator(
      Path.join(__dirname, "..", "validation_types", "joke-types.js")
    );
    this.dao = DaoFactory.getDao("joke");
  }

  async createJoke(awid, dtoIn) {
    let validationResult = this.validator.validate(
      "createJokeDtoInType",
      dtoIn
    );
    let dtoOut;
    let validJokeCategories = [];
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      {},
      `${prefix}/${createJoke.code}/unsupportedKey`,
      createJoke.invalidDtoIn
    );

    dtoIn.awid = awid;

    if (dtoIn.categoryList && dtoIn.categoryList.length > 0) {
      dtoIn.categoryList.forEach(async categoryId => {
        try {
          let foundCategory = await CategoryModel.dao.get(awid, categoryId);

          if (!foundCategory.hasOwnProperty("id")) {
            ValidationHelper.addWarning(
              uuAppErrorMap,
              WARNINGS.createJoke.categoryDoesNotExist.code,
              WARNINGS.createJoke.categoryDoesNotExist.message,
              {
                categoryId: categoryId
              }
            );
          } else {
            validJokeCategories.push(categoryId);
          }
        } catch (err) {
          ValidationHelper.addWarning(
            uuAppErrorMap,
            WARNINGS.createJoke.categoryDaoGetFailed.code,
            WARNINGS.createJoke.categoryDaoGetFailed.message,
            {
              cause: err
            }
          );
        }
      });
    }

    try {
      if (validJokeCategories.length > 0) {
        dtoIn.categoryList = validJokeCategories;
      }

      dtoOut = await this.dao.create(dtoIn);
    } catch (e) {
      throw new createJoke.jokeDaoCreateFailed(
        {
          uuAppErrorMap
        },
        null,
        e
      );
    }

    if (validJokeCategories.length > 0) {
      const JokeCategoryModel = require("./joke-category-model");

      try {
        await JokeCategoryModel.dao.create({
          awid: awid,
          jokeId: dtoOut.id,
          categoryList: validJokeCategories
        });
      } catch (err) {
        throw new createJoke.jokeCategoryDaoCreateFailed(
          {
            uuAppErrorMap
          },
          null,
          err
        );
      }
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;

    return dtoOut;
  }

  async getJoke(awid, dtoIn) {
    let validationResult = this.validator.validate("getJokeDtoInType", dtoIn);
    let dtoOut = {};
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      {},
      `${prefix}/${getJoke.code}/unsupportedKey`,
      getJoke.invalidDtoIn
    );

    try {
      dtoOut = await this.dao.get(awid, dtoIn.id);
    } catch (e) {
      throw new getJoke.jokeDoesNotExist(
        {
          uuAppErrorMap
        },
        null,
        e
      );
    }

    // A4
    if (typeof dtoOut.name === "undefined") {
      throw new getJoke.jokeDoesNotExist(
        {
          uuAppErrorMap
        },
        null,
        { jokeId: dtoIn.id }
      );
    }

    try {
      const JokeCategoryModel = require("./joke-category-model");

      await JokeCategoryModel.dao.listByJoke(awid, dtoIn.id);
    } catch (err) {
      throw new getJoke.jokeCategoryDaoListByJokeFailed(
        { uuAppErrorMap },
        null,
        {
          cause: err
        }
      );
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async listJokes(awid, dtoIn) {
    let validationResult = this.validator.validate("listJokesDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      {},
      `${prefix}/${listJokes.code}/unsupportedKey`,
      listJokes.invalidDtoInError
    );

    dtoIn.pageInfo = dtoIn.pageInfo || {
      pageIndex: 0,
      pageSize: 100
    };
    dtoIn.pageInfo.pageSize = dtoIn.pageInfo.pageSize || 100;
    let sort = dtoIn.sortBy === "name" ? "name" : "rating";
    let order = dtoIn.order === "desc" ? -1 : 1;

    let dtoOut;
    try {
      dtoOut = await this.dao.list(awid, dtoIn.pageInfo, {
        [sort]: order
      });
    } catch (e) {
      throw new listJokes.jokeDaoListFailed(
        {
          uuAppErrorMap
        },
        null,
        e
      );
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async listCategoryJokes(awid, dtoIn) {
    let validationResult = this.validator.validate(
      "listCategoryJokesDtoInType",
      dtoIn
    );
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      {},
      `${prefix}/${listCategoryJokes.code}/unsupportedKey`,
      listCategoryJokes.invalidDtoInError
    );

    let dtoOut;
    try {
      dtoOut = await this.dao.listCategoryJokes(awid, dtoIn.categoryId);
    } catch (e) {
      throw new listCategoryJokes.jokeCategoryDaoListByCategoryFailed(
        {
          uuAppErrorMap
        },
        null,
        e
      );
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async update(awid, dtoIn) {
    let validationResult = this.validator.validate(
      "updateJokeDtoInType",
      dtoIn
    );
    let dtoOut = {};
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      {},
      `${prefix}/${updateJoke.code}/unsupportedKey`,
      updateJoke.invalidDtoInError
    );
    let uuObject = Object.assign({}, dtoIn);

    uuObject.awid = awid;

    try {
      let foundJoke = await this.dao.get(awid, dtoIn.id);

      if (!foundJoke || !foundJoke.hasOwnProperty("id")) {
        ValidationHelper.addWarning(
          uuAppErrorMap,
          WARNINGS.updateJoke.jokeDoesNotExist.code,
          WARNINGS.updateJoke.jokeDoesNotExist.message,
          {
            jokeId: dtoIn.id
          }
        );
      } else {
        try {
          dtoOut = await this.dao.update(uuObject);
        } catch (e) {
          throw new updateJoke.jokeDaoUpdateFailed({ uuAppErrorMap }, null, {
            cause: e
          });
        }
      }
    } catch (err) {
      throw new updateJoke.jokeDaoGetFailed(
        {
          uuAppErrorMap
        },
        null,
        {
          cause: err
        }
      );
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;

    return dtoOut;
  }

  async remove(awid, dtoIn) {
    let validationResult = this.validator.validate(
      "deleteJokeDtoInType",
      dtoIn
    );
    let dtoOut = {};
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      {},
      `${prefix}/${deleteJoke.code}/unsupportedKey`,
      deleteJoke.invalidDtoIn
    );

    try {
      const JokeRatingModel = require("./joke-rating-model");

      await JokeRatingModel.dao.deleteByJoke(awid, dtoIn.id);
    } catch (err) {
      throw new deleteJoke.jokeRatingDaoDeleteByJokeFailed(
        { uuAppErrorMap },
        null,
        { cause: err }
      );
    }

    try {
      const JokeCategoryModel = require("./joke-category-model");

      await JokeCategoryModel.dao.deleteByJoke(awid, dtoIn.id);
    } catch (err) {
      throw new deleteJoke.jokeCategoryDaoDeleteByJokeFailed(
        { uuAppErrorMap },
        null,
        { cause: err }
      );
    }

    try {
      await this.dao.remove(awid, dtoIn.id);
    } catch (e) {
      throw new deleteJoke.jokeDaoDeleteFailed(
        {
          uuAppErrorMap
        },
        null,
        {
          cause: e
        }
      );
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;

    return dtoOut;
  }
}

module.exports = new JokeModel();

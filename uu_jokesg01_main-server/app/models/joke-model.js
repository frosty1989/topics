"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").Workspace;
const Errors = require("../errors/joke-error");
const Path = require("path");

const WARNINGS = {
  createJoke: {
    unsupportedKeys: {
      code: `${Errors.CreateJoke.UC_CODE}unsupportedKeys`,
      message: "DtoIn contains unsupported keys."
    },
    categoryDaoGetFailed: {
      code: `${Errors.CreateJoke.UC_CODE}categoryDaoGetFailed`,
      message: "Get category by category Dao get failed,"
    },
    categoryDoesNotExist: {
      code: `${Errors.CreateJoke.UC_CODE}categoryDoesNotExist`,
      message: "Category with given categoryId does not exist."
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
  getJoke: {
    unsupportedKeys: {
      code: `${Errors.GetJoke.UC_CODE}unsupportedKeys`,
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
  }

  async create(awid, dtoIn) {
    //HDS 1
    //A1
    let validationResult = this.validator.validate("createJokeDtoInType", dtoIn);
    //A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.createJoke.unsupportedKeys.code,
      Errors.CreateJoke.InvalidDtoIn
    );
    let dtoOut;
    let validCategories = [];
    let categoryList = dtoIn.categoryList || [];

    dtoIn.awid = awid;
    //HDS 1.4
    dtoIn.averageRating = 0;
    dtoIn.ratingCount = 0;
    delete dtoIn.categoryList;

    try {
      //HDS2
      dtoOut = await this.dao.create(dtoIn);
    } catch (e) {
      //A3
      throw new Errors.CreateJoke.JokeDaoCreateFailed({ uuAppErrorMap }, e);
    }

    if (categoryList.length > 0) {
      const JokeCategoryModel = require("./joke-category-model");

      //HDS 3
      for (let index = 0; index < categoryList.length; index++) {
        const categoryId = categoryList[index];

        try {
          //HDS 3.1
          const CategoryModel = require("./category-model");
          let category = await CategoryModel.dao.get(awid, categoryId);

          if (category && !category.hasOwnProperty("id")) {
            //A5
            ValidationHelper.addWarning(
              uuAppErrorMap,
              WARNINGS.createJoke.categoryDoesNotExist.code,
              WARNINGS.createJoke.categoryDoesNotExist.message,
              {
                categoryId: categoryId
              }
            );
            continue;
          } else {
            validCategories.push(categoryId);
          }
        } catch (err) {
          //A4
          ValidationHelper.addWarning(
            uuAppErrorMap,
            WARNINGS.createJoke.categoryDaoGetFailed.code,
            WARNINGS.createJoke.categoryDaoGetFailed.message,
            {
              cause: err
            }
          );
          continue;
        }

        try {
          //HDS 3.2
          await JokeCategoryModel.dao.create({ awid: awid, jokeId: dtoOut.id.toString(), categoryId: categoryId });
        } catch (e) {
          //A6
          throw new Errors.CreateJoke.JokeCategoryDaoCreateFailed({ uuAppErrorMap }, e);
        }
      }
    }

    dtoOut.categoryList = validCategories;
    dtoOut.uuAppErrorMap = uuAppErrorMap;

    //HDS 4
    return dtoOut;
  }

  async update(awid, dtoIn) {
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

      if (foundJoke && !foundJoke.hasOwnProperty("id")) {
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
      throw new Errors.UpdateJoke.JokeDaoGetFailed({ uuAppErrorMap }, e);
    }

    try {
      dtoIn.awid = awid;
      //HDS 3
      dtoOut = await this.dao.update(dtoIn);
    } catch (e) {
      //A3
      throw new Errors.UpdateJoke.JokeDaoUpdateFailed({ uuAppErrorMap }, e);
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;

    //HDS 4
    return dtoOut;
  }

  async remove(awid, dtoIn) {
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
      throw new Errors.DeleteJoke.JokeRatingDaoDeleteByJokeFailed({ uuAppErrorMap }, e);
    }

    try {
      const JokeCategoryModel = require("./joke-category-model");
      //HDS 3
      await JokeCategoryModel.dao.deleteByJoke(awid, dtoIn.id);
    } catch (e) {
      //A4
      throw new Errors.DeleteJoke.JokeCategoryDaoDeleteByJokeFailed({ uuAppErrorMap }, e);
    }

    try {
      //HDS 4
      await this.dao.remove(awid, dtoIn.id);
    } catch (e) {
      //A5
      throw new Errors.DeleteJoke.JokeDaoDeleteFailed({ uuAppErrorMap }, e);
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;

    //HDS 5
    return dtoOut;
  }

  async get(awid, dtoIn) {
    //HDS 1
    let validationResult = this.validator.validate("getJokeDtoInType", dtoIn);
    //A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.getJoke.unsupportedKeys.code,
      Errors.GetJoke.InvalidDtoIn
    );
    let dtoOut = {};

    try {
      //HDS 2
      dtoOut = await this.dao.get(awid, dtoIn.id);
    } catch (e) {
      //A3
      throw new Errors.GetJoke.JokeDaoGetFailed({ uuAppErrorMap }, e);
    }

    //A4
    if (!dtoOut.hasOwnProperty("id")) {
      throw new Errors.GetJoke.JokeDoesNotExist({ uuAppErrorMap }, { jokeId: dtoIn.id });
    }

    try {
      const JokeCategoryModel = require("./joke-category-model");
      //HDS 3
      const categories = await JokeCategoryModel.dao.listByJoke(awid, dtoIn.id);

      dtoOut.categoryList = categories.itemList.map(x => x.id);
    } catch (e) {
      //A5
      throw new Errors.GetJoke.JokeCategoryDaoListByJokeFailed({ uuAppErrorMap },e);
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;

    //HDS 4
    return dtoOut;
  }

  async list(awid, dtoIn) {
    //HDS 1
    let validationResult = this.validator.validate("listJokesDtoInType", dtoIn);
    //A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.listJokes.unsupportedKeys.code,
      Errors.ListJokes.InvalidDtoInError
    );
    let sort = dtoIn.sortBy === "name" ? "name" : "rating";
    let order = dtoIn.order === "desc" ? -1 : 1;
    let dtoOut = {};

    //HDS 1.4
    dtoIn.pageInfo = dtoIn.pageInfo || { pageIndex: 0, pageSize: 100 };
    dtoIn.pageInfo.pageSize = dtoIn.pageInfo.pageSize || 100;

    try {
      //HDS 2
      dtoOut = await this.dao.list(awid, dtoIn.pageInfo, { [sort]: order });
    } catch (e) {
      //A3
      throw new Errors.ListJokes.JokeDaoListFailed({ uuAppErrorMap }, e);
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;

    //HDS 3
    return dtoOut;
  }
}

module.exports = new JokeModel();

"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Path = require("path");
const JokeModel = require("./joke-model");
const CategoryModel = require("./category-model");
const Errors = require("../errors/joke-category-error");

const WARNINGS = {
  addJokeCategory: {
    unsupportedKeys: {
      code: `${Errors.AddJokeCategory.UC_CODE}unsupportedKeys`
    },
    categoryDoesNotExist: {
      code: `${Errors.AddJokeCategory.UC_CODE}categoryDoesNotExist`,
      message: "Category does not exist."
    },
    jokeCategoryAlreadyExists: {
      code: `${Errors.AddJokeCategory.UC_CODE}jokeCategoryAlreadyExists`,
      message: "uuObject jokeCategory already exists."
    }
  },
  removeJokeCategory: {
    code: `${Errors.RemoveJokeCategory.UC_CODE}unsupportedKeys`
  },
  listCategoryJokesUnsupportedKeys: {
    code: `${Errors.ListCategoryJokes.UC_CODE}unsupportedKeys`
  }
};

class JokeCategoryModel {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "validation_types", "joke-category-types.js"));
    this.dao = DaoFactory.getDao("jokeCategory");
  }

  async addJokeCategory(awid, dtoIn) {
    //HDS 1
    let validationResult = this.validator.validate("addJokeCategoryDtoInType", dtoIn);
    //A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.addJokeCategory.unsupportedKeys.code,
      Errors.AddJokeCategory.InvalidDtoIn
    );
    let dtoOut = { categoryList: [] };
    let foundJoke;

    try {
      //HDS 2
      foundJoke = await JokeModel.dao.get(awid, dtoIn.jokeId);
    } catch (e) {
      //A3
      if (e instanceof ObjectStoreError) {
        throw new Errors.AddJokeCategory.JokeDaoGetFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    if (!foundJoke) {
      //A4
      throw new Errors.AddJokeCategory.JokeDoesNotExist({ uuAppErrorMap }, { jokeId: dtoIn.jokeId });
    }

    dtoOut.joke = foundJoke;

    //HDS 3
    for (let index = 0; index < dtoIn.categoryList.length; index++) {
      const dtoInCategoryId = dtoIn.categoryList[index];
      let foundCategory;

      try {
        //HDS 3.1
        foundCategory = await CategoryModel.dao.get(awid, dtoInCategoryId);
      } catch (e) {
        //A5
        if (e instanceof ObjectStoreError) {
          throw new Errors.AddJokeCategory.CategoryDaoGetFailed({ uuAppErrorMap }, e);
        }
        throw e;
      }

      if (!foundCategory) {
        //A6
        if (uuAppErrorMap.hasOwnProperty(WARNINGS.addJokeCategory.categoryDoesNotExist.code)) {
          uuAppErrorMap[WARNINGS.addJokeCategory.categoryDoesNotExist.code].paramMap.categoryIds.push(dtoInCategoryId);
        } else {
          ValidationHelper.addWarning(
            uuAppErrorMap,
            WARNINGS.addJokeCategory.categoryDoesNotExist.code,
            WARNINGS.addJokeCategory.categoryDoesNotExist.message,
            { categoryIds: [dtoInCategoryId] }
          );
        }
      } else {
        try {
          //HDS 3.2
          await this.dao.create({ awid: awid, jokeId: dtoIn.jokeId, categoryId: dtoInCategoryId });
          dtoOut.categoryList.push(dtoInCategoryId);
        } catch (e) {
          if (e.code === "uu-app-objectstore/duplicateKey") {
            //A8
            if (uuAppErrorMap.hasOwnProperty(WARNINGS.addJokeCategory.jokeCategoryAlreadyExists.code)) {
              uuAppErrorMap[WARNINGS.addJokeCategory.jokeCategoryAlreadyExists.code].paramMap.push({
                jokeId: dtoIn.jokeId,
                categoryId: foundCategory.id
              });
            } else {
              ValidationHelper.addWarning(
                uuAppErrorMap,
                WARNINGS.addJokeCategory.jokeCategoryAlreadyExists.code,
                WARNINGS.addJokeCategory.jokeCategoryAlreadyExists.message,
                [{ jokeId: dtoIn.jokeId, categoryId: foundCategory.id }]
              );
            }
          } else {
            //A7
            if (e instanceof ObjectStoreError) {
              throw new Errors.AddJokeCategory.JokeCategoryDaoCreateFailed({ uuAppErrorMap }, e);
            }
            throw e;
          }
        }
      }
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;

    //HDS 4
    return dtoOut;
  }

  async removeJokeCategory(awid, dtoIn) {
    //HDS 1
    let validationResult = this.validator.validate("removeJokeCategoryDtoInType", dtoIn);
    //A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.removeJokeCategory.code,
      Errors.RemoveJokeCategory.InvalidDtoIn
    );
    let dtoOut = {};

    //HDS 2
    for (let index = 0; index < dtoIn.categoryList.length; index++) {
      const categoryId = dtoIn.categoryList[index];

      try {
        //HDS 2.1
        await this.dao.deleteByJokeAndCategory(awid, dtoIn.jokeId, categoryId);
      } catch (e) {
        //A3
        if (e instanceof ObjectStoreError) {
          throw new Errors.RemoveJokeCategory.JokeCategoryDaoDeleteByJokeAndCategoryFailed({ uuAppErrorMap }, e);
        }
        throw e;
      }
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;

    //HDS3
    return dtoOut;
  }

  async listCategoryJokes(awid, dtoIn) {
    //HDS 1
    let validationResult = this.validator.validate("listCategoryJokesDtoInType", dtoIn);
    //A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.listCategoryJokesUnsupportedKeys.code,
      Errors.ListCategoryJokes.InvalidDtoIn
    );
    let jokeIds = [];
    let dtoOut;

    try {
      //HDS 2
      let listByCategory = await this.dao.listByCategory(awid, dtoIn.categoryId);
      jokeIds = listByCategory.itemList.map(x => x.jokeId);
    } catch (e) {
      //A3
      if (e instanceof ObjectStoreError) {
        throw new Errors.ListCategoryJokes.JokeCategoryDaoListByCategoryFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    try {
      //HDS 3
      dtoOut = await JokeModel.dao.listByIds(awid, jokeIds);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.ListCategoryJokes.JokeDaoListByIdsFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;

    //HDS 4
    return dtoOut;
  }
}

module.exports = new JokeCategoryModel();

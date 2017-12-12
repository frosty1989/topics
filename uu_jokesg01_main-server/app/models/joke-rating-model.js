"use strict";
const {Validator} = require("uu_appg01_server").Validation;
const {DaoFactory} = require("uu_appg01_server").ObjectStore;
const {ValidationHelper} = require("uu_appg01_server").Workspace;

const Path = require("path");
const JokeError = require("../errors/joke-rating-error.js");

class JokeRatingModel {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "validation_types", "joke-rating-types.js"));
    this.dao = DaoFactory.getDao("jokeRating");
    this.dao.createSchema();
  }

  async addJokeRating(awid, dtoIn) {
    let validationResult = this.validator.validate("addJokeRatingDtoInType", dtoIn);
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(dtoIn, validationResult, uuAppErrorMap, "uu-demoappg01-main/addJokeRating/unsupportedKey", AddJokeRatingError.AddJokeRatingInvalidDtoInError);

    dtoIn.awid = awid;
    let dtoOut;
    try {
      dtoOut = await this.dao.create(dtoIn);
    } catch (e) {
      throw new AddJokeRatingError.AddJokeRatingFailedError({uuAppErrorMap}, null, e);
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async getByJokeAndIdentity(awid, dtoIn) {
    let validationResult = this.validator.validate("getByJokeAndIdentityDtoInType", dtoIn);
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(dtoIn, validationResult, uuAppErrorMap, "uu-demoappg01-main/getByJokeAndIdentity/unsupportedKey", GetByJokeAndIdentityError.GetByJokeAndIdentityInvalidDtoInError);

    let dtoOut;
    try {
      dtoOut = await this.dao.getByJokeAndIdentity(awid, dtoIn.id, dtoIn.uuIdentity);
    } catch (e) {
      throw new AddJokeRatingError.AddJokeRatingFailedError({uuAppErrorMap}, null, e);
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async update(awid, dtoIn) {
    let validationResult = this.validator.validate("updateCategoryDtoInType", dtoIn);
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(dtoIn, validationResult, uuAppErrorMap, "uu-demoappg01-main/updateCategory/unsupportedKey", CategoryError.UpdateCategoryInvalidDtoInError);

    dtoIn.awid = awid;
    let dtoOut;
    try {
      dtoOut = await this.dao.update({awid: awid, id: dtoIn.id, rating: dtoIn.rating});
    } catch (e) {
      throw new CategoryError.UpdateCategoryFailedError({uuAppErrorMap}, null, e);
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async deleteByJoke(awid, dtoIn) {
    let validationResult = this.validator.validate("deleteJokeDtoInType", dtoIn);
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(dtoIn, validationResult, uuAppErrorMap, "uu-demoappg01-main/deleteJoke/unsupportedKey", JokeError.DeleteJokeInvalidDtoInError);

    let dtoOut;
    try {
      dtoOut = await this.dao.deleteByJoke(awid, dtoIn.id);
    } catch (e) {
      throw new JokeError.DeleteJokeFailedError({uuAppErrorMap}, null, e);
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new JokeRatingModel();

"use strict";
const {Validator} = require("uu_appg01_server").Validation;
const {DaoFactory} = require("uu_appg01_server").ObjectStore;
const {ValidationHelper} = require("uu_appg01_server").Workspace;

const Path = require("path");
const JokeRatingError = require("../errors/joke-rating-error.js");
const JokeError = require("../errors/joke-error");
const JokeModel = require("../models/joke-model");

class JokeRatingModel {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "validation_types", "joke-rating-types.js"));
    this.dao = DaoFactory.getDao("jokeRating");
    this.dao.createSchema();
  }

  async create(awid, dtoIn) {
    let validationResult = this.validator.validate("addJokeRatingDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      {},
      `uu-jokesg01-main/${JokeRatingError.Code}/unsupportedKey`,
      JokeRatingError.InvalidDtoInError
    );
    let joke = JokeModel.dao.get(awid, dtoIn.id);

    if (!joke) {
      throw new JokeError.GetJokeFailedError({uuAppErrorMap}, null, {})
    }

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
}

module.exports = new JokeRatingModel();

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
}

module.exports = new JokeRatingModel();

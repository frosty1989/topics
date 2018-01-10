"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").Workspace;
const Path = require("path");
const Errors = require("../errors/joke-rating-error");
const WARNINGS = {
  createRating: {
    code: `${Errors.AddJokeRating.UC_CODE}unsupportedKeys`,
    message: "DtoIn contains unsupported keys."
  }
};

class JokeRatingModel {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "validation_types", "joke-rating-types.js"));
    this.dao = DaoFactory.getDao("jokeRating");
  }

  async create(awid, dtoIn, session) {
    let validationResult = this.validator.validate("addJokeRatingDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.createRating.code,
      Errors.AddJokeRating.invalidDtoIn
    );
    let joke;
    let userVote;
    let dtoOut;
    let uuObject = Object.create(dtoIn);
    let averageRating = 0;
    let identity = session.getIdentity();
    let uuIdentity = identity.getUUIdentity();

    try {
      const JokeModel = require("./joke-model");
      joke = await JokeModel.dao.get(awid, dtoIn.id);
    } catch (e) {
      throw new Errors.AddJokeRating.JokeDaoGetFailed({ uuAppErrorMap }, e);
    }

    if (!joke.hasOwnProperty("id")) {
      throw new Errors.AddJokeRating.JokeDoesNotExist({ uuAppErrorMap }, { jokeId: dtoIn.id });
    }

    try {
      userVote = await this.dao.getByJokeAndIdentity(awid, dtoIn.id, uuIdentity);
    } catch (e) {
      throw new Errors.AddJokeRating.JokeRatingDaoGetByJokeAndIdentityFailed({ uuAppErrorMap }, e);
    }

    uuObject.awid = awid;
    uuObject.uuIdentity = uuIdentity;

    if (userVote) {
      try {
        averageRating = (userVote.rating * 1 + uuObject.rating) / (userVote.rating + 1);
        dtoOut = await this.dao.create(uuObject);
      } catch (e) {
        throw new Errors.AddJokeRating.JokeRatingDaoCreateFailed({ uuAppErrorMap }, e);
      }
    } else {
      try {
        averageRating = 3;
        dtoOut = await this.dao.update(uuObject);
      } catch (e) {
        throw new Errors.AddJokeRating.JokeRatingDaoUpdateFailed({ uuAppErrorMap }, e);
      }
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;

    return dtoOut;
  }
}

module.exports = new JokeRatingModel();

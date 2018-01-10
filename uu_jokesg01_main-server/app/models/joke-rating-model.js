"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
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

  async addJokeRating(awid, dtoIn, session) {
    // HDS 1 // A1
    let validationResult = this.validator.validate("addJokeRatingDtoInType", dtoIn);
    // A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.createRating.code,
      Errors.AddJokeRating.InvalidDtoIn
    );
    let joke;
    let userVote;
    let dtoOut;
    let uuObject = Object.create(dtoIn);
    let averageRating = 0;
    let identity = session.getIdentity();
    let uuIdentity = identity.getUUIdentity();

    try {
      //HDS 2
      const JokeModel = require("./joke-model");
      joke = await JokeModel.dao.get(awid, dtoIn.id);
    } catch (e) {
      // HDS2 //A3
      if (e instanceof ObjectStoreError) {
        throw new Errors.AddJokeRating.JokeDaoGetFailed({ uuAppErrorMap }, e);
      }
    }
    // HDS 2 //A4
    if (!joke.hasOwnProperty("id")) {
      throw new Errors.AddJokeRating.JokeDoesNotExist({ uuAppErrorMap }, { jokeId: dtoIn.id });
    }

    try {
      // HDS 3
      userVote = await this.dao.getByJokeAndIdentity(awid, dtoIn.id, uuIdentity);
    } catch (e) {
      // A5
      if (e instanceof ObjectStoreError) {
        throw new Errors.AddJokeRating.JokeRatingDaoGetByJokeAndIdentityFailed({ uuAppErrorMap }, e);
      }
    }

    uuObject.awid = awid;
    uuObject.uuIdentity = uuIdentity;

    if (userVote) {
      try {
        // HDS 3.2
        averageRating = (userVote.rating * 1 + uuObject.rating) / (userVote.rating + 1);
        dtoOut = await this.dao.create(uuObject);
      } catch (e) {
        // A7
        if (e instanceof ObjectStoreError) {
          throw new Errors.AddJokeRating.JokeRatingDaoCreateFailed({ uuAppErrorMap }, e);
        }
      }
    } else {
      try {
        // HDS 6
        averageRating = 3;
        dtoOut = await this.dao.update(uuObject);
      } catch (e) {
        // A8
        if (e instanceof ObjectStoreError) {
          throw new Errors.AddJokeRating.JokeRatingDaoUpdateFailed({ uuAppErrorMap }, e);
        }
      }
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;

    return dtoOut;
  }
}

module.exports = new JokeRatingModel();

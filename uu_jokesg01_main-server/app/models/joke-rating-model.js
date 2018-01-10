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
    // HDS 1
    // HDS 1.1
    // A1
    let validationResult = this.validator.validate("addJokeRatingDtoInType", dtoIn);
    // HDS 1.2
    // HDS 1.3
    // A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.createRating.code,
      Errors.AddJokeRating.InvalidDtoIn
    );
    const JokeModel = require("./joke-model");
    let joke;
    let userVote;
    let dtoOut;
    let averageRating = 0;
    let identity = session.getIdentity();
    let uuObject = {};

    try {
      //HDS 2
      joke = await JokeModel.dao.get(awid, dtoIn.id);
    } catch (e) {
      //A3
      if (e instanceof ObjectStoreError) {
        throw new Errors.AddJokeRating.JokeDaoGetFailed({ uuAppErrorMap }, e);
      }
    }

    //A4
    if (!joke.hasOwnProperty("id")) {
      throw new Errors.AddJokeRating.JokeDoesNotExist({ uuAppErrorMap }, { jokeId: dtoIn.id });
    }

    uuObject.awid = awid;
    uuObject.jokeId = dtoIn.id;
    uuObject.rating = dtoIn.rating;
    uuObject.uuIdentity = identity.getUUIdentity();

    try {
      // HDS 3
      userVote = await this.dao.getByJokeAndIdentity(awid, dtoIn.id, uuIdentity);
    } catch (e) {
      // A5
      if (e instanceof ObjectStoreError) {
        throw new Errors.AddJokeRating.JokeRatingDaoGetByJokeAndIdentityFailed({ uuAppErrorMap }, e);
      }
    }

    if (userVote && userVote.hasOwnProperty("id")) {
      try {
        // HDS 3.1
        userVote.rating = dtoIn.rating;
        dtoOut = await this.dao.update(userVote);
      } catch (e) {
        // A6
        if (e instanceof ObjectStoreError) {
          throw new Errors.AddJokeRating.JokeRatingDaoUpdateFailed({ uuAppErrorMap }, e);
        }
      }
    } else {
      try {
        // HDS 3.2
        dtoOut = await this.dao.create(uuObject);
      } catch (e) {
        // A7
        if (e instanceof ObjectStoreError) {
          throw new Errors.AddJokeRating.JokeRatingDaoCreateFailed({ uuAppErrorMap }, e);
        }
      }
    }

    // HDS 4

    dtoOut.uuAppErrorMap = uuAppErrorMap;

    return dtoOut;
  }
}

module.exports = new JokeRatingModel();

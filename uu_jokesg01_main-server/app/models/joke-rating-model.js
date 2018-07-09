"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
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
    let oldRating;
    let dtoOut;
    let averageRating;
    let identity = session.getIdentity();

    try {
      //HDS 2
      joke = await JokeModel.dao.get(awid, dtoIn.id);
    } catch (e) {
      //A3
      if (e instanceof ObjectStoreError) {
        throw new Errors.AddJokeRating.JokeDaoGetFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    //A4
    if (!joke) {
      throw new Errors.AddJokeRating.JokeDoesNotExist({ uuAppErrorMap }, { jokeId: dtoIn.id });
    }

    let rating = {
      awid: awid,
      jokeId: dtoIn.id,
      rating: dtoIn.rating,
      uuIdentity: identity.getUUIdentity()
    };

    try {
      // HDS 3
      oldRating = await this.dao.getByJokeAndIdentity(rating.awid, rating.jokeId, rating.uuIdentity);
    } catch (e) {
      // A5
      if (e instanceof ObjectStoreError) {
        throw new Errors.AddJokeRating.JokeRatingDaoGetByJokeAndIdentityFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    if (oldRating) {
      try {
        // HDS 4.2
        averageRating = (joke.averageRating * joke.ratingCount - oldRating.rating + rating.rating) / joke.ratingCount;

        // HDS 3.1
        oldRating.rating = rating.rating;
        dtoOut = await this.dao.update(oldRating);
      } catch (e) {
        // A6
        if (e instanceof ObjectStoreError) {
          throw new Errors.AddJokeRating.JokeRatingDaoUpdateFailed({ uuAppErrorMap }, e);
        }
        throw e;
      }
    } else {
      try {
        // HDS 3.2
        dtoOut = await this.dao.create(rating);
        // HDS 4.1
        averageRating = (joke.averageRating * joke.ratingCount + rating.rating) / (joke.ratingCount + 1);
        // HDS 5
        joke.ratingCount += 1;
      } catch (e) {
        // A7
        if (e instanceof ObjectStoreError) {
          throw new Errors.AddJokeRating.JokeRatingDaoCreateFailed({ uuAppErrorMap }, e);
        }
        throw e;
      }
    }

    // HDS 6
    try {
      joke.averageRating = averageRating;
      await JokeModel.dao.update(joke);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        // A8
        throw new Errors.AddJokeRating.JokeDaoUpdateFailed.new({ uuAppErrorMap }, e);
      }
      throw e;
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;

    // HDS 7
    return dtoOut;
  }
}

module.exports = new JokeRatingModel();

"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").Workspace;
const Session = require("uu_appg01_server").Authentication.Session;

const Path = require("path");
const { addJokeRating } = require("../errors/joke-rating-error.js").Errors;

class JokeRatingModel {
  constructor() {
    this.validator = new Validator(
      Path.join(__dirname, "..", "validation_types", "joke-rating-types.js")
    );
    this.dao = DaoFactory.getDao("jokeRating");
    this.dao.createSchema();
  }

  async create(awid, dtoIn, uuIdentity) {
    let validationResult = this.validator.validate(
      "addJokeRatingDtoInType",
      dtoIn
    );
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      {},
      `uu-jokesg01-main/${addJokeRating.code}/unsupportedKey`,
      addJokeRating.invalidDtoIn
    );
    let joke;
    let userVote;
    let dtoOut = {
      uuAppErrorMap: uuAppErrorMap
    };
    let uuObject = Object.create(dtoIn);
    let averageRating = 0;

    try {
      const JokeModel = require("./joke-model");
      joke = await JokeModel.dao.get(awid, dtoIn.id);
    } catch (e) {
      throw new addJokeRating.jokeDaoGetFailed({ uuAppErrorMap }, null, e);
    }

    if (!joke) {
      throw new addJokeRating.jokeDoesNotExist({ uuAppErrorMap }, null, {
        jokeId: dtoIn.id
      });
    }

    try {
      userVote = this.dao.getByJokeAndIdentity(awid, dtoIn.id, uuIdentity);
    } catch (e) {
      throw new addJokeRating.jokeRatingDaoGetByJokeAndIdentityFailed(
        { uuAppErrorMap },
        null,
        {
          cause: e
        }
      );
    }

    uuObject.awid = awid;
    uuObject.uuIdentity = uuIdentity;

    if (userVote) {
      try {
        averageRating =
          (userVote.rating * 1 + uuObject.rating) / (userVote.rating + 1);
        dtoOut.item = this.dao.create(uuObject);
      } catch (e) {
        throw new addJokeRating.jokeRatingDaoCreateFailed(
          { uuAppErrorMap },
          null,
          {
            cause: e
          }
        );
      }
    } else {
      try {
        averageRating = 666;
        dtoOut.item = this.dao.update(uuObject);
      } catch (e) {
        throw new addJokeRating.jokeRatingDaoUpdateFailed(
          { uuAppErrorMap },
          null,
          {
            cause: e
          }
        );
      }
    }

    return dtoOut;
  }
}

module.exports = new JokeRatingModel();

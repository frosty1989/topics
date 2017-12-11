"use strict";
const {Validator} = require("uu_appg01_server").Validation;
const {DaoFactory} = require("uu_appg01_server").ObjectStore;
const {ValidationHelper} = require("uu_appg01_server").Workspace;

const Path = require("path");
const BookError = require("../errors/book-error.js");

class JokeModel {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "validation_types", "joke-types.js"));
    this.dao = DaoFactory.getDao("joke");
    this.dao.createSchema();
  }

  async createJoke(awid, dtoIn) {
    let validationResult = this.validator.validate("createJokeDtoInType", dtoIn);
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    // ValidationHelper.processValidationResult(dtoIn, validationResult, uuAppErrorMap, "uu-demoappg01-main/createJoke/unsupportedKey", BookError.CreateBookInvalidDtoInError);

    dtoIn.awid = awid;
    let dtoOut;
    try {
      dtoOut = await this.dao.create(dtoIn);
    } catch (e) {
      // throw new BookError.CreateBookFailedError({uuAppErrorMap}, null, e);
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new JokeModel();

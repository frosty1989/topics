"use strict";
const {Validator} = require("uu_appg01_server").Validation;
const {LoggerFactory} = require("uu_appg01_server").Logging;
const {ValidationHelper} = require("uu_appg01_server").Workspace;

const logger = LoggerFactory.get("Models.EchoModel");
const Path = require("path");
const EchoError = require("../errors/echo-error.js");

class EchoModel {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "../validation_types/echo-types.js"));
  }

  async echo(awid, dtoIn) {
    logger.info("Processing Echo...");

    let validationResult = this.validator.validate("echoDtoInType", dtoIn);
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(dtoIn, validationResult, uuAppErrorMap, EchoError.EchoInvalidDtoInError);

    let dtoOut = {
      serverTime: new Date(),
      echoText: dtoIn.text,
      awid: awid,
      uuAppErrorMap
    };

    return dtoOut;
  }
}

module.exports = new EchoModel();

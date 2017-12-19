"use strict";
const { UseCaseError } = require("uu_appg01_server").AppServer;
const ERROR_PREFIX = "uu-jokesg01-main/";

let Errors = {
  JokesError: class JokesError extends UseCaseError {
    constructor(dtoOut, paramMap = {}, cause = null) {
      if (dtoOut instanceof Error) {
        cause = dtoOut;
        dtoOut = null;
        paramMap = {};
      }

      super({
        dtoOut: dtoOut,
        paramMap: paramMap,
        status: 400,
        cause: cause
      });

      let errParams = this.setParams();
      this.message = errParams.message;
      this.code = ERROR_PREFIX + errParams.code;
      errParams.status && (this.status = errParams.status);
    }
  }
};

module.exports = Errors;

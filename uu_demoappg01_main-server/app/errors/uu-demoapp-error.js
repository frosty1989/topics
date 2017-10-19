const {UseCaseError} = require("uu_appg01_server").AppServer;

const ERROR_PREFIX = "uu-demoappg01-main/";

class DemoAppError extends UseCaseError {
  constructor(dtoOut, paramMap = {}, cause = null) {
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

module.exports = DemoAppError;

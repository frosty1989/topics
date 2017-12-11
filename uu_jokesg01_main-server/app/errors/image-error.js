"use strict";
const DemoAppError = require("./uu-demoapp-error");

class CreateImageInvalidDtoInError extends DemoAppError {
  setParams() {
    return {
      code: "createImage/invalidDtoIn",
      message: "DtoIn is not valid."
    };
  }
}

class GetImageInvalidDtoInError extends DemoAppError {
  setParams() {
    return {
      code: "getImage/invalidDtoIn",
      message: "DtoIn is not valid."
    };
  }
}

class CreateImageFailedError extends DemoAppError {
  setParams() {
    return {
      code: "createImage/failed",
      message: "Create image failed.",
      status: 500
    };
  }
}

class GetImageFailedError extends DemoAppError {
  setParams() {
    return {
      code: "getImage/failed",
      message: "Get image failed.",
      status: 500
    };
  }
}

module.exports = {
  CreateImageInvalidDtoInError,
  CreateImageFailedError,
  GetImageInvalidDtoInError,
  GetImageFailedError
};

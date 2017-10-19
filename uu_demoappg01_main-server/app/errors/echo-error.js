const DemoAppError = require("./uu-demoapp-error.js");

const UC_NAME = "echo";

class EchoInvalidDtoInError extends DemoAppError {
  setParams() {
    return {
      code: UC_NAME + "/invalidDtoIn",
      message: "DtoIn is not valid."
    };
  }
}

module.exports = {
  EchoInvalidDtoInError,
};

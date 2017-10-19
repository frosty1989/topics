const DemoAppError = require("./uu-demoapp-error");

class CreateBookInvalidDtoInError extends DemoAppError {
  setParams() {
    return {
      code: "createBook/invalidDtoIn",
      message: "DtoIn is not valid."
    };
  }
}

class CreateBookFailedError extends DemoAppError {
  setParams() {
    return {
      code: "createBook/failed",
      message: "Create book failed.",
      status: 500
    };
  }
}

class GetBookInvalidDtoInError extends DemoAppError {
  setParams() {
    return {
      code: "getBook/invalidDtoIn",
      message: "DtoIn is not valid."
    };
  }
}

class GetBookFailedError extends DemoAppError {
  setParams() {
    return {
      code: "getBook/failed",
      message: "Get book failed.",
      status: 500
    };
  }
}

class ListBooksInvalidDtoInError extends DemoAppError {
  setParams() {
    return {
      code: "listBooks/invalidDtoIn",
      message: "DtoIn is not valid."
    };
  }
}

class ListBooksFailedError extends DemoAppError {
  setParams() {
    return {
      code: "listBooks/failed",
      message: "List books failed.",
      status: 500
    };
  }
}

class DeleteBookInvalidDtoInError extends DemoAppError {
  setParams() {
    return {
      code: "deleteBook/invalidDtoIn",
      message: "DtoIn is not valid."
    };
  }
}

class DeleteBookFailedError extends DemoAppError {
  setParams() {
    return {
      code: "deleteBook/failed",
      message: "Delete book failed.",
      status: 500
    };
  }
}
module.exports = {
  CreateBookInvalidDtoInError,
  CreateBookFailedError,
  GetBookInvalidDtoInError,
  GetBookFailedError,
  ListBooksInvalidDtoInError,
  ListBooksFailedError,
  DeleteBookInvalidDtoInError,
  DeleteBookFailedError
};

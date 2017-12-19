"use strict";
const Errors = require("./uu-jokes-error");

class CreateCategoryInvalidDtoInError extends Errors.JokesError {
  setParams() {
    return {
      code: "createCategory/invalidDtoIn",
      message: "DtoIn is not valid."
    };
  }
}

class CreateCategoryFailedError extends Errors.JokesError {
  setParams() {
    return {
      code: "createCategory/failed",
      message: "Create category failed.",
      status: 500
    };
  }
}

class ListCategoriesInvalidDtoInError extends Errors.JokesError {
  setParams() {
    return {
      code: "listCategories/invalidDtoIn",
      message: "DtoIn is not valid."
    };
  }
}

class ListCategoriesFailedError extends Errors.JokesError {
  setParams() {
    return {
      code: "listCategories/failed",
      message: "List category failed.",
      status: 500
    };
  }
}

class DeleteCategoryInvalidDtoInError extends Errors.JokesError {
  setParams() {
    return {
      code: "deleteCategory/invalidDtoIn",
      message: "DtoIn is not valid."
    };
  }
}

class DeleteCategoryFailedError extends Errors.JokesError {
  setParams() {
    return {
      code: "deleteCategory/failed",
      message: "Delete category failed.",
      status: 500
    };
  }
}

class UpdateCategoryInvalidDtoInError extends Errors.JokesError {
  setParams() {
    return {
      code: "updateCategory/invalidDtoIn",
      message: "DtoIn is not valid."
    };
  }
}

class UpdateCategoryFailedError extends Errors.JokesError {
  setParams() {
    return {
      code: "updateCategory/failed",
      message: "Update category failed.",
      status: 500
    };
  }
}
module.exports = {
  CreateCategoryInvalidDtoInError,
  CreateCategoryFailedError,
  DeleteCategoryInvalidDtoInError,
  DeleteCategoryFailedError,
  UpdateCategoryFailedError,
  UpdateCategoryInvalidDtoInError,
  ListCategoriesInvalidDtoInError,
  ListCategoriesFailedError
};

"use strict";
const DemoAppError = require("./uu-jokes-error");

class CreateCategoryInvalidDtoInError extends DemoAppError {
  setParams() {
    return {
      code: "createCategory/invalidDtoIn",
      message: "DtoIn is not valid."
    };
  }
}

class CreateCategoryFailedError extends DemoAppError {
  setParams() {
    return {
      code: "createCategory/failed",
      message: "Create category failed.",
      status: 500
    };
  }
}

class ListCategoriesInvalidDtoInError extends DemoAppError {
  setParams() {
    return {
      code: "listCategories/invalidDtoIn",
      message: "DtoIn is not valid."
    };
  }
}

class ListCategoriesFailedError extends DemoAppError {
  setParams() {
    return {
      code: "listCategories/failed",
      message: "List category failed.",
      status: 500
    };
  }
}

class DeleteCategoryInvalidDtoInError extends DemoAppError {
  setParams() {
    return {
      code: "deleteCategory/invalidDtoIn",
      message: "DtoIn is not valid."
    };
  }
}

class DeleteCategoryFailedError extends DemoAppError {
  setParams() {
    return {
      code: "deleteCategory/failed",
      message: "Delete category failed.",
      status: 500
    };
  }
}

class UpdateCategoryInvalidDtoInError extends DemoAppError {
  setParams() {
    return {
      code: "updateCategory/invalidDtoIn",
      message: "DtoIn is not valid."
    };
  }
}

class UpdateCategoryFailedError extends DemoAppError {
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

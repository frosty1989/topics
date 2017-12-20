"use strict";
const Errors = require("./uu-jokes-error");

let createCategory = {
  Code: "createCategory",
  InvalidDtoInError: class CreateCategoryInvalidDtoInError extends Errors.JokesError {
    setParams() {
      return {
        code: `${createCategory.Code}/invalidDtoIn`,
        message: "DtoIn is not valid."
      };
    }
  },

  FailedError: class CreateCategoryFailedError extends Errors.JokesError {
    setParams() {
      return {
        code: `${createCategory.Code}/failed`,
        message: "Create category failed.",
        status: 500
      };
    }
  }
};

let listCategories = {
  Code: "listCategories",
  InvalidDtoInError: class ListCategoriesInvalidDtoInError extends Errors.JokesError {
    setParams() {
      return {
        code: `${listCategories.Code}/invalidDtoIn`,
        message: "DtoIn is not valid."
      };
    }
  },

  FailedError: class ListCategoriesFailedError extends Errors.JokesError {
    setParams() {
      return {
        code: `${listCategories.Code}/failed`,
        message: "List category failed.",
        status: 500
      };
    }
  }
};

let deleteCategory = {
  Code: "deleteCategory",
  InvalidDtoInError: class DeleteCategoryInvalidDtoInError extends Errors.JokesError {
    setParams() {
      return {
        code: `${deleteCategory.Code}/invalidDtoIn`,
        message: "DtoIn is not valid."
      };
    }
  },

  FailedError: class DeleteCategoryFailedError extends Errors.JokesError {
    setParams() {
      return {
        code: `${deleteCategory.Code}/jokeCategoryDaoListByCategoryFailed`,
        message: "Delete category failed.",
        status: 500
      };
    }
  },

  relatedJokesExist: class RelatedJokesExists extends Errors.JokesError {
    setParams() {
      return {
        code: `${deleteCategory.Code}/relatedJokesExist`,
        message: "Category is not empty.",
        status: 500
      };
    }
  }
};

let updateCategory = {
  Code: "updateCategory",
  InvalidDtoInError: class UpdateCategoryInvalidDtoInError extends Errors.JokesError {
    setParams() {
      return {
        code: `${updateCategory.Code}/invalidDtoIn`,
        message: "DtoIn is not valid."
      };
    }
  },

  FailedError: class UpdateCategoryFailedError extends Errors.JokesError {
    setParams() {
      return {
        code: `${updateCategory.Code}/failed`,
        message: "Update category failed.",
        status: 500
      };
    }
  }
};

Errors.createCategory = createCategory;
Errors.listCategories = listCategories;
Errors.deleteCategory = deleteCategory;
Errors.updateCategory = updateCategory;

module.exports = { Errors };

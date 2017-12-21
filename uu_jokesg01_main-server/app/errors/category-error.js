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

  categoryNameNotUnique: class CategoryNameNotUnique extends Errors.JokesError {
    setParams() {
      return {
        code: `${createCategory.Code}/categoryNameNotUnique`,
        message: "Category name is not unique in awid.",
        status: 500
      };
    }
  },

  categoryDaoCreateFailed: class CategoryDaoCreateFailed extends Errors.JokesError {
    setParams() {
      return {
        code: `${createCategory.Code}/categoryDaoCreateFailed`,
        message: "Create category by category Dao create failed.",
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

  categoryDaoListFailed: class CategoryDaoListFailed extends Errors.JokesError {
    setParams() {
      return {
        code: `${listCategories.Code}/categoryDaoListFailed`,
        message: "List categories by category Dao list failed.",
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

  jokeCategoryDaoListByCategoryFailed: class JokeCategoryDaoListByCategoryFailed extends Errors.JokesError {
    setParams() {
      return {
        code: `${deleteCategory.Code}/jokeCategoryDaoListByCategoryFailed`,
        message: "List jokeCategory by Dao listByCategory failed.",
        status: 500
      };
    }
  },

  relatedJokesExist: class RelatedJokesExist extends Errors.JokesError {
    setParams() {
      return {
        code: `${deleteCategory.Code}/relatedJokesExist`,
        message: "Category is not empty.",
        status: 500
      };
    }
  },

  jokeCategoryDaoDeleteByCategoryFailed: class JokeCategoryDaoDeleteByCategoryFailed extends Errors.JokesError {
    setParams() {
      return {
        code: `${deleteCategory.Code}/jokeCategoryDaoDeleteByCategoryFailed`,
        message: "Delete jokeCategory by Dao deleteByCategory failed.",
        status: 500
      };
    }
  },

  categoryDaoDeleteFailed: class CategoryDaoDeleteFailed extends Errors.JokesError {
    setParams() {
      return {
        code: `${deleteCategory.Code}/categoryDaoDeleteFailed`,
        message: "Delete category by Dao delete failed.",
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

  categoryNameNotUnique: class CategoryNameNotUnique extends Errors.JokesError {
    setParams() {
      return {
        code: `${updateCategory.Code}/categoryNameNotUnique`,
        message: "Category name is not unique in awid.",
        status: 500
      };
    }
  },

  categoryDaoUpdateFailed: class CategoryDaoUpdateFailed extends Errors.JokesError {
    setParams() {
      return {
        code: `${updateCategory.Code}/categoryDaoUpdateFailed`,
        message: "Update category by category Dao update failed.",
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

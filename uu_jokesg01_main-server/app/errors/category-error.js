"use strict";
const { jokesError } = require("./uu-jokes-error");

let createCategory = {
  code: "createCategory",

  invalidDtoInError: class invalidDtoInError extends jokesError {
    setParams() {
      return {
        code: `${createCategory.code}/invalidDtoIn`,
        message: "DtoIn is not valid."
      };
    }
  },

  categoryNameNotUnique: class categoryNameNotUnique extends jokesError {
    setParams() {
      return {
        code: `${createCategory.code}/categoryNameNotUnique`,
        message: "Category name is not unique in awid.",
        status: 500
      };
    }
  },

  categoryDaoCreateFailed: class categoryDaoCreateFailed extends jokesError {
    setParams() {
      return {
        code: `${createCategory.code}/categoryDaoCreateFailed`,
        message: "Create category by category Dao create failed.",
        status: 500
      };
    }
  }
};

let listCategories = {
  code: "listCategories",
  invalidDtoInError: class ListCategoriesInvalidDtoInError extends jokesError {
    setParams() {
      return {
        code: `${listCategories.code}/invalidDtoIn`,
        message: "DtoIn is not valid."
      };
    }
  },

  categoryDaoListFailed: class CategoryDaoListFailed extends jokesError {
    setParams() {
      return {
        code: `${listCategories.code}/categoryDaoListFailed`,
        message: "List categories by category Dao list failed.",
        status: 500
      };
    }
  }
};

let deleteCategory = {
  code: "deleteCategory",
  invalidDtoInError: class DeleteCategoryInvalidDtoInError extends jokesError {
    setParams() {
      return {
        code: `${deleteCategory.code}/invalidDtoIn`,
        message: "DtoIn is not valid."
      };
    }
  },

  jokeCategoryDaoListByCategoryFailed: class JokeCategoryDaoListByCategoryFailed extends jokesError {
    setParams() {
      return {
        code: `${deleteCategory.code}/jokeCategoryDaoListByCategoryFailed`,
        message: "List jokeCategory by Dao listByCategory failed.",
        status: 500
      };
    }
  },

  relatedJokesExist: class RelatedJokesExist extends jokesError {
    setParams() {
      return {
        code: `${deleteCategory.code}/relatedJokesExist`,
        message: "Category is not empty.",
        status: 500
      };
    }
  },

  jokeCategoryDaoDeleteByCategoryFailed: class JokeCategoryDaoDeleteByCategoryFailed extends jokesError {
    setParams() {
      return {
        code: `${deleteCategory.code}/jokeCategoryDaoDeleteByCategoryFailed`,
        message: "Delete jokeCategory by Dao deleteByCategory failed.",
        status: 500
      };
    }
  },

  categoryDaoDeleteFailed: class CategoryDaoDeleteFailed extends jokesError {
    setParams() {
      return {
        code: `${deleteCategory.code}/categoryDaoDeleteFailed`,
        message: "Delete category by Dao delete failed.",
        status: 500
      };
    }
  }
};

let updateCategory = {
  code: "updateCategory",
  invalidDtoInError: class UpdateCategoryInvalidDtoInError extends jokesError {
    setParams() {
      return {
        code: `${updateCategory.code}/invalidDtoIn`,
        message: "DtoIn is not valid."
      };
    }
  },

  categoryNameNotUnique: class CategoryNameNotUnique extends jokesError {
    setParams() {
      return {
        code: `${updateCategory.code}/categoryNameNotUnique`,
        message: "Category name is not unique in awid.",
        status: 500
      };
    }
  },

  categoryDaoUpdateFailed: class CategoryDaoUpdateFailed extends jokesError {
    setParams() {
      return {
        code: `${updateCategory.code}/categoryDaoUpdateFailed`,
        message: "Update category by category Dao update failed.",
        status: 500
      };
    }
  }
};

module.exports = {
  createCategory,
  listCategories,
  deleteCategory,
  updateCategory
};

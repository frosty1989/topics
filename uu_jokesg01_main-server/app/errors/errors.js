"use strict";

const { issuePrefix, jokesError } = require("./uu-jokes-error");
const {
  createCategory,
  listCategories,
  deleteCategory,
  updateCategory
} = require("./category-error");

module.exports = {
  prefix: issuePrefix,
  generalError: jokesError,
  createCategoryError: createCategory,
  listCategoriesError: listCategories,
  deleteCategoryError: deleteCategory,
  updateCategoryError: updateCategory
};

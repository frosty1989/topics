"use strict";

const CategoryModel = require("../models/category-model.js");

class CategoryController {
  createCategory(ucEnv) {
    return CategoryModel.createCategory(ucEnv.uri.getAwid(), ucEnv.parameters);
  }

  listCategories(ucEnv) {
    return CategoryModel.listCategories(ucEnv.uri.getAwid(), ucEnv.parameters);
  }

  updateCategory(ucEnv) {
    return CategoryModel.updateCategory(ucEnv.uri.getAwid(), ucEnv.parameters);
  }

  deleteCategory(ucEnv) {
    return CategoryModel.deleteCategory(ucEnv.uri.getAwid(), ucEnv.parameters);
  }
}

module.exports = new CategoryController();

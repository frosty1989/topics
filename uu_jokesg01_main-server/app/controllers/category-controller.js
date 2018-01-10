"use strict";

const CategoryModel = require("../models/category-model.js");

class CategoryController {
  createCategory(ucEnv) {
    return CategoryModel.createCategory(ucEnv.uri.awid, ucEnv.parameters);
  }

  listCategories(ucEnv) {
    return CategoryModel.listCategories(ucEnv.uri.awid, ucEnv.parameters);
  }

  updateCategory(ucEnv) {
    return CategoryModel.updateCategory(ucEnv.uri.awid, ucEnv.parameters);
  }

  deleteCategory(ucEnv) {
    return CategoryModel.deleteCategory(ucEnv.uri.awid, ucEnv.parameters);
  }
}

module.exports = new CategoryController();

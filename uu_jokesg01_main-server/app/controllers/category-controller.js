"use strict";

const CategoryModel = require("../models/category-model.js");

class CategoryController {

  create(ucEnv) {
    return CategoryModel.createCategory(ucEnv.uri.awid, ucEnv.parameters);
  }

  list(ucEnv) {
    return CategoryModel.listCategories(ucEnv.uri.awid, ucEnv.parameters);
  }

  update(ucEnv) {
    return CategoryModel.updateCategory(ucEnv.uri.awid, ucEnv.parameters);
  }

  delete(ucEnv) {
    return CategoryModel.deleteCategory(ucEnv.uri.awid, ucEnv.parameters);
  }

}

module.exports = new CategoryController();

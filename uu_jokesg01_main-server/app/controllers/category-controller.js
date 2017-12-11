"use strict";

const CategoryModel = require("../models/app-model.js");

class CategoryController {

  create(ucEnv) {
    return CategoryModel.create(ucEnv.uri.awid, ucEnv.parameters);
  }

  list(ucEnv) {
    return CategoryModel.list(ucEnv.uri.awid, ucEnv.parameters);
  }

  update(ucEnv) {
    return CategoryModel.update(ucEnv.uri.awid, ucEnv.parameters);
  }

  delete(ucEnv) {
    return CategoryModel.delete(ucEnv.uri.awid, ucEnv.parameters);
  }

}

module.exports = new CategoryController();

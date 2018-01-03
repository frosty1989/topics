"use strict";

const { DaoFactory } = require("uu_appg01_server").ObjectStore;

class AppModel {
  async init() {
    let schemas = ["joke", "jokeRating", "category", "jokeCategory"];

    schemas.forEach(schema => {
      DaoFactory.getDao(schema).createSchema();
    });
  }
}

module.exports = new AppModel();

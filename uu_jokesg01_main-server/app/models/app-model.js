"use strict";
const {Validator} = require("uu_appg01_server").Validation;
const {DaoFactory} = require("uu_appg01_server").ObjectStore;
const {ValidationHelper} = require("uu_appg01_server").Workspace;

const Path = require("path");

class AppModel {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "validation_types", "joke-types.js"));
  }

  async init(awid, dtoIn) {
    let schemas = ["joke", "jokeRating", "category", "jokeCategory"];

    schemas.forEach(schema => {
      DaoFactory.getDao(schema).createSchema();
    });
  }
}

module.exports = new AppModel();

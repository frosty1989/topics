"use strict";

const JokeRatingModel = require("../models/joke-rating-model.js");

class JokeRatingController {
  create(ucEnv) {
    return JokeRatingModel.create(
      ucEnv.uri.awid,
      ucEnv.parameters,
      ucEnv.session._identity._uuIdentity
    );
  }
}

module.exports = new JokeRatingController();

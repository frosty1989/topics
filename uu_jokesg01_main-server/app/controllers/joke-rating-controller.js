"use strict";

const JokeRatingModel = require("../models/joke-rating-model.js");

class JokeRatingController {

  create(ucEnv) {
    return JokeRatingModel.create(ucEnv.uri.awid, ucEnv.parameters);
  }

}

module.exports = new JokeRatingController();

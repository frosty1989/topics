"use strict";

const JokeRatingModel = require("../models/joke-rating-model.js");

class JokeRatingController {
  addJokeRating(ucEnv) {
    return JokeRatingModel.addJokeRating(ucEnv.uri.getAwid(), ucEnv.parameters, ucEnv.session);
  }
}

module.exports = new JokeRatingController();

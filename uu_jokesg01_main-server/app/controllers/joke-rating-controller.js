"use strict";

const JokeRatingModel = require("../models/joke-rating-model.js");

class JokeRatingController {

  addJokeRating(ucEnv) {
    return JokeRatingModel.addJokeRating(ucEnv.uri.awid, ucEnv.parameters);
  }

}

module.exports = new JokeRatingController();

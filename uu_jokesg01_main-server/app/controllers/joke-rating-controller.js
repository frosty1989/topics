"use strict";

const JokeRatingModel = require("../models/joke-rating-model.js");

class JokeRatingController {
  create(ucEnv) {
    let identity = ucEnv.session.getIdentity();
    let uuIdentity = identity.getUUIdentity();

    return JokeRatingModel.create(ucEnv.uri.awid, ucEnv.parameters, uuIdentity);
  }
}

module.exports = new JokeRatingController();

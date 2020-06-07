"use strict";

const TopicAbl = require("../../abl/topic-abl.js");

class TopicController {
  static create(ucEnv) {
    return TopicAbl.create(ucEnv.uri.getAwid(), ucEnv.parameters);
  }

  static get(ucEnv) {
    return TopicAbl.get(ucEnv.uri.getAwid(), ucEnv.parameters, ucEnv.getAuthorizationResult());
  }

  static update(ucEnv) {
    return TopicAbl.update(ucEnv.uri.getAwid(), ucEnv.parameters);
  }

  static delete(ucEnv) {
    return TopicAbl.delete(ucEnv.uri.getAwid(), ucEnv.parameters);
  }

  static list(ucEnv) {
    return TopicAbl.list(ucEnv.uri.getAwid(), ucEnv.parameters, ucEnv.getAuthorizationResult());
  }
}

module.exports = TopicController;

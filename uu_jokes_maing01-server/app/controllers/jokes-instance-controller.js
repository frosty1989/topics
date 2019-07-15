"use strict";

const JokesInstanceModel = require("../models/jokes-instance-model.js");

class JokesInstanceController {
  static init(ucEnv) {
    return JokesInstanceModel.init(ucEnv.uri.getAwid(), ucEnv.parameters);
  }

  static load(ucEnv) {
    return JokesInstanceModel.load(ucEnv.uri.getAwid(), ucEnv.getAuthorizationResult());
  }

  static update(ucEnv) {
    return JokesInstanceModel.update(ucEnv.uri.getAwid(), ucEnv.parameters);
  }

  static setLogo(ucEnv) {
    return JokesInstanceModel.setLogo(ucEnv.uri.getAwid(), ucEnv.parameters);
  }

  static getProductInfo(ucEnv){
    return JokesInstanceModel.getProductInfo(ucEnv.uri.getAwid());
  }

  static async getProductLogo(ucEnv){
    let dtoOut = await JokesInstanceModel.getProductLogo(ucEnv.getUri().getAwid(), ucEnv.parameters);
    return ucEnv.setBinaryDtoOut(dtoOut);
  }

  static async getUveMetaData(ucEnv){
    let dtoOut = await JokesInstanceModel.getUveMetaData(ucEnv.getUri().getAwid(), ucEnv.parameters);
    return ucEnv.setBinaryDtoOut(dtoOut);
  }

  static async getIndex(ucEnv){
    return JokesInstanceModel.getIndex(ucEnv.uri.getAwid(), ucEnv.getUri());
  }
}

module.exports = JokesInstanceController;

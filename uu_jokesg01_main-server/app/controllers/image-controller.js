"use strict";
const ImageModel = require("../models/image-model.js");

class ImageController {
  createImage(ucEnv) {
    return ImageModel.createImage(ucEnv.uri.awid, ucEnv.parameters);
  }

  getImage(ucEnv) {
    return ImageModel.getImage(ucEnv.uri.awid, ucEnv.parameters, ucEnv.response);
  }
}

module.exports = new ImageController();

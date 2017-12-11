"use strict";
const {Validator} = require("uu_appg01_server").Validation;
const {DaoFactory} = require("uu_appg01_server").ObjectStore;
const {ValidationHelper} = require("uu_appg01_server").Workspace;

const Path = require("path");
const ImageError = require("../errors/image-error.js");

class ImageModel {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "validation_types", "image-types.js"));
    this.dao = DaoFactory.getDao("image");
    this.dao.createSchema();
  }

  async createImage(awid, dtoIn) {
    let validationResult = this.validator.validate("createImageDtoInType", dtoIn);
    let uuAppErrorMap = validationResult.getValidationErrorMap();
    ValidationHelper.processValidationResult(dtoIn, validationResult, uuAppErrorMap,
      "uu-demoappg01-main/createImage/unsupportedKey", ImageError.CreateImageInvalidDtoInError);

    let data = dtoIn["data"];

    let image = {
      awid: awid
    };
    image["name"] = dtoIn["name"]
      ? dtoIn["name"]
      : "DefaultImageName";
    if (dtoIn["code"]) {
      image["code"] = dtoIn["code"];
    }
    if (dtoIn["description"]) {
      image["description"] = dtoIn["description"];
    }

    try {
      return await this.dao.create(image, data);
    } catch (e) {
      throw new ImageError.CreateImageFailedError({uuAppErrorMap}, null, e);
    }
  }

  async getImage(awid, dtoIn, response) {
    let validationResult = this.validator.validate("getImageDtoInType", dtoIn);
    let uuAppErrorMap = validationResult.getValidationErrorMap();
    ValidationHelper.processValidationResult(dtoIn, validationResult, uuAppErrorMap,
      "uu-demoappg01-main/getImage/unsupportedKey", ImageError.GetImageInvalidDtoInError);

    let contentDisposition;
    if (dtoIn["contentDisposition"] === "inline") {
      contentDisposition = "inline";
    } else {
      contentDisposition = "attachment";
    }

    try {
      await this.dao.getDataByCode(awid, dtoIn["code"], response, contentDisposition);
    } catch (e) {
      throw new ImageError.GetImageFailedError({uuAppErrorMap}, null, e);
    }
  }
}

module.exports = new ImageModel();

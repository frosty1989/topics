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

    let contentType, filename;
    [contentType, filename] = this._getContentType(data, dtoIn);
    if (contentType) {
      image["contentType"] = contentType;
    }
    if (filename) {
      image["filename"] = filename;
    }

    try {
      return await this.dao.create(image, data);
    } catch (e) {
      throw new ImageError.CreateImageFailedError(e);
    }
  }

  async getImage(awid, dtoIn, response) {
    let validationResult = this.validator.validate("getImageDtoInType", dtoIn);
    let uuAppErrorMap = validationResult.getValidationErrorMap();
    ValidationHelper.processValidationResult(dtoIn, validationResult, uuAppErrorMap, "uu-demoappg01-main/getImage/unsupportedKey", ImageError.GetImageInvalidDtoInError);

    if (!dtoIn["contentDisposition"]) {
      dtoIn["contentDisposition"] = "attachment";
    }

    try {
      await this.dao.getDataByCode(awid, dtoIn["code"], response);
    } catch (e) {
      throw new ImageError.GetImageFailedError(e);
    }
  }

  _getContentType(data, dtoIn) {
    let contentType,
      filename;
    if (dtoIn["contentType"]) {
      contentType = dtoIn["contentType"];
    }
    if (dtoIn["filename"]) {
      filename = dtoIn["filename"];
    }

    if (data.read) {
      return [
        contentType || (data.mediaType && data.mediaType),
        filename || (data.name && data.name)
      ];
    } else if (typeof data === "string") {
      return [
        contentType || "plain/text",
        filename || null
      ];
    } else {
      return [null, null];
    }
  }
}

module.exports = new ImageModel();

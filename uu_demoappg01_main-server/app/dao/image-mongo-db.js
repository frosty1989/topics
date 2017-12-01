"use strict";
const {UuBinaryDao} = require("uu_appg01_binarystore");

class ImageMongoDB extends UuBinaryDao {
  createSchema() {
    super.createIndex({awid: 1, _id: 1}, {unique: true});
    super.createIndex({awid: 1, code: 1, "sys.cts": -1}, {unique: true});
  }

  create(uuBinary, data) {
    return super.insertFromStream(uuBinary, data);
  }

  getDataByCode(awid, code, res, contentDisposition) {
    return super.openDownloadStream({
      awid: awid,
      code: code
    }, res, contentDisposition);
  }
}

module.exports = ImageMongoDB;

"use strict";
const base64url = require("base64url");
const fileType = require("file-type");

const IMAGE_MIME_TYPE_PREFIX = "image/";

class FileHelper {
  getBufferFromBase64UrlImage(imageBase64Url) {
    return base64url.toBuffer(imageBase64Url);
  }

  validateImageBuffer(buffer) {
    let result = fileType(buffer);
    if (result && result.mime.includes(IMAGE_MIME_TYPE_PREFIX)) return { valid: true, buffer: buffer };
    else return { valid: false, buffer: buffer };
  }

  async validateImageStream(stream) {
    if ((stream.contentType && stream.contentType.includes(IMAGE_MIME_TYPE_PREFIX)) || !stream.contentType) {
      let result = await fileType.stream(stream);
      if (result && result.fileType && result.fileType.mime.includes(IMAGE_MIME_TYPE_PREFIX))
        return { valid: true, stream: result };
      else return { valid: false, stream: result };
    } else return { valid: false, stream: stream };
  }

  toStream(buffer) {
    const { Readable } = require("stream");
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
  }
}

module.exports = new FileHelper();

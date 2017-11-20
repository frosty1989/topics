"use strict";
const {Validator} = require("uu_appg01_server").Validation;
const {DaoFactory} = require("uu_appg01_server").ObjectStore;
const {ValidationHelper} = require("uu_appg01_server").Workspace;

const Path = require("path");
const BookError = require("../errors/book-error.js");

class BookModel {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "validation_types", "book-types.js"));
    this.dao = DaoFactory.getDao("book");
    this.dao.createSchema();
  }

  async createBook(awid, dtoIn) {
    let validationResult = this.validator.validate("createBookDtoInType", dtoIn);
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(dtoIn, validationResult, uuAppErrorMap, "uu-demoappg01-main/createBook/unsupportedKey", BookError.CreateBookInvalidDtoInError);

    dtoIn.awid = awid;
    let dtoOut;
    try {
      dtoOut = await this.dao.create(dtoIn);
    } catch (e) {
      throw new BookError.CreateBookFailedError({
        uuAppErrorMap
      }, null, e);
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async getBook(awid, dtoIn) {
    let validationResult = this.validator.validate("getBookDtoInType", dtoIn);
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(dtoIn, validationResult, uuAppErrorMap, "uu-demoappg01-main/getBook/unsupportedKey", BookError.GetBookInvalidDtoInError);

    let dtoOut;
    try {
      dtoOut = await this.dao.get(awid, dtoIn.id);
    } catch (e) {
      throw new BookError.GetBookFailedError({
        uuAppErrorMap
      }, null, e);
    }
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async listBooks(awid, dtoIn) {
    let validationResult = this.validator.validate("listBooksDtoInType", dtoIn);
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(dtoIn, validationResult, uuAppErrorMap, "uu-demoappg01-main/listBooks/unsupportedKey", BookError.ListBooksInvalidDtoInError);

    dtoIn.pageInfo = dtoIn.pageInfo || {
      pageIndex: 0,
      pageSize: 100
    };
    dtoIn.pageInfo.pageSize = dtoIn.pageInfo.pageSize || 100;
    let sort = (dtoIn.sortBy === "author"
      ? "author"
      : "name");
    let order = (dtoIn.order === "desc"
      ? -1
      : 1);

    let dtoOut;
    try {
      dtoOut = await this.dao.list(awid, dtoIn.pageInfo, {[sort]: order});
    } catch (e) {
      throw new BookError.ListBooksFailedError({
        uuAppErrorMap
      }, null, e);
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async deleteBook(awid, dtoIn) {
    let validationResult = this.validator.validate("deleteBookDtoInType", dtoIn);
    let uuAppErrorMap = validationResult.getValidationErrorMap();

    ValidationHelper.processValidationResult(dtoIn, validationResult, uuAppErrorMap, "uu-demoappg01-main/deleteBook/unsupportedKey", BookError.DeleteBookInvalidDtoInError);

    let dtoOut;
    try {
      let dtoOut = await this.dao.remove(awid, dtoIn.id);
    } catch (e) {
      throw new BookError.DeleteBookFailedError({
        uuAppErrorMap
      }, null, e);
    }

    dtoOut = dtoOut || {};
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new BookModel();

"use strict";
const BookModel = require("../models/book-model.js");

class BookController {
  createBook(ucEnv) {
    return BookModel.createBook(ucEnv.uri.awid, ucEnv.parameters);
  }

  getBook(ucEnv) {
    return BookModel.getBook(ucEnv.uri.awid, ucEnv.parameters);
  }

  listBooks(ucEnv) {
    return BookModel.listBooks(ucEnv.uri.awid, ucEnv.parameters);
  }

  deleteBook(ucEnv) {
    return BookModel.deleteBook(ucEnv.uri.awid, ucEnv.parameters);
  }
}

module.exports = new BookController();

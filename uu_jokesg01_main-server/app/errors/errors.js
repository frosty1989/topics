"use strict";

const { issuePrefix, jokesError } = require("./uu-jokes-error");
const {
  createCategory,
  listCategories,
  deleteCategory,
  updateCategory
} = require("./category-error");
const {
  addJokeCategory,
  removeJokeCategory
} = require("./joke-category-error");
const {
  createJoke,
  getJoke,
  listJokes,
  deleteJoke,
  updateJoke,
  listCategoryJokes
} = require("./joke-error");
const { addJokeRating } = require("./joke-rating-error");

module.exports = {
  prefix: issuePrefix,
  generalError: jokesError,
  createCategory,
  listCategories,
  deleteCategory,
  updateCategory,
  addJokeCategory,
  removeJokeCategory,
  createJoke,
  getJoke,
  listJokes,
  deleteJoke,
  updateJoke,
  listCategoryJokes,
  addJokeRating
};

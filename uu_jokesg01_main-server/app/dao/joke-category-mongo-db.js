"use strict";
const {UuObjectDao} = require("uu_appg01_server").ObjectStore;

class CategoryMongoDB extends UuObjectDao {
  createSchema() {
    super.createIndex({
      awid: 1,
      _id: 1
    }, {
      unique: true
    });
    super.createIndex({
      awid: 1,
      categoryId: 1
    });
    super.createIndex({
      awid: 1,
      jokeId: 1
    });
    super.createIndex({
      awid: 1,
      jokeId: 1,
      categoryId: 1
    }, {
      unique: true
    })
  }

  create(uuObject) {
    return super.insertOne(uuObject);
  }

  getByJokeAndCategory(awid, jokeId, categoryId) {
    return super.findOne({ awid, jokeId, categoryId });
  }

  listByCategory(awid, cajegoryId) {
    return super.find({ awid, categoryId });
  }

  listByJoke(awid, jokeId) {
    return super.find({ awid, jokeId });
  }

  delete(awid, id) {
    return super.deleteOne({awid, _id: id});
  }

  deleteByCategory(awid, categoryId) {
    return super.deleteMany({ awid, categoryId });
  }

  deleteByJoke(awid, jokeId) {
    return super.deleteMany({ awid, jokeId });
  }

  deleteByJokeAndCategory(awid, jokeId, categoryListId = []) {
    return super.deleteMany({
      awid,
      jokeId,
      categoryId: {
        $in: categoryListId
      }
    });
  }
}

module.exports = CategoryMongoDB;

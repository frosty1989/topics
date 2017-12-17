"use strict";
const {UuObjectDao} = require("uu_appg01_server").ObjectStore;

class JokeMongoDB extends UuObjectDao {
  createSchema() {
    super.createIndex({
      awid: 1,
      _id: 1
    }, {unique: true});
  }

  create(uuObject) {
    return super.insertOne(uuObject);
  }

  get(awid, id) {
    return super.findOne({ awid, _id: id });
  }

  update(filter, uuObject) {
    return super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  remove(awid, id) {
    return super.deleteOne({ awid, id: id });
  }

  list(awid, pageInfo = {}, sort = {}) {
    return super.find({
      awid
    }, pageInfo, sort);
  }

  listCategoryJokes(awid, id) {
    return super.find({
      awid,
      id: id
    })
  }

  listByIds(awid, jokeIds = []) {
    return super.find({
      awid,
      _id: {
        $in: jokeIds
      }
    })
  }
}

module.exports = JokeMongoDB;

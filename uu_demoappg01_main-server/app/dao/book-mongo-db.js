"use strict";
const {UuObjectDao} = require("uu_appg01_server").ObjectStore;

class BookMongoDB extends UuObjectDao {
  createSchema() {
    super.createIndex({awid: 1, code: 1, name: 1}, {unique: true});
  }

  create(uuObject) {
    return super.insertOne(uuObject);
  }

  get(awid, id) {
    return super.findOne({awid, id});
  }

  remove(awid, id) {
    return super.deleteOne({id, awid});
  }

  list(awid, pageInfo = {}, sort = {}) {
    return super.find({awid}, pageInfo, sort);
  }
}

module.exports = BookMongoDB;

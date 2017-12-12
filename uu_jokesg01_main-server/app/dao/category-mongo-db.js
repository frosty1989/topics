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
      name: 1
    }, {
      unique: true
    });
  }

  create(uuObject) {
    return super.insertOne(uuObject);
  }

  get(awid, id) {
    return super.findOne({ awid, _id: id });
  }

  getByName(awid, name) {
    return super.findOne({ awid, name });
  }

  list(awid, pageInfo = {}) {
    return super.find({ awid }, pageInfo)
  }

  update(uuObject) {
    let filter = { awid: uuObject.awid, _id: uuObject.id };

    return super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  delete(awid, id) {
    return super.deleteOne({ awid, _id: id });
  }
}

module.exports = CategoryMongoDB;

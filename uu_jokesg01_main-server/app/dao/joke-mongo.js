"use strict";

const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class JokeMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, categoryList: 1 });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async get(awid, id) {
    return await super.findOne({ id, awid });
  }

  async getCountByCategoryId(awid, categoryId) {
    return await super.count({ awid, categoryList: categoryId });
  }

  async update(uuObject) {
    let filter = { id: uuObject.id, awid: uuObject.awid };
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  async updateVisibility(awid, id, visibility) {
    return await this.update({ awid, id, visibility });
  }

  async removeCategory(awid, categoryId) {
    await this.db.collection(this.collectionName).updateMany({ awid }, { $pull: { categoryList: categoryId } });
  }

  async delete(awid, id) {
    await super.deleteOne({ awid, id });
  }

  async list(awid, sortBy, order, pageInfo) {
    return await super.find({ awid }, pageInfo, { sortBy: order });
  }

  async listByCategoryIdList(awid, categoryIdList, sortBy, order, pageInfo) {
    return await super.find({ awid, categoryList: { $in: categoryIdList } }, pageInfo, { sortBy: order });
  }
}

module.exports = JokeMongo;

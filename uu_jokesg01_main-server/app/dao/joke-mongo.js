"use strict";

const { UuObjectDao } = require("uu_appg01_server").ObjectStore;
const { ObjectId } = require("bson");

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
    let sort = {};
    sort[sortBy] = order === "asc" ? 1 : -1;
    return await super.find({ awid }, pageInfo, sort);
  }

  async listByCategoryIdList(awid, categoryIdList, sortBy, order, pageInfo) {
    let sort = {};
    sort[sortBy] = order === "asc" ? 1 : -1;
    return await super.find(
      {
        awid,
        categoryList: {
          $in: categoryIdList.map(id => {
            if (!ObjectId.isValid(id)) return id;
            return new ObjectId(id);
          })
        }
      },
      pageInfo,
      sort
    );
  }
}

module.exports = JokeMongo;

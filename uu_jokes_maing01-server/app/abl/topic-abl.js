"use strict";

const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError, DuplicateKey } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const JokesInstanceAbl = require("./jokes-instance-abl");
const Errors = require("../api/errors/topic-error");
const Path = require("path");

const WARNINGS = {
  createUnsupportedKeys: {
    code: `${Errors.Create.UC_CODE}unsupportedKeys`
  },
  getUnsupportedKeys: {
    code: `${Errors.Get.UC_CODE}unsupportedKeys`
  },
  updateUnsupportedKeys: {
    code: `${Errors.Update.UC_CODE}unsupportedKeys`
  },
  deleteUnsupportedKeys: {
    code: `${Errors.Delete.UC_CODE}unsupportedKeys`
  },
  listUnsupportedKeys: {
    code: `${Errors.List.UC_CODE}unsupportedKeys`
  }
};
const DEFAULT_ICON = "mdi-label";
const DEFAULTS = {
  order: "asc",
  pageIndex: 0,
  pageSize: 100
};

class TopicAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "api", "validation_types", "topic-types.js"));
    this.dao = DaoFactory.getDao("topic");
    this.jokeDao = DaoFactory.getDao("joke");
  }

  async create(awid, dtoIn) {
    // hds 1, A1, hds 1.1, A2
    await JokesInstanceAbl.checkInstance(
      awid,
      Errors.Create.JokesInstanceDoesNotExist,
      Errors.Create.JokesInstanceNotInProperState
    );

    // hds 2, 2.1
    let validationResult = this.validator.validate("topicCreateDtoInType", dtoIn);
    // hds 2.2, 2.3, A3, A4
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.createUnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );
    // hds 2.4
    if (!dtoIn.icon) dtoIn.icon = DEFAULT_ICON;
    dtoIn.awid = awid;

    // hds 3
    let topic;
    try {
      topic = await this.dao.create(dtoIn);
    } catch (e) {
      if (e instanceof DuplicateKey) {
        // A5
        throw new Errors.Create.TopicNameNotUnique({ uuAppErrorMap }, { topicName: dtoIn.name });
      }
      if (e instanceof ObjectStoreError) {
        // A6
        throw new Errors.Create.TopicDaoCreateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // hds 4
    topic.uuAppErrorMap = uuAppErrorMap;
    return topic;
  }

  async get(awid, dtoIn, authorizationResult) {
    // hds 1, A1, hds 1.1, A2
    let jokesInstance = await JokesInstanceAbl.checkInstance(
      awid,
      Errors.Get.JokesInstanceDoesNotExist,
      Errors.Get.JokesInstanceNotInProperState
    );
    // A3
    let authorizedProfiles = authorizationResult.getAuthorizedProfiles();
    if (
      jokesInstance.state === JokesInstanceAbl.STATE_UNDER_CONSTRUCTION &&
      !authorizedProfiles.includes(JokesInstanceAbl.AUTHORITIES) &&
      !authorizedProfiles.includes(JokesInstanceAbl.EXECUTIVES)
    ) {
      throw new Errors.Get.JokesInstanceIsUnderConstruction({}, { state: jokesInstance.state });
    }

    // hds 2, 2.1
    let validationResult = this.validator.validate("topicGetDtoInType", dtoIn);
    // hds 2.2, 2.3, A4, A5
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.getUnsupportedKeys.code,
      Errors.Get.InvalidDtoIn
    );

    // hds 3
    let topic;
    if (dtoIn.id) {
      topic = await this.dao.get(awid, dtoIn.id);
    } else {
      topic = await this.dao.getByName(awid, dtoIn.name);
    }
    // A6
    if (!topic) {
      let paramMap = {};
      if (dtoIn.id) paramMap.topicId = dtoIn.id;
      if (dtoIn.name) paramMap.topicName = dtoIn.name;
      throw new Errors.Get.TopicDoesNotExist({ uuAppErrorMap }, paramMap);
    }

    // hds 4
    topic.uuAppErrorMap = uuAppErrorMap;
    return topic;
  }

  async update(awid, dtoIn) {
    // hds 1, A1, hds 1.1, A2
    await JokesInstanceAbl.checkInstance(
      awid,
      Errors.Update.JokesInstanceDoesNotExist,
      Errors.Update.JokesInstanceNotInProperState
    );

    // hds 2, 2.1
    let validationResult = this.validator.validate("topicUpdateDtoInType", dtoIn);
    // hds 2.2, 2.3, A3, A4
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.updateUnsupportedKeys.code,
      Errors.Update.InvalidDtoIn
    );

    // hds 3
    let topic;
    dtoIn.awid = awid;
    try {
      topic = await this.dao.update(dtoIn);
    } catch (e) {
      if (e instanceof DuplicateKey) {
        // A5
        throw new Errors.Update.TopicNameNotUnique({ uuAppErrorMap }, { topicName: dtoIn.name });
      }
      if (e instanceof ObjectStoreError) {
        // A6
        throw new Errors.Update.TopicDaoUpdateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // hds 4
    topic.uuAppErrorMap = uuAppErrorMap;
    return topic;
  }

  async delete(awid, dtoIn) {
    // hds 1, A1, hds 1.1, A2
    await JokesInstanceAbl.checkInstance(
      awid,
      Errors.Delete.JokesInstanceDoesNotExist,
      Errors.Delete.JokesInstanceNotInProperState
    );

    // hds 2, 2.1
    let validationResult = this.validator.validate("topicDeleteDtoInType", dtoIn);
    // hds 2.2, 2.3, A3, A4
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.deleteUnsupportedKeys.code,
      Errors.Delete.InvalidDtoIn
    );

    // hds 3
    if (!dtoIn.forceDelete) {
      // hds 3.1
      let count;
      try {
        count = await this.jokeDao.getCountByTopicId(awid, dtoIn.id);
      } catch (e) {
        //  A5
        if (e instanceof ObjectStoreError) {
          throw new Errors.Delete.JokeDaoGetCountByTopicFailed({ uuAppErrorMap }, e);
        }
        throw e;
      }
      if (count !== 0) {
        // A6
        throw new Errors.Delete.RelatedJokesExist({ uuAppErrorMap }, { relatedJokes: count });
      }
    } else {
      // hds 3.2
      try {
        await this.jokeDao.removeTopic(awid, dtoIn.id);
      } catch (e) {
        if (e instanceof ObjectStoreError) {
          // A7
          throw new Errors.Delete.JokeDaoRemoveTopicFailed({ uuAppErrorMap }, e);
        }
        throw e;
      }
    }

    // hds 4
    await this.dao.delete(awid, dtoIn.id);

    // hds 5
    return { uuAppErrorMap };
  }

  async list(awid, dtoIn, authorizationResult) {
    // hds 1, A1, hds 1.1, A2
    let jokesInstance = await JokesInstanceAbl.checkInstance(
      awid,
      Errors.List.JokesInstanceDoesNotExist,
      Errors.List.JokesInstanceNotInProperState
    );
    // A3
    let authorizedProfiles = authorizationResult.getAuthorizedProfiles();
    if (
      jokesInstance.state === JokesInstanceAbl.STATE_UNDER_CONSTRUCTION &&
      !authorizedProfiles.includes(JokesInstanceAbl.AUTHORITIES) &&
      !authorizedProfiles.includes(JokesInstanceAbl.EXECUTIVES)
    ) {
      throw new Errors.List.JokesInstanceIsUnderConstruction({}, { state: jokesInstance.state });
    }

    // hds 2, 2.1
    let validationResult = this.validator.validate("topicListDtoInType", dtoIn);
    // hds 2.2, 2.3, A4, A5
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.listUnsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );
    // hds 2.4
    if (!dtoIn.pageInfo) dtoIn.pageInfo = {};
    if (!dtoIn.pageInfo.pageSize) dtoIn.pageInfo.pageSize = DEFAULTS.pageSize;
    if (!dtoIn.pageInfo.pageIndex) dtoIn.pageInfo.pageIndex = DEFAULTS.pageIndex;
    if (!dtoIn.order) dtoIn.order = DEFAULTS.order;

    // hds 3
    let list = await this.dao.list(awid, dtoIn.order, dtoIn.pageInfo);

    // hds 4
    list.uuAppErrorMap = uuAppErrorMap;
    return list;
  }
}

module.exports = new TopicAbl();

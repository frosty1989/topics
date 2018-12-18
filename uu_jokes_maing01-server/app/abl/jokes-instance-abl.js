"use strict";

const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { SysProfileModel } = require("uu_appg01_server").Workspace;
const { UuBinaryModel } = require("uu_appg01_binarystore-cmd");
const Path = require("path");
const Errors = require("../errors/jokes-instance-error");

const WARNINGS = {
  initUnsupportedKeys: {
    code: `${Errors.Init.UC_CODE}unsupportedKeys`
  },
  updateUnsupportedKeys: {
    code: `${Errors.Update.UC_CODE}unsupportedKeys`
  }
};

const DEFAULT_NAME = "uuJokes";
const AUTHORITIES = "Authorities";
const EXECUTIVES = "Executives";
const STATE_ACTIVE = "active";
const STATE_UNDER_CONSTRUCTION = "underConstruction";
const STATE_CLOSED = "closed";

class JokesInstanceAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "validation_types", "jokes-instance-types.js"));
    this.dao = DaoFactory.getDao("jokesInstance");
    this.categoryDao = DaoFactory.getDao("category");
    // redeclare some constants, so they can be used from other abls
    this.STATE_ACTIVE = STATE_ACTIVE;
    this.STATE_UNDER_CONSTRUCTION = STATE_UNDER_CONSTRUCTION;
    this.AUTHORITIES = AUTHORITIES;
    this.EXECUTIVES = EXECUTIVES;
  }

  async init(awid, dtoIn) {
    // hds 1
    let jokeInstance = await this.dao.getByAwid(awid);
    // A1
    if (jokeInstance) {
      throw new Errors.Init.JokesInstanceAlreadyInitialized();
    }

    // hds 2
    let validationResult = this.validator.validate("jokesInstanceInitDtoInType", dtoIn);
    // A2, A3
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.initUnsupportedKeys.code,
      Errors.Init.InvalidDtoIn
    );
    dtoIn.state = dtoIn.state || STATE_UNDER_CONSTRUCTION;
    dtoIn.name = dtoIn.name || DEFAULT_NAME;
    dtoIn.awid = awid;

    // hds 3
    await Promise.all([
      this.dao.createSchema(),
      DaoFactory.getDao("joke").createSchema(),
      DaoFactory.getDao("jokeRating").createSchema(),
      DaoFactory.getDao("category").createSchema()
    ]);

    try {
      // hds 4
      await SysProfileModel.setProfile(awid, { code: AUTHORITIES, roleUri: dtoIn.uuAppProfileAuthorities });
    } catch (e) {
      // A4
      throw new Errors.Init.SysSetProfileFailed({ uuAppErrorMap }, { role: dtoIn.uuAppProfileAuthorities }, e);
    }

    // hds 5
    if (dtoIn.logo) {
      let binary;
      try {
        binary = await UuBinaryModel.createBinary(awid, { data: dtoIn.logo, code: "logo" });
      } catch (e) {
        // A5
        throw new Errors.Init.UuBinaryCreateFailed({ uuAppErrorMap }, e);
      }
      // hds 6
      dtoIn.logo = binary.code;
    }

    // hds 7
    try {
      jokeInstance = await this.dao.create(dtoIn);
    } catch (e) {
      // A6
      if (e instanceof ObjectStoreError) {
        throw new Errors.Init.JokesInstanceDaoCreateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // hds 8
    jokeInstance.uuAppErrorMap = uuAppErrorMap;
    return jokeInstance;
  }

  async load(awid, authorizationResult) {
    // hds 1, A1, hds 1.1, A2
    let jokesInstance = await this.checkInstance(
      awid,
      Errors.Load.JokesInstanceDoesNotExist,
      Errors.Load.JokesInstanceNotInProperState
    );
    // A3
    let authorizedProfiles = authorizationResult.getAuthorizedProfiles();
    if (
      jokesInstance.state === STATE_UNDER_CONSTRUCTION &&
      !authorizedProfiles.includes(AUTHORITIES) &&
      !authorizedProfiles.includes(EXECUTIVES)
    ) {
      throw new Errors.Load.JokesInstanceIsUnderConstruction({}, { state: jokesInstance.state });
    }

    // hds 2
    jokesInstance.categoryList = (await this.categoryDao.list(awid)).itemList;

    // hds 3
    jokesInstance.authorizedProfileList = authorizedProfiles;

    // HDS 4
    return jokesInstance;
  }

  async update(awid, dtoIn) {
    // hds 1
    let validationResult = this.validator.validate("jokesInstanceUpdateDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.updateUnsupportedKeys.code,
      Errors.Update.InvalidDtoIn
    );

    // hds 2
    let jokeInstance;
    if (dtoIn.logo) {
      jokeInstance = await this.dao.getByAwid(awid);
      // A3
      if (!jokeInstance) {
        throw new Errors.Update.JokesInstanceDoesNotExist(uuAppErrorMap);
      }
      let binary;
      // hds 2.1
      if (!jokeInstance.logo) {
        try {
          binary = await UuBinaryModel.createBinary(awid, { data: dtoIn.logo, code: "logo" });
        } catch (e) {
          // A4
          throw new Errors.Update.UuBinaryCreateFailed(uuAppErrorMap, e);
        }
      } else {
        // hds 2.2
        try {
          binary = await UuBinaryModel.updateBinary(awid, { data: dtoIn.logo, code: "logo", revisionStrategy: "NONE" });
        } catch (e) {
          // A5
          throw new Errors.Update.UuBinaryUpdateBinaryDataFailed(uuAppErrorMap, e);
        }
      }
      dtoIn.logo = binary.code;
    }

    // hds 3
    try {
      dtoIn.awid = awid;
      jokeInstance = await this.dao.updateByAwid(dtoIn);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        // A6
        throw new Errors.Update.JokesInstanceDaoUpdateByAwidFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // hds 4
    jokeInstance.uuAppErrorMap = uuAppErrorMap;
    return jokeInstance;
  }

  /**
   * Checks whether jokes instance exists and that it is not in closed state.
   * @param {String} awid Used awid
   * @param {Error} notExistError Error thrown when jokes instance does not exist
   * @param {Error} closedStateError Error thrown when jokes instance is in closed state
   * @returns {Promise<{}>} jokes instance
   */
  async checkInstance(awid, notExistError, closedStateError) {
    let jokesInstance = await this.dao.getByAwid(awid);
    if (!jokesInstance) {
      throw new notExistError();
    }
    if (jokesInstance.state === STATE_CLOSED) {
      throw new closedStateError(
        {},
        {
          state: jokesInstance.state,
          expectedStateList: [STATE_ACTIVE, STATE_UNDER_CONSTRUCTION]
        }
      );
    }
    return jokesInstance;
  }
}

module.exports = new JokesInstanceAbl();

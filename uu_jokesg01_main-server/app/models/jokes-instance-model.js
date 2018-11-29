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

class JokesInstanceModel {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "validation_types", "jokes-instance-types.js"));
    this.dao = DaoFactory.getDao("jokesInstance");
    this.categoryDao = DaoFactory.getDao("category");
    // redeclare some constants, so they can be used from other models
    this.STATE_ACTIVE = STATE_ACTIVE;
    this.STATE_UNDER_CONSTRUCTION = STATE_UNDER_CONSTRUCTION;
    this.AUTHORITIES = AUTHORITIES;
  }

  async init(awid, dtoIn) {
    //HDS 1
    let jokeInstance = await this.dao.getByAwid(awid);
    //A1
    if (jokeInstance) {
      throw new Errors.Init.JokesInstanceAlreadyInitialized({});
    }

    //HDS 2
    let validationResult = this.validator.validate("jokesInstanceInitDtoInType", dtoIn);
    //A2, A3
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.initUnsupportedKeys.code,
      Errors.Init.InvalidDtoIn
    );
    dtoIn.state = dtoIn.state || STATE_UNDER_CONSTRUCTION;
    dtoIn.name = dtoIn.name || DEFAULT_NAME;
    dtoIn.awid = awid;

    //HDS 3
    await Promise.all([
      this.dao.createSchema(),
      DaoFactory.getDao("joke").createSchema(),
      DaoFactory.getDao("jokeRating").createSchema(),
      DaoFactory.getDao("category").createSchema()
    ]);

    try {
      //HDS 4
      await SysProfileModel.setProfile(awid, { code: AUTHORITIES, roleUri: dtoIn.uuAppProfileAuthorities });
    } catch (e) {
      //A4
      throw new Errors.Init.SysSetProfileFailed({ uuAppErrorMap }, { role: dtoIn.uuAppProfileAuthorities }, e);
    }

    //HDS 5
    if (dtoIn.logo) {
      let binary;
      try {
        binary = await UuBinaryModel.createBinary(awid, { data: dtoIn.logo, code: "logo" });
      } catch (e) {
        //A5
        throw new Errors.Init.CreateBinaryFailed({ uuAppErrorMap }, e);
      }
      //HDS 6
      dtoIn.logo = binary.code;
    }

    //HDS 7
    try {
      jokeInstance = await this.dao.create(dtoIn);
    } catch (e) {
      //A6
      if (e instanceof ObjectStoreError) {
        throw new Errors.Init.JokesInstanceDaoCreateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    //HDS 8
    jokeInstance.uuAppErrorMap = uuAppErrorMap;
    return jokeInstance;
  }

  async load(awid, authorizationResult) {
    //HDS 1
    let jokeInstance = await this.dao.getByAwid(awid);
    //A1
    if (!jokeInstance) {
      throw new Errors.Load.JokesInstanceDoesNotExist({});
    }
    //A2
    if (jokeInstance.state === STATE_CLOSED) {
      throw new Errors.Load.JokesInstanceNotInProperState(
        {},
        {
          state: jokeInstance.state,
          expectedStateList: [STATE_ACTIVE, STATE_UNDER_CONSTRUCTION]
        }
      );
    }
    //A3
    let authorizedProfiles = authorizationResult.getAuthorizedProfiles();
    if (
      jokeInstance.state === STATE_UNDER_CONSTRUCTION &&
      !authorizedProfiles.includes(AUTHORITIES) &&
      !authorizedProfiles.includes(EXECUTIVES)
    ) {
      throw new Errors.Load.JokesInstanceIsUnderConstruction({}, { state: jokeInstance.state });
    }

    //HDS 2
    jokeInstance.categoryList = (await this.categoryDao.list(awid)).itemList;

    //HDS 3
    jokeInstance.authorizedProfileList = authorizedProfiles;

    // HDS 4
    return jokeInstance;
  }

  async update(awid, dtoIn) {
    //HDS 1
    let validationResult = this.validator.validate("jokesInstanceUpdateDtoInType", dtoIn);
    //A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.updateUnsupportedKeys.code,
      Errors.Update.InvalidDtoIn
    );

    //HDS 2
    let jokeInstance;
    if (dtoIn.logo) {
      jokeInstance = await this.dao.getByAwid(awid);
      //A3
      if (!jokeInstance) {
        throw new Errors.Update.JokesInstanceDoesNotExist(uuAppErrorMap);
      }
      let binary;
      //HDS 2.1
      if (!jokeInstance.logo) {
        try {
          binary = await UuBinaryModel.createBinary(awid, { data: dtoIn.logo, code: "logo" });
        } catch (e) {
          //A4
          throw new Errors.Update.UuBinaryCreateFailed(uuAppErrorMap, e);
        }
      } else {
        //HDS 2.2
        try {
          binary = await UuBinaryModel.updateBinary(awid, { data: dtoIn.logo, code: "logo", revisionStrategy: "NONE" });
        } catch (e) {
          //A5
          throw new Errors.Update.UuBinaryUpdateBinaryDataFailed(uuAppErrorMap, e);
        }
      }
      dtoIn.logo = binary.code;
    }

    //HDS 3
    try {
      dtoIn.awid = awid;
      jokeInstance = await this.dao.update(dtoIn);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.Update.JokesInstanceDaoUpdateByAwidFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    //HDS 4
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
      throw new notExistError({});
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

module.exports = new JokesInstanceModel();

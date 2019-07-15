"use strict";

const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { SysProfileModel } = require("uu_appg01_server").Workspace;
const { LoggerFactory } = require("uu_appg01_server").Logging;
const { UuBinaryModel } = require("uu_appg01_binarystore-cmd");
const Path = require("path");
const fs = require("fs");
const Errors = require("../errors/jokes-instance-error");
const FileHelper = require("../helpers/file-helper");

const WARNINGS = {
  initUnsupportedKeys: {
    code: `${Errors.Init.UC_CODE}unsupportedKeys`
  },
  updateUnsupportedKeys: {
    code: `${Errors.Update.UC_CODE}unsupportedKeys`
  },
  setLogoUnsupportedKeys: {
    code: `${Errors.SetLogo.UC_CODE}unsupportedKeys`
  },
  getProductLogoUnsupportedKeys: {
    code: `${Errors.GetProductLogo.UC_CODE}unsupportedKeys`
  },
  getProductLogoLogoDoesNotExists: {
    code: `${Errors.GetProductLogo.UC_CODE}logoDoesNotExists`
  }
};

const logger = LoggerFactory.get("UuJokes.Models.JokesInstanceModel");

const DEFAULT_NAME = "uuJokes";
const AUTHORITIES = "Authorities";
const EXECUTIVES = "Executives";
const STATE_ACTIVE = "active";
const STATE_UNDER_CONSTRUCTION = "underConstruction";
const STATE_CLOSED = "closed";
const DEFAULT_LOGO_TYPE = "16x9";

class JokesInstanceModel{
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "validation_types", "jokes-instance-types.js"));
    this.dao = DaoFactory.getDao("jokesInstance");
    this.categoryDao = DaoFactory.getDao("category");
    // redeclare some constants, so they can be used from other models
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
        binary = await UuBinaryModel.createBinary(awid, { data: dtoIn.logo, code: DEFAULT_LOGO_TYPE });
      } catch (e) {
        // A5
        throw new Errors.Init.UuBinaryCreateFailed({ uuAppErrorMap }, e);
      }
      // hds 6
      dtoIn.logos = [DEFAULT_LOGO_TYPE];
      delete dtoIn.logo;
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

    // hds 3
    let jokesInstance;
    try {
      dtoIn.awid = awid;
      jokesInstance = await this.dao.updateByAwid(dtoIn);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        // A6
        throw new Errors.Update.JokesInstanceDaoUpdateByAwidFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // hds 4
    jokesInstance.uuAppErrorMap = uuAppErrorMap;
    return jokesInstance;
  }

  async setLogo(awid, dtoIn) {
    // hds 1
    let validationResult = this.validator.validate("setLogoDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.setLogoUnsupportedKeys.code,
      Errors.SetLogo.InvalidDtoIn
    );
    
    
    //check if stream or base64  
    if (dtoIn.logo.readable) {
      //check if the stream is valid         
      let {valid: isValidStream, stream} = await FileHelper.validateImageStream(dtoIn.logo);
      if (!isValidStream) {
        throw new Errors.SetLogo.InvalidPhotoContentType({ uuAppErrorMap });
      }
      dtoIn.logo = stream;
    } else {
      //check if the base64 is valid
      let binaryBuffer = FileHelper.getBufferFromBase64UrlImage(dtoIn.logo);
      if (!FileHelper.validateImageBuffer(binaryBuffer).valid) {
        throw new Errors.SetLogo.InvalidPhotoContentType({ uuAppErrorMap });
      }
      
      dtoIn.logo = FileHelper.toStream(binaryBuffer);
    }
    
    // hds 2, hds 2.1, A3, A4
    let jokesInstance = await this.checkInstance(
      awid,
      Errors.SetLogo.JokesInstanceDoesNotExist,
      Errors.SetLogo.JokesInstanceNotInProperState
    );

    // hds 3
    let type = dtoIn.type ? dtoIn.type : DEFAULT_LOGO_TYPE;
    let binary;
    if (!jokesInstance.logos || !jokesInstance.logos.includes(type)) {
      // hds 3.1
      try {
        binary = await UuBinaryModel.createBinary(awid, { data: dtoIn.logo, code: type });
      } catch (e) {
        // A5
        throw new Errors.SetLogo.UuBinaryCreateFailed(uuAppErrorMap, e);
      }
    } else {
      // hds 3.2
      try {
        binary = await UuBinaryModel.updateBinaryData(awid, { data: dtoIn.logo, code: type, revisionStrategy: "NONE" });
      } catch (e) {
        // A6
        throw new Errors.SetLogo.UuBinaryUpdateBinaryDataFailed(uuAppErrorMap, e);
      }
    }

    // hds 4
    if (!jokesInstance.logos) jokesInstance.logos = [];
    jokesInstance.logos.push(type);
    jokesInstance.awid = awid;

    try {
      jokesInstance = await this.dao.updateByAwid(jokesInstance);
    } catch (e) {
      if (e instanceof ObjectStoreError) { // A7
        throw new Errors.SetLogo.JokesInstanceDaoUpdateByAwidFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // hds 5
    jokesInstance.uuAppErrorMap = uuAppErrorMap;
    return jokesInstance;
  }

  async getProductInfo(awid) {
    // hds 1
    let jokesInstance = await this.dao.getByAwid(awid);
    // hds 2
    return {
      name: jokesInstance ? jokesInstance.name : DEFAULT_NAME,
      uuAppErrorMap: {}
    };
  }

  async getProductLogo(awid, dtoIn) {
    // hds 1
    let validationResult = this.validator.validate("getProductLogoDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.getProductLogoUnsupportedKeys.code,
      Errors.GetProductLogo.InvalidDtoIn
    );

    // hds 2
    let type = dtoIn.type ? dtoIn.type : DEFAULT_LOGO_TYPE;
    let dtoOut = {};
    let jokesInstance = await this.dao.getByAwid(awid);
    if (jokesInstance && jokesInstance.logos && jokesInstance.logos.includes(type)) {
      try {
        dtoOut = await UuBinaryModel.getBinaryData(awid, { code: type });
      } catch (e) {
        // A3
        if (logger.isWarnLoggable()) {
          logger.warn(`Unable to load uuBinary logo ${type} for jokes instance ${awid}. Error: ${e} `);
        }
        ValidationHelper.addWarning(
          uuAppErrorMap,
          WARNINGS.getProductLogoLogoDoesNotExists.code,
          {
            type: type
          }
        );
      }
    }

    // hds 2.1
    if (!dtoOut.stream) {
      let filePath = Path.resolve(__dirname, `../../public/assets/logos/${type}.png`);
      dtoOut.contentType = "image/png";
      dtoOut.stream = fs.createReadStream(filePath);
    }

    // hds 3
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
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

module.exports = new JokesInstanceModel();

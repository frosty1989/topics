import UU5 from "uu5g04";
import Config from "../config/config.js";

// helper class to handle basic authorization with cached values
export default class {
  constructor(userProfiles) {
    this.userProfiles = userProfiles;
    // precalculate rights ... once
    this._isInAuthoritiesProfile = UU5.Common.Tools.hasProfile(this.userProfiles, Config.PROFILES.AUTHORITIES);
    this._isInExecutivesProfile = UU5.Common.Tools.hasProfile(this.userProfiles, Config.PROFILES.EXECUTIVES);
  }

  canManage() {
    // can manage own records
    return this._isInExecutivesProfile || this._isInAuthoritiesProfile;
  }

  canManageAll() {
    // can manage all records
    return this._isInAuthoritiesProfile;
  }

  canToggleVisibility() {
    return this._isInAuthoritiesProfile;
  }

  canFilterPublished() {
    return this._isInAuthoritiesProfile;
  }

  canFilterOwnRecords() {
    return this._isInExecutivesProfile || this._isInAuthoritiesProfile;
  }

  canSeeAllUnpublished() {
    // can see all unpublished records
    return this._isInAuthoritiesProfile;
  }

  canSeeUnpublished() {
    // can see own unpublished records
    return this._isInExecutivesProfile;
  }

}

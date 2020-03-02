// This file was auto-generated according to the "namespace" setting in package.json.
// Manual changes to this file are discouraged, if values are inconsistent with package.json setting.

export default {
  TAG: "UuJokes.",
  CSS: "uujokes-",

  LEFT_MENU_CCR_KEY: "UuJokes.LeftMenu",

  AUTH_HOME_ROUTE: "jokes",
  NOT_AUTH_HOME_ROUTE: "login",

  FEEDBACK: {
    LOADING: "loading",
    READY: "ready",
    ERROR: "error",
    INITIAL: "initial",
    SUCCESS: "success"
  },

  SCREEN_SIZE: {
    XS: "xs",
    S: "s",
    M: "m",
    L: "L",
    XL: "xl"
  },

  PROFILES: {
    AUTHORITIES: "Authorities",
    EXECUTIVES: "Executives"
  },

  STATES: {
    ACTIVE: "active",
    CLOSED: "closed",
    UNDER_CONSTRUCTION: "underConstruction"
  },

  ERROR_CODES: {
    LOAD_INSTANCE_CLOSED: "uu-jokes-main/jokesInstance/load/jokesInstanceNotInProperState",
    LOAD_INSTANCE_UNDER_CONSTRUCTION: "uu-jokes-main/jokesInstance/load/jokesInstanceIsUnderConstruction",
    APP_NOT_AUTHORIZED: "uu-appg01/authorization/accessDenied",
    JOKE_RATING_NOT_AUTHORIZED: "uu-jokes-main/joke/addRating/userNotAuthorized",
    JOKE_DELETE_NOT_AUTHORIZED: "uu-jokes-main/joke/delete/userNotAuthorized",
    JOKE_UPDATE_NOT_AUTHORIZED: "uu-jokes-main/joke/update/userNotAuthorized",
    CATEGORY_CONTAIN_JOKES: "uu-jokes-main/category/delete/relatedJokesExist",
    CATEGORY_NAME_NOT_UNIQUE: "uu-jokes-main/category/create/categoryNameNotUnique"
  }
};

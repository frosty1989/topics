//@@viewOn:imports
import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import * as Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-app";

import Config from "./config/config.js";
import { whitelistedKeys } from "../helpers/object-utils.js";
import SpaReady from "./spa-ready.js";
import Calls from "calls";
import { dig } from "../helpers/object-utils";
import Authorization from "../helpers/authorization.js";

import "./spa-authenticated.less";
import LSI from "./spa-authenticated-lsi.js";
import JokesProvider from "./jokes-provider.js";
//@@viewOff:imports

const SpaAuthenticated = createReactClass({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "SpaAuthenticated",
    classNames: {
      main: Config.CSS + "spaauthenticated"
    },
    lsi: LSI
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    identity: PropTypes.object
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps
  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  setAppData(appData, setStateCallback) {
    // filter out keys, no possibility to set awid or userProfiles
    let newData = whitelistedKeys(appData, "state", "name", "categoryList", "logos");
    this._provider.setData(newData, setStateCallback);
    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _buildAppDataContext(data) {
    return {
      awid: data.awid,
      state: data.state,
      name: data.name,
      logos: data.logos,
      categoryList: data.categoryList,
      userProfiles: data.userProfiles,
      setAppData: this.setAppData
    };
  },

  _handleErrorMessage() {
    let content; // default message
    let errorCode = dig(this.state, "errorDtoOut", "code");

    switch (errorCode) {
      case Config.ERROR_CODES.LOAD_INSTANCE_CLOSED:
      case Config.ERROR_CODES.LOAD_INSTANCE_UNDER_CONSTRUCTION:
        let appState = dig(this.state, "errorDtoOut", "paramMap", "state");
        switch (appState) {
          case Config.STATES.CLOSED:
            content = this.getLsiComponent("closed");
            break;
          case Config.STATES.UNDER_CONSTRUCTION:
            content = this.getLsiComponent("underConstruction");
            break;
        }
        break;
      case Config.ERROR_CODES.APP_NOT_AUTHORIZED:
        content = this.getLsiComponent("notAuthorized");
        break;
    }

    return content;
  },

  _handleLoad(data) {
    return Calls.loadApp(data).then(data => {
      // setup authorization service in Environment to access it across the application
      UU5.Environment.App.authorization = new Authorization(data.authorizedProfileList, this.props.identity.uuIdentity);
      return data;
    });
  },

  _getChild(data) {
    return (
      <JokesProvider ref={comp => {this._provider = comp}} data={this._buildAppDataContext(data)}>
        <SpaReady {...this.getMainPropsToPass()} />;
      </JokesProvider>
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let child;
    return (
      <UU5.Common.Loader onLoad={this._handleLoad}>
        {({ isLoading, isError, data }) => {
          if (isError) {
            child = (
              <Plus4U5.App.SpaError
                {...this.getMainPropsToPass()}
                error={this.state.errorDtoOut}
                errorData={dig(this.state, "errorDtoOut", "dtoOut", "uuAppErrorMap")}
                content={this._handleErrorMessage()}
              />
            );
          } else if (isLoading) {
            child = <Plus4U5.App.SpaLoading {...this.getMainPropsToPass()}>uuJokes</Plus4U5.App.SpaLoading>;
          } else {
            child = this._getChild(data);
          }
          return child;
        }}
      </UU5.Common.Loader>
    );
  }
  //@@viewOff:render
});

export default SpaAuthenticated;

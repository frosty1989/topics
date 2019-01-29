//@viewOn:imports
import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";

import Config from "./config/config.js";
import Uri from "../helpers/uri-helpers.js";
import LeftLink from "../bricks/left-link.js";
import { ensureClosedMenu } from "../helpers/menu-helper";

import "./left.less";
import LSI from "./left-lsi.js";
//@viewOff:imports

export const Left = createReactClass({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.CcrWriterMixin, UU5.Common.PureRenderMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Left",
    classNames: {
      main: Config.CSS + "left",
      logo: Config.CSS + "left-logo",
      menu: Config.CSS + "left-menu"
    },
    lsi: LSI,
    opt: {
      ccrKey: Config.LEFT_MENU_CCR_KEY,
      pureRender: true
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    appData: PropTypes.object,
    authenticated: PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      appData: {},
      authenticated: false
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      activeRoute: null
    };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  setActiveRoute(route, setStateCallback) {
    this.setState({ activeRoute: route }, setStateCallback);
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _handleGoHome() {
    let code = this.props.authenticated ? Config.AUTH_HOME_ROUTE : Config.NOT_AUTH_HOME_ROUTE;
    UU5.Environment.setRoute(code, ensureClosedMenu);
  },

  _handleTabHome() {
    let code = this.props.authenticated ? Config.AUTH_HOME_ROUTE : Config.NOT_AUTH_HOME_ROUTE;
    Uri.openNewTab({ code });
  },

  _getAuthenticatedMenu() {
    return (
      <React.Fragment>
        <LeftLink route="jokes" active={this.state.activeRoute === "jokes"}>
          {this.getLsiComponent("jokes")}
        </LeftLink>
        {UU5.Environment.App.authorization.canManage() && (
          <LeftLink route="categoryManagement" active={this.state.activeRoute === "categoryManagement"}>
            {this.getLsiComponent("categories")}
          </LeftLink>
        )}
      </React.Fragment>
    );
  },

  _getNonAuthenticatedMenu() {
    return (
      <LeftLink route="login" active={this.state.activeRoute === "login"}>
        {this.getLsiComponent("login")}
      </LeftLink>
    );
  },

  _getImage() {
    let imageUrl = Uri.getBinaryUrl(this.props.appData.logo);
    return <UU5.Bricks.Image src={imageUrl} authenticate />;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <UU5.Bricks.Div className={this.getClassName("logo")}>
          <UU5.Bricks.Link
            onClick={this._handleGoHome}
            onWheelClick={this._handleTabHome}
            onCtrlClick={this._handleTabHome}
          >
            {/* // Logo */}
            {this.props.appData.logo ? (
              this._getImage()
            ) : (
              <UU5.Bricks.Image name="Logo" responsive src="assets/logo.png" />
            )}
          </UU5.Bricks.Link>
        </UU5.Bricks.Div>
        {this.props.authenticated ? this._getAuthenticatedMenu() : this._getNonAuthenticatedMenu()}
        <LeftLink route="about" size="xl" active={this.state.activeRoute === "about"}>
          {this.getLsiComponent("about")}
        </LeftLink>
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default Left;

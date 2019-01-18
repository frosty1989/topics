//@@viewOn:imports
import React from "react";
import createReactClass from "create-react-class";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Plus4U5 from "uu_plus4u5g01";

import Config from "./config/config.js";

import "./not-authenticated.less";
import LSI from "./not-authenticated-lsi.js";
import { ensureClosedMenu } from "../helpers/menu-helper";
//@@viewOff:imports

const NotAuthenticated = createReactClass({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.RouteMixin, UU5.Common.CcrReaderMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "NotAuthenticated",
    classNames: {
      main: Config.CSS + "notauthenticated",
      login: Config.CSS + "notauthenticated-login",
      loginButton: Config.CSS + "notauthenticated-loginbutton"
    },
    lsi: LSI
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  componentDidMount() {
    // enforce redirect to correct address
    UU5.Environment.setRoute("login");
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  onRouteChanged_() {
    let menu = this.getCcrComponentByKey(Config.LEFT_MENU_CCR_KEY);
    menu && menu.setActiveRoute("login");
    ensureClosedMenu();
  },
  //@@viewOff:overriding

  //@@viewOn:private
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Section {...this.getMainPropsToPass()} header={this.getLsiComponent("welcome")} level="2">
        <UU5.Bricks.Row display="flex">
          <UU5.Bricks.Column colWidth="xs-12 s-2">
            <UU5.Bricks.Icon icon="mdi-account-key" />
          </UU5.Bricks.Column>
          <UU5.Bricks.Column colWidth="xs-12 s-10">
            <UU5.Bricks.Span>{this.getLsiComponent("login")}</UU5.Bricks.Span>
            <Plus4U5.App.LoginButton />
          </UU5.Bricks.Column>
        </UU5.Bricks.Row>
      </UU5.Bricks.Section>
    );
  } //@@viewOff:render
});

export default NotAuthenticated;

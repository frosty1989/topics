import React from "react";
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import * as UU5 from "uu5g04";
import "uu5g04-bricks";

import Cfg from "./_config.js";
import WelcomeRow from "../bricks/welcome-row.js";

import "./demo-home.less";

const DemoHome = createReactClass({

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.RouteMixin,
    UU5.Common.CcrReaderMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Cfg.APP + ".DemoNotAuthenticated",
    classNames: {
      main: Cfg.CSS + "-demo-home",
      welcomeRow: Cfg.CSS + "-demo-home-welcome-row",
      welcome: Cfg.CSS + "-demo-home-welcome"
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render(){
    let identity = this.getCcrComponentByKey(Cfg.CCRKEY_SPA).getIdentity();
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <UU5.Bricks.Row className={this.getClassName("welcomeRow")}>
          <UU5.Bricks.Div className={this.getClassName("welcome")}>
            <UU5.Bricks.Column colWidth="x12 s12 m3 l3 xl3">
              <Plus4U5.Bricks.UserPhoto style={{margin: "0 auto", width: "100px"}}/>
            </UU5.Bricks.Column>
            <UU5.Bricks.Column colWidth="x12 s12 m9 l9 xl9">
              <UU5.Bricks.Header
                style={{marginTop: "10px", fontSize: "30px", borderBottom: "0px"}}
                level="2"
                content={Cfg.LSILABEL_WELCOME_SHORT}
              />
              <UU5.Bricks.Header
                style={{marginTop: "10px", paddingBottom: "45px", fontSize: "30px", borderBottom: "0px"}}
                level="2"
                content={identity.name}
              />
            </UU5.Bricks.Column>
          </UU5.Bricks.Div>
        </UU5.Bricks.Row>
        <WelcomeRow textPadding="6px" glyphicon="mdi-human-greeting">
          {Cfg.LSILABEL_INTRO_AUTH}
        </WelcomeRow>
        <WelcomeRow textPadding="10px" glyphicon="mdi-monitor">
          {Cfg.LSILABEL_CLIENT_AUTH}
        </WelcomeRow>
        <WelcomeRow textPadding="10px" glyphicon="mdi-server">
          {Cfg.LSILABEL_SERVER_AUTH}
        </WelcomeRow>
      </UU5.Bricks.Div>
    );
  }  //@@viewOff:render
});

export default DemoHome;


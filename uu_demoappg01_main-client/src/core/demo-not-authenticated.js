import React from "react";
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import * as UU5 from "uu5g04";
import "uu5g04-bricks";

import Cfg from "./_config.js";
import WelcomeRow from "../bricks/welcome-row.js";

import "./demo-home.less";

const DemoNotAuthenticated = createReactClass({

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
      main: Cfg.CSS + "-demo-not-authenticated",
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
    return (
      <UU5.Bricks.Div>
        <UU5.Bricks.Row className="center" style={{padding: "60px 0px 0px 20px"}}>
          <UU5.Bricks.Header
            style={{paddingBottom: "45px", fontSize: "30px"}}
            level="2"
            content={Cfg.LSILABEL_WELCOME}
          />
        </UU5.Bricks.Row>
        <WelcomeRow textPadding="6px" glyphicon="mdi-human-greeting">
          {Cfg.LSILABEL_INTRO}
        </WelcomeRow>
        <WelcomeRow textPadding="10px" glyphicon="mdi-monitor">
          {Cfg.LSILABEL_CLIENT}
        </WelcomeRow>
        <WelcomeRow textPadding="10px" glyphicon="mdi-server">
          {Cfg.LSILABEL_SERVER}
        </WelcomeRow>
        <WelcomeRow style={{backgroundColor: "rgba(0,93,167,0.11)"}} textPadding="20px" glyphicon="mdi-account-key">
          <UU5.Bricks.Span key="loginText" style={{fontSize: "18px", paddingRight: "10px"}}>
            {Cfg.LSILABEL_LOGIN}
          </UU5.Bricks.Span>
          <Plus4U5.App.LoginButton key="loginButton" style={{
            width: "130px",
            height: "32px",
            borderRadius: "2px",
            backgroundColor: "#005DA7",
            color: "white"
          }}/>
        </WelcomeRow>
      </UU5.Bricks.Div>
    );
  }  //@@viewOff:render
});

export default DemoNotAuthenticated;


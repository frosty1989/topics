import React from "react";
import createReactClass from "create-react-class";
import UU5 from "uu5g04";
import "uu5g04-bricks";
import Plus4U5 from "uu_plus4u5g01";
import ns from "ns";

import Lsi from "./lsi.js";
import WelcomeRow from "../bricks/welcome-row.js";

import "./home.less";

const NotAuthenticated = createReactClass({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin, UU5.Common.RouteMixin, UU5.Common.CcrReaderMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.tag("NotAuthenticated"),
    classNames: {
      main: ns.css("not-authenticated")
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
  render() {
    return (
      <UU5.Bricks.Div>
        <UU5.Bricks.Row className="center" style={{ padding: "60px 0px 0px 20px" }}>
          <UU5.Bricks.Header style={{ paddingBottom: "45px", fontSize: "30px" }} level="2" content={Lsi.welcome} />
        </UU5.Bricks.Row>
        <WelcomeRow textPadding="6px" icon="mdi-human-greeting">
          {Lsi.intro}
        </WelcomeRow>
        <WelcomeRow textPadding="10px" icon="mdi-monitor">
          {Lsi.clientSide}
        </WelcomeRow>
        <WelcomeRow textPadding="10px" icon="mdi-server">
          {Lsi.serverSide}
        </WelcomeRow>
        <WelcomeRow style={{ backgroundColor: "rgba(0,93,167,0.11)" }} textPadding="16px" glyphicon="mdi-account-key">
          <UU5.Bricks.Span key="loginText" style={{ fontSize: "18px", paddingRight: "16px" }}>
            {Lsi.login}
          </UU5.Bricks.Span>
          <Plus4U5.App.LoginButton
            key="loginButton"
            style={{
              width: "100px",
              height: "32px",
              borderRadius: "2px",
              backgroundColor: "#005DA7",
              color: "white",
              marginBottom: "4px"
            }}
          />
        </WelcomeRow>
      </UU5.Bricks.Div>
    );
  } //@@viewOff:render
});

export default NotAuthenticated;

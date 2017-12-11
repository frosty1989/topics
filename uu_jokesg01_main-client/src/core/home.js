import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import UU5 from "uu5g04";
import "uu5g04-bricks";
import Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-bricks";
import ns from "ns";

import Lsi from "./lsi.js";
import WelcomeRow from "../bricks/welcome-row.js";
import "./home.less";

const Home = createReactClass({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin, UU5.Common.RouteMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.tag("NotAuthenticated"),
    classNames: {
      main: ns.css("home"),
      welcomeRow: ns.css("home-welcome-row"),
      welcome: ns.css("home-welcome")
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    identity: PropTypes.shape()
  },
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
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <UU5.Bricks.Row className={this.getClassName("welcomeRow")}>
          <UU5.Bricks.Div className={this.getClassName("welcome")}>
            <UU5.Bricks.Column colWidth="x12 s12 m3 l3 xl3">
              <Plus4U5.Bricks.UserPhoto style={{ margin: "0 auto", width: "100px" }} />
            </UU5.Bricks.Column>
            <UU5.Bricks.Column colWidth="x12 s12 m9 l9 xl9">
              <UU5.Bricks.Header
                style={{
                  marginTop: "10px",
                  fontSize: "30px",
                  borderBottom: "0px"
                }}
                level="2"
                content={Lsi.welcomeShort}
              />
              <UU5.Bricks.Header
                style={{
                  marginTop: "10px",
                  paddingBottom: "45px",
                  fontSize: "30px",
                  borderBottom: "0px"
                }}
                level="2"
                content={this.props.identity.name}
              />
            </UU5.Bricks.Column>
          </UU5.Bricks.Div>
        </UU5.Bricks.Row>
        <WelcomeRow textPadding="6px" icon="mdi-human-greeting">
          {Lsi.introAuth}
        </WelcomeRow>
        <WelcomeRow textPadding="10px" icon="mdi-monitor">
          {Lsi.clientSideAuth}
        </WelcomeRow>
        <WelcomeRow textPadding="10px" icon="mdi-server">
          {Lsi.serverSideAuth}
        </WelcomeRow>
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default Home;

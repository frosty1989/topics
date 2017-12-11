import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import UU5 from "uu5g04";
import "uu5g04-bricks";
import ns from "ns";

import Lsi from "./lsi.js";
import LeftLink from "../bricks/left-link.js";
import "./left.less";

export const Left = createReactClass({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin, UU5.Common.CcrReaderMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.tag("Left"),
    classNames: {
      main: ns.css("left"),
      menu: ns.css("left-menu"),
      menuItem: ns.css("left-menu-item"),
      aboutAuth: ns.css("about-authors"),
      aboutApp: ns.css("about-app")
    },
    lsi: Lsi.leftLinks
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    home: PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      home: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _goToAbout() {
    this.getCcrComponentByKey(UU5.Environment.CCRKEY_ROUTER) &&
      this.getCcrComponentByKey(UU5.Environment.CCRKEY_ROUTER).setRoute("/about");
  },

  _goHome() {
    this.getCcrComponentByKey(UU5.Environment.CCRKEY_ROUTER) &&
      this.getCcrComponentByKey(UU5.Environment.CCRKEY_ROUTER).setRoute("/home");
  },

  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <UU5.Bricks.Div className="center">
          <UU5.Bricks.Image name="Logo" responsive src="assets/logo.png" />
        </UU5.Bricks.Div>

        {this.props.home && (
          <LeftLink>
            <UU5.Bricks.Link onClick={this._goHome}>
              <UU5.Bricks.Icon
                icon="mdi-home"
                style={{ fontSize: "20px", lineHeight: "20px", fontFamily: "Material Design Icons" }}
              />
              <UU5.Bricks.Span style={{ paddingLeft: "10px", lineHeight: "20px" }}>
                {this.getLsiComponent("welcome")}
              </UU5.Bricks.Span>
            </UU5.Bricks.Link>
          </LeftLink>
        )}

        <LeftLink>
          <UU5.Bricks.Link content={this.getLsiComponent("aboutApp")} onClick={this._goToAbout} />
        </LeftLink>
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default Left;

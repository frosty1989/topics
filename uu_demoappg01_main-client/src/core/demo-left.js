import React from "react";
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import * as UU5 from "uu5g04";
import "uu5g04-bricks";

import LeftLink from "./left-link.js";
import About from "./about.js";
import DemoHome from "./demo-home.js";


import Cfg from "./_config.js";
import "./demo-left.less";

export const DemoLeft = createReactClass({

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.CcrReaderMixin

  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Cfg.APP + ".DemoLeft",
    nestingLevel: "boxCollection",
    classNames: {
      main: Cfg.CSS + "-demo-left",
      menu: Cfg.CSS + "-demo-left-menu",
      menuItem: Cfg.CSS + "-demo-left-menu-item",
      aboutAuth: Cfg.CSS + "-about-authors",
      aboutApp: Cfg.CSS + "-about-app"
    },
    lsi: {
      welcome: {
        cs: "Uvítací stránka",
        en: "Welcome page"
      },
      aboutAuth: {
        cs: "O Autorech",
        en: "About Authors"
      },
      aboutApp: {
        cs: "O Aplikaci",
        en: "About Application"
      }
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
  _goToAbout() {
    this.getCcrComponentByKey(UU5.Environment.CCRKEY_ROUTER) && this.getCcrComponentByKey(UU5.Environment.CCRKEY_ROUTER).setRoute(
      <About/>,
      {url: {useCase: "about", parameters: {}}}
    );
  },

  _goHome() {
    this.getCcrComponentByKey(UU5.Environment.CCRKEY_ROUTER) && this.getCcrComponentByKey(UU5.Environment.CCRKEY_ROUTER).setRoute(
      <DemoHome/>,
      {url: {useCase: "home", parameters: {}}}
    );
  },

  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render(){
    return (
      this.getNestingLevel()
        ? (
        <UU5.Bricks.Div {...this.getMainPropsToPass()}>
          <UU5.Bricks.Div className="center">
            <UU5.Bricks.Image
              name="Logo"
              responsive
              src="assets/logo.png"/>
          </UU5.Bricks.Div>

          {(this.props.home) ?  <LeftLink>
            <UU5.Bricks.Link onClick={this._goHome}>
              <UU5.Bricks.Span
                className="mdi-home"
                style={{fontSize: "20px", lineHeight: "20px", fontFamily: "Material Design Icons"}}
              />
              <UU5.Bricks.Span style={{paddingLeft: "10px", lineHeight: "20px"}}>
                {this.getLSIComponent("welcome")}
              </UU5.Bricks.Span>
            </UU5.Bricks.Link>
          </LeftLink> : null}

          <LeftLink>
            <UU5.Bricks.Link
              content={Cfg.LSILABEL_ABOUT}
              onClick={this._goToAbout}
            />
          </LeftLink>
        </UU5.Bricks.Div>
      ) : null
    );
  }
  //@@viewOff:render
});

export default DemoLeft;


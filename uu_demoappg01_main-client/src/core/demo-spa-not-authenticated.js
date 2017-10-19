import React from "react";
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import * as UU5 from "uu5g04";
import "uu5g04-bricks";

import * as Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-app";

import Cfg from "./_config.js";

import "./demo-spa-not-authenticated.less";
import DemoLeft from "./demo-left.js";
import DemoBottom from "./demo-bottom.js";
import About from "./about.js";
import DemoNotAuthenticated from "./demo-not-authenticated.js";
import Calls from "calls";

const DemoSpaNotAuthenticated = createReactClass({

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Cfg.APP + ".DemoSpaNotAuthenticated",
    nestingLevel: "spa",
    classNames: {
      main: Cfg.CSS + "-demo-spa-not-authenticated"
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
  _getLanguageSelector() {
    return <UU5.Bricks.LanguageSelector
      headerMode="code"
      bodyMode="label-code"
      displayedLanguages={["cs", "en"]}
      className="plus4u5-app-page-language-selector"
    />;
  },

  _getRoute() {
    let route = null;
    let baseUri = Calls.APP_BASE_URI;
    let uc = (window.location.href.substr(0, baseUri.length) === baseUri ? window.location.href.substr(baseUri.length) : "");

    if (uc.match(/^\/?about/)) {
      route = <About/>;
    } else {
      route = <DemoNotAuthenticated/>;
    }
    return route;
  },

  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render(){
    let routerBasePath = Calls.APP_BASE_URI.replace(/\/+$/, "");
    return (
      this.getNestingLevel()
        ? (
        <Plus4U5.App.Page
          {...this.getMainPropsToPass()}
          top={<Plus4U5.App.Top style={{backgroundColor: '#005DA7'}} content={Cfg.LSILABEL_APP_NAME}/>}
          bottom={<DemoBottom/>}
          type={2}
          systemLayerContent={[
            this._getLanguageSelector(),
            <Plus4U5.App.Button/>
          ]}
          left={<DemoLeft/>}
          leftWidth="!xs-320px !s-320px !m-256px l-256px xl-256px"
        >
          <UU5.Common.Router
            urlBuilder={Plus4U5.Common.Url}
            route={this._getRoute()}
            basePath={routerBasePath}
          />
        </Plus4U5.App.Page>
      ) : null
    );
  }
  //@@viewOff:render
});

export default DemoSpaNotAuthenticated;


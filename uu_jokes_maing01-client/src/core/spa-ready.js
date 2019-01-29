//@@viewOn:imports
import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import * as Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-app";

import Config from "./config/config.js";
import Bottom from "./bottom";
import Left from "./left";
import Jokes from "../routes/jokes";
import CategoryManagement from "../routes/category-management";
import About from "../routes/about";

import "./spa-ready.less";
//@@viewOff:imports

export const SpaReady = createReactClass({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.PureRenderMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "SpaReady",
    classNames: {
      main: Config.CSS + "spaready"
    },
    opt: {
      pureRender: true // avoid re-render from parent
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    calls: PropTypes.object.isRequired,
    appData: PropTypes.shape({
      awid: PropTypes.string,
      state: PropTypes.string,
      name: PropTypes.string,
      logo: PropTypes.string,
      uuIdentity: PropTypes.string,
      categories: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          name: PropTypes.string
        })
      ),
      userProfiles: PropTypes.arrayOf(PropTypes.string),
      setAppData: PropTypes.func
    }).isRequired
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <Plus4U5.App.Page
        {...this.getMainPropsToPass()}
        top={<Plus4U5.App.Top content={this.props.appData.name} />} // TopTitle
        bottom={<Bottom />}
        type={1}
        displayedLanguages={["cs", "en"]}
        left={<Left appData={this.props.appData} authenticated={true} />}
        leftWidth="!xs-320px !s-320px !m-256px l-256px xl-256px"
      >
        <UU5.Common.Router
          route=""
          notFoundRoute="jokes"
          routes={{
            jokes: { component: <Jokes calls={this.props.calls} appData={this.props.appData} /> },
            "": "jokes",
            categoryManagement: {
              component: <CategoryManagement calls={this.props.calls} appData={this.props.appData} />
            },
            about: { component: <About /> }
          }}
          controlled={false}
        />
      </Plus4U5.App.Page>
    );
  }
  //@@viewOff:render
});

export default SpaReady;

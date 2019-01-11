//@@viewOn:imports
import React from "react";
import PropTypes from "prop-types";
import createReactClass from "create-react-class";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";

import Config from "./config/config.js";
import Uri from "../helpers/uri-helpers.js";

import "./left-link.less";
//@@viewOff:imports

const LeftLink = createReactClass({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "LeftLink",
    classNames: {
      main: Config.CSS + "leftlink",
      inner: Config.CSS + "leftlink-inner",
      sizeXl: Config.CSS + "leftlink-xl",
      active: Config.CSS + "leftlink-active"
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    appData: PropTypes.object,
    route: PropTypes.string,
    active: PropTypes.bool,
    size: PropTypes.oneOf(["l", "xl"])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      route: null,
      size: "l"
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  _goRoute() {
    // to reset menu
    // UU5.Environment.App.menuRef.update("");
    UU5.Environment.setRoute(this.props.route);
  },

  _tabRoute() {
    // to reset menu
    // UU5.Environment.App.menuRef.update("");
    Uri.openNewTab({ code: this.props.route });
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _getChildren() {
    let children = React.Children.toArray(this.props.children);

    if (typeof this.props.route === "string") {
      children = (
        <UU5.Bricks.Link onClick={this._goRoute} onWheelClick={this._tabRoute} onCtrlClick={this._tabRoute}>
          {children}
        </UU5.Bricks.Link>
      );
    }

    return children;
  },

  _propsToPass() {
    let props = this.getMainPropsToPass();
    if (this.props.active) {
      props.className = `${props.className} ${this.getClassName("active")}`;
    }
    if (this.props.size === "xl") {
      props.className = `${props.className} ${this.getClassName("sizeXl")}`;
    }
    return props;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Div {...this._propsToPass()}>
        <UU5.Bricks.Div className={this.getClassName("inner")}>{this._getChildren()}</UU5.Bricks.Div>
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default LeftLink;

//@@viewOn:imports
import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";

import Config from "./config/config.js";

import "./delete.less";
import LSI from "./delete-lsi.js";
//@@viewOff:imports

export const Delete = createReactClass({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Delete",
    classNames: {
      main: Config.CSS + "delete"
    },
    lsi: LSI
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    data: PropTypes.object
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
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <UU5.Bricks.P>{this.getLsiComponent("confirm", null, this.props.data.name)}</UU5.Bricks.P>
        {/* // CheckBox */}
        <UU5.Forms.Checkbox name="forceDelete" label={this.getLsiComponent("forced")} labelPosition="right" />
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default Delete;

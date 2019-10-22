//@@viewOn:imports
import React from "react";
import PropTypes from "prop-types";
import UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";

import "./checkbox.less";
import LSI from "./checkbox-lsi.js";
//@@viewOff:imports

//@@viewOn:statics
function getBoolString(bool) {
  return bool ? "yes" : "no";
}
//@@viewOff:statics

export const Checkbox = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Checkbox",
    classNames: {
      main: Config.CSS + "checkbox"
    },
    lsi: LSI
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    addFilter: PropTypes.func.isRequired,
    getValues: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    filters: PropTypes.array.isRequired,
    values: PropTypes.any
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      value: !!this.props.values
    };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _handleChange(opt) {
    opt.component.onChangeDefault(opt);
    this.setState({ value: opt.value });
  },

  _handleSubmit() {
    let values = this.props.getValues();
    let lsiKey = `${values.type}_${getBoolString(this.state.value)}`;
    let usedFilter = this.props.filters.find(filter => filter.key === values.type);

    this.props.addFilter(values.type, this.getLsiComponent(lsiKey), this.state.value, usedFilter.filterFn);
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let lsiKey = `${this.props.type}_${getBoolString(this.state.value)}`;
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <UU5.Forms.Checkbox
          type={2}
          name={this.props.type}
          value={this.state.value}
          onChange={this._handleChange}
          label={this.getLsiValue(lsiKey)}
          labelPosition="right"
          inputWidth="auto"
          controlled={false}
        />
        <UU5.Bricks.Button onClick={this._handleSubmit} colorSchema="primary" content={this.getLsiValue("apply")} />
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default Checkbox;

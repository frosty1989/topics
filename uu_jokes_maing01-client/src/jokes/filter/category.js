//@@viewOn:imports
import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";

import "./category.less";
import LSI from "./category-lsi.js";
//@@viewOff:imports

export const Category = createReactClass({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Category",
    classNames: {
      main: Config.CSS + "category"
    },
    lsi: LSI
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    appData: PropTypes.object,
    addFilter: PropTypes.func.isRequired,
    getValues: PropTypes.func.isRequired,
    filters: PropTypes.array.isRequired,
    values: PropTypes.string
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
  _handleSubmit() {
    let values = this.props.getValues();
    let usedFilter = this.props.filters.find(filter => filter.key === values.type);
    this.props.addFilter(
      values.type,
      this.getLsiComponent(
        "category",
        null,
        this.props.appData.categories.find(category => category.id === values[values.type]).name
      ),
      values[values.type],
      usedFilter.filterFn
    );
  },

  _getOptions() {
    return this.props.appData.categories.map(category => (
      <UU5.Forms.Select.Option value={category.id} key={category.id} style="whiteSpace: nowrap">
        {category.name}
      </UU5.Forms.Select.Option>
    ));
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <UU5.Forms.Select value={this.props.values} name="category" inputWidth="auto" controlled={false}>
          {this._getOptions()}
        </UU5.Forms.Select>
        <UU5.Bricks.Button onClick={this._handleSubmit} colorSchema="primary" content={this.getLsiValue("apply")} />
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default Category;

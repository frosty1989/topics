//@@viewOn:imports
import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";

import Config from "./config/config.js";
import { dig } from "../helpers/object-utils.js";
import Rating from "./filter/rating.js";
import Category from "./filter/category.js";
import Checkbox from "./filter/checkbox.js";

import "./filter.less";
import LSI from "./filter-lsi.js";
//@@viewOff:imports

export const Filter = createReactClass({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.PureRenderMixin, UU5.Common.LsiMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Filter",
    classNames: {
      main: Config.CSS + "filter",
      valueColumn: Config.CSS + "filter-checkbox-row"
    },
    opt: {
      pureRender: true
    },
    lsi: LSI
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    appData: PropTypes.object,
    appliedFilters: PropTypes.object,
    filters: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string,
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        filterFn: PropTypes.func
      })
    ),
    addFilter: PropTypes.func,
    removeFilter: PropTypes.func,
    filterBar: PropTypes.object
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      selectedType: null
    };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _registerForm(cmp) {
    this._form = cmp;
  },

  _getFormValues() {
    return this._form.getValues();
  },

  _getOptions() {
    return Object.keys(this.props.filters).map(key => {
      let item = this.props.filters[key];
      return (
        <UU5.Forms.Select.Option key={item.key} value={item.key}>
          {this.getLsiItem(this.props.filters[key].label)}
        </UU5.Forms.Select.Option>
      );
    });
  },

  _handleTypeSelection(opt) {
    opt.component.onChangeDefault(opt);
    this.setState({
      selectedType: opt.value
    });
  },

  _wrapWithColumn(content) {
    return <UU5.Bricks.Column colWidth="xs-12 s-6 m-6 l-6 xl-6">{content}</UU5.Bricks.Column>;
  },

  _getValueByType() {
    let child;
    let filter = dig(this.props.appliedFilters, this.state.selectedType, "value");
    switch (this.state.selectedType) {
      case "category":
        child = (
          <Category
            className={this.getClassName("valueColumn")}
            addFilter={this.props.addFilter}
            getValues={this._getFormValues}
            filters={this.props.filters}
            appData={this.props.appData}
            values={filter}
          />
        );
        break;
      case "averageRating":
        child = (
          <Rating
            className={this.getClassName("valueColumn")}
            addFilter={this.props.addFilter}
            values={dig(this.props.appliedFilters, "averageRating", "value")}
            filters={this.props.filters}
            getValues={this._getFormValues}
          />
        );
        break;
      case "visibility":
      case "uuIdentity":
      case "image":
        child = (
          <Checkbox
            className={this.getClassName("valueColumn")}
            addFilter={this.props.addFilter}
            values={filter}
            type={this.state.selectedType}
            filters={this.props.filters}
            getValues={this._getFormValues}
          />
        );
        break;
      default:
        child = <UU5.Bricks.Null />;
    }

    return this._wrapWithColumn(child);
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Forms.Form {...this.getMainPropsToPass()} ref_={this._registerForm}>
        <UU5.Bricks.Row className={this.getClassName().formRow} display="flex">
          <UU5.Bricks.Column colWidth="xs-12 s-6 m-5 l-4 xl-3">
            <UU5.Forms.Select
              name="type"
              value={this.state.selectedType}
              onChange={this._handleTypeSelection}
              inputColWidth="xs-12 s-11 m-7"
              placeholder={this.getLsiValue("filterTypePlaceholder")}
            >
              {this._getOptions()}
            </UU5.Forms.Select>
          </UU5.Bricks.Column>
          {this._getValueByType()}
        </UU5.Bricks.Row>
      </UU5.Forms.Form>
    );
  }
  //@@viewOff:render
});

export default Filter;
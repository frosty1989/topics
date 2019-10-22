//@@viewOn:imports
import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";

import Config from "./config/config.js";

import {JokesConsumer} from "../core/jokes-provider.js";
import "./update-form.less";
import LSI from "./update-form-lsi.js";
//@@viewOff:imports

export const Form = createReactClass({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.PureRenderMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "UpdateForm",
    classNames: {
      main: Config.CSS + "UpdateForm"
    },
    lsi: LSI,
    opt: {
      pureRender: true
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    showPublished: PropTypes.bool
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
  _getCategoriesOptions(categories) {
    return categories.map(category => (
      <UU5.Forms.Select.Option value={category.id} key={category.id}>
        {category.name}
      </UU5.Forms.Select.Option>
    ));
  },

  _validateText(opt) {
    let result = { feedback: Config.FEEDBACK.INITIAL, value: opt.value };
    // when there is no event, validation comes from "isValid" method
    if (opt.event === undefined) {
      if (!opt.value && !this._file.getValue()) {
        // text is empty, check file
        result.feedback = Config.FEEDBACK.ERROR;
        result.message = this.getLsiComponent("textOrFile");
        opt.component.setFeedback(result.feedback, result.message);
      }
    }
    return result;
  },

  _registerFile(cmp) {
    this._file = cmp;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <JokesConsumer>
        {({ categoryList }) => (
          <UU5.Bricks.Div {...this.getMainPropsToPass()}>
            {/* // Name */}
            <UU5.Forms.Text inputAttrs={{ maxLength: 255 }} label={this.getLsiComponent("name")} name="name" required />
            {/* // Text */}
            <UU5.Forms.TextArea
              label={this.getLsiComponent("text")}
              inputAttrs={{ maxLength: 4000 }}
              name="text"
              onValidate={this._validateText}
              autoResize
            />
            {/* // Image */}
            <UU5.Forms.File label={this.getLsiComponent("image")} name="image" ref_={this._registerFile} />
            {/* // Categories */}
            <UU5.Forms.Select
              label={this.getLsiComponent("category")}
              name="categoryList"
              multiple
              openToContent={true}
            >
              {this._getCategoriesOptions(categoryList)}
            </UU5.Forms.Select>
          </UU5.Bricks.Div>
        )}
      </JokesConsumer>
    );
  }
  //@@viewOff:render
});

export default Form;

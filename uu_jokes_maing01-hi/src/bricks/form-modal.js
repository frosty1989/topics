//@@viewOn:imports
import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";

import Config from "./config/config.js";

import "./form-modal.less";
//@@viewOff:imports

export const FormModal = createReactClass({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "FormModal",
    classNames: {
      main: Config.CSS + "formmodal"
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    appData: PropTypes.object
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  open(setup, setStateCallback) {
    this._modal.open(
      {
        header: setup.header,
        // build content as form
        content: this._prepareForm(setup)
      },
      setStateCallback
    );
    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _registerModal(cmp) {
    this._modal = cmp;
  },

  _handleCancel() {
    this._modal.close();
  },

  _handleSave(opt, setup) {
    if (opt.component.isValid()) {
      // form valid, close modal and pass data down
      this._modal.close();
      setup.onSave(opt.values);
    } else {
      opt.component.validate();
    }
  },

  _prepareForm(setup) {
    // build form props first
    const formProps = {
      onCancel: this._handleCancel,
      onSave: opt => this._handleSave(opt, setup),
      values: setup.values,
      id: UU5.Common.Tools.generateUUID() // ensure rerender of the content
    };

    // build form itself
    return (
      <UU5.Forms.Form {...formProps}>
        {setup.content}
        <UU5.Forms.Controls {...setup.controls} />
      </UU5.Forms.Form>
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return <UU5.Bricks.Modal {...this.getMainPropsToPass()} ref_={this._registerModal} />;
  }
  //@@viewOff:render
});

export default FormModal;

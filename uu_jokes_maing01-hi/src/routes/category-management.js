//@@viewOn:imports
import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";

import Calls from "calls";
import Config from "./config/config.js";
import ArrayUtils from "../helpers/array-utils.js";
import CategoryReady from "../category/ready.js";
import { reportError, reportSuccess } from "../helpers/alert-helper";

import "./category-management.less";
import LSI from "./category-management-lsi.js";
import JokesReady from "../jokes/ready";
import { dig } from "../helpers/object-utils";
import SpaContext from "../core/spa-context.js";
//@@viewOff:imports

export const CategoryManagement = createReactClass({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.RouteMixin, UU5.Common.CcrReaderMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "CategoryManagement",
    classNames: {
      main: Config.CSS + "categorymanagement"
    },
    lsi: LSI
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding

  onRouteChanged_() {
    let menu = this.getCcrComponentByKey(Config.LEFT_MENU_CCR_KEY);
    menu && menu.setActiveRoute("categoryManagement");
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _handleUpdate(data, updateCategory, setAppData, categories) {
    // set new data (temporally)
    updateCategory(data.id, { ...data, inProgress: true })
      .then(dtoOut => this._handleUpdateDone(dtoOut, setAppData, categories))
      .catch(response => this._handleUpdateFail(response));
  },

  _handleUpdateDone(dtoOut, setAppData, categories) {
    setAppData({ categories: ArrayUtils.updateItem(categories, dtoOut) });
    // display alert
    reportSuccess(this.getLsiComponent("updateSuccessHeader"));
  },

  _handleUpdateFail(response) {
    // display alert
    reportError(this.getLsiComponent("updateFailHeader"), this._decideErrorDescription(response));
  },

  _handleCreate(data, createCategory, setAppData, categories) {
    createCategory({ ...data, inProgress: true })
      .then(dtoOut => this._handleCreateDone(dtoOut, setAppData, categories))
      .catch(response => this._handleCreateFail(response));
  },

  _handleCreateDone(dtoOut, setAppData, categories) {
    setAppData({ categories: ArrayUtils.addItem(categories, dtoOut) });
    // display alert
    reportSuccess(this.getLsiComponent("createSuccessHeader"));
  },

  _handleCreateFail(response) {
    // display alert
    reportError(this.getLsiComponent("createFailHeader"), this._decideErrorDescription(response));
  },

  _handleDelete(data, deleteCategory, setAppData, categories) {
    let original = data;
    let { forceDelete } = data;
    deleteCategory(data.id, undefined, { forceDelete })
      .then(dtoOut => this._handleDeleteDone(original, setAppData, categories))
      .catch(response => this._handleDeleteFail(response));
  },

  _handleDeleteDone(original, setAppData, categories) {
    setAppData({ categories: ArrayUtils.removeItem(categories, original) });
    // display alert
    reportSuccess(this.getLsiComponent("deleteSuccessHeader"));
  },

  _handleDeleteFail(response) {
    // display alert
    reportError(this.getLsiComponent("deleteFailHeader"), this._decideErrorDescription(response));
  },

  _decideErrorDescription(response) {
    switch (response.status) {
      case 400: // app error
        switch (response.code) {
          case Config.ERROR_CODES.CATEGORY_CONTAIN_JOKES:
            return this.getLsiComponent("categoryInUseError");
          case Config.ERROR_CODES.CATEGORY_NAME_NOT_UNIQUE:
            return this.getLsiComponent("categoryNameNotUnique");
        }
        break;
      case 403:
        return this.getLsiComponent("rightsError");
    }
    return this.getLsiComponent("unexpectedServerError");
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <UU5.Common.ListDataManager
          onLoad={Calls.categoryList}
          onCreate={Calls.categoryCreate}
          onDelete={Calls.categoryDelete}
          onUpdate={Calls.categoryUpdate}
        >
          {({ data: listData, handleCreate, handleDelete, handleUpdate }) => {
            if (listData) {
              return (
                <SpaContext.Consumer>
                  {({ setAppData, categories }) => (
                    <CategoryReady
                      {...this.getMainPropsToPass()}
                      data={listData}
                      onCreate={data => {
                        this._handleCreate(data, handleCreate, setAppData, categories);
                      }}
                      onUpdate={data => {
                        this._handleUpdate(data, handleUpdate, setAppData, categories);
                      }}
                      onDelete={data => {
                        this._handleDelete(data, handleDelete, setAppData, categories);
                      }}
                    />
                  )}
                </SpaContext.Consumer>
              );
            } else {
              return <UU5.Bricks.Loading />;
            }
          }}
        </UU5.Common.ListDataManager>
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default CategoryManagement;

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
  propTypes: {
    appData: PropTypes.object
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  onLoadSuccess_(dtoOut, setStateCallback) {
    // cast itemList directly into dtoOut
    this.setState(
      {
        loadFeedback: Config.FEEDBACK.READY,
        dtoOut: dtoOut.itemList,
        errorDtoOut: null
      },
      setStateCallback
    );

    return dtoOut;
  },

  getOnLoadData_(props) {
    // load 1000 items by default
    return {
      pageInfo: {
        pageSize: 1000
      }
    };
  },

  onRouteChanged_() {
    let menu = this.getCcrComponentByKey(Config.LEFT_MENU_CCR_KEY);
    menu && menu.setActiveRoute("categoryManagement");
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _handleUpdate(data, updateCategory) {
    // set new data (temporally)
    let original;
    this.setState(
      prevState => ({
        dtoOut: ArrayUtils.updateItemProgress(prevState.dtoOut, data, item => (original = item))
      }),
      () => {
        updateCategory(data.id, data)
          .then(dtoOut => this._handleUpdateDone(dtoOut, original))
          .catch(response => this._handleUpdateFail(response, original));
      }
    );
  },

  _handleUpdateDone(dtoOut, original) {
    this.setAsyncState(
      prevState => ({
        dtoOut: ArrayUtils.updateItemFinal(prevState.dtoOut, { ...original, ...dtoOut })
      }),
      this._setAppData
    );
    // display alert
    reportSuccess(this.getLsiComponent("updateSuccessHeader"));
  },

  _handleUpdateFail(response, original) {
    // set original value
    this.setAsyncState(
      prevState => ({
        dtoOut: ArrayUtils.updateItemFinal(prevState.dtoOut, original)
      }),
      this._setAppData
    );
    // display alert
    reportError(this.getLsiComponent("updateFailHeader"), this._decideErrorDescription(response));
  },

  _handleCreate(data, createCategory) {
    let original;
    // add new one
    this.setState(
      prevState => ({
        dtoOut: ArrayUtils.addItem(prevState.dtoOut, data, item => (original = item))
      }),
      () => {
        createCategory(data)
          .then(dtoOut => this._handleCreateDone(dtoOut, original))
          .catch(response => this._handleCreateFail(response, original));
      }
    );
  },

  _handleCreateDone(dtoOut, original) {
    // set id in dtoOut
    this.setAsyncState(
      prevState => ({
        dtoOut: ArrayUtils.updateItemFinal(prevState.dtoOut, { ...original, ...dtoOut })
      }),
      this._setAppData
    );
    // display alert
    reportSuccess(this.getLsiComponent("createSuccessHeader"));
  },

  _handleCreateFail(response, original) {
    // remove from dtoOut
    this.setAsyncState(prevState => ({
      dtoOut: ArrayUtils.removeItem(prevState.dtoOut, original)
    }));
    // display alert
    reportError(this.getLsiComponent("createFailHeader"), this._decideErrorDescription(response));
  },

  _handleDelete(data, deleteCategory) {
    let original;
    let { forceDelete } = data;
    delete data.forceDelete; // remove extra key
    this.setState(
      prevState => ({
        dtoOut: ArrayUtils.updateItemProgress(prevState.dtoOut, data, item => (original = item))
      }),
      () => {
        deleteCategory(data.id, forceDelete)
          .then(dtoOut => this._handleDeleteDone(dtoOut, original))
          .catch(response => this._handleDeleteFail(response, original));
      }
    );
  },

  _handleDeleteDone(dtoOut, original) {
    // remove from dataset
    this.setAsyncState(prevState => ({
      dtoOut: ArrayUtils.removeItem(prevState.dtoOut, original)
    }));
    // display alert
    reportSuccess(this.getLsiComponent("deleteSuccessHeader"));
  },

  _handleDeleteFail(response, original) {
    // set original value
    this.setAsyncState(
      prevState => ({
        dtoOut: ArrayUtils.updateItemFinal(prevState.dtoOut, original)
      }),
      this._setAppData
    );
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

  _setAppData(callBack) {
    this.props.appData.setAppData({ categories: this.state.dtoOut }, callBack);
  },

  _onLoad(data) {
    return Calls.categoryList(data).then(data => this.onLoadSuccess_(data));
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <UU5.Common.ListDataManager
          onLoad={this._onLoad}
          onCreate={Calls.categoryCreate}
          onDelete={Calls.categoryDelete}
          onUpdate={Calls.categoryUpdate}
        >
          {({ data, handleCreate, handleDelete, handleUpdate }) => {
            if (data) {
              return (
                <CategoryReady
                  {...this.getMainPropsToPass()}
                  data={data}
                  appData={this.props.appData}
                  onCreate={data => {
                    return this._handleCreate(data, handleCreate);
                  }}
                  onUpdate={data => {
                    return this._handleUpdate(data, handleUpdate);
                  }}
                  onDelete={data => {
                    return this._handleDelete(data, handleDelete);
                  }}
                />
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

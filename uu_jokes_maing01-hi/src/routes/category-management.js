//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";

import Calls from "calls";
import Config from "./config/config.js";
import ArrayUtils from "../helpers/array-utils.js";
import CategoryReady from "../category/ready.js";
import { reportError, reportSuccess } from "../helpers/alert-helper";

import {JokesConsumer} from "../core/jokes-provider.js";
import "./category-management.less";
import LSI from "./category-management-lsi.js";

//@@viewOff:imports

export const CategoryManagement = UU5.Common.VisualComponent.create({
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
  _handleUpdate(data, updateCategory, setAppData, categoryList) {
    // set new data (temporally)
    updateCategory(data.id, { ...data, inProgress: true })
      .then(dtoOut => this._handleUpdateDone(dtoOut, setAppData, categoryList))
      .catch(response => this._handleUpdateFail(response));
  },

  _handleUpdateDone(dtoOut, setAppData, categoryList) {
    setAppData({ categoryList: ArrayUtils.updateItem(categoryList, dtoOut) });
    // display alert
    reportSuccess(this.getLsiComponent("updateSuccessHeader"));
  },

  _handleUpdateFail(response) {
    // display alert
    reportError(this.getLsiComponent("updateFailHeader"), this._decideErrorDescription(response));
  },

  _handleCreate(data, createCategory, setAppData, categoryList) {
    createCategory({ ...data, inProgress: true })
      .then(dtoOut => this._handleCreateDone(dtoOut, setAppData, categoryList))
      .catch(response => this._handleCreateFail(response));
  },

  _handleCreateDone(dtoOut, setAppData, categoryList) {
    setAppData({ categoryList: ArrayUtils.addItem(categoryList, dtoOut) });
    // display alert
    reportSuccess(this.getLsiComponent("createSuccessHeader"));
  },

  _handleCreateFail(response) {
    // display alert
    reportError(this.getLsiComponent("createFailHeader"), this._decideErrorDescription(response));
  },

  _handleDelete(data, deleteCategory, setAppData, categoryList) {
    let original = data;
    let { forceDelete } = data;
    deleteCategory(data.id, undefined, { forceDelete })
      .then(() => this._handleDeleteDone(original, setAppData, categoryList))
      .catch(response => this._handleDeleteFail(response));
  },

  _handleDeleteDone(original, setAppData, categoryList) {
    setAppData({ categoryList: ArrayUtils.removeItem(categoryList, original) });
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
                <JokesConsumer>
                  {({ setAppData, categoryList }) => (
                    <CategoryReady
                      {...this.getMainPropsToPass()}
                      data={listData}
                      onCreate={data => {
                        this._handleCreate(data, handleCreate, setAppData, categoryList);
                      }}
                      onUpdate={data => {
                        this._handleUpdate(data, handleUpdate, setAppData, categoryList);
                      }}
                      onDelete={data => {
                        this._handleDelete(data, handleDelete, setAppData, categoryList);
                      }}
                    />
                  )}
                </JokesConsumer>
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

//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";

import Calls from "calls";
import Config from "./config/config.js";
import ArrayUtils from "../helpers/array-utils.js";
import NewspaperReady from "../newspaper/ready.js";
import { reportError, reportSuccess } from "../helpers/alert-helper";

import {JokesConsumer} from "../core/jokes-provider.js";
import "./newspaper-management.less";
import LSI from "./newspaper-management-lsi.js";

//@@viewOff:imports

export const NewspaperManagement = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.RouteMixin, UU5.Common.CcrReaderMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "NewspaperManagement",
    classNames: {
      main: Config.CSS + "newspapermanagement"
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
    menu && menu.setActiveRoute("newspaperManagement");
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _handleUpdate(data, updateNewspaper, setAppData, newspaperList) {
    // set new data (temporally)
    updateNewspaper(data.id, { ...data, inProgress: true })
      .then(dtoOut => this._handleUpdateDone(dtoOut, setAppData, newspaperList))
      .catch(response => this._handleUpdateFail(response));
  },

  _handleUpdateDone(dtoOut, setAppData, newspaperList) {
    setAppData({ newspaperList: ArrayUtils.updateItem(newspaperList, dtoOut) });
    // display alert
    reportSuccess(this.getLsiComponent("updateSuccessHeader"));
  },

  _handleUpdateFail(response) {
    // display alert
    reportError(this.getLsiComponent("updateFailHeader"), this._decideErrorDescription(response));
  },

  _handleCreate(data, createNewspaper, setAppData, newspaperList) {
    createNewspaper({ ...data, inProgress: true })
      .then(dtoOut => this._handleCreateDone(dtoOut, setAppData, newspaperList))
      .catch(response => this._handleCreateFail(response));
  },

  _handleCreateDone(dtoOut, setAppData, newspaperList) {
    setAppData({ newspaperList: ArrayUtils.addItem(newspaperList, dtoOut) });
    // display alert
    reportSuccess(this.getLsiComponent("createSuccessHeader"));
  },

  _handleCreateFail(response) {
    // display alert
    reportError(this.getLsiComponent("createFailHeader"), this._decideErrorDescription(response));
  },

  _handleDelete(data, deleteNewspaper, setAppData, newspaperList) {
    let original = data;
    let { forceDelete } = data;
    deleteNewspaper(data.id, undefined, { forceDelete })
      .then(() => this._handleDeleteDone(original, setAppData, newspaperList))
      .catch(response => this._handleDeleteFail(response));
  },

  _handleDeleteDone(original, setAppData, newspaperList) {
    setAppData({ newspaperList: ArrayUtils.removeItem(newspaperList, original) });
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
            return this.getLsiComponent("newspaperInUseError");
          case Config.ERROR_CODES.CATEGORY_NAME_NOT_UNIQUE:
            return this.getLsiComponent("newspaperNameNotUnique");
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
          onLoad={Calls.newspaperList}
          onCreate={Calls.newspaperCreate}
          onDelete={Calls.newspaperDelete}
          onUpdate={Calls.newspaperUpdate}
        >
          {({ data: listData, handleCreate, handleDelete, handleUpdate }) => {
            if (listData) {
              return (
                <JokesConsumer>
                  {({ setData, newspaperList }) => (
                    <NewspaperReady
                      {...this.getMainPropsToPass()}
                      data={listData}
                      onCreate={data => {
                        this._handleCreate(data, handleCreate, setData, newspaperList);
                      }}
                      onUpdate={data => {
                        this._handleUpdate(data, handleUpdate, setData, newspaperList);
                      }}
                      onDelete={data => {
                        this._handleDelete(data, handleDelete, setData, newspaperList);
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

export default NewspaperManagement;

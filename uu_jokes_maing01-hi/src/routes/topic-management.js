//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";

import Calls from "calls";
import Config from "./config/config.js";
import ArrayUtils from "../helpers/array-utils.js";
import TopicReady from "../topic/ready.js";
import { reportError, reportSuccess } from "../helpers/alert-helper";

import {JokesConsumer} from "../core/jokes-provider.js";
import "./topic-management.less";
import LSI from "./topic-management-lsi.js";

//@@viewOff:imports

export const TopicManagement = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.RouteMixin, UU5.Common.CcrReaderMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "TopicManagement",
    classNames: {
      main: Config.CSS + "topicmanagement"
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
    menu && menu.setActiveRoute("topicManagement");
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _handleUpdate(data, updateTopic, setAppData, topicList) {
    // set new data (temporally)
    updateTopic(data.id, { ...data, inProgress: true })
      .then(dtoOut => this._handleUpdateDone(dtoOut, setAppData, topicList))
      .catch(response => this._handleUpdateFail(response));
  },

  _handleUpdateDone(dtoOut, setAppData, topicList) {
    setAppData({ topicList: ArrayUtils.updateItem(topicList, dtoOut) });
    // display alert
    reportSuccess(this.getLsiComponent("updateSuccessHeader"));
  },

  _handleUpdateFail(response) {
    // display alert
    reportError(this.getLsiComponent("updateFailHeader"), this._decideErrorDescription(response));
  },

  _handleCreate(data, createTopic, setAppData, topicList) {
    createTopic({ ...data, inProgress: true })
      .then(dtoOut => this._handleCreateDone(dtoOut, setAppData, topicList))
      .catch(response => this._handleCreateFail(response));
  },

  _handleCreateDone(dtoOut, setAppData, topicList) {
    setAppData({ topicList: ArrayUtils.addItem(topicList, dtoOut) });
    // display alert
    reportSuccess(this.getLsiComponent("createSuccessHeader"));
  },

  _handleCreateFail(response) {
    // display alert
    reportError(this.getLsiComponent("createFailHeader"), this._decideErrorDescription(response));
  },

  _handleDelete(data, deleteTopic, setAppData, topicList) {
    let original = data;
    let { forceDelete } = data;
    deleteTopic(data.id, undefined, { forceDelete })
      .then(() => this._handleDeleteDone(original, setAppData, topicList))
      .catch(response => this._handleDeleteFail(response));
  },

  _handleDeleteDone(original, setAppData, topicList) {
    setAppData({ topicList: ArrayUtils.removeItem(topicList, original) });
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
            return this.getLsiComponent("topicInUseError");
          case Config.ERROR_CODES.CATEGORY_NAME_NOT_UNIQUE:
            return this.getLsiComponent("topicNameNotUnique");
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
          onLoad={Calls.topicList}
          onCreate={Calls.topicCreate}
          onDelete={Calls.topicDelete}
          onUpdate={Calls.topicUpdate}
        >
          {({ data: listData, handleCreate, handleDelete, handleUpdate }) => {
            if (listData) {
              return (
                <JokesConsumer>
                  {({ setData, topicList }) => (
                    <TopicReady
                      {...this.getMainPropsToPass()}
                      data={listData}
                      onCreate={data => {
                        this._handleCreate(data, handleCreate, setData, topicList);
                      }}
                      onUpdate={data => {
                        this._handleUpdate(data, handleUpdate, setData, topicList);
                      }}
                      onDelete={data => {
                        this._handleDelete(data, handleDelete, setData, topicList);
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

export default TopicManagement;

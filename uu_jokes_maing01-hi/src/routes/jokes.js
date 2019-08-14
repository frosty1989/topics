//@@viewOn:imports
import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5tilesg01";
import Calls from "calls";

import Config from "./config/config.js";
import JokesReady from "../jokes/ready.js";
import ArrayUtils from "../helpers/array-utils";
import { dig } from "../helpers/object-utils.js";
import { reportSuccess, reportError } from "../helpers/alert-helper";

import "./jokes.less";
import LSI from "./jokes-lsi.js";
//@@viewOff:imports

export const Jokes = createReactClass({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.RouteMixin, UU5.Common.CcrReaderMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Jokes",
    classNames: {
      main: Config.CSS + "jokes"
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
    menu && menu.setActiveRoute("jokes");
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _handleUpdate(data, updateJoke) {
    // set new data (temporally)
    let original;
    this.setState(
      prevState => ({
        dtoOut: ArrayUtils.updateItemProgress(prevState.dtoOut, data, item => (original = item))
      }),
      () => {
        updateJoke(data.id, data, undefined, null, "updateJoke")
          .then(dtoOut => this._handleUpdateDone(dtoOut, original))
          .catch(response => this._handleUpdateFail(response, original));
      }
    );
  },

  _handleUpdateDone(dtoOut, original) {
    this.setAsyncState(prevState => ({
      dtoOut: ArrayUtils.updateItemFinal(prevState.dtoOut, { ...original, ...dtoOut })
    }));
    // display alert
    reportSuccess(this.getLsiComponent("updateSuccessHeader"));
  },

  _handleUpdateFail(response, original) {
    // set original value
    this.setAsyncState(prevState => ({
      dtoOut: ArrayUtils.updateItemFinal(prevState.dtoOut, original)
    }));
    // display alert
    reportError(this.getLsiComponent("updateFailHeader"), this._decideErrorDescription(response));
  },

  _handleRate(data, updateRating) {
    // set new data (temporally)
    let original;
    let { newRate } = data;
    delete data.newRate;
    this.setState(
      prevState => ({
        dtoOut: ArrayUtils.updateItemProgress(prevState.dtoOut, data, item => (original = item))
      }),
      () => {
        updateRating(data.id, { id: data.id, rating: newRate }, undefined, null, "updateJokeRating")
          .then(dtoOut => this._handleRateDone(dtoOut, original))
          .catch(response => this._handleRateFail(response, original));
      }
    );
  },

  _handleRateDone(dtoOut, original) {
    this.setAsyncState(prevState => ({
      dtoOut: ArrayUtils.updateItemFinal(prevState.dtoOut, { ...original, ...dtoOut })
    }));
    // display alert
    reportSuccess(this.getLsiComponent("rateSuccessHeader"));
  },

  _handleRateFail(response, original) {
    // set original value
    this.setAsyncState(prevState => ({
      dtoOut: ArrayUtils.updateItemFinal(prevState.dtoOut, original)
    }));
    // display alert
    reportError(this.getLsiComponent("rateFailHeader"), this._decideErrorDescription(response));
  },

  _handleUpdateVisibility(data, updateVisibility) {
    // set new data (temporally)
    let original;
    this.setState(
      prevState => ({
        dtoOut: ArrayUtils.updateItemProgress(prevState.dtoOut, data, item => (original = item))
      }),
      () => {
        updateVisibility(data.id, data, undefined, null, "updateJokeVisibility")
          .then(dtoOut => this._handleUpdateVisibilityDone(dtoOut, original))
          .catch(response => this._handleUpdateVisibilityFail(response, original));
      }
    );
  },

  _handleUpdateVisibilityDone(dtoOut, original) {
    this.setState(prevState => ({
      dtoOut: ArrayUtils.updateItemFinal(prevState.dtoOut, { ...original, ...dtoOut })
    }));
    // display alert
    let lsiKey = original.visibility ? "unpublish" : "publish";
    reportSuccess(this.getLsiComponent(`${lsiKey}SuccessHeader`));
  },

  _handleUpdateVisibilityFail(response, original) {
    // set original value
    this.setAsyncState(prevState => ({
      dtoOut: ArrayUtils.updateItemFinal(prevState.dtoOut, original)
    }));
    // display alert
    let lsiKey = original.visibility ? "unpublish" : "publish";
    reportError(this.getLsiComponent(`${lsiKey}FailHeader`), this._decideErrorDescription(response));
  },

  _handleCreate(data, createJoke) {
    let original;
    // add new one
    this.setState(
      prevState => ({
        dtoOut: ArrayUtils.addItem(prevState.dtoOut, data, item => (original = item))
      }),
      () => {
        createJoke(data)
          .then(dtoOut => this._handleCreateDone(dtoOut, original))
          .catch(response => this._handleCreateFail(response, original));
      }
    );
  },

  _handleCreateDone(dtoOut, original) {
    // set id in dtoOut
    this.setAsyncState(prevState => ({
      dtoOut: ArrayUtils.updateItemFinal(prevState.dtoOut, { ...original, ...dtoOut })
    }));
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

  _handleDelete(data, deleteJoke) {
    let original;
    this.setState(
      prevState => ({
        dtoOut: ArrayUtils.updateItemProgress(prevState.dtoOut, data, item => (original = item))
      }),
      () => {
        deleteJoke(data.id)
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
    this.setAsyncState(prevState => ({
      dtoOut: ArrayUtils.updateItemFinal(prevState.dtoOut, original)
    }));
    // display alert
    reportError(this.getLsiComponent("deleteFailHeader"), this._decideErrorDescription(response));
  },

  _decideErrorDescription(response) {
    switch (response.status) {
      case 400: // app error
        switch (response.code) {
          case Config.ERROR_CODES.JOKE_RATING_NOT_AUTHORIZED:
            return this.getLsiComponent("rateRightsError");
          case Config.ERROR_CODES.JOKE_DELETE_NOT_AUTHORIZED:
          case Config.ERROR_CODES.JOKE_UPDATE_NOT_AUTHORIZED:
            return this.getLsiComponent("rightsError");
        }
        break;
      case 403:
        return this.getLsiComponent("rightsError");
    }
    return this.getLsiComponent("unexpectedServerError");
  },

  _filterOutVisibility(jokes) {
    let canSeeAllUnpublished = UU5.Environment.App.authorization.canSeeAllUnpublished();
    let canSeeUnpublished = UU5.Environment.App.authorization.canSeeUnpublished();

    return jokes.filter(joke => {
      let result;

      if (canSeeAllUnpublished) {
        result = true;
      } else if (canSeeUnpublished && UU5.Environment.App.authorization.isOwner(joke)) {
        result = true;
      } else {
        result = joke.visibility;
      }
      return result;
    });
  },

  _handleLoad(data) {
    return Calls.jokeList(data).then(data => {
      this.setAsyncState({
        loadFeedback: Config.FEEDBACK.READY,
        dtoOut: data.itemList,
        errorDtoOut: null
      });
      return data;
    });
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <UU5.Common.ListDataManager
          onLoad={this._handleLoad}
          onCreate={Calls.jokeCreate}
          onDelete={Calls.jokeDelete}
          onUpdate={{
            updateJokeRating: Calls.updateJokeRating,
            updateJokeVisibility: Calls.updateJokeVisibility,
            updateJoke: Calls.updateJoke
          }}
        >
          {({ data, handleCreate, handleUpdate, handleDelete }) => {
            if (data) {
              return (
                <JokesReady
                  data={this._filterOutVisibility(data)}
                  detailId={dig(this.props, "params", "id")}
                  onCreate={data => {
                    return this._handleCreate(data, handleCreate);
                  }}
                  onUpdate={data => {
                    return this._handleUpdate(data, handleUpdate);
                  }}
                  onRate={data => {
                    return this._handleRate(data, handleUpdate);
                  }}
                  onDelete={data => {
                    return this._handleDelete(data, handleDelete);
                  }}
                  onUpdateVisibility={data => {
                    return this._handleUpdateVisibility(data, handleUpdate);
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

export default Jokes;

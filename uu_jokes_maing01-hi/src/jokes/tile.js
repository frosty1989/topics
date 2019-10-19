//@@viewOn:imports
import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";

import Uri from "../helpers/uri-helpers.js";
import { nl2br } from "../helpers/string-helper";

import "./tile.less";
import Config from "./config/config";
//@@viewOff:imports

export const Tile = createReactClass({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Tile",
    classNames: {
      main: Config.CSS + "tile",
      notPublished: Config.CSS + "tile-not-published",
      header: Config.CSS + "tile-header",
      footer: Config.CSS + "tile-footer",
      content: Config.CSS + "tile-content",
      text: Config.CSS + "tile-text"
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    onDetail: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onRate: PropTypes.func.isRequired,
    onUpdateVisibility: PropTypes.func.isRequired,
    data: PropTypes.shape({
      id: PropTypes.string,
      text: PropTypes.text
    }).isRequired
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
  _getMainProps() {
    let props = this.getMainPropsToPass();
    // add css class
    if (!this.props.data.visibility) {
      props.className = props.className + ` ${this.getClassName("notPublished")}`;
    }

    return props;
  },

  _handleDetail() {
    this.props.onDetail(this.props.data);
  },

  _handleUpdate() {
    this.props.onUpdate(this.props.data);
  },

  _handleDelete() {
    this.props.onDelete(this.props.data);
  },

  _handleUpdateVisibility() {
    this.props.onUpdateVisibility({ ...this.props.data, visibility: !this.props.data.visibility });
  },

  _handleRating(rateValue) {
    this.props.onRate({ ...this.props.data, newRate: rateValue });
  },

  _canManage(joke) {
    return (
      UU5.Environment.App.authorization.canManageAll() ||
      (UU5.Environment.App.authorization.canManage() && UU5.Environment.App.authorization.isOwner(joke))
    );
  },

  _getImage() {
    let imageUrl = Uri.getBinaryUrl(this.props.data.image);
    return <UU5.Bricks.Image src={imageUrl} authenticate />;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Div {...this._getMainProps()}>
        <UU5.Bricks.Div className={this.getClassName("header")} mainAttrs={{ onClick: this._handleDetail }}>
          {/* // Icon */}
          {!this.props.data.visibility && <UU5.Bricks.Icon icon="mdi-eye-off" />}
          {/* // Joke name */}
          <span>
            {
              // basic HTML tags are used to prevent possible uu5string from execution
              this.props.data.name
            }
          </span>
        </UU5.Bricks.Div>
        <UU5.Bricks.Div className={this.getClassName("content")} mainAttrs={{ onClick: this._handleDetail }}>
          {/* // Joke text */}
          <div className={this.getClassName("text")}>
            {// basic HTML tags are used to prevent possible uu5string from execution
            nl2br(this.props.data.text)}
          </div>
          {/* // Joke image */}
          {this.props.data.image && this._getImage()}
        </UU5.Bricks.Div>
        <UU5.Bricks.Div className={this.getClassName("footer")}>
          <UU5.Bricks.Rating value={this.props.data.averageRating} onClick={this._handleRating} />
          {this._canManage(this.props.data) && (
            <UU5.Bricks.Div>
              {/* // EditButton */}
              <UU5.Bricks.Icon icon="mdi-pencil" mainAttrs={{ onClick: this._handleUpdate }} />
              {/* // PublishButton */}
              {UU5.Environment.App.authorization.canToggleVisibility() && (
                <UU5.Bricks.Icon icon="mdi-eye" mainAttrs={{ onClick: this._handleUpdateVisibility }} />
              )}
              {/* // DeleteButton */}
              <UU5.Bricks.Icon icon="mdi-delete" mainAttrs={{ onClick: this._handleDelete }} />
            </UU5.Bricks.Div>
          )}
        </UU5.Bricks.Div>
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default Tile;

//@@viewOn:imports
import React from "react";
import PropTypes from "prop-types";
import UU5 from "uu5g04";
import "uu5g04-bricks";

import Config from "./config/config.js";

import "./tile.less";
//@@viewOff:imports

export const Tile = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin, UU5.Common.PureRenderMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Tile",
    classNames: {
      main: Config.CSS + "tile",
      text: Config.CSS + "tile-text"
    },
    defaults: {
      icon: "mdi-label"
    },
    opt: {
      pureRender: true // avoid re-render from parent
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
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
  _handleUpdate() {
    this.props.onUpdate(this.props.data);
  },

  _handleDelete() {
    this.props.onDelete(this.props.data);
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <UU5.Bricks.Icon icon={this.props.data.icon || this.getDefault().icon} />
        {/* // CategoryName */}
        <span className={this.getClassName("text")}>{this.props.data.name}</span>
        {/* // EditButton */}
        <UU5.Bricks.Link onClick={this._handleUpdate}>
          <UU5.Bricks.Icon icon="mdi-pencil" />
        </UU5.Bricks.Link>
        {/* // DeleteButton */}
        <UU5.Bricks.Link onClick={this._handleDelete}>
          <UU5.Bricks.Icon icon="mdi-delete" />
        </UU5.Bricks.Link>
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default Tile;

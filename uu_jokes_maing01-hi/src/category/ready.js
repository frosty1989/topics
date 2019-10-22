//@@viewOn:imports
import React from "react";
import PropTypes from "prop-types";
import UU5 from "uu5g04";
import "uu5g04-bricks";

import Config from "./config/config.js";
import TileList from "../bricks/tile-list.js";
import Tile from "./tile.js";
import CreateForm from "./create-form.js";
import UpdateForm from "./update-form.js";
import Delete from "./delete.js";
import FormModal from "../bricks/form-modal.js";

import "./ready.less";
import LSI from "./ready-lsi.js";
//@@viewOff:imports

export const Ready = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Ready",
    classNames: {
      main: Config.CSS + "ready"
    },
    lsi: LSI
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    onCreate: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
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
  _tileRenderer(tileProps) {
    const { data, ...props } = tileProps;
    if (data.inProgress) {
      props.disabled = true;
    }
    return <Tile {...props} data={tileProps.data} onDelete={this._handleDelete} onUpdate={this._handleUpdate} />;
  },

  _registerModal(cmp) {
    this._modal = cmp;
  },

  _getActions() {
    return [
      {
        content: this.getLsi("create"), // CreateCategory Button
        onClick: () => {
          this._modal.open({
            header: this.getLsiComponent("createHeader"),
            content: <CreateForm />,
            onSave: this.props.onCreate,
            controls: {
              buttonSubmitProps: {
                content: this.getLsiComponent("createButton")
              }
            }
          });
        },
        icon: "mdi-plus-circle",
        active: true
      }
    ];
  },

  _getSortItems() {
    return [
      {
        key: "name",
        name: { cs: "Název", en: "Name" }
      }
    ];
  },

  _handleUpdate(record) {
    this._modal.open({
      header: this.getLsiComponent("updateHeader"),
      content: <UpdateForm />,
      onSave: data => this.props.onUpdate({ id: record.id, ...data }),
      values: record,
      controls: {
        buttonSubmitProps: {
          content: this.getLsiComponent("updateButton")
        }
      }
    });
  },

  _handleDelete(record) {
    this._modal.open({
      header: this.getLsiComponent("deleteHeader"),
      content: <Delete data={record} />,
      onSave: data => this.props.onDelete({ ...record, ...data }),
      controls: {
        buttonSubmitProps: {
          content: this.getLsiComponent("deleteButton"),
          colorSchema: "danger"
        }
      }
    });
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <TileList
          tileRenderer={this._tileRenderer}
          data={this.props.data}
          title={this.getLsi("list")}
          actions={this._getActions}
          sortItems={this._getSortItems}
          tileHeight={48}
        />
        <FormModal ref_={this._registerModal} />
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default Ready;

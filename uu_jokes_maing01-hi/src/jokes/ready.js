//@@viewOn:imports
import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5tilesg01";

import Config from "./config/config.js";
import FormModal from "../bricks/form-modal";
import TileList from "../bricks/tile-list.js";
import Filter from "./filter.js";
import Tile from "./tile.js";
import CreateForm from "./create-form.js";
import UpdateForm from "./update-form.js";
import Detail from "./detail.js";
import { removeRouteParameters, setRouteParameters } from "../helpers/history-helper.js";

import SpaContext from "../core/spa-context.js";
import "./ready.less";
import LSI from "./ready-lsi.js";
//@@viewOff:imports

export const Jokes = createReactClass({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Ready",
    classNames: {
      main: Config.CSS + "ready",
      detail: Config.CSS + "ready-detail-modal"
    },
    lsi: LSI
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    detailId: PropTypes.string,
    onCreate: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onRate: PropTypes.func.isRequired,
    onUpdateVisibility: PropTypes.func.isRequired
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  componentDidMount() {
    if (this.props.detailId) {
      let joke = this.props.data.find(item => item.id === this.props.detailId);
      joke && this._handleDetail(joke);
    }
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _tileRenderer(tileProps) {
    const { data, ...props } = tileProps;
    if (data._inProgress) {
      //props.disabled = true; //FIXME
    }
    return (
      <Tile
        {...props}
        data={tileProps.data}
        onDelete={this._handleDelete}
        onUpdate={this._handleUpdate}
        onDetail={this._handleDetail}
        onRate={this.props.onRate}
        onUpdateVisibility={this.props.onUpdateVisibility}
      />
    );
  },

  _handleDetail(record) {
    this._modal.open(
      {
        header: <span>{record.name}</span>,
        content: <Detail data={record} />,
        className: this.getClassName("detail"),
        onClose: this._handleDetailClose
      },
      () => this._handleDetailOpen(record)
    );
  },

  _handleDetailOpen(record) {
    setRouteParameters({ id: record.id });
  },

  _handleDetailClose(opt) {
    // remove id from location
    removeRouteParameters();
    opt.component.onCloseDefault(opt);
  },

  _registerModal(cmp) {
    this._modal = cmp;
  },

  _registerFormModal(cmp) {
    this._formModal = cmp;
  },

  _getActions() {
    let actions = [];
    if (UU5.Environment.App.authorization.canManage()) {
      actions.push({
        content: this.getLsi("create"), // CreateJoke Button
        onClick: () => {
          this._formModal.open({
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
      });
    }
    return actions;
  },

  _getSortItems() {
    return [
      {
        key: "name",
        name: { cs: "Název", en: "Name" }
      }
    ];
  },

  _getFilters(uuIdentity) {
    let filters = [
      {
        key: "category",
        label: this.getLsi("filterByCategory"),
        filterFn: (item, filterValue) => item.categoryList && item.categoryList.includes(filterValue)
      },
      {
        key: "image",
        label: this.getLsi("filterByImage"),
        filterFn: (item, filterValue) => !!item.image === filterValue
      },
      {
        key: "averageRating",
        label: this.getLsi("filterByRating"),
        filterFn: (item, filterValue) => {
          switch (filterValue.type) {
            case "1":
              return item.averageRating === filterValue.value;
            case "2":
              return item.averageRating >= filterValue.value;
            case "3":
              return item.averageRating > filterValue.value;
            case "4":
              return item.averageRating <= filterValue.value;
            case "5":
              return item.averageRating < filterValue.value;
          }
          return false;
        }
      }
    ];

    if (UU5.Environment.App.authorization.canFilterOwnRecords()) {
      filters.push({
        key: "uuIdentity",
        label: this.getLsi("filterByUser"),
        filterFn: (item, filterValue) => {
          return (uuIdentity === item.uuIdentity) === filterValue;
        }
      });
    }
    if (UU5.Environment.App.authorization.canFilterPublished()) {
      filters.push({
        key: "visibility",
        label: this.getLsi("filterByVisibility"),
        filterFn: (item, filterValue) => item.visibility === filterValue
      });
    }

    return filters;
  },

  _handleUpdate(record) {
    this._formModal.open({
      header: this.getLsiComponent("updateHeader"),
      content: <UpdateForm />,
      onSave: data => {
        if (typeof data.image === "string") {
          delete data.image; // image code, not a binary
        }
        this.props.onUpdate({ id: record.id, ...data });
      },
      values: record,
      controls: {
        buttonSubmitProps: {
          content: this.getLsiComponent("updateButton")
        }
      }
    });
  },

  _handleDelete(record) {
    this._formModal.open({
      header: this.getLsiComponent("deleteHeader"),
      content: <UU5.Bricks.P>{this.getLsiComponent("deleteConfirm", null, record.name)}</UU5.Bricks.P>,
      onSave: () => this.props.onDelete(record),
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
      <SpaContext.Consumer>
        {({ uuIdentity }) => (
          <UU5.Bricks.Div {...this.getMainPropsToPass()}>
            <TileList
              tileRenderer={this._tileRenderer}
              data={this.props.data}
              actions={this._getActions}
              sortItems={this._getSortItems}
              tileHeight={196}
              title={this.getLsi("list")}
            >
              <UU5.Tiles.FilterBar filters={this._getFilters(uuIdentity)}>
                <Filter />
              </UU5.Tiles.FilterBar>
            </TileList>
            <FormModal ref_={this._registerFormModal} />
            <UU5.Bricks.Modal ref_={this._registerModal} />
          </UU5.Bricks.Div>
        )}
      </SpaContext.Consumer>
    );
  }
  //@@viewOff:render
});

export default Jokes;

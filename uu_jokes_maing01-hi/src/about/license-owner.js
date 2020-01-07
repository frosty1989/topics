//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";

import Config from "./config/config.js";

import "./license-owner.less";
import LSI from "./license-owner-lsi.js";
//@@viewOff:imports

export const LicenseOwner = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "AppInfo",
    classNames: {
      main: Config.CSS + "appInfo",
      licenseText: Config.CSS + "license-text"
    },
    lsi: LSI
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    organization: UU5.PropTypes.object,
    authorities: UU5.PropTypes.array,
    awid: UU5.PropTypes.string
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
  _getAuthoritiesUrl(uuId) {
    //https://plus4u.net/ues/sesm?SessFree=ues%3AVPH-BT%3A4-1
    return "https://plus4u.net/ues/sesm?SessFree=" + encodeURIComponent("ues:VPH-BT:" + uuId);
  },
  _getAuthorities(authorities) {
    return authorities.map(authority => {
      return (
        <UU5.Bricks.Link href={this._getAuthoritiesUrl(authority.uuId)} content={authority.name} key={authority.uuId} />
      );
    });
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Common.Div>
        <UU5.Bricks.Header level="4" content={this.getLsiComponent("licenseOwner")} />
        <UU5.Bricks.Text className={this.getClassName("licenseText")}>
          {this.getLsiComponent("organization")}:{" "}
          <UU5.Bricks.Link href={this.props.organization.link} content={this.props.organization.name} />
        </UU5.Bricks.Text>
        <UU5.Bricks.Text className={this.getClassName("licenseText")}>
          {this.getLsiComponent("authorities")}: {this._getAuthorities(this.props.authorities)}
        </UU5.Bricks.Text>
        <UU5.Bricks.Text className={this.getClassName("licenseText")}>
          AWID: <UU5.Bricks.Link content={this.props.awid} />
        </UU5.Bricks.Text>
      </UU5.Common.Div>
    );
  }
  //@@viewOff:render
});

export default LicenseOwner;

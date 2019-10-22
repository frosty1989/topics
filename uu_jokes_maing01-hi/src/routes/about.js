//@@viewOn:imports
import React from "react";
import UU5 from "uu5g04";
import "uu5g04-bricks";
import Plus4U5 from "uu_plus4u5g01";

import Config from "./config/config.js";
import AboutCfg from "../config/about.js";

import "./about.less";
import LSI from "./about-lsi.js";
//@@viewOff:imports

export const About = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.LsiMixin, UU5.Common.RouteMixin, UU5.Common.CcrReaderMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "About",
    classNames: {
      main: Config.CSS + "about",
      logos: Config.CSS + "about-logos",
      termsOfUse: Config.CSS + "about-terms"
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
    menu && menu.setActiveRoute("about");
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _getAuthors(authors) {
    return (
      authors &&
      authors.slice().map(author => {
        author = UU5.Common.Tools.merge({}, author);
        author.role =
          author.role && typeof author.role === "object" ? <UU5.Bricks.Lsi lsi={author.role} /> : author.role;
        return author;
      })
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    const licence = AboutCfg.licence || {};
    const leadingAuthors = this._getAuthors(AboutCfg.leadingAuthors);
    const otherAuthors = this._getAuthors(AboutCfg.otherAuthors);
    const usedTechnologies = AboutCfg.usedTechnologies || {};

    return (
      <UU5.Bricks.Section {...this.getMainPropsToPass()}>
        <Plus4U5.App.About header={this.getLsiValue("header")} />
        <Plus4U5.App.Licence
          organisation={this.getLsiItem(licence.organisation)}
          authorities={this.getLsiItem(licence.authorities)}
        />
        <Plus4U5.App.Authors
          header={this.getLsiValue("creatorsHeader")}
          leadingAuthors={leadingAuthors}
          otherAuthors={otherAuthors}
        />
        <Plus4U5.App.Technologies
          technologies={this.getLsiItem(usedTechnologies.technologies)}
          content={this.getLsiItem(usedTechnologies.content)}
        />
        {licence.termsOfUse && (
          <UU5.Bricks.P className={this.getClassName("termsOfUse")}>
            <UU5.Bricks.Link href={licence.termsOfUse} target="_blank" content={this.getLsiValue("termsOfUse")} />
          </UU5.Bricks.P>
        )}
        <UU5.Bricks.Div className={this.getClassName("logos")}>
          <UU5.Bricks.Image responsive={false} src="assets/plus4u.svg" />
          <UU5.Bricks.Image responsive={false} src="assets/unicorn.svg" />
        </UU5.Bricks.Div>
      </UU5.Bricks.Section>
    );
  }
  //@@viewOff:render
});

export default About;

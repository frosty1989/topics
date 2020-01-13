//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu_flsg01";
import Plus4U5 from "uu_plus4u5g01";
import { Uri } from "uu_appg01_core";

import Config from "./config/config.js";
import AboutCfg from "../config/about.js";

import AppInfo from "../about/app-info.js";
import LicenseOwner from "../about/license-owner.js";

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
      termsOfUse: Config.CSS + "about-terms",
      links: Config.CSS + "about-links",
      license: Config.CSS + "about-license",
      licenseText: Config.CSS + "about-license-text",
      authors: Config.CSS + "about-authors",
      fls: Config.CSS + "fls",
      flsText: Config.CSS + "fls-text"
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
    const currentUrl = window.location.href;
    const awid = Uri.Uri.parse(currentUrl)
      .getAwid()
      .toString();

    return (
      <UU5.Bricks.Section {...this.getMainPropsToPass()}>
        <Plus4U5.App.About header={this.getLsiValue("header")} />

        <AppInfo
          termsOfUse="https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-96f8595b119144fb8a9ffbc087ea7e26/book"
          technicalDocumentation="https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-71f8d7b5cfdc4336b0abfe47b3cb237b/book"
        />

        <UU5.Common.Identity>
          {({ identity }) => {
            let children;
            if (identity === undefined) {
              children = <UU5.Bricks.Loading inline />;
            } else if (identity) {
              children = (
                <UU5.Bricks.Div className={this.getClassName("fls")}>
                  <UU5.Bricks.Div content={this.getLsiComponent("fslText")} className={this.getClassName("flsText")} />

                  <UuFls.Bricks.CreateIssueButton
                    flsBaseUri="https://uuappg01-eu-w-1.plus4u.net/uu-flsg01-main/8014eb79e8184ebb8942d96ce37b61b4/"
                    borderRadius="2px"
                    productCode="support/uuJokes"
                    colorSchema="blue-rich"
                    size="m"
                    content={this.getLsiComponent("flsButton")}
                  />
                </UU5.Bricks.Div>
              );
            } else {
              children = null;
            }
            return children;
          }}
        </UU5.Common.Identity>

        <Plus4U5.App.Authors
          className={this.getClassName("authors")}
          level="3"
          header={this.getLsiValue("creatorsHeader")}
          leadingAuthors={leadingAuthors}
          otherAuthors={otherAuthors}
        />

        <UU5.Bricks.Line size="s" />

        <UU5.Bricks.Section {...this.getMainPropsToPass()}>
          <UU5.Bricks.Row display="flex">
            <UU5.Bricks.Column colWidth="xl-6 l-6 md-6 s-12">
              <Plus4U5.App.Technologies
                textAlign="left"
                technologyType="application"
                technologies={this.getLsiItem(usedTechnologies.technologies)}
                content={this.getLsiItem(usedTechnologies.content)}
              />
            </UU5.Bricks.Column>
            <UU5.Bricks.Column className={this.getClassName("license")} colWidth="xl-6 l-6 md-6 s-12">
              <LicenseOwner
                organization={{ name: "Plus4U", link: "https://www.plus4u.net/" }}
                authorities={AboutCfg.authorities}
                awid={awid}
              />
            </UU5.Bricks.Column>
          </UU5.Bricks.Row>
        </UU5.Bricks.Section>

        <UU5.Bricks.Div className={this.getClassName("logos")}>
          <UU5.Bricks.Image responsive={false} src="assets/unicorn.svg" />
          <UU5.Bricks.Image responsive={false} src="assets/plus4u.svg" />
        </UU5.Bricks.Div>
      </UU5.Bricks.Section>
    );
  }
  //@@viewOff:render
});

export default About;

import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import UU5 from "uu5g04";
import "uu5g04-bricks";
import Plus4U5 from "uu_plus4u5g01";
import ns from "ns";

import Lsi from "./lsi.js";
import "./about.less";

export const About = createReactClass({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin, UU5.Common.RouteMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.tag("About"),
    classNames: {
      main: ns.css("about")
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    identity: PropTypes.shape()
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    const about = Lsi.aboutApp.about || {};
    const licence = Lsi.aboutApp.licence || {};
    const authors = Lsi.aboutApp.authors || {};
    const usedTechnologies = Lsi.aboutApp.usedTechnologies || {};

    return (
      <UU5.Bricks.Section {...this.getMainPropsToPass()}>
        <Plus4U5.App.About header={this.getLsiItem(Lsi.aboutHeader)} content={this.getLsiItem(about)} />
        <Plus4U5.App.Licence
          organisation={this.getLsiItem(licence.organisation)}
          authorities={[
            {
              name: this.props.identity ? this.props.identity.name : "",
              uri: "https://www.unicorn.com/"
            }
          ]}
        />
        <Plus4U5.App.Authors
          header={this.getLsiItem(Lsi.aboutCreatorsHeader)}
          leadingAuthors={authors.leadingAuthors}
          otherAuthors={authors.otherAuthors}
        />
        <Plus4U5.App.Technologies
          technologies={this.getLsiItem(usedTechnologies.technologies)}
          content={this.getLsiItem(usedTechnologies.content)}
        />
      </UU5.Bricks.Section>
    );
  }
  //@@viewOff:render
});

export default About;

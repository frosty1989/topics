import React from "react";
import createReactClass from 'create-react-class';
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import * as Plus4U5 from "uu_plus4u5g01";

import Cfg from './_config.js';
import './about.less';

export const About = createReactClass({

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.RouteMixin,
    UU5.Common.LsiMixin,
    UU5.Common.CcrReaderMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Cfg.APP + '.About',
    nestingLevel: 'bigBoxCollection',
    classNames: {
      main: Cfg.CSS + '-about',
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
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
  render(){
    const about = Cfg.aboutApp.about || {};
    const licence = Cfg.aboutApp.licence || {};
    const authors = Cfg.aboutApp.authors || {};
    const usedTechnologies = Cfg.aboutApp.usedTechnologies || {};
    let identity = this.getCcrComponentByKey(Cfg.CCRKEY_SPA).getIdentity();


    return (
      this.getNestingLevel()
        ? (
        <UU5.Bricks.Section {...this.getMainPropsToPass()}>
          <Plus4U5.App.About
            header={this.getLSIItem(Cfg.aboutHeader)}
            content={this.getLSIItem(about)}
          />
          <Plus4U5.App.Licence
            organisation={this.getLSIItem(licence.organisation)}
            authorities={[{
              name: identity ? identity.name : "",
              uri: 'https://www.unicorn.com/'
            }]}
          />
          <Plus4U5.App.Authors
            header={this.getLSIItem(Cfg.aboutCreatorsHeader)}
            leadingAuthors={authors.leadingAuthors}
            otherAuthors={authors.otherAuthors}
          />
          <Plus4U5.App.Technologies
            technologies={this.getLSIItem(usedTechnologies.technologies)}
            content={this.getLSIItem(usedTechnologies.content)}
          />
        </UU5.Bricks.Section>
      ) : null
    );
  }
  //@@viewOff:render
});

export default About;


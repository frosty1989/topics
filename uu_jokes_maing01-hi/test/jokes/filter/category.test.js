import React from "react";
import { shallow } from "enzyme";
import UuJokes from "uu_jokes_main-client";

describe(`UuJokes.Jokes.Filter.Category`, () => {
  it(`default props`, () => {
    const wrapper = shallow(<UuJokes.Jokes.Filter.Category />);
    expect(wrapper).toMatchSnapshot();
  });
});

import React from "react";
import { shallow } from "enzyme";
import UuJokes from "uu_jokes_main-client";

describe(`UuJokes.Bricks.TileList`, () => {
  it(`default props`, () => {
    const wrapper = shallow(<UuJokes.Bricks.TileList />);
    expect(wrapper).toMatchSnapshot();
  });
});

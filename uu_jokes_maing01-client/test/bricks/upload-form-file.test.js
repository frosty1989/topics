import React from "react";
import { shallow } from "enzyme";
import UuJokes from "uu_jokes_main-client";

describe(`UuJokes.Bricks.UploadFormFile`, () => {
  it(`default props`, () => {
    const wrapper = shallow(<UuJokes.Bricks.UploadFormFile />);
    expect(wrapper).toMatchSnapshot();
  });
});

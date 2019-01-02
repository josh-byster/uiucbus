import React from "react";
import expect from "expect";
import { shallow, mount } from "enzyme";
import EnzymeToJson from "enzyme-to-json";
// setup file
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import HomePage from "../pages/HomePage";

configure({ adapter: new Adapter() });

describe("Bus Info Modal Component", () => {
  const elem = mount(<HomePage />);

  it("renders the proper page", () => {
    expect(EnzymeToJson(elem)).toMatchSnapshot();
  });
});

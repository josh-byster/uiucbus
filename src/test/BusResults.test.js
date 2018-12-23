import React from "react";
import expect from "expect";
import { shallow } from "enzyme";
import BusResults from "../components/BusResults";

// setup file
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });
var stopInfo = {
  stop_id: "IU"
};
describe("Bus Result Component:", () => {
  it("renders without crash", () => {
    expect(shallow(<BusResults stopInfo={stopInfo} />).length).toEqual(1);
  });

  it("starts with a modal closed", () => {
    expect(
      shallow(<BusResults stopInfo={stopInfo} />)
        .setProps({ stopInfo: { stop_id: "PLAZA" } })
        .state().modalOpen
    ).toBeFalsy();
  });
});

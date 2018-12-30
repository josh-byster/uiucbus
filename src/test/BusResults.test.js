import React from "react";
import expect from "expect";
import { shallow } from "enzyme";
import BusResults from "../components/BusResults";
import renderer from "react-test-renderer";
import departures from "./mock_departures";
// setup file
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });
var stopInfo = {
  stop_id: "IU"
};
describe("Bus Result Component:", () => {
  it("renders without crash", () => {
    expect(
      shallow(<BusResults stopInfo={stopInfo} resultCallback={function() {}} />)
        .length
    ).toEqual(1);
  });

  it("starts with a modal closed", () => {
    expect(
      shallow(
        <BusResults
          stopInfo={{ stop_id: "PLAZA" }}
          resultCallback={function() {}}
        />
      ).state().modalOpen
    ).toBeFalsy();
  });

  // SNAPSHOT TESTING

  const elem = renderer.create(
    <BusResults stopInfo={stopInfo} resultCallback={function() {}} />
  );
  elem.getInstance().setState({ validRequest: false });

  it("renders the proper h4 with invalid request", () => {
    expect(elem.toJSON()).toMatchSnapshot();
  });

  it("renders no buses coming", () => {
    elem.getInstance().setState({ validRequest: true, departures: [] });
    expect(elem.toJSON()).toMatchSnapshot();
  });

  it("renders many buses with mock data ", () => {
    elem.getInstance().setState({ validRequest: true, departures: departures });
    expect(elem.toJSON()).toMatchSnapshot();
  });
});

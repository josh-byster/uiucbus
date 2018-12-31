import React from "react";
import expect from "expect";
import { shallow, mount } from "enzyme";
import BusInfoModal from "../components/BusInfoModal";
import EnzymeToJson from "enzyme-to-json";
import departures from "./mock_departures";
import renderer from "react-test-renderer";
// setup file
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("Bus Info Modal Component", () => {
  const elem = mount(
    <BusInfoModal
      toggle={function() {}}
      isOpen={true}
      stopInfo={{}}
      busInfo={{ headsign: "12W Teal" }}
    />
  );
  elem.setState({
    mapURL: "http://example.com/",
    nextStop: "Test 1",
    previousStop: "Test 2"
  });

  it("renders the proper modal", () => {
    expect(EnzymeToJson(elem)).toMatchSnapshot();
  });
});

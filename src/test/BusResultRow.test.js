import React from "react";
import expect from "expect";
import { shallow } from "enzyme";
import BusResultRow from "../components/BusResultRow";
import renderer from "react-test-renderer";
import departures from "./mock_departures";
// setup file
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("Bus Result Row Component", () => {
  const elem = renderer.create(
    <BusResultRow info={departures[0]} toggleModal={function() {}} />
  );
  elem.getInstance().setState({ validRequest: false });

  it("renders the proper h4 with invalid request", () => {
    expect(elem.toJSON()).toMatchSnapshot();
  });
});

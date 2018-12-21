import React, { Component } from "react";
import { getBuses } from "../util/api";
import BusResultRow from "./BusResultRow";
import { Table } from "reactstrap";
class BusResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      departures: []
    };
    this.getData(props.stop_id);
  }
  getData = async stop_id => {
    const { status, rqst, departures } = await getBuses(stop_id);
    this.setState({ departures: departures });
  };
  render() {
    return (
      <div>
        <Table>
          <thead>
            <tr>
              <th>Bus Name</th>
              <th>Mins Left</th>
              <th>ETA</th>
              <th>Last Location</th>
            </tr>
          </thead>
          <tbody>
            {this.state.departures.map((element, key) => {
              return <BusResultRow info={element} key={key} />;
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default BusResults;

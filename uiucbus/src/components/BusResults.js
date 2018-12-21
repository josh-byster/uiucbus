import React, { Component } from "react";
import { getBuses } from "../util/api";
import BusResultRow from "./BusResultRow";
import { Table } from "reactstrap";
import PropTypes from "prop-types";
class BusResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      departures: [],
      validRequest: true
    };
    this.getData(props.stop_id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.stop_id !== this.props.stop_id) {
      console.log("Updating again");
      this.getData(this.props.stop_id);
    }
  }
  getData = async stop_id => {
    const { status, rqst, departures } = await getBuses(stop_id);
    console.log(status);
    if (status.code === 200) {
      this.setState({ validRequest: true });
      this.setState({ departures: departures });
    } else {
      this.setState({ validRequest: false });
    }
  };
  render() {
    return (
      <div>
        {this.state.validRequest ? (
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
        ) : (
          <h4>Can't load the page.</h4>
        )}
      </div>
    );
  }
}

BusResults.propTypes = {
  stop_id: PropTypes.string
};
export default BusResults;

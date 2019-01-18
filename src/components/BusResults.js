import React, { Component } from "react";
import { getBuses } from "../util/api";
import BusResultRow from "./BusResultRow";
import { Table } from "reactstrap";
import PropTypes from "prop-types";
import BusInfoModal from "../components/BusInfoModal";
class BusResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      departures: [],
      validRequest: null,
      modalInfo: {},
      modalOpen: false
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.stopInfo.stop_id !== this.props.stopInfo.stop_id) {
      this.setState({
        departures: [],
        validRequest: null,
        modalInfo: {},
        modalOpen: false
      });
      this.getData(this.props.stopInfo.stop_id);
    }
  }
  getData = async stop_id => {
    const { status, departures } = await getBuses(stop_id);
    if (status.code === 200) {
      this.setState({ validRequest: true });
      this.setState({ departures: departures });
    } else {
      this.setState({ validRequest: false });
    }
    this.props.resultCallback();
  };

  toggleModal = info => {
    this.setState(state => {
      if (info !== undefined) {
        return { modalOpen: !state.modalOpen, modalInfo: info };
      }
      // Only toggle, don't update info if there is no new info
      return { modalOpen: !state.modalOpen };
    });
  };

  render() {
    if (this.state.validRequest === null) {
      // On first time don't swap out elements unnecessarily. Just render div.
      return <div />;
    }
    if (this.state.validRequest === false) {
      return <h4>This page cannot be loaded.</h4>;
    }

    if (
      this.state.validRequest === true &&
      this.state.departures.length === 0
    ) {
      return <h4 className="no-bus">No buses coming in the next hour.</h4>;
    }
    return (
      <div style={this.props.style}>
        <BusInfoModal
          busInfo={this.state.modalInfo}
          isOpen={this.state.modalOpen}
          toggle={this.toggleModal}
          stopInfo={this.props.stopInfo}
        />
        <Table>
          <thead>
            <tr>
              <th id="bus-name">Bus Name</th>
              <th id="mins-left">Mins Left</th>
              <th id="eta">ETA</th>
              <th id="last-location">Last Location</th>
            </tr>
          </thead>
          <tbody>
            {this.state.departures.map((element, key) => {
              return (
                <BusResultRow
                  info={element}
                  toggleModal={this.toggleModal}
                  key={key}
                  elementOrder={key}
                />
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}

BusResults.propTypes = {
  stopInfo: PropTypes.object.isRequired,
  resultCallback: PropTypes.func.isRequired,
  style: PropTypes.object
};
export default BusResults;

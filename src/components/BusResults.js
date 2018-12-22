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
      console.info("Getting buses...");
      this.getData(this.props.stopInfo.stop_id);
    }
  }
  getData = async stop_id => {
    const { status, departures } = await getBuses(stop_id);
    console.log(status);
    if (status.code === 200) {
      this.setState({ validRequest: true });
      this.setState({ departures: departures });
    } else {
      this.setState({ validRequest: false });
    }
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
      return <h4>No buses coming in the next hour.</h4>;
    }
    return (
      <div>
        <BusInfoModal
          busInfo={this.state.modalInfo}
          isOpen={this.state.modalOpen}
          toggle={this.toggleModal}
          stopInfo={this.props.stopInfo}
        />
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
              return (
                <BusResultRow
                  info={element}
                  toggleModal={this.toggleModal}
                  key={key}
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
  stopInfo: PropTypes.object.isRequired
};
export default BusResults;

import React, { Component } from 'react';
import { Table } from 'reactstrap';
import PropTypes from 'prop-types';
import PullToRefresh from 'pulltorefreshjs';
import { getBuses } from '../util/api';
import BusResultRow from './BusResultRow';
import BusInfoModal from './BusInfoModal';

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

  componentDidMount = () => {
    PullToRefresh.init({
      mainElement: 'body',
      triggerElement: '.data',
      shouldPullToRefresh: () => {
        return this.props.stopInfo.stop_id !== undefined;
      },
      onRefresh: this.getData
    });
  };

  componentDidUpdate(prevProps) {
    const { stopInfo, shouldRefresh } = this.props;
    if (
      prevProps.stopInfo.stop_id !== stopInfo.stop_id ||
      (!prevProps.shouldRefresh && shouldRefresh)
    ) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        departures: [],
        validRequest: null,
        modalInfo: {},
        modalOpen: false
      });
      this.getData();
    }
  }

  handleRequestError = (numRetries) => {
    this.props.errorHandler(`Looks like at this moment, the MTD servers are under heavy load and are unresponsive. We'll keep retrying in the meantime. (Number of tries: ${numRetries})`);
  }

  getData = async () => {
    console.log("Hello!")
    const { stopInfo, resultCallback } = this.props;
    const { status, departures } = await getBuses(stopInfo.stop_id, this.handleRequestError);
    if (status.code === 200) {
      this.setState({ validRequest: true });
      this.setState({ departures });
    } else {
      this.setState({ validRequest: false });
    }
    resultCallback();
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

  getModalStyle = info => {
    if (info.route) {
      return {
        backgroundColor: `#${info.route.route_color}`,
        color: `#${info.route.route_text_color}`
      };
    }
    return {};
  };

  render() {
    const { validRequest, departures, modalInfo, modalOpen, errorMsg } = this.state;
    const { style, stopInfo } = this.props;
    if (validRequest === null) {
      // On first time don't swap out elements unnecessarily. Just render div.
      return <div />;
    }
    if (validRequest === false) {
      return <h4>This page cannot be loaded.</h4>;
    }

    if (validRequest === true && departures.length === 0) {
      return <h4 className="no-bus">No buses coming in the next hour.</h4>;
    }

    if(errorMsg){
      return <h4 className='error'>Hi</h4>
    }
    return (
      <div style={style}>
        <BusInfoModal
          busInfo={modalInfo}
          isOpen={modalOpen}
          toggle={this.toggleModal}
          stopInfo={stopInfo}
          headerStyle={this.getModalStyle(modalInfo)}
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
            {departures.map((element, key) => {
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
  style: PropTypes.object.isRequired,
  shouldRefresh: PropTypes.bool.isRequired,
  errorHandler: PropTypes.func.isRequired
};
export default BusResults;

import React, { Component } from 'react';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import removeColors from './HelperFunctions';

class BusResultRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
    };
  }

  componentDidMount() {
    this.setState({ isVisible: true });
  }

  computeHMS = (expectedDate) => {
    const date = new Date(expectedDate.toString());
    let hour = date.getHours() % 12;
    if (hour === 0) {
      hour = 12;
    }
    let minute = date.getMinutes();
    if (minute < 10) {
      minute = `0${minute}`;
    }
    let seconds = date.getSeconds();
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
    return `${hour}:${minute}:${seconds}`;
  };

  getTRStyle = () => {
    const { info } = this.props;
    return {
      backgroundColor: `#${info.route.route_color}`,
      color: `#${info.route.route_text_color}`,
    };
  };

  render() {
    const { isVisible } = this.state;
    const { info, toggleModal } = this.props;
    return (isVisible && (
          <tr
            key={info.headsign + info.expected_mins}
            style={this.getTRStyle()}
            className="resultRow"
          >
            <td>
              <b>{removeColors(info.headsign)}</b>
            </td>
            <td>
              {info.expected_mins !== 0
                ? `${info.expected_mins}m`
                : 'Arriving Now'}
            </td>
            <td className="no-wrap">{this.computeHMS(info.expected)}</td>
            <td>
              <Button color="success" onClick={() => toggleModal(info)}>
                Location
              </Button>
            </td>
          </tr>
        )
    );
  }
}

BusResultRow.propTypes = {
  info: PropTypes.object.isRequired,
  toggleModal: PropTypes.func.isRequired,
  elementOrder: PropTypes.number.isRequired,
};

export default BusResultRow;

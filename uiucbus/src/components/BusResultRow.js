import React, { Component } from "react";
import { removeColors } from "./HelperFunctions";
import { Button } from "reactstrap";
import PropTypes from "prop-types";
class BusResultRow extends Component {
  computeHMS = expected_date => {
    var date = new Date(expected_date.toString());
    var hour = date.getHours() % 12;
    if (hour === 0) {
      hour = 12;
    }
    var minute = date.getMinutes();
    if (minute < 10) {
      minute = "0" + minute;
    }
    var seconds = date.getSeconds();
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return `${hour}:${minute}:${seconds}`;
  };

  getTRStyle = () => {
    return {
      backgroundColor: "#" + this.props.info.route.route_color,
      color: "#" + this.props.info.route.route_text_color
    };
  };
  render() {
    return (
      <tr style={this.getTRStyle()}>
        <td>
          <b>{removeColors(this.props.info.headsign)}</b>
        </td>
        <td>
          {this.props.info.expected_mins !== 0
            ? this.props.info.expected_mins + "m"
            : "Arriving Now"}
        </td>
        <td>{this.computeHMS(this.props.info.expected)}</td>
        <td>
          <Button color="success">Location</Button>
        </td>
      </tr>
    );
  }
}

BusResultRow.propTypes = {
  info: PropTypes.object
};

export default BusResultRow;

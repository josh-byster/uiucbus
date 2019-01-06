import React, { Component } from "react";
import { removeColors } from "./HelperFunctions";
import { Button } from "reactstrap";
import PropTypes from "prop-types";
import posed, { PoseGroup } from "react-pose";

class BusResultRow extends Component {
  TransitionWrapper = posed.tr({
    enter: {
      y: 0,
      opacity: 1,
      delay: 100 * this.props.elementOrder,
      transition: {
        y: { type: "spring", stiffness: 1000, damping: 15 },
        default: { duration: 300 }
      }
    },
    exit: {
      y: 0,
      opacity: 0,
      transition: { duration: 150 }
    }
  });

  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      modalOpen: false
    };
  }

  componentDidMount() {
    this.setState({ isVisible: true });
  }
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
      <PoseGroup>
        {this.state.isVisible && (
          <this.TransitionWrapper
            key="bus"
            style={this.getTRStyle()}
            className="resultRow"
          >
            <td>
              <b>{removeColors(this.props.info.headsign)}</b>
            </td>
            <td>
              {this.props.info.expected_mins !== 0
                ? this.props.info.expected_mins + "m"
                : "Arriving Now"}
            </td>
            <td className="no-wrap">
              {this.computeHMS(this.props.info.expected)}
            </td>
            <td>
              <Button
                color="success"
                onClick={e => this.props.toggleModal(this.props.info)}
              >
                Location
              </Button>
            </td>
          </this.TransitionWrapper>
        )}
      </PoseGroup>
    );
  }
}

BusResultRow.propTypes = {
  info: PropTypes.object.isRequired,
  toggleModal: PropTypes.func.isRequired,
  elementOrder: PropTypes.number.isRequired
};

export default BusResultRow;

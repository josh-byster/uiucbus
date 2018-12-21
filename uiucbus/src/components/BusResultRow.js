import React, { Component } from "react";
import { removeColors } from "./HelperFunctions";
import { Button } from "reactstrap";
class BusResultRow extends Component {
  render() {
    return (
      <tr>
        <td>
          <b>{removeColors(this.props.info.headsign)}</b>
        </td>
        <td>{this.props.info.expected_mins}</td>
        <td>k</td>
        <td>
          <Button color="success">Location</Button>
        </td>
      </tr>
    );
  }
}

export default BusResultRow;

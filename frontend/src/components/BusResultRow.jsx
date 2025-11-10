import React, { useMemo } from 'react';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import removeColors from './HelperFunctions';

const BusResultRow = ({ info, toggleModal, elementOrder }) => {
  const computeHMS = (expectedDate) => {
    const date = new Date(expectedDate.toString());
    let hour = date.getHours() % 12;
    if (hour === 0) {
      hour = 12;
    }
    const minute = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hour}:${minute}:${seconds}`;
  };

  const rowStyle = useMemo(() => ({
    backgroundColor: `#${info.route.route_color}`,
    color: `#${info.route.route_text_color}`,
  }), [info.route.route_color, info.route.route_text_color]);

  return (
    <motion.tr
      style={rowStyle}
      className="resultRow"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, delay: elementOrder * 0.05 }}
    >
      <td>
        <b>{removeColors(info.headsign)}</b>
      </td>
      <td>
        {info.expected_mins !== 0 ? `${info.expected_mins}m` : 'Arriving Now'}
      </td>
      <td className="no-wrap">{computeHMS(info.expected)}</td>
      <td>
        <Button
          color="success"
          onClick={() => toggleModal(info)}
          aria-label={`View location of ${removeColors(info.headsign)}`}
        >
          Location
        </Button>
      </td>
    </motion.tr>
  );
};

BusResultRow.propTypes = {
  info: PropTypes.object.isRequired,
  toggleModal: PropTypes.func.isRequired,
  elementOrder: PropTypes.number.isRequired,
};

export default BusResultRow;

// import axios from "axios";
const axios = require('axios');

const API_URL = 'https://developer.mtd.org/api/v2.2/json/';
const CUMTD_API_KEY = 'fd4fb84bbbb34acfae890f17144ee131';
const fs = require('fs');

axios.get(`${API_URL}/getstops?key=${CUMTD_API_KEY}`).then(res => {
  const allstops = [
    { stop_id: 'PAR', stop_name: 'PAR (Pennsylvania Ave. Residence Hall)' }
  ];
  res.data.stops.forEach(element => {
    if (element.stop_id !== 'PAR') {
      // workaround since PAR doesn't show up on list
      allstops.push({
        stop_id: element.stop_id,
        stop_name: element.stop_name
      });
    }
  });
  fs.writeFile(
    './allstops.json',

    JSON.stringify(allstops),

    err => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error('Something happened');
      }
    }
  );
});

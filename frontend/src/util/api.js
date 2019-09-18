import axios from 'axios';
const promiseRetry = require('promise-retry');

const CUMTD_API_URI =
  process.env.NODE_ENV === 'production'
    ? 'https://bustracker-api.herokuapp.com/api'
    : `http://localhost:${process.env.REACT_APP_API_PORT}/api`;
const MAPBOX_API_KEY =
  'pk.eyJ1Ijoiam9zaC1ieXN0ZXIiLCJhIjoiY2psN2xyZGFoMDY5ZjNxbWtpeDE0dDlwNSJ9.AAJipEPA6e-kLi1Jv3Wpyg';
function getBuses(stopId) {
  return promiseRetry(function(retry, number) {
    if (number > 1) console.error('Retrying XHR with attempt number', number);
    return axios
      .get(`${CUMTD_API_URI}/getdeparturesbystop?stop_id=${stopId}`)
      .then(res => res.data)
      .catch(retry);
  });
}

// Get the stop name and additional info
function getStop(stopId) {
  return promiseRetry(function(retry, number) {
    if (number > 1) console.error('Retrying XHR with attempt number', number);
    return axios
      .get(`${CUMTD_API_URI}/getstop?stop_id=${stopId}`)
      .then(res => res.data)
      .catch(retry);
  });
}

function getVehicleInfo(vehicleId) {
  return promiseRetry(function(retry, number) {
    if (number > 1) console.error('Retrying XHR with attempt number', number);
    return axios
      .get(`${CUMTD_API_URI}/getvehicle?vehicle_id=${vehicleId}`)
      .then(res => res.data)
      .catch(retry);
  });
}

function getNearestStops(latitude, longitude) {
  return promiseRetry(function(retry, number) {
    if (number > 1) console.error('Retrying XHR with attempt number', number);
    return axios
      .get(`${CUMTD_API_URI}/getstopsbylatlon?lat=${latitude}&lon=${longitude}`)
      .then(res => res.data)
      .catch(retry);
  });
}
export {
  getBuses,
  getStop,
  MAPBOX_API_KEY,
  CUMTD_API_URI,
  getVehicleInfo,
  getNearestStops
};

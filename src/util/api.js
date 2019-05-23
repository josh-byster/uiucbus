import axios from 'axios';

const CUMTD_API_URI = 'https://bustracker-api.herokuapp.com/api';
const MAPBOX_API_KEY =
  'pk.eyJ1Ijoiam9zaC1ieXN0ZXIiLCJhIjoiY2psN2xyZGFoMDY5ZjNxbWtpeDE0dDlwNSJ9.AAJipEPA6e-kLi1Jv3Wpyg';
function getBuses(stopId) {
  return axios
    .get(`${CUMTD_API_URI}/getdeparturesbystop?stop_id=${stopId}`)
    .then(res => res.data);
}

// Get the stop name and additional info
function getStop(stopId) {
  return axios
    .get(`${CUMTD_API_URI}/getstop?stop_id=${stopId}`)
    .then(res => res.data);
}

function getVehicleInfo(vehicleId) {
  return axios
    .get(`${CUMTD_API_URI}/getvehicle?vehicle_id=${vehicleId}`)
    .then(res => res.data);
}

function getNearestStops(latitude, longitude) {
  return axios
    .get(`${CUMTD_API_URI}/getstopsbylatlon?lat=${latitude}&lon=${longitude}`)
    .then(res => res.data);
}
export {
  getBuses,
  getStop,
  MAPBOX_API_KEY,
  CUMTD_API_URI,
  getVehicleInfo,
  getNearestStops
};

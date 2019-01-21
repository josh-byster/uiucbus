import axios from "axios";

const API_URL = "https://developer.mtd.org/api/v2.2/json/";
const MAPBOX_API_KEY =
  "pk.eyJ1Ijoiam9zaC1ieXN0ZXIiLCJhIjoiY2psN2xyZGFoMDY5ZjNxbWtpeDE0dDlwNSJ9.AAJipEPA6e-kLi1Jv3Wpyg";
const CUMTD_API_KEY = "fd4fb84bbbb34acfae890f17144ee131";
const MAX_EXPECTED_MINS_AWAY = 60;
function getBuses(stop_id) {
  return axios
    .get(
      `${API_URL}/getdeparturesbystop?key=${CUMTD_API_KEY}&stop_id=${stop_id}&pt=${MAX_EXPECTED_MINS_AWAY}`
    )
    .then(res => res.data);
}

// Get the stop name and additional info
function getStop(stop_id) {
  return axios
    .get(`${API_URL}/getstop?key=${CUMTD_API_KEY}&stop_id=${stop_id}`)
    .then(res => res.data);
}

function getVehicleInfo(vehicle_id) {
  return axios
    .get(`${API_URL}/getvehicle?key=${CUMTD_API_KEY}&vehicle_id=${vehicle_id}`)
    .then(res => res.data);
}

function getNearestStops(latitude, longitude) {
  return axios
    .get(
      `${API_URL}/getstopsbylatlon?key=${CUMTD_API_KEY}&lat=${latitude}&lon=${longitude}`
    )
    .then(res => res.data);
}
export {
  getBuses,
  getStop,
  MAPBOX_API_KEY,
  CUMTD_API_KEY,
  getVehicleInfo,
  getNearestStops
};

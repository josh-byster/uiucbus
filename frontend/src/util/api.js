import axios from 'axios';
import promiseRetry from 'promise-retry';

const CUMTD_API_URI =
  process.env.NODE_ENV === 'production'
    ? 'https://bustracker-api.herokuapp.com/api'
    : `http://localhost:${process.env.REACT_APP_API_PORT}/api`;

const MAPBOX_API_KEY =
  'pk.eyJ1Ijoiam9zaC1ieXN0ZXIiLCJhIjoiY2psN2xyZGFoMDY5ZjNxbWtpeDE0dDlwNSJ9.AAJipEPA6e-kLi1Jv3Wpyg';

function getBuses(stopId, cb) {
  return retryWrapper(
    `${CUMTD_API_URI}/getdeparturesbystop?stop_id=${stopId}`,
    cb
  );
}

// Get the stop name and additional info
function getStop(stopId, cb) {
  return retryWrapper(`${CUMTD_API_URI}/getstop?stop_id=${stopId}`, cb);
}

function getVehicleInfo(vehicleId) {
  return retryWrapper(`${CUMTD_API_URI}/getvehicle?vehicle_id=${vehicleId}`);
}

function getNearestStops(latitude, longitude) {
  return retryWrapper(
    `${CUMTD_API_URI}/getstopsbylatlon?lat=${latitude}&lon=${longitude}`
  );
}

function retryWrapper(url, cb) {
  return promiseRetry(function(retry, number) {
    if (number > 1) {
      console.error('Retrying XHR with attempt number', number);
      if (cb) {
        cb(number);
      }
    }
    return axios
      .get(url)
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

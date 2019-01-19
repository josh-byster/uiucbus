// import axios from "axios";
const axios = require("axios");
const API_URL = "https://developer.cumtd.com/api/v2.2/json/";
const CUMTD_API_KEY = "fd4fb84bbbb34acfae890f17144ee131";

module.exports.init = function() {
  axios.get(`${API_URL}/getstops?key=${CUMTD_API_KEY}`).then(res => {
    var allstops = [
      { stop_id: "PAR", stop_name: "PAR (Pennsylvania Ave. Residence Hall)" }
    ];
    for (var i in res.data.stops) {
      if (res.data.stops[i].stop_id !== "PAR") {
        //workaround since PAR doesn't show up on list
        allstops.push({
          stop_id: res.data.stops[i].stop_id,
          stop_name: res.data.stops[i].stop_name
        });
      }
    }
    require("fs").writeFile(
      "./allstops.json",

      JSON.stringify(allstops),

      function(err) {
        if (err) {
          console.error("Crap happens");
        }
      }
    );
    console.log(allstops);
  });
};

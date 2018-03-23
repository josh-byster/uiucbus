
function tConvert(time) {
  // Check correct time format and split into components
  var hours = Number(time.match(/^(\d+)/)[1]);
  var minutes = Number(time.match(/:(\d+)/)[1]);

  if (hours == 12 || hours == 24)
    hours = "12"
  else
    hours = hours % 12;
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  return `${hours}:${minutes}`;
}
var google_api = my_api_keys.GOOGLE_API_KEY;
var cumtd_api = my_api_keys.CUMTD_API_KEY;
var vars = {};
var stop_lat = 0;
var stop_long = 0;
var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
  vars[key] = value;
});
$.getJSON(`https://developer.cumtd.com/api/v2.2/json/getstoptimesbytrip?key=${cumtd_api}&trip_id=` +
  vars["trip_id"], displayData);

function displayData(data) {
  if (data) {
    console.log(data);
    for (i in data.stop_times) {
      stop = data.stop_times[i];
      document.getElementById('contents').innerHTML += `<tr><td>${parseInt(stop.stop_sequence)+1}</td><td>${stop.stop_point.stop_name}</td><td>${tConvert(stop.departure_time)}</td></tr>`
      console.log(`<tr><td>${parseInt(stop.stop_sequence)+1}</td><td>${stop.stop_point.stop_name}</td><td>${stop.arrival_time}</td></tr>`)
    }
  }
}
Raven.config('https://a3cd776e555b4f62b9215dee5e11a886@sentry.io/306037').install();

function setOptions() { //Does all the autocomplete setup.
    var options = {
        url: function (phrase) {
            return "https://www.cumtd.com/autocomplete/stops/v1.0/json/search?query=" + phrase + "&format=json";
        },

        getValue: "n",

        list: {

            onChooseEvent: function () {
                var id = $("#provider-remote").getSelectedItemData().i;
                var name = $("#provider-remote").getSelectedItemData().n;
                var storedAry = Cookies.get("storedAry");
                if (!storedAry) {
                    storedAry = [];
                } else {
                    storedAry = JSON.parse(storedAry);
                }
                storedAry.push([id, name]);
                Cookies.set("storedAry", storedAry, {
                    path: '/',
                    expires: 10
                });
                window.location = `BusTracking.html?id=${id}&name=${name}`
            }
        }
    };

    $("#provider-remote").easyAutocomplete(options);
}

function calcCrow(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    return d * 0.62137119; //to miles
}

// Converts numeric degrees to radians
function toRad(Value) {
    return Value * Math.PI / 180;
}

var google_api = my_api_keys.GOOGLE_API_KEY;
var cumtd_api = my_api_keys.CUMTD_API_KEY;
var vars = {};
var stop_lat = 0;
var stop_long = 0;
var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
    vars[key] = value;
});

function getInfo() {
    document.body.innerHTML += `
    <center>
    <div class="modal fade" id='myModal'>
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Where would you like to go?</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          </div>
          <div class="modal-body" id="modalBody2">
            <p>Modal body text goes here.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </center>`
    $.getJSON(`https://developer.cumtd.com/api/v2.2/json/getstop?key=${cumtd_api}&stop_id=` + vars["id"], function (data) {
        stop_lat = data.stops[0].stop_points[0].stop_lat;
        stop_long = data.stops[0].stop_points[0].stop_lon;
    });
    var count = 60;
    if (vars['refreshcount'] && decodeURIComponent(vars['refreshcount']) < 5) {
        var interval = setInterval(function () {
            count--;
            if (count == 50) {
                try {
                    ga('create', 'UA-109186351-1', 'auto');
                    ga('set', 'dimension1', vars['id']);
                    ga('set', 'dimension2', vars['name']);
                    ga('send', 'HIT');
                    ga('send', 'event', 'Stayed on page', vars['name']);
                } catch (e) {
                    console.log("Google Analytics could not load.");
                }
            }

            if (document.getElementById("change") != null) {
                document.getElementById("change").innerHTML = `<h4>Refreshing in ${count}s</h4><br/><h6>The current time is ${new Date().toLocaleTimeString()}</h6>`;
            } else {
                if (count < 55)
                    Raven.captureMessage("Info hasn't loaded in " + 60 - count + " seconds."); // will execute only if the async call below takes >5s
            }

        }, 1000);
    }
    //set cookies
    //var myAry = [1, 2, 3];
    //Cookies.set('name', JSON.stringify(myAry));
    //var storedAry = JSON.parse(Cookies.get('name'));
    $.getJSON(`https://developer.cumtd.com/api/v2.2/json/getdeparturesbystop?key=${cumtd_api}&pt=60&stop_id=` + vars["id"], function (data) {
        var body =
            `<center><h1>${decodeURIComponent(vars['name'])}</h1><br/><div id="change"><h4>Refreshing in ${count}s</h4><br/><h6>The current time is ${new Date().toLocaleTimeString()}</h6></div><br/><h6>Enter new location here:</h6><input id="provider-remote" /><br/><button type="button" onclick="getLocation()" class="btn btn-primary">Get Nearest Stop</button><br/></br></center>`


        if (data.departures.length == 0) {
            body += `<center><h4>No buses are coming to this stop within the next hour.</h4></center>`;
        } else {
            body += `<table class='table' id="bustable"><thead><tr><th>Bus Name</th><th>Mins Left</th><th>ETA</th><th>Last Location</th></thead><tbody>`;
            for (i = 0; i < data.departures.length; i++) {
                var current = data.departures[i];
                if (current.expected_mins == 0)
                    current.expected_mins = "Arriving Now";
                else {
                    current.expected_mins += "m";
                }
                var date = new Date(current.expected.toString());
                var hour = date.getHours() % 12;
                if (hour == 0) hour = 12;
                var minute = date.getMinutes();
                if (minute < 10) {
                    minute = "0" + minute
                }
                var seconds = date.getSeconds();
                if (seconds < 10) {
                    seconds = "0" + seconds
                }
                body +=
                    `<tr style='background-color:#${current.route.route_color};color:#${current.route.route_text_color}'><td style="word-wrap:break-word;"><b>${removeColors(current.headsign)}</b></td><td>${current.expected_mins}</td><td>${hour}:${minute}:${seconds}<td><button type="button" class="btn btn-success" onclick="directToMaps(${current.location.lat},${current.location.lon},'${current.trip.trip_id}','${current.trip.shape_id}','${current.route.route_color}','${current.vehicle_id}')">Location</button></td></tr>`;
                //"<div style='color:#" + current.route.route_color +
                //";'>" + current.headsign + current.expected_mins + "</div><br/>";
            }
            body += " </tr></tbody></table>"
        }

        document.body.innerHTML += body;

        // in case the page has been inactive, stop refresh
        if (!(vars['refreshcount'] && decodeURIComponent(vars['refreshcount']) < 10)) {
            console.log(document.getElementById("change"));
            if (document.getElementById("change") != null) {
                document.getElementById("change").innerHTML = `<h4>Will not refresh page due to inactivity.</h4><br/>`;
            }
        }
        setOptions();
    });
};

if ("id" in vars) {
    Raven.context(function () {
        getInfo();
    });
    if (vars['refreshcount'] && decodeURIComponent(vars['refreshcount']) < 5) {
        setInterval(function () {
            window.location.href = window.location.href.substring(0, window.location.href.length - 15) + "&refreshcount=" + parseInt(parseInt(decodeURIComponent(vars['refreshcount'])) + 1);
        }, 60000);
    }

} else {
    document.body.innerHTML = `<center><h4>Please provide a valid URL.</h4></center>`
}

function directToMaps(lat, long, trip, shape, color, vehicle) {
    console.log(vehicle);
    //window.open(`https://www.google.com/maps/place/${lat},${long}`,'mywindow');
    if (!document.getElementById("location")) {
        document.body.innerHTML +=
            `<div class="modal fade" id="location">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Current Bus Location</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" id="modalBody">

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>`;
    }
    $("#location").modal("show");
    modalBody = document.getElementById("modalBody");
    if (lat != 0 && long != 0) {
        modalBody.innerHTML =
            `<center><img src="https://maps.googleapis.com/maps/api/staticmap?center=${lat},${long}&size=300x300&maptype=roadmap&markers=color:blue%7Clabel:B%7C${lat},${long}&markers=color:green%7Clabel:GBB%7C${stop_lat},${stop_long}&key=${google_api}"></img>`
        dist = calcCrow(stop_lat, stop_long, lat, long).toFixed(2)
        if (dist < .05) {
            modalBody.innerHTML += `<center><br>The bus has arrived.</center>`
            $.getJSON(`https://developer.cumtd.com/api/v2.2/json/getvehicle?key=${cumtd_api}&vehicle_id=` + vehicle, function (data) {
                trip_id = data.vehicles[0].trip.trip_id;
                modalBody.innerHTML += `<center><a href='TripInfo.html?trip_id=${trip}'>View Trip Info</a></center>`;
                modalBody.innerHTML += `<center><a href='shapeViewer.html?shape_id=${shape}&color=${color}'>View Bus Route Map</a></center>`;
                console.log(`<a href='TripInfo.html?trip_id=${trip}'>View Trip Info</a>`);
            });
        } else {
            modalBody.innerHTML += `<center><br>The bus is ${calcCrow(stop_lat, stop_long, lat, long).toFixed(2)} miles away.</center>`
            console.log(vehicle);
            $.getJSON(`https://developer.cumtd.com/api/v2.2/json/getvehicle?key=${cumtd_api}&vehicle_id=` + vehicle, function (data) {
                prev_stop = data.vehicles[0].previous_stop_id;
                next_stop = data.vehicles[0].next_stop_id;
                $.getJSON(`https://developer.cumtd.com/api/v2.2/json/getstop?key=${cumtd_api}&stop_id=${prev_stop}`, function (data) {
                    if (data.stops[0]) {
                        modalBody.innerHTML += `<center><br><b>Previous stop:</b>  ${data.stops[0].stop_name}</center>`
                        console.log(`<center><br><b>Previous stop:</b>  ${data.stops[0].stop_name}</center>`);
                    }
                    $.getJSON(`https://developer.cumtd.com/api/v2.2/json/getstop?key=${cumtd_api}&stop_id=${next_stop}`, function (data) { //this is nested because I wanted to avoid the async call
                        if (data.stops[0]) {
                            modalBody.innerHTML += `<center><b>Next stop:</b> ${data.stops[0].stop_name}</center>`
                            console.log(`<center><b>Next stop:</b> ${data.stops[0].stop_name}</center>`);
                        }
                        modalBody.innerHTML += `<center><a href='TripInfo.html?trip_id=${trip}'>View Trip Info</a></center>`
                        modalBody.innerHTML += `<center><a href='shapeViewer.html?shape_id=${shape}&color=${color}'>View Bus Route Map</a></center>`;
                        console.log(`<a href='TripInfo?trip_id=${trip}'>View Trip Info</a>`);
                    });
                });

            });
        }
        setOptions();
    }
}

function showModalBefore() {
    $('#myModal').modal('show');
    document.getElementById("modalBody2").innerHTML = "Loading stops...";
}

function getLocation() {
    if (navigator.geolocation) {
        showModalBefore();
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        window.alert("We could not get your location.");
    }
}

function showPosition(position) {
    console.log("Got position!")
    console.log(position)
    $.getJSON(`https://developer.cumtd.com/api/v2.2/json/getstopsbylatlon?key=${cumtd_api}&pt=60&lat=${position.coords.latitude}&lon=${position.coords.longitude}`, function (data) {
        console.log(data);
        modalBody = document.getElementById("modalBody2");
        modalBody.innerHTML = "";
        for (i = 0; i < 3; i++) {
            redirectURL = `BusTracking.html?id=${data.stops[i].stop_id}&name=${encodeURIComponent(data.stops[i].stop_name)}`;
            modalBody.innerHTML += `<a href=${redirectURL} onclick="addLocationToHistory('${data.stops[i].stop_name}\',\'${data.stops[i].stop_id}');">${data.stops[i].stop_name} (${(data.stops[i].distance * 0.00018939).toFixed(2)} mi.)</a></br>`
            modalBody.innerHTML += ``;

            console.log(data.stops[i]);
        }
    });
}

function addLocationToHistory(name, id) {
    var storedAry = Cookies.get("storedAry");
    if (!storedAry) {
        storedAry = [];
    } else {
        storedAry = JSON.parse(storedAry);
    }
    storedAry.push([id, name]);
    Cookies.set("storedAry", storedAry, {
        path: '/',
        expires: 10
    });

}

function removeColors(str) {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        var colors = ["Yellow", "Red", "Lavender", "Blue", "Green", "Orange", "Grey", "Bronze", "Brown", "Gold", "Ruby", "Teal", "Silver", "Navy", "Pink", "Raven", "Illini", "YELLOW", "RED", "LAVENDER", "BLUE", "GREEN", "ORANGE", "GREY", "BRONZE", "BROWN", "GOLD", "RUBY", "TEAL", "SILVER", "NAVY", "PINK", "RAVEN", "ILLINI"]
        for (var i = 0; i < colors.length; i++) {
            str = str.split(colors[i]).join('');
        }
    }
    return str;
}
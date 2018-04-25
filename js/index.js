Raven.config('https://a3cd776e555b4f62b9215dee5e11a886@sentry.io/306037').install();

var cumtd_api = my_api_keys.CUMTD_API_KEY;
var storedAry = [];

function navbarFunc(index) {
    Raven.context(function () {
        var arr = [
            ["PLAZA", "Transit Plaza"],
            ["IU", "Illini Union"],
            ["PAR", "Pennsylvania Ave. Residence Hall"],
            ["KRANNERT", "Krannert Center"],
            ["1STSTDM", "First and Stadium"],
            ['GWNNV', 'Goodwin and Nevada'],
            ['ARC', 'Activities and Recreation']
        ];
        storedAry.push(arr[index]);
        Cookies.set('storedAry', JSON.stringify(storedAry), {
            expires: 10
        });
        window.location = `BusTracking.html?id=${arr[index][0]}&name=${encodeURIComponent(arr[index][1])}&refreshcount=0`
    });
}


function setUpStoredAry() {
    var storedAry = Cookies.get("storedAry");
    if (storedAry !== undefined && storedAry.length > 2) {
        storedAry = JSON.parse(storedAry);
        document.getElementById('recents').innerHTML = "<h3>Recently Viewed:</h3>"
        for (i = storedAry.length - 1; i >= Math.max(storedAry.length, 3) - 3; i--) {
            var currentElementName = storedAry[i][1];
            var currentElementName_encoded = encodeURIComponent(currentElementName);
            var currentElementID = storedAry[i][0];
            var window_location = `BusTracking.html?id=${currentElementID}&name=${currentElementName_encoded}`;
            document.getElementById('recents').innerHTML += `<button type="button" class="btn btn-success" style='margin-bottom:20px;' onclick="window.location = '${window_location}';">${currentElementName}</button><br/>`;

        }
        document.getElementById('recents').innerHTML +=
            `<button type="button" class="btn btn-primary" style='margin-bottom:20px;' onclick="storedAry=[];Cookies.set('storedAry',[],{expires:10});document.getElementById('recents').innerHTML='';">Clear</button><br/>`;
    }
}

Raven.context(function () {
    setUpStoredAry();
});

var options = {
    url: function (phrase) {
        return "https://www.cumtd.com/autocomplete/stops/v1.0/json/search?query=" + phrase + "&format=json";
    },

    getValue: "n",

    list: {

        onChooseEvent: function () {
            Raven.context(function () {
                var id = $("#provider-remote").getSelectedItemData().i;
                var name = $("#provider-remote").getSelectedItemData().n;
                try {
                    storedAry.push([id, name]);
                    Cookies.set('storedAry', JSON.stringify(storedAry), {
                        expires: 10
                    });
                } catch (e) {
                    Raven.captureException(new Error("Browser cannot to store cookies. Not necessarily error."));
                    console.log("Hello");
                }

                window.location = `BusTracking.html?id=${id}&name=${name}`
            });
        }
    }
};
console.log("HI");
if (!$.fn.easyAutocomplete) { 
    console.log("HI");
    $.getScript( "cdn-backup/popper.min.js"); 
    $('<link/>', {
   rel: 'stylesheet',
   type: 'text/css',
   href: 'cdn-backup/easy-autocomplete.themes.css'
    }).appendTo('head');
    $('<link/>', {
   rel: 'stylesheet',
   type: 'text/css',
   href: 'cdn-backup/easy-autocomplete.min.css'
    }).appendTo('head');
    
    $.getScript( "cdn-backup/jquery.easy-autocomplete.min.js",function(){
        $("#provider-remote").easyAutocomplete(options);   
        console.log($.fn.easyAutocomplete);
    });
} else {
    $("#provider-remote").easyAutocomplete(options);   
}



function showModal() {
    if (!document.getElementById("location")) {
        document.body.innerHTML +=
            `<div class="modal fade" id="location">
<div class="modal-dialog" role="document">
  <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title" id="modal_title">Trip Planner</h5>
      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body" id="modalBody">
    <center><iframe src="planner_search.html" id='frame' frameborder="0" style="position:relative;width:100%;height:300px;" width=''></iframe>
    </center>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-primary" onclick="document.getElementById('frame').src='planner_search.html'">New Route</button>
      <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
    </div>
  </div>
</div>
</div>`;
    }
    $("#location").modal("show");
    $('#location').on('hidden.bs.modal', function () {
        $("#provider-remote").easyAutocomplete(options);
    })
}

function showModalBefore() {
    $('#myModal').modal('show');
    document.getElementById("modalBody").innerHTML = "Loading stops...";
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
    $.getJSON(`https://developer.cumtd.com/api/v2.2/json/getstopsbylatlon?key=${cumtd_api}&pt=60&lat=${position.coords.latitude}&lon=${position.coords.longitude}`, function (data) {
        console.log(data);
        modalBody = document.getElementById("modalBody");
        modalBody.innerHTML = "";
        for (i = 0; i < 3; i++) {
            redirectURL = `BusTracking.html?id=${data.stops[i].stop_id}&name=${encodeURIComponent(data.stops[i].stop_name)}`;
            modalBody.innerHTML += `<a href=${redirectURL}>${data.stops[i].stop_name} (${(data.stops[i].distance * 0.00018939).toFixed(2)} mi.)</a></br>`
            modalBody.innerHTML += ``;
            console.log(data.stops[i]);
        }
    });
}
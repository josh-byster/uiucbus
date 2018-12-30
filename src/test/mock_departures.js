var departures = [
  {
    stop_id: "PLAZA:4",
    headsign: "100N Yellow",
    route: {
      route_color: "fcee1f",
      route_id: "YELLOW SATURDAY",
      route_long_name: "Yellow Saturday",
      route_short_name: "100",
      route_text_color: "000000"
    },
    trip: {
      trip_id: "[@15.0.63192124@][1][1338414280664]/18__Y4SA",
      trip_headsign: "Champaign Walmart",
      route_id: "YELLOW SATURDAY",
      block_id: "Y4SA",
      direction: "North",
      service_id: "Y4SA",
      shape_id: "[@14.0.57766396@]100N"
    },
    vehicle_id: "1185",
    origin: { stop_id: "SWALMART:1" },
    destination: { stop_id: "WALMART:2" },
    is_monitored: true,
    is_scheduled: true,
    is_istop: true,
    scheduled: "2018-12-29T17:28:00-06:00",
    expected: "2018-12-29T17:32:40-06:00",
    expected_mins: 5,
    location: { lat: 40.102727, lon: -88.24125 }
  },
  {
    stop_id: "PLAZA:3",
    headsign: "130S Silver Limited",
    route: {
      route_color: "cccccc",
      route_id: "SILVER LIMITED SATURDAY",
      route_long_name: "Silver Limited Saturday",
      route_short_name: "130",
      route_text_color: "000000"
    },
    trip: {
      trip_id: "[@15.0.67916770@][2][1363721664566]/31__SV1NONUISA",
      trip_headsign: "Transit Plaza",
      route_id: "SILVER LIMITED SATURDAY",
      block_id: "SV1NONUISA",
      direction: "South",
      service_id: "SV1NONUISA",
      shape_id: "[@15.0.67916770@]3"
    },
    vehicle_id: "1166",
    origin: { stop_id: "LSE:8" },
    destination: { stop_id: "PLAZA:4" },
    is_monitored: true,
    is_scheduled: true,
    is_istop: false,
    scheduled: "2018-12-29T17:33:00-06:00",
    expected: "2018-12-29T17:34:15-06:00",
    expected_mins: 7,
    location: { lat: 40.112417, lon: -88.20875 }
  },
  {
    stop_id: "PLAZA:4",
    headsign: "130N Silver Limited",
    route: {
      route_color: "cccccc",
      route_id: "SILVER LIMITED SATURDAY",
      route_long_name: "Silver Limited Saturday",
      route_short_name: "130",
      route_text_color: "000000"
    },
    trip: {
      trip_id: "[@15.0.67916770@][1][1363722440092]/81__SV1NONUISA",
      trip_headsign: "Lincoln Square",
      route_id: "SILVER LIMITED SATURDAY",
      block_id: "SV1NONUISA",
      direction: "North",
      service_id: "SV1NONUISA",
      shape_id: "[@15.0.67916770@]2"
    },
    vehicle_id: "1166",
    origin: { stop_id: "PLAZA:4" },
    destination: { stop_id: "LSE:8" },
    is_monitored: true,
    is_scheduled: true,
    is_istop: false,
    scheduled: "2018-12-29T17:35:00-06:00",
    expected: "2018-12-29T17:36:15-06:00",
    expected_mins: 9,
    location: { lat: 40.112417, lon: -88.20875 }
  },
  {
    stop_id: "PLAZA:3",
    headsign: "220S Illini Limited",
    route: {
      route_color: "5a1d5a",
      route_id: "ILLINI LIMITED SATURDAY",
      route_long_name: "Illini Limited Saturday",
      route_short_name: "220",
      route_text_color: "ffffff"
    },
    trip: {
      trip_id: "[@12.0.44202283@][1250947454031]/180__I1NONUISA",
      trip_headsign: "Transit Plaza",
      route_id: "ILLINI LIMITED SATURDAY",
      block_id: "I1NONUISA",
      direction: "South",
      service_id: "I1NONUISA",
      shape_id: "ILLINI LIMITED WEEKEND 845"
    },
    vehicle_id: "1606",
    origin: { stop_id: "LNCLNKLRNY:1" },
    destination: { stop_id: "ARYWRT:3" },
    is_monitored: true,
    is_scheduled: true,
    is_istop: true,
    scheduled: "2018-12-29T17:45:00-06:00",
    expected: "2018-12-29T17:45:00-06:00",
    expected_mins: 18,
    location: { lat: 40.13243, lon: -88.218 }
  },
  {
    stop_id: "PLAZA:3",
    headsign: "100S Yellow",
    route: {
      route_color: "fcee1f",
      route_id: "YELLOW SATURDAY",
      route_long_name: "Yellow Saturday",
      route_short_name: "100",
      route_text_color: "000000"
    },
    trip: {
      trip_id: "[@15.0.63192124@][2][1338469240094]/25__Y2NONUISA",
      trip_headsign: "Savoy Walmart",
      route_id: "YELLOW SATURDAY",
      block_id: "Y2NONUISA",
      direction: "South",
      service_id: "Y2NONUISA",
      shape_id: "[@14.0.57766396@]100S"
    },
    vehicle_id: "0317",
    origin: { stop_id: "WALMART:2" },
    destination: { stop_id: "SWALMART:1" },
    is_monitored: true,
    is_scheduled: true,
    is_istop: true,
    scheduled: "2018-12-29T17:45:00-06:00",
    expected: "2018-12-29T17:46:40-06:00",
    expected_mins: 19,
    location: { lat: 40.140347, lon: -88.242583 }
  },
  {
    stop_id: "PLAZA:4",
    headsign: "220N Illini Limited",
    route: {
      route_color: "5a1d5a",
      route_id: "ILLINI LIMITED SATURDAY",
      route_long_name: "Illini Limited Saturday",
      route_short_name: "220",
      route_text_color: "ffffff"
    },
    trip: {
      trip_id: "[@12.0.44202283@][1250947454031]/87__I1NONUISA",
      trip_headsign: "Lincoln & Killarney",
      route_id: "ILLINI LIMITED SATURDAY",
      block_id: "I1NONUISA",
      direction: "North",
      service_id: "I1NONUISA",
      shape_id: "22N ILLINI LIMITED WEEKEND"
    },
    vehicle_id: "1606",
    origin: { stop_id: "ARYWRT:3" },
    destination: { stop_id: "LNCLNKLRNY:1" },
    is_monitored: true,
    is_scheduled: true,
    is_istop: true,
    scheduled: "2018-12-29T17:47:00-06:00",
    expected: "2018-12-29T17:47:00-06:00",
    expected_mins: 20,
    location: { lat: 40.13243, lon: -88.218 }
  },
  {
    stop_id: "PLAZA:3",
    headsign: "130S Silver Limited",
    route: {
      route_color: "cccccc",
      route_id: "SILVER LIMITED SATURDAY",
      route_long_name: "Silver Limited Saturday",
      route_short_name: "130",
      route_text_color: "000000"
    },
    trip: {
      trip_id: "[@15.0.67916770@][2][1363721676269]/32__SV1NONUISA",
      trip_headsign: "Transit Plaza",
      route_id: "SILVER LIMITED SATURDAY",
      block_id: "SV1NONUISA",
      direction: "South",
      service_id: "SV1NONUISA",
      shape_id: "[@15.0.67916770@]3"
    },
    vehicle_id: "1166",
    origin: { stop_id: "LSE:8" },
    destination: { stop_id: "PLAZA:4" },
    is_monitored: true,
    is_scheduled: true,
    is_istop: false,
    scheduled: "2018-12-29T17:53:00-06:00",
    expected: "2018-12-29T17:53:00-06:00",
    expected_mins: 26,
    location: { lat: 40.112417, lon: -88.20875 }
  },
  {
    stop_id: "PLAZA:4",
    headsign: "130N Silver Limited",
    route: {
      route_color: "cccccc",
      route_id: "SILVER LIMITED SATURDAY",
      route_long_name: "Silver Limited Saturday",
      route_short_name: "130",
      route_text_color: "000000"
    },
    trip: {
      trip_id: "[@15.0.67916770@][1][1363722440092]/82__SV1NONUISA",
      trip_headsign: "Lincoln Square",
      route_id: "SILVER LIMITED SATURDAY",
      block_id: "SV1NONUISA",
      direction: "North",
      service_id: "SV1NONUISA",
      shape_id: "[@15.0.67916770@]2"
    },
    vehicle_id: "1166",
    origin: { stop_id: "PLAZA:4" },
    destination: { stop_id: "LSE:8" },
    is_monitored: true,
    is_scheduled: true,
    is_istop: false,
    scheduled: "2018-12-29T17:55:00-06:00",
    expected: "2018-12-29T17:55:00-06:00",
    expected_mins: 28,
    location: { lat: 40.112417, lon: -88.20875 }
  }
];

export default departures;

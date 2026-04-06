import { NextRequest, NextResponse } from "next/server";
import { getDepartures } from "@/lib/cumtd";

// TODO: Remove mock data — temporary for UI preview
const MOCK_DEPARTURES = [
  {
    destination: { stop_id: "PAR:2", stop_name: "PAR" },
    expected: new Date(Date.now() + 0 * 60_000).toISOString(),
    expected_mins: 0,
    headsign: "Yellow Hopper",
    is_istop: false,
    is_monitored: true,
    location: { lat: 40.1105, lon: -88.2284 },
    origin: { stop_id: "IU:2", stop_name: "Illini Union" },
    route: { route_color: "CEAB00", route_id: "YELLOWHOPPER", route_long_name: "Yellow Hopper", route_short_name: "YLW", route_text_color: "000000" },
    scheduled: new Date(Date.now() + 0 * 60_000).toISOString(),
    stop_id: "IU:2",
    trip: { trip_id: "t1", direction: "South", route_id: "YELLOWHOPPER" },
    vehicle_id: "1801",
  },
  {
    destination: { stop_id: "CCRB:1", stop_name: "CCRB" },
    expected: new Date(Date.now() + 3 * 60_000).toISOString(),
    expected_mins: 3,
    headsign: "22 Illini",
    is_istop: false,
    is_monitored: true,
    location: { lat: 40.1098, lon: -88.2272 },
    origin: { stop_id: "IU:2", stop_name: "Illini Union" },
    route: { route_color: "008144", route_id: "22ILLINI", route_long_name: "22 Illini", route_short_name: "22", route_text_color: "FFFFFF" },
    scheduled: new Date(Date.now() + 4 * 60_000).toISOString(),
    stop_id: "IU:2",
    trip: { trip_id: "t2", direction: "East", route_id: "22ILLINI" },
    vehicle_id: "1815",
  },
  {
    destination: { stop_id: "LWSN:1", stop_name: "Lawson Hall" },
    expected: new Date(Date.now() + 8 * 60_000).toISOString(),
    expected_mins: 8,
    headsign: "12E Teal",
    is_istop: false,
    is_monitored: true,
    location: { lat: 40.1120, lon: -88.2310 },
    origin: { stop_id: "IU:2", stop_name: "Illini Union" },
    route: { route_color: "008990", route_id: "12ETEAL", route_long_name: "12E Teal", route_short_name: "12E", route_text_color: "FFFFFF" },
    scheduled: new Date(Date.now() + 9 * 60_000).toISOString(),
    stop_id: "IU:2",
    trip: { trip_id: "t3", direction: "North", route_id: "12ETEAL" },
    vehicle_id: "1823",
  },
  {
    destination: { stop_id: "SRGNT:2", stop_name: "Sargent Hall" },
    expected: new Date(Date.now() + 15 * 60_000).toISOString(),
    expected_mins: 15,
    headsign: "5E Green",
    is_istop: false,
    is_monitored: true,
    location: { lat: 40.1090, lon: -88.2250 },
    origin: { stop_id: "IU:2", stop_name: "Illini Union" },
    route: { route_color: "00703C", route_id: "5EGREEN", route_long_name: "5E Green", route_short_name: "5E", route_text_color: "FFFFFF" },
    scheduled: new Date(Date.now() + 15 * 60_000).toISOString(),
    stop_id: "IU:2",
    trip: { trip_id: "t4", direction: "South", route_id: "5EGREEN" },
    vehicle_id: "1807",
  },
  {
    destination: { stop_id: "GRNGD:1", stop_name: "Grange & Dodson" },
    expected: new Date(Date.now() + 22 * 60_000).toISOString(),
    expected_mins: 22,
    headsign: "1S Yellow",
    is_istop: false,
    is_monitored: true,
    location: { lat: 40.1070, lon: -88.2200 },
    origin: { stop_id: "IU:2", stop_name: "Illini Union" },
    route: { route_color: "CEAB00", route_id: "1SYELLOW", route_long_name: "1S Yellow", route_short_name: "1S", route_text_color: "000000" },
    scheduled: new Date(Date.now() + 23 * 60_000).toISOString(),
    stop_id: "IU:2",
    trip: { trip_id: "t5", direction: "West", route_id: "1SYELLOW" },
    vehicle_id: "1830",
  },
  {
    destination: { stop_id: "BECK:1", stop_name: "Beckman Institute" },
    expected: new Date(Date.now() + 1 * 60_000).toISOString(),
    expected_mins: 1,
    headsign: "13 Silver",
    is_istop: false,
    is_monitored: true,
    location: { lat: 40.1155, lon: -88.2275 },
    origin: { stop_id: "IU:2", stop_name: "Illini Union" },
    route: { route_color: "808080", route_id: "13SILVER", route_long_name: "13 Silver", route_short_name: "13", route_text_color: "FFFFFF" },
    scheduled: new Date(Date.now() + 1 * 60_000).toISOString(),
    stop_id: "IU:2",
    trip: { trip_id: "t6", direction: "North", route_id: "13SILVER" },
    vehicle_id: "1842",
  },
  {
    destination: { stop_id: "OAKCR:1", stop_name: "Oak & Crescent" },
    expected: new Date(Date.now() + 5 * 60_000).toISOString(),
    expected_mins: 5,
    headsign: "9 Brown",
    is_istop: false,
    is_monitored: true,
    location: { lat: 40.1060, lon: -88.2190 },
    origin: { stop_id: "IU:2", stop_name: "Illini Union" },
    route: { route_color: "7B3F00", route_id: "9BROWN", route_long_name: "9 Brown", route_short_name: "9", route_text_color: "FFFFFF" },
    scheduled: new Date(Date.now() + 6 * 60_000).toISOString(),
    stop_id: "IU:2",
    trip: { trip_id: "t7", direction: "West", route_id: "9BROWN" },
    vehicle_id: "1850",
  },
  {
    destination: { stop_id: "MTHWS:1", stop_name: "Matthews & Green" },
    expected: new Date(Date.now() + 10 * 60_000).toISOString(),
    expected_mins: 10,
    headsign: "6 Blue",
    is_istop: false,
    is_monitored: true,
    location: { lat: 40.1130, lon: -88.2340 },
    origin: { stop_id: "IU:2", stop_name: "Illini Union" },
    route: { route_color: "1E3A8A", route_id: "6BLUE", route_long_name: "6 Blue", route_short_name: "6", route_text_color: "FFFFFF" },
    scheduled: new Date(Date.now() + 11 * 60_000).toISOString(),
    stop_id: "IU:2",
    trip: { trip_id: "t8", direction: "East", route_id: "6BLUE" },
    vehicle_id: "1855",
  },
  {
    destination: { stop_id: "GRNST:1", stop_name: "Green & State" },
    expected: new Date(Date.now() + 18 * 60_000).toISOString(),
    expected_mins: 18,
    headsign: "10 Gold",
    is_istop: false,
    is_monitored: true,
    location: { lat: 40.1045, lon: -88.2155 },
    origin: { stop_id: "IU:2", stop_name: "Illini Union" },
    route: { route_color: "DAA520", route_id: "10GOLD", route_long_name: "10 Gold", route_short_name: "10", route_text_color: "000000" },
    scheduled: new Date(Date.now() + 19 * 60_000).toISOString(),
    stop_id: "IU:2",
    trip: { trip_id: "t9", direction: "South", route_id: "10GOLD" },
    vehicle_id: "1860",
  },
  {
    destination: { stop_id: "WNDSR:1", stop_name: "Windsor & Neil" },
    expected: new Date(Date.now() + 25 * 60_000).toISOString(),
    expected_mins: 25,
    headsign: "7 Grey",
    is_istop: false,
    is_monitored: true,
    location: { lat: 40.1020, lon: -88.2110 },
    origin: { stop_id: "IU:2", stop_name: "Illini Union" },
    route: { route_color: "4B5563", route_id: "7GREY", route_long_name: "7 Grey", route_short_name: "7", route_text_color: "FFFFFF" },
    scheduled: new Date(Date.now() + 26 * 60_000).toISOString(),
    stop_id: "IU:2",
    trip: { trip_id: "t10", direction: "North", route_id: "7GREY" },
    vehicle_id: "1865",
  },
  {
    destination: { stop_id: "SPRNG:1", stop_name: "Springfield & Mattis" },
    expected: new Date(Date.now() + 30 * 60_000).toISOString(),
    expected_mins: 30,
    headsign: "100 Red",
    is_istop: false,
    is_monitored: true,
    location: { lat: 40.1000, lon: -88.2080 },
    origin: { stop_id: "IU:2", stop_name: "Illini Union" },
    route: { route_color: "DC2626", route_id: "100RED", route_long_name: "100 Red", route_short_name: "100", route_text_color: "FFFFFF" },
    scheduled: new Date(Date.now() + 31 * 60_000).toISOString(),
    stop_id: "IU:2",
    trip: { trip_id: "t11", direction: "West", route_id: "100RED" },
    vehicle_id: "1870",
  },
  {
    destination: { stop_id: "KNRDY:1", stop_name: "Kennedy & Prospect" },
    expected: new Date(Date.now() + 38 * 60_000).toISOString(),
    expected_mins: 38,
    headsign: "20 Raven",
    is_istop: false,
    is_monitored: true,
    location: { lat: 40.0980, lon: -88.2050 },
    origin: { stop_id: "IU:2", stop_name: "Illini Union" },
    route: { route_color: "1F2937", route_id: "20RAVEN", route_long_name: "20 Raven", route_short_name: "20", route_text_color: "FFFFFF" },
    scheduled: new Date(Date.now() + 39 * 60_000).toISOString(),
    stop_id: "IU:2",
    trip: { trip_id: "t12", direction: "East", route_id: "20RAVEN" },
    vehicle_id: "1875",
  },
];

const USE_MOCK = true;

export async function GET(request: NextRequest) {
  const stopId = request.nextUrl.searchParams.get("stop_id");
  if (!stopId) {
    return NextResponse.json(
      { error: "stop_id is required" },
      { status: 400 }
    );
  }

  if (USE_MOCK) {
    return NextResponse.json({
      status: { code: 200, msg: "ok" },
      departures: MOCK_DEPARTURES,
    });
  }

  try {
    const data = await getDepartures(stopId);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Departures API error:", error);
    return NextResponse.json(
      { status: { code: 500, msg: "API error" }, departures: [] },
      { status: 500 }
    );
  }
}

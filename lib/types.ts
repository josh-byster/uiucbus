// CUMTD API response types

export interface Stop {
  stop_id: string
  stop_name: string
  code: string
  distance?: number
  stop_points: StopPoint[]
}

export interface StopPoint {
  code: string
  stop_id: string
  stop_lat: number
  stop_lon: number
  stop_name: string
}

export interface Route {
  route_color: string
  route_id: string
  route_long_name: string
  route_short_name: string
  route_text_color: string
}

export interface Departure {
  destination: { stop_id: string; stop_name: string }
  expected: string
  expected_mins: number
  headsign: string
  is_istop: boolean
  is_monitored: boolean
  location: { lat: number; lon: number }
  origin: { stop_id: string; stop_name: string }
  route: Route
  scheduled: string
  stop_id: string
  trip: { trip_id: string; direction: string; route_id: string }
  vehicle_id: string
}

export interface Vehicle {
  vehicle_id: string
  trip: { trip_id: string; route_id: string; direction: string }
  location: { lat: number; lon: number }
  next_stop_id: string
  previous_stop_id: string
  origin_stop_id: string
  destination_stop_id: string
  last_updated: string
}

export interface StopSearchEntry {
  stop_id: string
  stop_name: string
}

export interface SavedStop {
  id: string
  name: string
}

// API response wrappers
export interface DeparturesResponse {
  status: { code: number; msg: string }
  departures: Departure[]
}

export interface StopResponse {
  status: { code: number; msg: string }
  stops: Stop[]
}

export interface VehicleResponse {
  status: { code: number; msg: string }
  vehicles: Vehicle[]
}

export interface NearestStopsResponse {
  status: { code: number; msg: string }
  stops: Stop[]
}

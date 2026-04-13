import type {
  DeparturesResponse,
  StopResponse,
  VehicleResponse,
  NearestStopsResponse,
} from "./types"

const BASE_URL = "https://developer.mtd.org/api/v2.2/json"
const API_KEY = process.env.CUMTD_API_KEY!
const MAX_EXPECTED_MINS = 60

async function cumtdFetch<T>(
  endpoint: string,
  params: Record<string, string>,
  revalidate?: number
): Promise<T> {
  const url = new URL(`${BASE_URL}/${endpoint}`)
  url.searchParams.set("key", API_KEY)
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v)
  }

  const res = await fetch(url.toString(), {
    next: revalidate !== undefined ? { revalidate } : { revalidate: false },
  } as RequestInit)

  if (!res.ok) {
    throw new Error(`CUMTD API error: ${res.status} ${res.statusText}`)
  }

  return res.json() as Promise<T>
}

export function getDepartures(stopId: string) {
  return cumtdFetch<DeparturesResponse>("getdeparturesbystop", {
    stop_id: stopId,
    pt: String(MAX_EXPECTED_MINS),
  })
}

export function getStop(stopId: string) {
  return cumtdFetch<StopResponse>(
    "getstop",
    {
      stop_id: stopId,
    },
    86400
  )
}

export function getVehicle(vehicleId: string) {
  return cumtdFetch<VehicleResponse>("getvehicle", {
    vehicle_id: vehicleId,
  })
}

export function getNearestStops(lat: string, lon: string) {
  return cumtdFetch<NearestStopsResponse>("getstopsbylatlon", {
    lat,
    lon,
  })
}

import type { StopSearchEntry } from "./types"
import allStops from "./allstops.json"

const stops: StopSearchEntry[] = allStops

export function searchStops(query: string): StopSearchEntry[] {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) return []

  const words = trimmed.split(/\s+/)
  return stops
    .filter((stop) => {
      const name = stop.stop_name.toLowerCase()
      return words.every((word) => name.includes(word))
    })
    .slice(0, 8)
}

export function getStopName(stopId: string): string | undefined {
  const parentId = stopId.split(":")[0]
  return stops.find((s) => s.stop_id === parentId)?.stop_name
}

export { stops as allStops }

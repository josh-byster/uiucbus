import type { SavedStop } from "./types"

const STORAGE_KEY = "savedStops"
const MAX_SAVED = 5

export function getSavedStops(): SavedStop[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addSavedStop(stop: SavedStop): SavedStop[] {
  const stops = getSavedStops().filter((s) => s.id !== stop.id)
  stops.unshift(stop)
  const updated = stops.slice(0, MAX_SAVED)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  window.dispatchEvent(new Event("storage"))
  return updated
}

export function removeSavedStop(stopId: string): SavedStop[] {
  const updated = getSavedStops().filter((s) => s.id !== stopId)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  window.dispatchEvent(new Event("storage"))
  return updated
}

export function clearSavedStops(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
  window.dispatchEvent(new Event("storage"))
}

export function isStopSaved(stopId: string): boolean {
  return getSavedStops().some((s) => s.id === stopId)
}

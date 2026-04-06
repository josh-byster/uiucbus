"use client"

import { useCallback, useEffect, useState } from "react"
import { BusFront, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DepartureRow } from "@/components/departure-row"
import type { Departure, StopPoint } from "@/lib/types"

interface DeparturesTableProps {
  stopId: string
  stopPoint?: StopPoint
  onStatusChange?: (secondsAgo: number, refresh: () => void) => void
}

const POLL_INTERVAL = 30_000

export function DeparturesTable({
  stopId,
  stopPoint,
  onStatusChange,
}: DeparturesTableProps) {
  const [departures, setDepartures] = useState<Departure[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [secondsAgo, setSecondsAgo] = useState(0)

  const fetchDepartures = useCallback(async () => {
    try {
      const res = await fetch(`/api/departures?stop_id=${stopId}`)
      const data = await res.json()
      setDepartures(data.departures || [])
      setError(null)
      setLastUpdated(new Date())
    } catch {
      setError("Failed to load departures.")
    } finally {
      setLoading(false)
    }
  }, [stopId])

  // Initial fetch + polling
  useEffect(() => {
    setLoading(true)
    fetchDepartures()
    const interval = setInterval(fetchDepartures, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchDepartures])

  // "Updated X seconds ago" ticker — report to parent if callback provided
  useEffect(() => {
    if (!lastUpdated) return
    const interval = setInterval(() => {
      const s = Math.round((Date.now() - lastUpdated.getTime()) / 1000)
      setSecondsAgo(s)
      onStatusChange?.(s, fetchDepartures)
    }, 1000)
    onStatusChange?.(0, fetchDepartures)
    return () => clearInterval(interval)
  }, [lastUpdated, onStatusChange, fetchDepartures])

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex animate-pulse items-center gap-4 rounded-lg border border-border/50 bg-muted/30 p-4"
          >
            <div className="h-10 w-14 rounded-md bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 rounded bg-muted" />
              <div className="h-3 w-20 rounded bg-muted" />
            </div>
            <div className="h-8 w-16 rounded bg-muted" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <p className="text-sm text-destructive">{error}</p>
        <Button variant="outline" size="sm" onClick={fetchDepartures}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div>
      {departures.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16">
          <div className="rounded-full bg-muted p-4">
            <BusFront className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="font-medium">No upcoming departures</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Buses may not be running at this time.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {departures.map((dep, i) => (
            <DepartureRow
              key={`${dep.vehicle_id}-${dep.expected}-${i}`}
              departure={dep}
              stopPoint={stopPoint}
            />
          ))}
        </div>
      )}

      {!onStatusChange && lastUpdated && (
        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <span>Updated {secondsAgo}s ago</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={fetchDepartures}
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  )
}

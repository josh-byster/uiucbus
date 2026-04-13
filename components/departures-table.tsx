"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { BusFront, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DepartureRow } from "@/components/departure-row"
import type { Departure, StopPoint } from "@/lib/types"

interface DeparturesTableProps {
  stopId: string
  onStatusChange?: (secondsAgo: number, refresh: () => void) => void
}

const POLL_INTERVAL = 30_000

export function DeparturesTable({
  stopId,
  onStatusChange,
}: DeparturesTableProps) {
  const [departures, setDepartures] = useState<Departure[]>([])
  const [stopPoints, setStopPoints] = useState<StopPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [secondsAgo, setSecondsAgo] = useState(0)
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const touchStartY = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Fetch stop points once for map pins
  useEffect(() => {
    fetch(`/api/stop?stop_id=${stopId}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.stops?.[0]?.stop_points) {
          setStopPoints(data.stops[0].stop_points)
        }
      })
      .catch(() => {})
  }, [stopId])

  const fetchDepartures = useCallback(async () => {
    try {
      const res = await fetch(`/api/departures?stop_id=${stopId}`, {
        cache: "no-store",
      })
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

  // Pull-to-refresh handlers
  const PULL_THRESHOLD = 80

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY
    }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartY.current) return
    const delta = e.touches[0].clientY - touchStartY.current
    if (delta > 0) {
      setPullDistance(Math.min(delta * 0.5, 120))
    }
  }, [])

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance >= PULL_THRESHOLD) {
      setIsRefreshing(true)
      await fetchDepartures()
      setIsRefreshing(false)
    }
    setPullDistance(0)
    touchStartY.current = 0
  }, [pullDistance, fetchDepartures])

  // Determine if service is likely not running
  const now = new Date()
  const hour = now.getHours()
  const isLateNight = hour >= 1 && hour < 5

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
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull-to-refresh indicator */}
      {(pullDistance > 0 || isRefreshing) && (
        <div
          className="flex items-center justify-center overflow-hidden transition-[height] duration-200"
          style={{ height: isRefreshing ? 40 : pullDistance }}
        >
          <RefreshCw
            className={`h-5 w-5 text-muted-foreground ${isRefreshing ? "animate-spin" : ""}`}
            style={{
              opacity: Math.min(pullDistance / PULL_THRESHOLD, 1),
              transform: `rotate(${pullDistance * 2}deg)`,
            }}
          />
        </div>
      )}

      {departures.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16">
          <div className="rounded-full bg-muted p-4">
            <BusFront className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="font-medium">No upcoming departures</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {isLateNight
                ? "Service typically resumes around 5:00 AM."
                : "Buses may not be running at this time."}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {departures.map((dep, i) => (
            <DepartureRow
              key={`${dep.vehicle_id}-${dep.expected}-${i}`}
              departure={dep}
              stopPoint={stopPoints.find((sp) => sp.stop_id === dep.stop_id)}
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

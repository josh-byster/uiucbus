"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ChevronLeft, RefreshCw } from "lucide-react"
import { StopSearch } from "@/components/stop-search"
import { SavedStops } from "@/components/saved-stops"
import { NearestStopsDialog } from "@/components/nearest-stops-dialog"
import { DeparturesTable } from "@/components/departures-table"
import { Button } from "@/components/ui/button"
import { addSavedStop } from "@/lib/saved-stops"
import type { StopSearchEntry } from "@/lib/types"

interface UnifiedHomeProps {
  initialStop?: StopSearchEntry
}

export function UnifiedHome({ initialStop }: UnifiedHomeProps) {
  const [nearestOpen, setNearestOpen] = useState(false)
  const [selectedStop, setSelectedStop] = useState<StopSearchEntry | null>(
    initialStop ?? null
  )
  const [updatedAgo, setUpdatedAgo] = useState(0)
  const refreshRef = useRef<(() => void) | null>(null)

  const handleStatusChange = useCallback(
    (seconds: number, refresh: () => void) => {
      setUpdatedAgo(seconds)
      refreshRef.current = refresh
    },
    []
  )

  const handleSelect = useCallback((stop: StopSearchEntry) => {
    setSelectedStop(stop)
    addSavedStop({ id: stop.stop_id, name: stop.stop_name })
    window.history.pushState(null, "", `/track/${stop.stop_id}`)
  }, [])

  const handleBack = useCallback(() => {
    setSelectedStop(null)
    window.history.pushState(null, "", "/")
  }, [])

  // Handle browser back/forward
  useEffect(() => {
    const onPopState = () => {
      if (window.location.pathname === "/") {
        setSelectedStop(null)
      }
    }
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])

  const isTracking = !!selectedStop

  return (
    <div className="relative flex h-[calc(100vh-3.5rem)] flex-col items-center overflow-hidden px-4">
      {/* Background — always full height */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/hero-bg.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-black/60 dark:bg-black/75" />

      {/* Hero title — fades out when tracking */}
      <div
        className={`transition-all duration-500 ease-out ${
          isTracking
            ? "pointer-events-none h-0 opacity-0"
            : "pt-[20vh] pb-8 opacity-100"
        }`}
      >
        <h1 className="text-center text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Track your bus
        </h1>
      </div>

      {/* Search bar — stays centered or slides up */}
      <div
        className={`w-full max-w-xl transition-all duration-500 ease-out ${
          isTracking ? "pt-6" : ""
        }`}
      >
        <StopSearch
          onNearestClick={() => setNearestOpen(true)}
          onSelect={handleSelect}
          compact={isTracking}
        />
      </div>

      {/* Saved stops — only on hero */}
      {!isTracking && (
        <div className="mt-6 animate-in duration-300 fade-in">
          <SavedStops />
        </div>
      )}

      {/* Departures — slides in when tracking */}
      {isTracking && (
        <div className="mt-6 flex min-h-0 w-full max-w-2xl flex-1 animate-in pb-4 duration-500 fade-in slide-in-from-bottom-4">
          <div className="flex w-full flex-col rounded-xl border bg-card p-4 shadow-lg sm:p-6">
            <div className="mb-4 flex shrink-0 items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleBack}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-lg font-bold tracking-tight">
                  {selectedStop.stop_name}
                </h2>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">
                  {updatedAgo}s ago
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => refreshRef.current?.()}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <DeparturesTable
                stopId={selectedStop.stop_id}
                onStatusChange={handleStatusChange}
              />
            </div>
          </div>
        </div>
      )}

      <NearestStopsDialog open={nearestOpen} onOpenChange={setNearestOpen} />
    </div>
  )
}

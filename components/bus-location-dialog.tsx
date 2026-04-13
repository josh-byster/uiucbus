"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Vehicle, StopPoint } from "@/lib/types"
import { getStopName } from "@/lib/stops"

interface BusLocationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehicleId: string
  headsign: string
  stopPoint?: StopPoint
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

export function BusLocationDialog({
  open,
  onOpenChange,
  vehicleId,
  headsign,
  stopPoint,
}: BusLocationDialogProps) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [now, setNow] = useState(() => Date.now())

  const fetchVehicle = useCallback(() => {
    if (!vehicleId) return
    fetch(`/api/vehicle?vehicle_id=${vehicleId}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.vehicles?.length > 0) {
          setNow(Date.now())
          setVehicle(data.vehicles[0])
          setError(null)
        } else {
          setError("Vehicle location not available.")
        }
      })
      .catch(() => {
        setError("Failed to fetch vehicle location.")
      })
  }, [vehicleId])

  // Fetch on open + poll every 10s
  useEffect(() => {
    if (!open || !vehicleId) return
    fetchVehicle()
    const interval = setInterval(fetchVehicle, 10_000)
    return () => clearInterval(interval)
  }, [open, vehicleId, fetchVehicle])

  // Derive loading from fetch state: loading when open + vehicleId set but no result yet
  const isLoading = open && !!vehicleId && !vehicle && !error

  useEffect(() => {
    if (!vehicle?.last_updated) return
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [vehicle?.last_updated])

  const mapUrl =
    vehicle?.location && stopPoint && MAPBOX_TOKEN
      ? `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s-bus+3498db(${vehicle.location.lon},${vehicle.location.lat}),pin-s-circle+e74c3c(${stopPoint.stop_lon},${stopPoint.stop_lat})/auto/400x300@2x?access_token=${MAPBOX_TOKEN}&padding=50`
      : null

  const nextStopName = vehicle?.next_stop_id
    ? getStopName(vehicle.next_stop_id)
    : null
  const prevStopName = vehicle?.previous_stop_id
    ? getStopName(vehicle.previous_stop_id)
    : null

  const lastUpdated = vehicle?.last_updated
    ? `${Math.max(0, Math.round((now - new Date(vehicle.last_updated).getTime()) / 1000))}s ago`
    : null

  // base-ui onOpenChange passes (open, eventDetails) — wrap to match our prop type
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setVehicle(null)
        setError(null)
      }
      onOpenChange(nextOpen)
    },
    [onOpenChange]
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{headsign} — Location</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <p className="py-4 text-center text-sm text-destructive">{error}</p>
        )}

        {!isLoading && !error && vehicle && (
          <div className="space-y-4">
            {mapUrl && (
              <Image
                src={mapUrl}
                alt="Bus location map"
                className="w-full rounded-md"
                width={400}
                height={300}
                unoptimized
              />
            )}
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-muted-foreground">Next stop:</span>{" "}
                {nextStopName ?? "Unknown"}
              </p>
              <p>
                <span className="text-muted-foreground">Previous stop:</span>{" "}
                {prevStopName ?? "Unknown"}
              </p>
              {lastUpdated && (
                <p>
                  <span className="text-muted-foreground">GPS updated:</span>{" "}
                  {lastUpdated}
                </p>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

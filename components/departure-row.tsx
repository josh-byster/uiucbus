"use client"

import { useState } from "react"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BusLocationDialog } from "@/components/bus-location-dialog"
import type { Departure, StopPoint } from "@/lib/types"

interface DepartureRowProps {
  departure: Departure
  stopPoint?: StopPoint
}

export function DepartureRow({ departure, stopPoint }: DepartureRowProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  const isArriving = departure.expected_mins <= 1

  const expectedTime = new Date(departure.expected).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  })

  return (
    <>
      <div className="group flex items-center gap-3 rounded-lg border border-border/50 bg-card/50 p-3 transition-colors hover:bg-card/80 sm:gap-4 sm:p-4">
        {/* Route badge */}
        <div
          className="flex h-10 w-14 shrink-0 items-center justify-center rounded-md text-sm font-bold shadow-sm"
          style={{
            backgroundColor: `#${departure.route.route_color}`,
            color: `#${departure.route.route_text_color}`,
          }}
        >
          {departure.route.route_short_name || departure.route.route_id}
        </div>

        {/* Destination info */}
        <div className="min-w-0 flex-1">
          <p className="truncate leading-tight font-semibold">
            {departure.headsign}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{expectedTime}</p>
        </div>

        {/* ETA */}
        <div className="shrink-0 text-right">
          {isArriving ? (
            <span className="inline-flex items-center rounded-full bg-green-500/15 px-3 py-1 text-sm font-bold text-green-500">
              NOW
            </span>
          ) : (
            <div className="flex items-baseline gap-0.5">
              <span className="text-2xl leading-none font-bold tabular-nums">
                {departure.expected_mins}
              </span>
              <span className="text-xs text-muted-foreground">min</span>
            </div>
          )}
        </div>

        {/* Location button */}
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 text-muted-foreground opacity-60 transition-opacity group-hover:opacity-100 hover:opacity-100"
          onClick={() => setDialogOpen(true)}
          aria-label="Show bus location"
        >
          <MapPin className="h-4 w-4" />
        </Button>
      </div>

      <BusLocationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        vehicleId={departure.vehicle_id}
        headsign={departure.headsign}
        stopPoint={stopPoint}
      />
    </>
  )
}

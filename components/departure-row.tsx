"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BusLocationDialog } from "@/components/bus-location-dialog";
import type { Departure, StopPoint } from "@/lib/types";

interface DepartureRowProps {
  departure: Departure;
  stopPoint?: StopPoint;
}

export function DepartureRow({ departure, stopPoint }: DepartureRowProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const etaText =
    departure.expected_mins === 0
      ? "Arriving"
      : `${departure.expected_mins} min`;

  const expectedTime = new Date(departure.expected).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <>
      <TableRow>
        <TableCell>
          <Badge
            style={{
              backgroundColor: `#${departure.route.route_color}`,
              color: `#${departure.route.route_text_color}`,
            }}
          >
            {departure.route.route_short_name || departure.route.route_id}
          </Badge>
        </TableCell>
        <TableCell className="font-medium">{departure.headsign}</TableCell>
        <TableCell>
          <span
            className={
              departure.expected_mins <= 1 ? "font-bold text-green-600" : ""
            }
          >
            {etaText}
          </span>
        </TableCell>
        <TableCell className="hidden sm:table-cell text-muted-foreground">
          {expectedTime}
        </TableCell>
        <TableCell>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDialogOpen(true)}
            aria-label="Show bus location"
          >
            <MapPin className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>

      <BusLocationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        vehicleId={departure.vehicle_id}
        headsign={departure.headsign}
        stopPoint={stopPoint}
      />
    </>
  );
}

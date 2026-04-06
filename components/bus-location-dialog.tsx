"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Vehicle, StopPoint } from "@/lib/types";
import { getStopName } from "@/lib/stops";

interface BusLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleId: string;
  headsign: string;
  stopPoint?: StopPoint;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export function BusLocationDialog({
  open,
  onOpenChange,
  vehicleId,
  headsign,
  stopPoint,
}: BusLocationDialogProps) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !vehicleId) return;

    setLoading(true);
    setError(null);

    fetch(`/api/vehicle?vehicle_id=${vehicleId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.vehicles?.length > 0) {
          setVehicle(data.vehicles[0]);
        } else {
          setError("Vehicle location not available.");
        }
      })
      .catch(() => setError("Failed to fetch vehicle location."))
      .finally(() => setLoading(false));
  }, [open, vehicleId]);

  const mapUrl =
    vehicle?.location && stopPoint && MAPBOX_TOKEN
      ? `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s-bus+3498db(${vehicle.location.lon},${vehicle.location.lat}),pin-s-circle+e74c3c(${stopPoint.stop_lon},${stopPoint.stop_lat})/auto/400x300@2x?access_token=${MAPBOX_TOKEN}&padding=50`
      : null;

  const nextStopName = vehicle?.next_stop_id
    ? getStopName(vehicle.next_stop_id)
    : null;
  const prevStopName = vehicle?.previous_stop_id
    ? getStopName(vehicle.previous_stop_id)
    : null;

  const lastUpdated = vehicle?.last_updated
    ? `${Math.round((Date.now() - new Date(vehicle.last_updated).getTime()) / 1000)}s ago`
    : null;

  // base-ui onOpenChange passes (open, eventDetails) — wrap to match our prop type
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      onOpenChange(nextOpen);
    },
    [onOpenChange]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{headsign} — Location</DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <p className="py-4 text-center text-sm text-destructive">{error}</p>
        )}

        {!loading && !error && vehicle && (
          <div className="space-y-4">
            {mapUrl && (
              <img
                src={mapUrl}
                alt="Bus location map"
                className="w-full rounded-md"
                width={400}
                height={300}
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
                  <span className="text-muted-foreground">Last updated:</span>{" "}
                  {lastUpdated}
                </p>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

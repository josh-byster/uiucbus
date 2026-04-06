"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { addSavedStop } from "@/lib/saved-stops";
import type { Stop } from "@/lib/types";

interface NearestStopsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NearestStopsDialog({
  open,
  onOpenChange,
}: NearestStopsDialogProps) {
  const router = useRouter();
  const [stops, setStops] = useState<Stop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!open) return;

    setLoading(true);
    setError(null);
    setStops([]);
    setShowAll(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `/api/nearest?lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          setStops(data.stops || []);
        } catch {
          setError("Failed to fetch nearby stops.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location services are not enabled.");
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 5000 }
    );
  }, [open]);

  const handleStopClick = useCallback(
    (stop: Stop) => {
      addSavedStop({ id: stop.stop_id, name: stop.stop_name });
      onOpenChange(false);
      router.push(`/track/${stop.stop_id}`);
    },
    [router, onOpenChange]
  );

  const displayed = showAll ? stops.slice(0, 10) : stops.slice(0, 5);

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
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Nearest Stops
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <p className="py-4 text-center text-sm text-destructive">{error}</p>
        )}

        {!loading && !error && stops.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No stops found nearby.
          </p>
        )}

        {!loading && !error && displayed.length > 0 && (
          <div className="space-y-1">
            {displayed.map((stop) => (
              <button
                key={stop.stop_id}
                onClick={() => handleStopClick(stop)}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent"
              >
                <span>{stop.stop_name}</span>
                {stop.distance !== undefined && (
                  <span className="text-muted-foreground">
                    {(stop.distance / 5280).toFixed(2)} mi
                  </span>
                )}
              </button>
            ))}
            {!showAll && stops.length > 5 && (
              <button
                onClick={() => setShowAll(true)}
                className="w-full rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent"
              >
                Show more...
              </button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

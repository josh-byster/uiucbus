"use client";

import { useCallback, useEffect, useState } from "react";
import { BusFront, RefreshCw } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { DepartureRow } from "@/components/departure-row";
import type { Departure, StopPoint } from "@/lib/types";

interface DeparturesTableProps {
  stopId: string;
  stopPoint?: StopPoint;
}

const POLL_INTERVAL = 30_000;

export function DeparturesTable({ stopId, stopPoint }: DeparturesTableProps) {
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [secondsAgo, setSecondsAgo] = useState(0);

  const fetchDepartures = useCallback(async () => {
    try {
      const res = await fetch(`/api/departures?stop_id=${stopId}`);
      const data = await res.json();
      setDepartures(data.departures || []);
      setError(null);
      setLastUpdated(new Date());
    } catch {
      setError("Failed to load departures.");
    } finally {
      setLoading(false);
    }
  }, [stopId]);

  // Initial fetch + polling
  useEffect(() => {
    setLoading(true);
    fetchDepartures();
    const interval = setInterval(fetchDepartures, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchDepartures]);

  // "Updated X seconds ago" ticker
  useEffect(() => {
    if (!lastUpdated) return;
    const interval = setInterval(() => {
      setSecondsAgo(Math.round((Date.now() - lastUpdated.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
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
    );
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Route</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead className="w-20">ETA</TableHead>
              <TableHead className="hidden sm:table-cell w-24">Time</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departures.map((dep, i) => (
              <DepartureRow
                key={`${dep.vehicle_id}-${dep.expected}-${i}`}
                departure={dep}
                stopPoint={stopPoint}
              />
            ))}
          </TableBody>
        </Table>
      )}

      {lastUpdated && (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Updated {secondsAgo}s ago
          <Button
            variant="ghost"
            size="icon"
            className="ml-1 h-6 w-6"
            onClick={fetchDepartures}
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </p>
      )}
    </div>
  );
}

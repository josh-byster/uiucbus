"use client";

import { useState } from "react";
import { StopSearch } from "@/components/stop-search";
import { SavedStops } from "@/components/saved-stops";
import { NearestStopsDialog } from "@/components/nearest-stops-dialog";

export default function HomePage() {
  const [nearestOpen, setNearestOpen] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-6 px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          UIUC Bus Tracker
        </h1>
        <p className="mt-2 text-muted-foreground">
          Real-time bus departures for Champaign-Urbana
        </p>
      </div>

      <StopSearch onNearestClick={() => setNearestOpen(true)} />

      <SavedStops />

      <NearestStopsDialog open={nearestOpen} onOpenChange={setNearestOpen} />
    </div>
  );
}

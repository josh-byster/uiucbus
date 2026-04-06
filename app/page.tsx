"use client";

import { useState } from "react";
import { StopSearch } from "@/components/stop-search";
import { SavedStops } from "@/components/saved-stops";
import { NearestStopsDialog } from "@/components/nearest-stops-dialog";

export default function HomePage() {
  const [nearestOpen, setNearestOpen] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center px-4 pt-[20vh]">
      <h1 className="mb-8 text-center text-4xl font-bold tracking-tight sm:text-5xl">
        Where are you headed?
      </h1>

      <StopSearch onNearestClick={() => setNearestOpen(true)} />

      <div className="mt-6">
        <SavedStops />
      </div>

      <NearestStopsDialog open={nearestOpen} onOpenChange={setNearestOpen} />
    </div>
  );
}

"use client";

import { useState } from "react";
import { StopSearch } from "@/components/stop-search";
import { SavedStops } from "@/components/saved-stops";
import { NearestStopsDialog } from "@/components/nearest-stops-dialog";

export default function HomePage() {
  const [nearestOpen, setNearestOpen] = useState(false);

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] flex-col items-center px-4 pt-[20vh]">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-bg.avif')" }}
      />
      <div className="absolute inset-0 -z-10 bg-black/60 dark:bg-black/75" />

      <h1 className="mb-8 text-center text-4xl font-bold tracking-tight text-white sm:text-5xl">
        Track your bus
      </h1>

      <StopSearch onNearestClick={() => setNearestOpen(true)} />

      <div className="mt-6">
        <SavedStops />
      </div>

      <NearestStopsDialog open={nearestOpen} onOpenChange={setNearestOpen} />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSavedStops } from "@/lib/saved-stops";
import type { SavedStop } from "@/lib/types";

export function SavedStops() {
  const [stops, setStops] = useState<SavedStop[]>([]);

  useEffect(() => {
    setStops(getSavedStops());

    function onStorage() {
      setStops(getSavedStops());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (stops.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {stops.map((stop) => (
        <Button
          key={stop.id}
          variant="outline"
          size="sm"
          render={<Link href={`/track/${stop.id}`} />}
        >
          {stop.name}
        </Button>
      ))}
    </div>
  );
}

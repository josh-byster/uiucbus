"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";
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

  const visible = stops.slice(0, 3);

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {visible.map((stop) => (
        <Link
          key={stop.id}
          href={`/track/${stop.id}`}
          className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm text-white/90 backdrop-blur-sm transition-colors hover:bg-white/25"
        >
          <Clock className="h-3 w-3" />
          {stop.name}
        </Link>
      ))}
    </div>
  );
}

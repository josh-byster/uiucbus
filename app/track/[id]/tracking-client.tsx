"use client";

import { useCallback, useEffect, useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeparturesTable } from "@/components/departures-table";
import {
  addSavedStop,
  removeSavedStop,
  isStopSaved,
} from "@/lib/saved-stops";
import type { Stop } from "@/lib/types";

interface TrackingClientProps {
  stop: Stop;
}

export function TrackingClient({ stop }: TrackingClientProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isStopSaved(stop.stop_id));
  }, [stop.stop_id]);

  const toggleSave = useCallback(() => {
    if (saved) {
      removeSavedStop(stop.stop_id);
      setSaved(false);
    } else {
      addSavedStop({ id: stop.stop_id, name: stop.stop_name });
      setSaved(true);
    }
  }, [saved, stop.stop_id, stop.stop_name]);

  const stopPoint = stop.stop_points?.[0];

  return (
    <div className="container mx-auto max-w-2xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          {stop.stop_name}
        </h1>
        <Button variant="ghost" size="icon" onClick={toggleSave}>
          {saved ? (
            <BookmarkCheck className="h-5 w-5 text-primary" />
          ) : (
            <Bookmark className="h-5 w-5" />
          )}
        </Button>
      </div>

      <DeparturesTable stopId={stop.stop_id} stopPoint={stopPoint} />
    </div>
  );
}

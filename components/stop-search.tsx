"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { searchStops } from "@/lib/stops";
import { addSavedStop } from "@/lib/saved-stops";
import type { StopSearchEntry } from "@/lib/types";

interface StopSearchProps {
  onNearestClick?: () => void;
}

export function StopSearch({ onNearestClick }: StopSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StopSearchEntry[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setResults(searchStops(query));
    setOpen(query.trim().length > 0);
  }, [query]);

  const handleSelect = useCallback(
    (stopId: string) => {
      const stop = results.find((s) => s.stop_id === stopId);
      if (stop) {
        addSavedStop({ id: stop.stop_id, name: stop.stop_name });
        setQuery("");
        setOpen(false);
        router.push(`/track/${stop.stop_id}`);
      }
    },
    [results, router]
  );

  return (
    <div className="flex w-full items-start gap-2">
      <div className="relative w-full">
        <Command
          className="overflow-visible rounded-lg border bg-background shadow-sm"
          shouldFilter={false}
        >
          <CommandInput
            placeholder="Search for a bus stop..."
            value={query}
            onValueChange={setQuery}
          />
          {open && (
            <div className="absolute left-0 right-0 top-full z-50 mt-1">
              <CommandList className="rounded-lg border bg-popover shadow-lg">
                <CommandEmpty className="py-4 text-center text-sm text-muted-foreground">
                  No stops found.
                </CommandEmpty>
                <CommandGroup>
                  {results.map((stop) => (
                    <CommandItem
                      key={stop.stop_id}
                      value={stop.stop_id}
                      onSelect={handleSelect}
                      className="cursor-pointer justify-center py-3 text-sm"
                    >
                      {stop.stop_name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </div>
          )}
        </Command>
      </div>
      {onNearestClick && (
        <Button
          variant="outline"
          size="icon"
          onClick={onNearestClick}
          aria-label="Find nearest stops"
          className="mt-1 shrink-0"
        >
          <MapPin className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
    <div className="relative w-full max-w-lg mx-auto">
      <Command className="rounded-lg border shadow-md" shouldFilter={false}>
        <div className="flex items-center">
          <CommandInput
            placeholder="Search for a bus stop..."
            value={query}
            onValueChange={setQuery}
            className="h-12"
          />
          {onNearestClick && (
            <button
              onClick={onNearestClick}
              className="mr-2 rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-accent"
              aria-label="Find nearest stops"
            >
              <MapPin className="h-5 w-5" />
            </button>
          )}
        </div>
        {open && (
          <CommandList>
            <CommandEmpty>No stops found.</CommandEmpty>
            <CommandGroup>
              {results.map((stop) => (
                <CommandItem
                  key={stop.stop_id}
                  value={stop.stop_id}
                  onSelect={handleSelect}
                >
                  <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                  {stop.stop_name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        )}
      </Command>
    </div>
  );
}

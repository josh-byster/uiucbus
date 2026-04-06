"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
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

function StopField({
  placeholder,
  onSelect,
}: {
  placeholder: string;
  onSelect: (stop: StopSearchEntry) => void;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<StopSearchEntry | null>(null);
  const [results, setResults] = useState<StopSearchEntry[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (selected) return;
    setResults(searchStops(query));
    setOpen(query.trim().length > 0);
  }, [query, selected]);

  const handleSelect = useCallback(
    (stopId: string) => {
      const stop = results.find((s) => s.stop_id === stopId);
      if (stop) {
        setSelected(stop);
        setQuery(stop.stop_name);
        setOpen(false);
        onSelect(stop);
      }
    },
    [results, onSelect]
  );

  return (
    <div className="relative">
      <Command
        className="overflow-visible rounded-lg border bg-background shadow-sm"
        shouldFilter={false}
      >
        <CommandInput
          placeholder={placeholder}
          value={query}
          onValueChange={(val) => {
            setQuery(val);
            if (selected) setSelected(null);
          }}
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
  );
}

export function RouteSearch() {
  const router = useRouter();
  const [origin, setOrigin] = useState<StopSearchEntry | null>(null);
  const [destination, setDestination] = useState<StopSearchEntry | null>(null);

  const handleSearch = useCallback(() => {
    if (!origin || !destination) return;
    addSavedStop({ id: destination.stop_id, name: destination.stop_name });
    // Navigate to origin stop's tracking page for now
    // Could be expanded to a trip planner view later
    router.push(`/track/${origin.stop_id}`);
  }, [origin, destination, router]);

  return (
    <div className="space-y-3">
      <StopField
        placeholder="Origin stop..."
        onSelect={setOrigin}
      />
      <StopField
        placeholder="Destination stop..."
        onSelect={setDestination}
      />
      <Button
        className="w-full"
        disabled={!origin || !destination}
        onClick={handleSearch}
      >
        Find Routes
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}

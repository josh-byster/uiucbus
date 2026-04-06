"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search, X } from "lucide-react";
import { searchStops } from "@/lib/stops";
import { addSavedStop } from "@/lib/saved-stops";
import type { StopSearchEntry } from "@/lib/types";

interface StopSearchProps {
  onNearestClick?: () => void;
  onSelect?: (stop: StopSearchEntry) => void;
  compact?: boolean;
}

export function StopSearch({ onNearestClick, onSelect, compact }: StopSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StopSearchEntry[]>([]);
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const r = searchStops(query);
    setResults(r);
    setActiveIndex(0);
  }, [query]);

  const showResults = focused && query.trim().length > 0;

  const handleSelect = useCallback(
    (stop: StopSearchEntry) => {
      addSavedStop({ id: stop.stop_id, name: stop.stop_name });
      setQuery("");
      if (onSelect) {
        onSelect(stop);
      } else {
        router.push(`/track/${stop.stop_id}`);
      }
    },
    [router, onSelect]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showResults || results.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % results.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleSelect(results[activeIndex]);
      }
    },
    [showResults, results, activeIndex, handleSelect]
  );

  return (
    <div className="relative w-full max-w-xl">
      <div className={`flex items-center gap-3 rounded-full border bg-background shadow-lg outline outline-2 outline-transparent transition-all duration-300 ease-out focus-within:shadow-xl focus-within:outline-ring/40 ${compact ? "px-4 py-2" : "px-5 py-3"}`}>
        <Search className={`shrink-0 text-muted-foreground ${compact ? "h-4 w-4" : "h-5 w-5"}`} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder="Search for a bus stop..."
          className={`w-full bg-transparent outline-none placeholder:text-muted-foreground/60 ${compact ? "text-sm" : "text-base"}`}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {onNearestClick && (
          <button
            onClick={onNearestClick}
            className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Find nearest stops"
          >
            <MapPin className="h-5 w-5" />
          </button>
        )}
      </div>

      {showResults && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border bg-popover shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          {results.length === 0 ? (
            <p className="px-5 py-4 text-center text-sm text-muted-foreground">
              No stops found.
            </p>
          ) : (
            <ul>
              {results.map((stop, i) => (
                <li key={stop.stop_id}>
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(stop);
                    }}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`flex w-full items-center gap-3 px-5 py-3 text-left text-sm transition-colors hover:bg-accent ${
                      i === activeIndex ? "bg-accent/50" : ""
                    }`}
                  >
                    <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                      {stop.stop_id}
                    </span>
                    <span>{stop.stop_name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

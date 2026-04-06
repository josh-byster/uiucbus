"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bus, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { getSavedStops, clearSavedStops } from "@/lib/saved-stops";
import type { SavedStop } from "@/lib/types";

const DEFAULT_STOPS = [
  { id: "PLAZA", name: "Transit Plaza" },
  { id: "IU", name: "Illini Union" },
  { id: "PAR", name: "PAR" },
  { id: "KRANNERT", name: "Krannert Center" },
  { id: "1STSTDM", name: "First & Stadium" },
];

export function Navbar() {
  const [savedStops, setSavedStops] = useState<SavedStop[]>([]);

  useEffect(() => {
    setSavedStops(getSavedStops());

    function onStorage() {
      setSavedStops(getSavedStops());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-foreground hover:text-foreground/80"
          >
            <Bus className="h-5 w-5" />
            UIUC Bus
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {DEFAULT_STOPS.map((stop) => (
              <Button
                key={stop.id}
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={<Link href={`/track/${stop.id}`} />}
              >
                {stop.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="sm" />}
            >
              Recents
              <ChevronDown className="ml-1 h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              {savedStops.length === 0 ? (
                <DropdownMenuItem disabled>No recent stops</DropdownMenuItem>
              ) : (
                <>
                  {savedStops.map((stop) => (
                    <DropdownMenuItem
                      key={stop.id}
                      render={<Link href={`/track/${stop.id}`} />}
                      className="text-sm"
                    >
                      {stop.name}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      clearSavedStops();
                      setSavedStops([]);
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear All
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

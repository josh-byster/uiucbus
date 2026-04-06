"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Bus, ChevronDown, Clock, MapPin, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  getSavedStops,
  removeSavedStop,
  clearSavedStops,
} from "@/lib/saved-stops"
import type { SavedStop } from "@/lib/types"

const DEFAULT_STOPS = [
  { id: "PLAZA", name: "Transit Plaza" },
  { id: "IU", name: "Illini Union" },
  { id: "PAR", name: "PAR" },
  { id: "KRANNERT", name: "Krannert Center" },
  { id: "1STSTDM", name: "First & Stadium" },
]

export function Navbar() {
  const [savedStops, setSavedStops] = useState<SavedStop[]>([])

  useEffect(() => {
    setSavedStops(getSavedStops()) // eslint-disable-line react-hooks/set-state-in-effect -- hydrate from localStorage

    function onStorage() {
      setSavedStops(getSavedStops())
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  return (
    <nav className="border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="group flex items-center gap-2.5 font-bold tracking-tight text-foreground transition-opacity hover:opacity-80"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
              <Bus className="h-5 w-5 opacity-50 group-hover:opacity-100" />
            </div>
            <span className="hidden sm:inline">UIUC Bus</span>
          </Link>

          <div className="hidden items-center md:flex">
            {DEFAULT_STOPS.map((stop) => (
              <Button
                key={stop.id}
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={<Link href={`/track/${stop.id}`} />}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {stop.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Recent stops"
                  className="text-muted-foreground hover:text-foreground"
                />
              }
            >
              <Clock className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">Recents</span>
              <ChevronDown className="ml-1 h-3.5 w-3.5 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              {savedStops.length === 0 ? (
                <div className="flex flex-col items-center gap-1 px-4 py-6 text-center">
                  <Clock className="h-8 w-8 text-muted-foreground/40" />
                  <p className="mt-1 text-sm font-medium text-muted-foreground">
                    No recent stops
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    Stops you visit will appear here
                  </p>
                </div>
              ) : (
                <>
                  <div className="px-3 py-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      Recently visited
                    </p>
                  </div>
                  {savedStops.map((stop) => (
                    <DropdownMenuItem
                      key={stop.id}
                      className="group flex items-center gap-3 px-3 py-2.5"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Link
                        href={`/track/${stop.id}`}
                        className="flex min-w-0 flex-1 items-center gap-3"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {stop.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {stop.id}
                          </p>
                        </div>
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeSavedStop(stop.id)
                          setSavedStops((prev) =>
                            prev.filter((s) => s.id !== stop.id)
                          )
                        }}
                        className="shrink-0 rounded-md p-1 text-muted-foreground/0 transition-colors group-hover:text-muted-foreground/50 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      clearSavedStops()
                      setSavedStops([])
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-muted-foreground"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="text-xs">Clear all</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}

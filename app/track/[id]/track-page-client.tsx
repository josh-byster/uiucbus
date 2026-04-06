"use client"

import { UnifiedHome } from "@/components/unified-home"

interface TrackPageClientProps {
  stopId: string
  stopName: string
}

export function TrackPageClient({ stopId, stopName }: TrackPageClientProps) {
  return <UnifiedHome initialStop={{ stop_id: stopId, stop_name: stopName }} />
}

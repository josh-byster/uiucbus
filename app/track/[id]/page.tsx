import type { Metadata } from "next"
import { getStopName } from "@/lib/stops"
import { TrackPageClient } from "./track-page-client"

interface TrackingPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: TrackingPageProps): Promise<Metadata> {
  const { id } = await params
  const stopName = getStopName(id) ?? id
  const title = `${stopName} — Live Departures`
  const description = `Real-time bus departures from ${stopName} in Champaign-Urbana. View upcoming buses, routes, and estimated arrival times.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/track/${id}`,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    alternates: {
      canonical: `/track/${id}`,
    },
  }
}

export default async function TrackingPage({ params }: TrackingPageProps) {
  const { id } = await params
  const stopName = getStopName(id) ?? id

  return <TrackPageClient stopId={id} stopName={stopName} />
}

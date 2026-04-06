import { getStopName } from "@/lib/stops";
import { TrackPageClient } from "./track-page-client";

interface TrackingPageProps {
  params: Promise<{ id: string }>;
}

export default async function TrackingPage({ params }: TrackingPageProps) {
  const { id } = await params;
  const stopName = getStopName(id) ?? id;

  return <TrackPageClient stopId={id} stopName={stopName} />;
}

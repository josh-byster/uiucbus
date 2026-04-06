import { notFound } from "next/navigation";
import { getStop } from "@/lib/cumtd";
import { TrackingClient } from "./tracking-client";

interface TrackingPageProps {
  params: Promise<{ id: string }>;
}

export default async function TrackingPage({ params }: TrackingPageProps) {
  const { id } = await params;

  try {
    const data = await getStop(id);
    if (!data.stops || data.stops.length === 0) {
      notFound();
    }

    const stop = data.stops[0];
    return <TrackingClient stop={stop} />;
  } catch {
    notFound();
  }
}

import type { MetadataRoute } from "next"
import { allStops } from "@/lib/stops"

export default function sitemap(): MetadataRoute.Sitemap {
  const stopEntries: MetadataRoute.Sitemap = allStops.map((stop) => ({
    url: `https://uiucbus.com/track/${stop.stop_id}`,
    changeFrequency: "hourly",
    priority: 0.7,
  }))

  return [
    {
      url: "https://uiucbus.com",
      changeFrequency: "daily",
      priority: 1,
    },
    ...stopEntries,
  ]
}

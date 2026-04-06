import { NextRequest, NextResponse } from "next/server"
import { getDepartures } from "@/lib/cumtd"

export async function GET(request: NextRequest) {
  const stopId = request.nextUrl.searchParams.get("stop_id")
  if (!stopId) {
    return NextResponse.json({ error: "stop_id is required" }, { status: 400 })
  }

  try {
    const data = await getDepartures(stopId)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Departures API error:", error)
    return NextResponse.json(
      { status: { code: 500, msg: "API error" }, departures: [] },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from "next/server"
import { getStop } from "@/lib/cumtd"

export async function GET(request: NextRequest) {
  const stopId = request.nextUrl.searchParams.get("stop_id")
  if (!stopId) {
    return NextResponse.json({ error: "stop_id is required" }, { status: 400 })
  }

  try {
    const data = await getStop(stopId)
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    })
  } catch (error) {
    console.error("Stop API error:", error)
    return NextResponse.json(
      { status: { code: 500, msg: "API error" }, stops: [] },
      { status: 500 }
    )
  }
}

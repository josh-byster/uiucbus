import { NextRequest, NextResponse } from "next/server";
import { getNearestStops } from "@/lib/cumtd";

export async function GET(request: NextRequest) {
  const lat = request.nextUrl.searchParams.get("lat");
  const lon = request.nextUrl.searchParams.get("lon");
  if (!lat || !lon) {
    return NextResponse.json(
      { error: "lat and lon are required" },
      { status: 400 }
    );
  }

  try {
    const data = await getNearestStops(lat, lon);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Nearest stops API error:", error);
    return NextResponse.json(
      { status: { code: 500, msg: "API error" }, stops: [] },
      { status: 500 }
    );
  }
}

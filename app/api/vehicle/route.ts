import { NextRequest, NextResponse } from "next/server";
import { getVehicle } from "@/lib/cumtd";

export async function GET(request: NextRequest) {
  const vehicleId = request.nextUrl.searchParams.get("vehicle_id");
  if (!vehicleId) {
    return NextResponse.json(
      { error: "vehicle_id is required" },
      { status: 400 }
    );
  }

  try {
    const data = await getVehicle(vehicleId);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Vehicle API error:", error);
    return NextResponse.json(
      { status: { code: 500, msg: "API error" }, vehicles: [] },
      { status: 500 }
    );
  }
}

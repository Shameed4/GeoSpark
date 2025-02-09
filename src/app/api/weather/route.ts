import { NextResponse } from "next/server";

export async function GET(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const API_KEY = process.env.WEATHERAPI_KEY;

    if (!lat || !lon) {
      return NextResponse.json({ error: "Missing latitude or longitude" }, { status: 400 });
    }

    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=no`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);
    return NextResponse.json(data, { status: 200 });

  } catch (error: unknown) {
    console.error("Weather API fetch error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

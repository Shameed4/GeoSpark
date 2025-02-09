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

    const currentResponse = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=yes`
    );

    const historyResponse = await fetch(
      `https://api.weatherapi.com/v1/history.json?key=${API_KEY}&q=${lat},${lon}&dt=${getYesterdayDate()}`
    );

    if (!currentResponse.ok || !historyResponse.ok) {
      throw new Error(`Weather API error: ${currentResponse.status} ${currentResponse.statusText}`);
    }

    const currentData = await currentResponse.json();
    const historyData = await historyResponse.json();

    const currentHumidity = currentData.current.humidity;
    const currentAQI = currentData.current.air_quality.pm2_5; // Using PM2.5 for AQI reference

    const previousHumidity = historyData.forecast.forecastday[0].day.avghumidity;
    const previousAQI = historyData.forecast.forecastday[0].day.air_quality?.pm2_5 || currentAQI; // Fallback if not available

    const humidityChange = calculatePercentageChange(previousHumidity, currentHumidity);
    const aqiChange = calculatePercentageChange(previousAQI, currentAQI);

    return NextResponse.json({
      humidity: {
        value: currentHumidity,
        percent_change: humidityChange,
      },
      aqi: {
        value: currentAQI,
        percent_change: aqiChange,
      }
    }, { status: 200 });

  } catch (error: unknown) {
    console.error("Weather API fetch error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

function getYesterdayDate(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split("T")[0];
}

function calculatePercentageChange(oldValue: number, newValue: number): string {
  if (oldValue === 0) return "N/A"; // Avoid division by zero
  const change = ((newValue - oldValue) / oldValue) * 100;
  return `${change.toFixed(2)}%`;
}
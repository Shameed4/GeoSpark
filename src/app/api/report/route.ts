import { NextResponse } from "next/server";

export async function GET(req: Request): Promise<NextResponse> {
    return NextResponse.json(
        {
            "34.0522,-118.2437": {
                "fire": true,
                "risk": "high",
                "temp": 53.01,
                "wind_str": 3.44,
                "wind_dir": 60,
                "humidity": 78,
                "aqi": 2,
                "pressure": 1017,
                "visibility": 10000,
                "precipitation": 0,
                "timestamp": "2025-02-09T01:31:39.137897"
            },
            "37.7749,-122.4194": {
                "fire": true,
                "risk": "high",
                "temp": 46.47,
                "wind_str": 4.61,
                "wind_dir": 290,
                "humidity": 78,
                "aqi": 2,
                "pressure": 1025,
                "visibility": 10000,
                "precipitation": 0,
                "timestamp": "2025-02-09T01:32:58.568582"
            }
        }
    )
}
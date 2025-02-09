"use client";

import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';

export default function Reports() {
  const [report, setReport] = useState(null);
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (!id) return;

    async function fetchReports() {
      try {
        console.log(`Fetching: http://127.0.0.1:5000/api/all-data?coords=${id}`);
        const response = await fetch(`http://127.0.0.1:5000/api/all-data?coords=${id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data = await response.json();
        setReport(data ? data["34.0522,-118.2437"] : {}); // change this line
      } catch (error) {
        console.error("Error fetching report:", error);
      }
    }

    fetchReports();
  }, [id]);

  console.log(`report is ${JSON.stringify(report)}`);

  return report ? (
    <div className="w-full flex flex-col items-center min-h-screen text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Report Details</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="font-bold">Air Quality Index (AQI)</span>
          <span>{report.aqi}</span>
        </div>
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="font-bold">Fire Alert</span>
          <span>{report.fire ? "Yes" : "No"}</span>
        </div>
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="font-bold">Humidity</span>
          <span>{report.humidity}%</span>
        </div>
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="font-bold">Precipitation</span>
          <span>{report.precipitation} mm</span>
        </div>
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="font-bold">Pressure</span>
          <span>{report.pressure} hPa</span>
        </div>
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="font-bold">Risk Level</span>
          <span className="text-red-400">{report.risk}</span>
        </div>
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="font-bold">Temperature</span>
          <span>{report.temp}°F</span>
        </div>
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="font-bold">Timestamp</span>
          <span>{new Date(report.timestamp).toLocaleString()}</span>
        </div>
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="font-bold">Visibility</span>
          <span>{report.visibility} meters</span>
        </div>
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="font-bold">Wind Direction</span>
          <span>{report.wind_dir}°</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">Wind Speed</span>
          <span>{report.wind_str} m/s</span>
        </div>
      </div>
    </div>
  ) : (
    <div className="w-full flex items-center justify-center min-h-screen">
      Loading...
    </div>
  );
}

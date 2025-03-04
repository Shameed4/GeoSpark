"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import UploadButton from "../uploadComponent";
import { getPlaceName } from "@/app/utils";
import Link from "next/link";

export default function Upload() {
  const [reports, setReports] = useState({});

  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/all-data', {
          method: 'GET',
        });
        console.log(response);
        console.log("Successful fetching data");
        const data = await response.json();
        console.log(data);
        console.log("Running for loop");
        for (const key of Object.keys(data)) {
          console.log(`Calling ${`https://nominatim.openstreetmap.org/reverse?lat=${key.split(",")[0]}&lon=${key.split(",")[1]}&format=json`}`)
          const geoResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${key.split(",")[0]}&lon=${key.split(",")[1]}&format=json`);
          const geoData = await geoResponse.json();
          data[key].address = await getPlaceName(key)
          if (geoData["error"])
            data[key].placeName = "Invalid location";
          else
            data[key].placeName = geoData.address.city || geoData.address.town || geoData.address.village || "Unknown Location";
          const timestamp = new Date(data[key]["timestamp"]);
          const formattedDate = timestamp.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });
          console.log(formattedDate)
          data[key].time = formattedDate
        }
        setReports(data);
      } catch (error) {
        console.error("Error fetching report:", error);
      }
    }
    fetchReports();
  }, [])

  const toggleHeart = (reportId) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === reportId ? { ...report, liked: !report.liked } : report
      )
    );
  };

  return (
    <div className="min-h-screen h-screen w-full bg-[#111219] text-white p-8 overflow-y-auto">
      <div className="relative rounded-lg overflow-hidden mb-8 min-h-80" style={{ backgroundImage: 'url(/uploadbg.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h1 className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)] text-4xl font-bold mb-2">
            Generate a Report For An Undocumented Wildfire
          </h1>
          <p className="text-gray-300 mb-6">Accepted Video Formats: .MP4, .MOV, .M4V</p>
          <UploadButton />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-3">Recent Fires</h2>

        {/* Display loading message while reports are being fetched */}
        {Object.keys(reports).length === 0 ? (
          <div className="flex justify-center items-center h-32">
            <p className="text-lg font-semibold text-gray-300 animate-pulse">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {Object.entries(reports).map(([coords, report]) => (
              <div
                key={report["timestamp"]}
                className="group relative transition-transform duration-300 group-hover:scale-105"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative rounded-xl shadow-lg overflow-hidden bg-gray-800 m-[2px]">
                  <div className="relative w-full h-48">
                    <Image
                      src={report.imgsrc ? report.imgsrc : '/lilacfire.jpg'}
                      alt={"Image"}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-lg"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold">{report.placeName}</h3>
                    <div className="flex items-center text-gray-400 mt-2">
                      <span>{report.address}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-3">Last Updated: {report["time"]}</p>
                    <Link href={`/report/results/${coords}`}>
                      <button className="w-full mt-4 py-2 rounded-lg font-bold 
                                 bg-gray-700 text-white
                                 transition-colors transition-transform duration-300 ease-in-out 
                                 hover:scale-105 active:scale-95">
                        View Details
                      </button>
                    </Link>
                  </div>
                  <div
                    className="absolute top-3 right-3 cursor-pointer"
                    onClick={() => toggleHeart(report.id)}
                  >
                    {report.liked ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-400 hover:text-red-500 transition"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

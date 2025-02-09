"use client";
import React, { useState } from "react";
import Image from "next/image";

export default function Upload() {
  const [reports, setReports] = useState([
    {
      id: 1,
      county: "Log Angeles",
      user: "Palisades Fire",
      lastUpdated: "Today",
      liked: false,
      imgSrc: "/palisadesfire.jpeg"
    },
    {
      id: 2,
      county: "Los Angeles",
      user: "Eaton Fire",
      lastUpdated: "Today",
      liked: false,
      imgSrc: "/eatonfire.jpg"
    },
    {
      id: 3,
      county: "San Diego",
      user: "Lilac Fire",
      lastUpdated: "Today",
      liked: false,
      imgSrc: "/lilacfire.jpg"
    },
  ]);

  const toggleHeart = (reportId) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === reportId ? { ...report, liked: !report.liked } : report
      )
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#111219] text-white p-8">
      <div className="relative rounded-lg overflow-hidden mb-8 h-80">
        <Image
          src="/uploadbg.jpeg"
          alt="Hero"
          layout="fill"
          objectFit="cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h1 className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)] text-4xl font-bold mb-2">
            Generate a Report For An Undocumented Wildfire Near You
          </h1>
          <p className="text-gray-300 mb-6">Accepted Video Formats: .MP4, .MOV, .M4V</p>
          <button
            onClick={() => alert("Upload logic triggered!")}
            className="flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold rounded-xl 
                       bg-gradient-to-r from-white to-orange-500 
                       hover:from-orange-400 hover:to-orange-600
                       transition-colors transition-transform duration-300 ease-in-out 
                       hover:scale-105 active:scale-95 shadow-lg"
          >
            <span className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]">Upload</span>
            <Image src={"/ai.png"} alt={"AI"} width={15} height={15} className="mb-1" />
          </button>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-3">Recent Fires</h2>
        <div className="grid grid-cols-3 gap-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="group relative transition-transform duration-300 group-hover:scale-105"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative rounded-xl shadow-lg overflow-hidden bg-gray-800 m-[2px]">
                <div className="relative w-full h-48">
                  <Image
                    src={report.imgSrc}
                    alt={report.county}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold">{report.county}</h3>
                  <div className="flex items-center text-gray-400 mt-2">
                    <span>{report.user}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-3">Last Updated: {report.lastUpdated}</p>
                  <button
                    className="w-full mt-4 py-2 rounded-lg font-bold 
                                 bg-gray-700 text-white
                                 transition-colors transition-transform duration-300 ease-in-out 
                                 hover:scale-105 active:scale-95"
                  >
                    View Details
                  </button>
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
      </div>
    </div>
  );
}

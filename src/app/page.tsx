'use client'

import { useEffect, useState } from "react";
import { ArrowUpRight, Lightbulb, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import TimeOptions from "@/components/timeOptions";

const blockClass =
  "w-[30%] min-h-40 bg-gradient-to-br from-black to-transparent rounded-md text-neutral-200 p-3";
const blurBlockClass =
  "w-[30%] min-h-40 bg-gradient-to-br from-black/50 to-transparent/50 backdrop-blur-md rounded-md text-neutral-200 p-3";

const pollutants = [
  { label: "PM", sub: "2.5" },
  { label: "Zn" },
  { label: "CO" },
  { label: "CO", sub: "2" },
  { label: "Cu" },
  { label: "CH", sub: "4" },
  { label: "As" },
  { label: "Cd" },
  { label: "Cr" },
  { label: "VOCs" },
  { label: "PAHs" },
  { label: "NO", sub: "x" },
  { label: "Ni" },
  { label: "SO", sub: "2" },
  { label: "Mn" },
  { label: "O", sub: "3" },
  { label: "Pb" },
  { label: "Hg" },
];

const nearbyFires = [
  {
    location: "San Diego",
    cause: "Dry Conditions",
    type: "Fire",
    start: "Jan. 21",
    distance: "2,761.3",
    status: "Ongoing",
  },
  {
    location: "Los Angeles",
    cause: "Dry Conditions",
    type: "Fire",
    start: "Jan. 7",
    distance: "2,789.1",
    status: "Resolved",
  },
  {
    location: "Santa Barbara",
    cause: "Dry Conditions",
    type: "Fire",
    start: "Jan. 1",
    distance: "2,878.0 ",
    status: "Resolved",
  },
];

export default function Home() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [aqi, setAqi] = useState<string | null>(null);
  const [aqiChange, setAqiChange] = useState<string | null>(null);
  const [humidity, setHumidity] = useState<string | null>(null);
  const [humidityChange, setHumidityChange] = useState<string | null>(null);
  const [city, setCity] = useState<string>("Loading...");
  const [sortOption, setSortOption] = useState("Distance");

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      setCity("Location not available");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lon: longitude });
      },
      (error) => {
        console.error("Error getting location:", error);
        setCity("Location permission denied");
      }
    );
  }, []);

  useEffect(() => {
    async function fetchWeather() {
      if (!location) return;
      try {
        const response = await fetch(`/api/weather?lat=${location.lat}&lon=${location.lon}`);
        if (!response.ok) throw new Error("Failed to fetch weather data");

        const data = await response.json();
        setAqi(`${data.aqi.value} AQI`);
        setAqiChange(`${data.aqi.percent_change}`);
        setHumidity(`${data.humidity.value}%`);
        setHumidityChange(`${data.humidity.percent_change}`);

        // Reverse Geocode to Get City Name
        const geoResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lon}&format=json`);
        const geoData = await geoResponse.json();
        setCity(geoData.address.city || geoData.address.town || geoData.address.village || "Unknown Location");

      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    }

    fetchWeather();
  }, [location]);

  return (
    <div className="w-full overflow-x-hidden">
      <header className="bg-cover h-52" style={{
        backgroundImage: `linear-gradient(90deg, black 0%, gray 20%, #ce5217 60%, #7a2800 100%), url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='200'%20height='200'%20viewBox='0%200%20200%20200'%3E%3Cfilter%20id='noise'%3E%3CfeTurbulence%20type='fractalNoise'%20baseFrequency='10'%20numOctaves='2'%20stitchTiles='stitch'/%3E%3C/filter%3E%3Crect%20width='200'%20height='200'%20filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundBlendMode: "overlay",
      }}></header>

      <main className="-translate-y-24 p-5">
        <div className="flex w-full justify-between">
          <div className="absolute -top-14 left-0 w-full flex justify-start ml-5">
            <h1 className="text-5xl font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]">
              Overview
            </h1>
          </div>
          <InfoCard title={city} value={aqi || "Loading..."} change={aqiChange || "..."} miniText={"Wildfires worsen air quality by releasing smoke and harmful particles into the air."}/>
          <InfoCard title="Humidity" value={humidity || "Loading..."} change={humidityChange || "..."} negative miniText={"Low humidity increases wildfire risk by drying out plants, while high humidity helps prevent fires."} />
          <TipCard />
        </div>

        <div className="my-10 flex w-full justify-between">
          <div className={cn(blockClass, "w-[35%]")}>
            <h4 className="text-lg">Pollutants</h4>
            <div className="mt-3 mb-5 flex flex-wrap gap-2">
              {pollutants.map(({ label, sub }) => (
                <div
                  key={label + sub}
                  className="inline-block py-2 px-1 min-w-5 rounded-lg bg-slate-600 text-sm"
                >
                  {label}
                  <sub>{sub}</sub>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-neutral-300">
              During a wildfire, smoke can make the outdoor air unhealthy to
              breathe. Local officials may advise you to stay indoors during a
              smoke event.
            </p>
          </div>
          <div className={cn(blockClass, "w-[60%]")}>
            <div className="flex">
              <h4 className="text-lg mr-auto">Analytics</h4>
              <TimeOptions />
            </div>
          </div>
        </div>

        <NearbyFiresTable sortOption={sortOption} setSortOption={setSortOption} />


      </main>
    </div>
  );
}

type NearbyFiresTableProps = {
  sortOption: string,
  setSortOption: (option: string) => void
}

function NearbyFiresTable({ sortOption, setSortOption }: NearbyFiresTableProps) {
  return (
    <div className="w-full bg-gradient-to-br from-black/50 to-transparent/50 backdrop-blur-md rounded-lg p-6">
      <table className="w-full text-left text-neutral-300 border-separate border-spacing-y-2 mb-[-30px]">
        <thead>
          <tr>
            <th
              colSpan={6}
              className="pl-3 pr-6 py-4 text-xl text-neutral-200 flex items-center mt-[-30px]"
            >
              Major Fires
              <select
                className="bg-neutral-800 text-neutral-300 text-sm p-2 rounded-md ml-auto border-r-[16px] border-r-transparent"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="Distance">Sort By: Distance</option>
                <option value="Start Date">Sort By: Start Date</option>
              </select>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={6}>
              <div className="max-h-64">
                <table className="w-full text-left text-neutral-300">
                  <thead>
                    <tr className="text-sm text-neutral-400">
                      <th className="p-3">Location</th>
                      <th className="p-3">Cause</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Start</th>
                      <th className="p-3">Distance (mi)</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nearbyFires.map((fire, idx) => (
                      <tr
                        key={idx}
                        className="bg-black/30 hover:bg-black/50 transition duration-300 rounded-md"
                      >
                        <td className="p-3">{fire.location}</td>
                        <td className="p-3">{fire.cause}</td>
                        <td className="p-3">{fire.type}</td>
                        <td className="p-3">{fire.start}</td>
                        <td className="p-3">{fire.distance}</td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(
                              fire.status
                            )}`}
                          >
                            {fire.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function getStatusStyle(status: string) {
  switch (status) {
    case "Resolved":
      return "bg-green-800 text-green-300";
    case "Ongoing":
      return "bg-red-800 text-red-300";
    case "Inconclusive":
      return "bg-yellow-800 text-yellow-300";
    default:
      return "";
  }
}

function InfoCard({ title, value, change, negative, miniText }: { title: string, value: string, change: string, negative?: boolean, miniText?: string;}) {
  return (
    <div className={blurBlockClass}>
      <h4>{title}</h4>
      <h3 className="mt-[10px] text-lg">{value}</h3>
      <div className="flex items-center">
        <div className={`mt-[10px] flex items-center ${negative ? "text-[#EB6B6B] bg-[rgba(102,38,38,0.2)]" : "text-[#6BEBA4] bg-[rgba(38,102,99,0.2)]"} px-2 py-1 rounded-3xl`}>
          <ArrowUpRight size={15} />
          {change}
        </div>
        <span className="ml-1 mt-3 text-xs">from yesterday</span>
      </div>
      {miniText && (
        <p className="mt-7 text-xs text-neutral-300">
          {miniText}
        </p>
      )}
    </div>
  );
}

function TipCard() {
  const tips = [
    "Avoid opening interior doors that feel hot, and stay away from downed power lines.",
    "If smoke is heavy, stay indoors with windows closed and use an air purifier if available.",
    "Have an evacuation plan ready if you're in a fire-prone area.",
    "Minimize outdoor activity when AQI is high to protect your respiratory system.",
    "Keep N95 masks available for outdoor use during poor air quality.",
    "Sign up for local wildfire alerts to stay informed in real time.",
    "Close vents, doors, and windows to prevent smoke from entering your home.",
    "Prepare an emergency bag with essentials like water, food, and important documents.",
    "Check on vulnerable family members or neighbors during wildfire events.",
  ];

  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  // Automatically cycle through tips every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext(); // Auto-cycle forward
    }, 5000);
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const handleNext = () => {
    setVisible(false); // Start fade-out animation
    setTimeout(() => {
      setCurrentTipIndex((prevIndex) =>
        prevIndex < tips.length - 1 ? prevIndex + 1 : 0
      ); // Move forward or loop back to the first tip
      setVisible(true); // Trigger fade-in
    }, 500); // Duration of fade-out animation
  };

  const handleBack = () => {
    setVisible(false); // Start fade-out animation
    setTimeout(() => {
      setCurrentTipIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : tips.length - 1
      ); // Move backward or loop to the last tip
      setVisible(true); // Trigger fade-in
    }, 500);
  };

  return (
    <div className={cn("relative", blurBlockClass)}>
      <div className="flex">
        <Lightbulb className="mr-2 mb-2" />
        <h4>Wildfire Safety Tips</h4>
      </div>
      <p
        className={cn(
          "mt-[15px] text-sm transition-opacity duration-500",
          visible ? "opacity-100" : "opacity-0"
        )}
      >
        {tips[currentTipIndex]}
      </p>

      <div className="flex justify-between items-center mt-5">
        <button
          onClick={handleBack}
          className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition"
        >
          <ChevronLeft className="text-white w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition"
        >
          <ChevronRight className="text-white w-5 h-5" />
        </button>
      </div>

      <div className="flex justify-center mt-3 space-x-2">
        {tips.map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              index === currentTipIndex ? "bg-white" : "bg-gray-500 opacity-50"
            )}
          />
        ))}
      </div>
    </div>
  );
}

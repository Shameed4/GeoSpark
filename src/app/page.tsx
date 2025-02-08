import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import TimeOptions from "@/components/timeOptions";

const blockClass = "w-[30%] h-40 bg-gradient-to-br from-black to-transparent rounded-md text-neutral-200 p-3"
const pollutants = [
  { label: "PM", sub: "2.5" },
  { label: "CO" },
  { label: "CO", sub: "2" },
  { label: "CH", sub: "4" },
  { label: "VOCs" },
  { label: "PAHs" },
  { label: "NO", sub: "x" },
  { label: "SO", sub: "2" },
  { label: "O", sub: "3" },
  { label: "Pb" },
  { label: "Hg" }
];







export default function Home() {
  return (
    <div className="w-full">
      <header className="bg-cover h-52" style={{
        backgroundImage: `
      radial-gradient(ellipse 30% 30% at -20% -20%, white, transparent),
      radial-gradient(ellipse 150% 150% at 100% 0%, #A62100, #CED3CF)`
      }}>
        <h1 className="text-white text-lg">Dashboard Overview</h1>
      </header>
      <main className="-translate-y-24 p-5">
        <div className="flex w-full justify-between">
          <div className={blockClass}>
            <h4>Stony Brook, NY</h4>
            <h3 className="text-lg">25 AQI</h3>
            <div className="flex">
              <div className="flex">
                <div className="flex items-center text-[#6BEBA4] px-2 p-1 rounded-3xl bg-[rgba(38,102,99,0.2)]">
                  <ArrowUpRight size={15} /> 4.8%
                </div>
                <div className="ml-1 py-1">from yesterday</div>
              </div>
            </div>
          </div>
          <div className={blockClass}>
            <h4>Humidity</h4>
            <h3 className="text-lg">25 AQI</h3>
            <div className="flex">
              <div className="flex">
                <div className="flex items-center text-[#6BEBA4] px-2 p-1 rounded-3xl bg-[rgba(38,102,99,0.2)]">
                  <ArrowUpRight size={15} /> 37%
                </div>
                <div className="ml-1 py-1">from yesterday</div>
              </div>
            </div>
          </div>
          <div className={blockClass}>
            <h4>Stony Brook, NY</h4>
            <h3 className="text-lg">25 AQI</h3>
            <div className="flex">
              <div className="flex">
                <div className="flex items-center text-[#6BEBA4] px-2 p-1 rounded-3xl bg-[rgba(38,102,99,0.2)]">
                  <ArrowUpRight size={15} /> 4.8%
                </div>
                <div className="ml-1 py-1">from yesterday</div>
              </div>
            </div>
          </div>
        </div>

        <div className="my-10 flex w-full justify-between">
          <div className={cn(blockClass, "w-[35%]")}>
            <h4 className="text-lg">Pollutants</h4>
            <div className="flex flex-wrap gap-2">
              {pollutants.map(({ label, sub }) => <div key={label + sub} className="inline-block py-2 px-1 min-w-5 rounded-lg bg-slate-600 text-sm">{label}<sub>{sub}</sub></div>)}
            </div>
          </div>
          <div className={cn(blockClass, "w-[60%]")}>
            <div className="flex">
              <h4 className="text-lg mr-auto">Analytics</h4>
              <TimeOptions />
            </div>
          </div>
        </div>
      </main >
    </div >
  );
}

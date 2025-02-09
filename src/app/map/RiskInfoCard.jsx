import React from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function RiskInfoCard({
    location = "Unknown Location",
    riskLevel = "Unknown Risk",
    activeFire = false,
    windDir = "Unknown",
    windStr = "Unknown",
    humidity = "Unknown",
    timeStamp = "Unknown",
    onClose
}) {
    return (
        <div className="absolute w-80 right-4 top-4 z-10 bg-neutral-950 p-4 rounded shadow-md text-white">
            <div onClick={onClose} className="cursor-pointer flex items-center gap-1">
                <X className="m-3" />
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-500 p-5 rounded-md">
                <h4 className="text-sm">{location}</h4>
                <h2 className="text-lg">{riskLevel}</h2>
                <h2 className="text-xs flex items-center gap-1">
                    {activeFire ? <ChevronUp size={15} /> : <ChevronDown size={15} />} Active Fire
                </h2>
            </div>
            <div className="flex justify-between my-4">
                <span>Information</span>
            </div>
            <div className="flex items-center justify-between">
                <div>Wind Direction</div>
                <div>{windDir}°</div>
            </div>

            <Separator className="bg-neutral-700 my-4" />
            <div className="flex items-center justify-between">
                <div>Wind Strength</div>
                <div>{windStr} m/s</div>
            </div>

            <Separator className="bg-neutral-700 my-4" />
            <div className="flex items-center justify-between">
                <div>Humidity</div>
                <div>{humidity}%</div>
            </div>

            <Separator className="bg-neutral-700 my-4" />
            <div className="flex items-center justify-between">
                <div>Timestamp</div>
                <div className="text-xs">{timeStamp}</div>
            </div>
        </div>
    );
}

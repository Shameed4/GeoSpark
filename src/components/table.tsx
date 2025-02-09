import { ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

const fires = [
    { location: "Los Angeles", cause: "...", type: "Fire", start: "Dec. 1", distance: 100, status: "Resolved" },
    { location: "San Francisco", cause: "Unknown", type: "Wildfire", start: "Jan. 3", distance: 50, status: "Active" },
    { location: "New York", cause: "Electrical", type: "Building Fire", start: "Feb. 10", distance: 10, status: "Contained" }
];

export default function Table() {
    return (
        <div className="bg-black text-neutral-200 p-5 pb-0 rounded-md">
            <div className="flex justify-between">
                <h2 className="text-lg text-white p-2 text-left">Nearby Fires</h2>
                <DropdownMenu>
                    <DropdownMenuTrigger className="bg-[rgb(41,41,44)] px-4 py-1 flex gap-2 items-center rounded-sm">Sort by: Distance <ChevronDown size={22}/></DropdownMenuTrigger>

                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuItem>Team</DropdownMenuItem>
                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <table className="min-w-full border-collapse">
                <thead>
                    <tr className="border-b border-gray-600 text-sm text-neutral-500">
                        <th className="text-left p-3 w-24">LOCATION</th>
                        <th className="text-left p-3">CAUSE</th>
                        <th className="text-left p-3 w-24">TYPE</th>
                        <th className="text-left p-3 w-24">START</th>
                        <th className="text-left p-3 w-32">DISTANCE (mi)</th>
                        <th className="text-left p-3 w-24">STATUS</th>
                    </tr>
                </thead>
                <tbody>
                    {fires.map((fire, index) => (
                        <tr key={index} className={`${index !== 0 ? "border-t" : ""} border-gray-600`}>
                            <td className="p-3">{fire.location}</td>
                            <td className="p-3">{fire.cause}</td>
                            <td className="p-3">{fire.type}</td>
                            <td className="p-3">{fire.start}</td>
                            <td className="p-3">{fire.distance}</td>
                            <td className="p-3">{fire.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>)
}
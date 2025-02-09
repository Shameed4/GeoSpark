"use client";

import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Set your Mapbox access token
mapboxgl.accessToken =
    "pk.eyJ1Ijoicml0ZXNzc2hoaCIsImEiOiJjbTZ3aXRrc3UwajF3MmxxNm1xMDYwNWlxIn0.ovuV5vNE3yW_gcwDIMk4yA";

export default function MapPage() {
    const mapContainerRef = useRef(null);
    const [map, setMap] = useState(null);
    const [popUp, setPopUp] = useState(true);

    // Initialize the map on component mount
    useEffect(() => {
        if (mapContainerRef.current && !map) {
            const mapInstance = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: "mapbox://styles/ritessshhh/cm6wlwszz00h901s1g88vhxxo",
                center: [-118.2437, 34.0522], // Los Angeles
                zoom: 10,
                pitch: 45,
                bearing: -17.6,
            });

            mapInstance.on("load", () => {
                // Add 3D terrain
                mapInstance.addSource("mapbox-dem", {
                    type: "raster-dem",
                    url: "mapbox://mapbox.mapbox-terrain-dem-v1",
                    tileSize: 512,
                    maxzoom: 14,
                });
                mapInstance.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

                // Add custom markers
                addCustomMarkers(mapInstance);

                setMap(mapInstance);
            });
        }
    }, [map]);

    async function fetchMarkerData() {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/markers'); // Adjust URL if needed
            if (!response.ok) {
                throw new Error('Failed to fetch marker data');
            }
            const markers = await response.json();
            return markers;
        } catch (error) {
            console.error('Error fetching marker data:', error);
            return [];
        }
    }

    async function addCustomMarkers(mapInstance) {
        const locations = await fetchMarkerData(); // Fetch markers from backend

        locations.forEach((location) => {
            // Create a DOM element for each marker
            const el = document.createElement("div");
            el.className = "custom-marker";
            el.style.fontSize = "24px"; // Adjust size as needed
            el.style.cursor = "pointer";
            el.textContent = "🔥"; // Set the emoji as the text content

            // Add marker to the map
            new mapboxgl.Marker(el)
                .setLngLat(location.coordinates)
                .setPopup(
                    new mapboxgl.Popup({ offset: 25 }).setText(location.title)
                ) // Add popups
                .addTo(mapInstance);
        });
    }



    // Function to fetch coordinates for a given address using Mapbox Geocoding API
    async function getCoordinates(address) {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            address
        )}.json?access_token=${mapboxgl.accessToken}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.features && data.features.length > 0) {
                return data.features[0].center;
            } else {
                alert(`No coordinates found for address: ${address}`);
                return null;
            }
        } catch (error) {
            console.error("Error fetching coordinates:", error);
            return null;
        }
    }

    // Function to get a route using the beta "exclude" syntax
    async function getRoute(start, end, pointsToExclude) {
        let excludeParam = "";
        if (pointsToExclude.length > 0) {
            excludeParam = pointsToExclude
                .filter(
                    (point) =>
                        point.length === 2 &&
                        !isNaN(point[0]) &&
                        !isNaN(point[1])
                )
                .map((point) => `point(${point[0]} ${point[1]})`)
                .join(",");
        }
        const baseUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}`;
        const finalUrl = `${baseUrl}?geometries=geojson&overview=full${excludeParam ? "&exclude=" + encodeURIComponent(excludeParam) : ""
            }&alternatives=false&access_token=${mapboxgl.accessToken}`;

        try {
            const response = await fetch(finalUrl);
            const data = await response.json();
            if (!data.routes || data.routes.length === 0) {
                alert("No route found.");
                return;
            }
            const route = data.routes[0].geometry.coordinates;
            const geojson = {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "LineString",
                    coordinates: route,
                },
            };

            if (map && map.getSource("route")) {
                map.getSource("route").setData(geojson);
            } else if (map) {
                map.addSource("route", { type: "geojson", data: geojson });
                map.addLayer({
                    id: "route",
                    type: "line",
                    source: "route",
                    layout: {
                        "line-join": "round",
                        "line-cap": "round",
                    },
                    paint: {
                        "line-color": "white",
                        "line-width": 5,
                        "line-opacity": 0.75,
                    },
                });
            }
        } catch (error) {
            console.error("Error fetching route:", error);
        }
    }

    // Update markers for the start and end points
    function updateMarkers(start, end) {
        const startGeoJSON = {
            type: "FeatureCollection",
            features: [
                { type: "Feature", geometry: { type: "Point", coordinates: start } },
            ],
        };
        const endGeoJSON = {
            type: "FeatureCollection",
            features: [
                { type: "Feature", geometry: { type: "Point", coordinates: end } },
            ],
        };

        if (map) {
            if (map.getSource("start-point")) {
                map.getSource("start-point").setData(startGeoJSON);
            } else {
                map.addSource("start-point", { type: "geojson", data: startGeoJSON });
                map.addLayer({
                    id: "start-point",
                    type: "circle",
                    source: "start-point",
                    paint: { "circle-radius": 10, "circle-color": "white" },
                });
            }

            if (map.getSource("end-point")) {
                map.getSource("end-point").setData(endGeoJSON);
            } else {
                map.addSource("end-point", { type: "geojson", data: endGeoJSON });
                map.addLayer({
                    id: "end-point",
                    type: "circle",
                    source: "end-point",
                    paint: { "circle-radius": 10, "circle-color": "white" },
                });
            }
        }
    }

    // Handle form submission
    async function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const startAddress = form.elements["start-address"].value;
        const endAddress = form.elements["end-address"].value;
        const useExclusions = form.elements["exclude-checkbox"].checked;

        // Hard-coded avoid point(s) in [lon, lat] order.
        const avoidPoints = [[-118.20695444568196, 33.79677470884872]];
        const pointsToExclude = useExclusions ? avoidPoints : [];

        const startCoords = await getCoordinates(startAddress);
        const endCoords = await getCoordinates(endAddress);
        if (startCoords && endCoords) {
            const start = [startCoords[0], startCoords[1]];
            const end = [endCoords[0], endCoords[1]];
            map.setCenter(start);
            updateMarkers(start, end);
            getRoute(start, end, pointsToExclude);
        }
    }

    return (
        <div className="relative h-screen w-full">
            {/* Form Container - vertically centered on left */}
            {!popUp ? (<div className="absolute w-80 right-4 top-4 z-10 bg-[#0E1018] p-4 rounded shadow-md text-white">
                <h4 className="text-lg font-bold mb-2">Route Settings</h4>
                <form id="route-form" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="start-address" className="block mb-1">
                                From:
                            </label>
                            <input
                                type="text"
                                name="start-address"
                                id="start-address"
                                placeholder="1600 Pennsylvania Ave NW, Washington, DC"
                                className="w-full border-none text-white p-2 border border-gray-300 rounded bg-[#29292C] border-collapse placeholder-white"
                            />
                        </div>
                        <div>
                            <label htmlFor="end-address" className="block mb-1">
                                To:
                            </label>
                            <input
                                type="text"
                                name="end-address"
                                id="end-address"
                                placeholder="1 Infinite Loop, Cupertino, CA"
                                className="w-full border-none text-white p-2 border border-gray-300 rounded bg-[#29292C] border-collapse placeholder-white"
                            />
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="exclude-checkbox"
                                id="exclude-checkbox"
                                className="mr-2"
                            />
                            <label htmlFor="exclude-checkbox">Exclude Dangerous Routes</label>
                        </div>
                        <button
                            type="submit"
                            className="bg-white text-black px-4 py-2 rounded "
                        >
                            Calculate Route
                        </button>
                    </div>
                </form>
            </div>) : (<div className="absolute w-80 right-4 top-4 z-10 bg-neutral-950 p-4 rounded shadow-md text-white">
                <div onClick={() => setPopUp(false)} className="cursor-pointer"><X />Close</div>
                <div className="bg-gradient-to-br from-red-50 to-red-500 p-5 rounded-md">
                    <h4 className="text-sm">Los Angeles, CA</h4>
                    <h2 className="text-lg">High Risk</h2>
                    <h2 className="text-xs flex items-center gap-1"><ChevronUp size={15} /> Active Fire</h2>
                </div>
                <div className="flex justify-between my-4">
                    <span>Information</span>
                    <span className="text-purple-700">View all</span>
                </div>
                <div className="flex items-center justify-between">
                    <div>ACRES BURNED</div>
                    <div>
                        <div>20,000</div>
                        <h2 className="text-xs flex items-center gap-1 text-green-600"><ChevronUp size={15} /> 2.35%</h2>
                    </div>
                </div>

                <Separator className="bg-neutral-700 my-4"/>
                <div className="flex items-center justify-between">
                    <div>% CONTAINED</div>
                    <div>
                        <div>57%</div>
                        <h2 className="text-xs flex items-center gap-1 text-green-600"><ChevronUp size={15} /> 2.35%</h2>
                    </div>
                </div>
                <Separator className="bg-neutral-700 my-4"/>
                <div className="flex items-center justify-between">
                    <div>START DATE</div>
                    <div>
                        <div>Jan. 1</div>
                        <h2 className="text-xs flex items-center gap-1 text-red-600"><ChevronDown size={15} /> 2.35%</h2>
                    </div>
                </div>
                <Separator className="bg-neutral-700 my-4"/>
                <div className="flex items-center justify-between">
                    <div>LAST UPDATED</div>
                    <div>Feb. 5</div>
                </div>
            </div>)}

            {/* Map Container */}
            <div
                id="map-container"
                ref={mapContainerRef}
                className="w-full h-full"
            ></div>
        </div>
    );
}
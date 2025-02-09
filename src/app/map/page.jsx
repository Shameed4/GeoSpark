"use client";

import React, { useState, useEffect, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import RiskInfoCard from "./RiskInfoCard";
import moment from 'moment';
import { getPlaceName } from "../utils";
import { mapboxgl } from "../utils";

// Set your Mapbox access token
mapboxgl.accessToken =
    "pk.eyJ1Ijoicml0ZXNzc2hoaCIsImEiOiJjbTZ3aXRrc3UwajF3MmxxNm1xMDYwNWlxIn0.ovuV5vNE3yW_gcwDIMk4yA";

export default function MapPage() {
    const mapContainerRef = useRef(null);
    const [map, setMap] = useState(null);
    const [riskData, setRiskData] = useState(null);
    const [showRiskCard, setShowRiskCard] = useState(false);
    // New state variable to store the resolved place name.
    const [locationName, setLocationName] = useState("");

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

            mapInstance.on("load", async () => {
                // Add 3D terrain
                mapInstance.addSource("mapbox-dem", {
                    type: "raster-dem",
                    url: "mapbox://mapbox.mapbox-terrain-dem-v1",
                    tileSize: 512,
                    maxzoom: 14,
                });
                mapInstance.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

                // Add custom markers for fire locations
                addCustomMarkers(mapInstance);

                // Fetch and add GeoJSON data as hospital markers
                const geojsonData = await fetchGeoJSONData();
                if (geojsonData) {
                    addHospitalMarkers(geojsonData, mapInstance);
                }

                setMap(mapInstance);
            });
        }

        return () => map?.remove();
    }, [map]);

    // Add hospital markers (kept as in your original code)
    async function addHospitalMarkers(geojsonData, mapInstance) {
        geojsonData.features.forEach((feature) => {
            const coordinates = feature.geometry.coordinates;
            const description = feature.properties.description || "Hospital";

            // Create a DOM element for the hospital marker
            const el = document.createElement("div");
            el.className = "hospital-marker";
            el.style.fontSize = "24px"; // Adjust size as needed
            el.style.cursor = "pointer";
            el.textContent = "\ud83c\udfe5"; // Hospital emoji

            // Add marker to the map with a simple popup
            new mapboxgl.Marker(el)
                .setLngLat(coordinates)
                .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(description))
                .addTo(mapInstance);
        });
    }

    // Function to fetch GeoJSON data from the Flask backend
    async function fetchGeoJSONData() {
        try {
            const response = await fetch("http://127.0.0.1:5000/api/geojson");
            if (!response.ok) {
                throw new Error("Failed to fetch GeoJSON data");
            }
            const geojsonData = await response.json();
            return geojsonData;
        } catch (error) {
            console.error("Error fetching GeoJSON data:", error);
            return null;
        }
    }

    // Fetch markers for fire locations from your API
    async function fetchMarkerData() {
        try {
            const response = await fetch("http://127.0.0.1:5000/api/coords-risk");
            if (!response.ok) {
                throw new Error("Failed to fetch marker data");
            }
            const markers = await response.json();
            return markers;
        } catch (error) {
            console.error("Error fetching marker data:", error);
            return [];
        }
    }

    // Add fire markers to the map
    async function addCustomMarkers(mapInstance) {
        const locations = await fetchMarkerData(); // Fetch markers from backend

        locations.forEach((location) => {
            // Create a DOM element for each fire marker
            const el = document.createElement("div");
            el.className = "custom-marker";
            el.style.fontSize = "24px";
            el.style.cursor = "pointer";
            el.textContent = "\ud83d\udd25"; // Fire emoji

            // Add a click event handler to fetch risk info and show the pop-up:
            el.addEventListener("click", async () => {
                // Convert coordinates from [lon, lat] to "lat,lon" for the API key.
                const coordsKey = `${location.coordinates[1]},${location.coordinates[0]}`;
                try {
                    const response = await fetch(
                        `http://127.0.0.1:5000/api/all-data?coords=${coordsKey}`
                    );
                    const data = await response.json();
                    if (data.error) {
                        alert(data.error);
                        return;
                    }
                    // The API returns data in the form:
                    // { "34.0522,-118.2437": { ... } }
                    const riskInfo = data[coordsKey];
                    if (riskInfo) {
                        // Extract only the necessary fields:
                        const extractedData = {
                            location: coordsKey,
                            fire: riskInfo.fire,
                            risk: riskInfo.risk,
                            wind_str: riskInfo.wind_str,
                            wind_dir: riskInfo.wind_dir,
                            humidity: riskInfo.humidity,
                            timestamp: riskInfo.timestamp,
                        };
                        setRiskData(extractedData);
                        setShowRiskCard(true);
                    } else {
                        alert("No risk information found for this location.");
                    }
                } catch (error) {
                    console.error("Error fetching risk info:", error);
                }
            });

            // Add the fire marker to the map.
            new mapboxgl.Marker(el)
                .setLngLat(location.coordinates)
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

    // Use an effect to update the place name whenever riskData changes
    useEffect(() => {
        if (riskData && riskData.location) {
            getPlaceName(riskData.location)
                .then((name) => setLocationName(name))
                .catch((error) => {
                    console.error("Error fetching place name:", error);
                    setLocationName("Unknown location");
                });
        }
    }, [riskData]);

    // Function to get a route using the beta "exclude" syntax
    async function getRoute(start, end, pointsToExclude) {
        let excludeParam = "";
        if (pointsToExclude.length > 0) {
            excludeParam = pointsToExclude
                .filter(
                    (point) =>
                        point.length === 2 && !isNaN(point[0]) && !isNaN(point[1])
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

    // Update markers for the start and end points on the map
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

    // Handle form submission for calculating a route
    async function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const startAddress = form.elements["start-address"].value;
        const endAddress = form.elements["end-address"].value;
        const useExclusions = form.elements["exclude-checkbox"].checked;

        let pointsToExclude = [];

        if (useExclusions) {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/coords-risk');
                if (response.ok) {
                    const data = await response.json();
                    // Map over the returned data to extract the coordinates ([lng, lat])
                    pointsToExclude = data.map(item => item.coordinates);
                    console.log(pointsToExclude)
                } else {
                    console.error('Failed to fetch risk coordinates:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching risk coordinates:', error);
            }
        }

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
        <div className="relative h-screen w-full overflow-hidden">
            {/* Route Settings Form (always visible) */}
            <div className="absolute w-80 right-4 top-4 z-10 bg-[#0E1018] p-4 rounded shadow-md text-white">
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
                                className="w-full border-none text-white p-2 border border-gray-300 rounded bg-[#29292C] placeholder-white"
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
                                className="w-full border-none text-white p-2 border border-gray-300 rounded bg-[#29292C] placeholder-white"
                            />
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="exclude-checkbox"
                                id="exclude-checkbox"
                                className="mr-2"
                            />
                            <label htmlFor="exclude-checkbox">
                                Exclude Dangerous Routes
                            </label>
                        </div>
                        <button
                            type="submit"
                            className="bg-white text-black px-4 py-2 rounded"
                        >
                            Calculate Route
                        </button>
                    </div>
                </form>
            </div>

            {/* Risk Info Card Popup (shown when a fire marker is clicked) */}
            {showRiskCard && riskData && (
                <RiskInfoCard
                    location={locationName}  // Pass the resolved string value
                    riskLevel={riskData.risk}
                    activeFire={riskData.fire}
                    windDir={riskData.wind_dir}
                    windStr={riskData.wind_str}
                    humidity={riskData.humidity}
                    timeStamp={moment(riskData.timestamp).format("MMMM Do YYYY, h:mm:ss a")}
                    onClose={() => setShowRiskCard(false)}
                />
            )}

            {/* Map Container */}
            <div id="map-container" ref={mapContainerRef} className="w-full h-full"></div>
        </div>
    );
}
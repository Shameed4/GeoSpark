// Reverse geocoding: Get a place name from a "lat,lon" string
import mapboxgl from "mapbox-gl";
mapboxgl.accessToken =
    "pk.eyJ1Ijoicml0ZXNzc2hoaCIsImEiOiJjbTZ3aXRrc3UwajF3MmxxNm1xMDYwNWlxIn0.ovuV5vNE3yW_gcwDIMk4yA";

export { mapboxgl };

export async function getPlaceName(location : string) {
    // Expecting location as a string "latitude,longitude", e.g., "34.0522,-118.2437"
    const [latStr, lngStr] = location.split(",");
    const latitude = parseFloat(latStr.trim());
    const longitude = parseFloat(lngStr.trim());

    // Mapbox expects coordinates as "longitude,latitude"
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.features && data.features.length > 0) {
            // Return the human-readable place name from the first feature.
            return data.features[0].place_name;
        } else {
            alert(`No address found for coordinates: ${location}`);
            return null;
        }
    } catch (error) {
        console.error("Error fetching address:", error);
        return null;
    }
}
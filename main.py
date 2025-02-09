from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
from openai import OpenAI
from fireDetection import generate_wildfire_report

# Initialize the app
app = Flask(__name__)
CORS(app)  # Enable CORS

# Set up OpenAI API key
client = OpenAI(api_key='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')  # Set this environment variable or hardcode for testing

def load_marker_data():
    if os.path.exists('database.json'):
        with open('database.json', 'r') as file:
            return json.load(file)
    return []  # Return empty list if file doesn't exist

def save_marker_data(markers):
    with open('database.json', 'w') as file:
        json.dump(markers, file, indent=4)

@app.route('/api/markers', methods=['POST'])
def add_marker():
    data = request.get_json()
    if not data or not all(key in data for key in ("lat", "lon", "risk")):
        return jsonify({"error": "Invalid input. Required fields: lat, lon, risk."}), 400

    new_marker = {
        "lat": data["lat"],
        "lon": data["lon"],
        "risk": data["risk"].lower()
    }
    markers = load_marker_data()
    markers.append(new_marker)
    save_marker_data(markers)

    return jsonify({
        "message": "Marker added successfully",
        "marker": new_marker
    }), 201

# Basic route for testing
@app.route('/', methods=['GET'])
def home():
    return "API running"

@app.route('/api/markers', methods=['GET'])
def get_markers():
    markers = load_marker_data()
    return jsonify(markers)

@app.route('/api/wildfire-report', methods=['POST'])
def wildfire_report():
    """
    Expects JSON with keys:
      - lat: Latitude (e.g., 34.0522)
      - lon: Longitude (e.g., -118.2437)
      - video_source: Path to the video file to analyze
    Generates a wildfire report and adds a new marker (lat, lon, risk) to the database.
    """
    data = request.get_json()
    if not data or not all(k in data for k in ("lat", "lon", "video_source")):
        return jsonify({"error": "Invalid input. Provide lat, lon, and video_source."}), 400

    coordinates = data["coordinates"]
    if not isinstance(coordinates, (list, tuple)) or len(coordinates) != 2:
        return jsonify({"error": "Coordinates must be a list or tuple of two elements: [latitude, longitude]."}), 400


    video_source = data["video_source"]

    try:
        report = generate_wildfire_report(video_source, coordinates)

        report_file = "wildfire_report.json"
        with open(report_file, "w") as f:
            json.dump(report, f, indent=4)

        markers = load_marker_data()
        lat, lon = coordinates
        new_marker = {
            "coordinates": {"lat": lat, "lon": lon},
            "risk": report.get("risk", "unknown")
        }
        markers.append(new_marker)
        save_marker_data(markers)

        return jsonify({
            "message": "Wildfire report generated and marker added successfully",
            "report": report,
            "marker": new_marker
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
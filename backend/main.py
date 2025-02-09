from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
from openai import OpenAI
from fireDetection import generate_wildfire_report
from datetime import datetime

# Initialize the app
app = Flask(__name__)
CORS(app)  # Enable CORS

# Set up OpenAI API key
client = OpenAI(api_key='API_KEY')  # Set this environment variable or hardcode for testing

def load_marker_data():
    if os.path.exists('database.json'):
        with open('database.json', 'r') as file:
            return json.load(file)
    return []  # Return empty list if file doesn't exist

def save_marker_data(markers):
    with open('database.json', 'w') as file:
        json.dump(markers, file, indent=4)

@app.route('/api/geojson', methods=['GET'])
def get_geojson():
    """Serve the GeoJSON data."""
    try:
        with open("hospitalData/FacilityList.geojson", 'r') as file:
            geojson_data = json.load(file)
        return jsonify(geojson_data)
    except Exception as e:
        return jsonify({"error": "Failed to load GeoJSON data", "details": str(e)}), 500

@app.route('/api/chat', methods=['POST'])
def chat_with_gpt():
    data = request.get_json()  # Get the incoming JSON data
    if not data or 'question' not in data:
        return jsonify({"error": "Invalid input"}), 400

    user_question = data['question']

    # Load the fine-tuning prompt from prompt.txt
    if os.path.exists('prompt.txt'):
        with open('prompt.txt', 'r') as file:
            base_prompt = file.read().strip()
    else:
        base_prompt = ""

    prompt_text = base_prompt

    response = client.chat.completions.create(
        model="gpt-4o-mini",  # Use the appropriate multimodal model
        messages=[
            {
                "role": "system",
                "content": prompt_text  # Include your main website-specific instructions here
            },
            {
                "role": "user",
                "content": user_question  # The user's actual question goes here
            }
        ]
    )

    # Extract and return the assistant's answer
    answer = response.choices[0].message.content.strip()
    return jsonify({"answer": answer}), 200

@app.route('/api/markers', methods=['POST'])
def add_marker():
    data = request.get_json()
    if not data or not all(key in data for key in ("coordinates", "risk")):
        return jsonify({"error": "Invalid input. Required fields: coordinates, risk."}), 400

    # Validate coordinates
    if not isinstance(data["coordinates"], (list, tuple)) or len(data["coordinates"]) != 2:
        return jsonify({"error": "Coordinates must be a list or tuple of two elements: [latitude, longitude]."}), 400

    new_marker = {
        "coordinates": {
            "lat": data["coordinates"][0],  # Latitude
            "lon": data["coordinates"][1]   # Longitude
        },
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
    Generates a wildfire report by calling generate_wildfire_report(),
    which writes it to wildfire_report.json as a dict keyed by "lat,lon".
    Returns JSON of the form:
      {
        "34.0522,-118.2437": {
          "fire": true,
          "risk": "high",
          ...
        }
      }
    """
    from datetime import datetime
    data = request.get_json()

    # Validate request
    if not data or not all(k in data for k in ("coordinates", "video_source")):
        return jsonify({"error": "Invalid input. Provide 'coordinates' and 'video_source'."}), 400

    coordinates = data["coordinates"]
    if not isinstance(coordinates, (list, tuple)) or len(coordinates) != 2:
        return jsonify({"error": "Coordinates must be [latitude, longitude]."}), 400

    video_source = data["video_source"]
    lat, lon = coordinates
    coord_key = f"{lat},{lon}"

    try:
        # This function already writes to "wildfire_report.json"
        report = generate_wildfire_report(video_source, coordinates)

        # (Optional) Add an 'id' or other extra fields in the returned JSON:
        # NOTE: if you want to save 'id' to the file, do it inside generate_wildfire_report.
        # report_id = f"{lat},{lon}-{datetime.now().isoformat()}"
        # report["id"] = report_id

        # Return just the single coordinate's data
        return jsonify({coord_key: report}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



with open('wildfire_report.json', 'r') as f:
    data = json.load(f)

@app.route('/api/all-data', methods=['GET'])
def all_data():
    """
    If a 'coords' query parameter is provided (e.g. ?coords=34.0522,-118.2437),
    return only that coordinate's data. Otherwise, return all data.
    """
    coords = request.args.get('coords', None)

    if coords:
        coords = coords.strip()

        if coords in data:
            return jsonify({coords: data[coords]})
        else:
            return jsonify({"error": f"No data found for coordinate '{coords}'"}), 404

    return jsonify(data)


@app.route('/api/coords-risk', methods=['GET'])
def coords_risk():
    """
    Returns a simplified version of the JSON data containing only
    coordinates and risk for each entry.
    """
    coords_risk_list = []

    for coord, details in data.items():
        coords_risk_list.append({
            "coordinate": coord,
            "risk": details.get("risk")
        })

    return jsonify(coords_risk_list)

if __name__ == '__main__':
    app.run(port=5000)

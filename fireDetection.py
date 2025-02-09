import subprocess
import os
import cv2
import base64
import requests
from ultralytics import YOLO
from openai import OpenAI
from datetime import datetime
import json

# Load the YOLO model
model = YOLO('fire_l.pt')
FIRE_CLASS_NAME = "fire"
SMOKE_CLASS_NAME = "smoke"

# Initialize OpenAI client
client = OpenAI(api_key='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')


def detect_fire_and_smoke(video_source):
    """Detects fire and smoke in the video and returns True if detected."""
    cap = cv2.VideoCapture(video_source)
    if not cap.isOpened():
        print("Error opening video file or stream")
        return False

    fire_detected = False
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        results = model(frame)
        for result in results:
            for bbox, class_id, conf in zip(result.boxes.xyxy, result.boxes.cls, result.boxes.conf):
                class_name = model.model.names[int(class_id)]
                if conf > 0.5 and class_name in [FIRE_CLASS_NAME, SMOKE_CLASS_NAME]:
                    fire_detected = True
                    break
            if fire_detected:
                break
        if fire_detected:
            break

    cap.release()
    return fire_detected

def get_weather_and_aqi(lat, lon):
    """Fetches weather and air quality data using OpenWeatherMap API."""
    api_key = "832ce1e9aa05f42e713ea690076b99c6"
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=imperial"
    url2 = f"http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat={lat}&lon={lon}&appid={api_key}"
    response = requests.get(url).json()
    response2 = requests.get(url2).json()

    weather_data = {
        "temp": response['main']['temp'],
        "humidity": response['main']['humidity'],
        "wind_str": response['wind']['speed'],
        "wind_dir": response['wind']['deg'],
        "pressure": response['main'].get('pressure'),
        "visibility": response.get('visibility'),
        "precipitation": response.get('rain', {}).get('1h', 0),
        "aqi": response2["main"]["aqi"]
    }
    return weather_data

# Helper functions (from your existing code)
def get_frame_from_video(video_source, frame_number=0):
    """Extracts a frame from the video."""
    cap = cv2.VideoCapture(video_source)
    if not cap.isOpened():
        raise Exception("Error opening video file or stream")
    cap.set(cv2.CAP_PROP_POS_FRAMES, frame_number)
    ret, frame = cap.read()
    cap.release()
    if not ret:
        raise Exception("Could not read frame from video")
    return frame

def image_to_base64(frame, target_size=(64, 64), jpeg_quality=50):
    """Converts a frame to a base64-encoded JPEG string."""
    resized_frame = cv2.resize(frame, target_size)
    encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), jpeg_quality]
    success, buffer = cv2.imencode('.jpg', resized_frame, encode_param)
    if not success:
        raise Exception("Failed to encode image")
    return base64.b64encode(buffer).decode("utf-8")

def get_fire_risk(lat, lon, frame):
    """Uses OpenAI GPT-4 to classify fire risk based on coordinates and frame."""
    base64_image = image_to_base64(frame)
    prompt_text = (
        "You are an expert fire risk assessor. Evaluate the following information:\n"
        f" - Latitude: {lat}\n"
        f" - Longitude: {lon}\n\n"
        "Based on these coordinates and the image provided, classify the fire risk for this area.\n"
        "Return only one word: High, Moderate, or Low."
    )
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt_text},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
                ]
            }
        ]
    )
    return response.choices[0].message.content.strip()

def generate_wildfire_report(video_source, coordinates, json_file_path="wildfire_report.json"):
    # Unpack the coordinates tuple
    lat, lon = coordinates

    fire_detected = detect_fire_and_smoke(video_source)

    weather_data = get_weather_and_aqi(lat, lon)

    frame = get_frame_from_video(video_source, frame_number=0)
    risk_level = get_fire_risk(lat, lon, frame)

    report = {
        "fire": fire_detected,
        "risk": risk_level.lower(),  # "high", "moderate", or "low"
        "temp": weather_data['temp'],
        "wind_str": weather_data['wind_str'],
        "wind_dir": weather_data['wind_dir'],
        "humidity": weather_data['humidity'],
        "aqi": weather_data['aqi'],
        "pressure": weather_data['pressure'],
        "visibility": weather_data['visibility'],
        "precipitation": weather_data['precipitation'],
        "timestamp": datetime.now().isoformat()
    }

    with open(json_file_path, "w") as f:
        json.dump(report, f, indent=4)
    print(f"Wildfire report saved to {json_file_path}")

    return report

# Example usage
video_source = "Fire.mp4"
latitude = 34.0522
longitude = -118.2437

report = generate_wildfire_report(video_source, latitude, longitude)
print(report)

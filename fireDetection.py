import subprocess
import os
import cv2
import base64
from ultralytics import YOLO
from openai import OpenAI

# Load the YOLO model
model = YOLO('fire_l.pt')  # Replace with your model file if different

# Class names for fire and smoke
FIRE_CLASS_NAME = "fire"
SMOKE_CLASS_NAME = "smoke"

# Function to detect fire and smoke in video
def detect_fire_and_smoke(video_source, output_file="fire_smoke_detection_output.mp4"):
    # Capture video from the file or camera
    cap = cv2.VideoCapture(video_source)

    # Check if the video capture is successful
    if not cap.isOpened():
        print("Error opening video file or stream")
        return

    # Get the width, height, and frames per second (fps) of the input video
    frame_width = int(cap.get(3))
    frame_height = int(cap.get(4))
    fps = int(cap.get(cv2.CAP_PROP_FPS))

    # Define the codec and create a VideoWriter object to save the video
    temp_output_file = "temp_fire_smoke_output.mp4"
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')  # Using mp4v for broader compatibility
    out = cv2.VideoWriter(temp_output_file, fourcc, fps, (frame_width, frame_height))

    # Loop through the frames of the video
    while cap.isOpened():
        ret, frame = cap.read()

        # Break the loop if the video ends
        if not ret:
            break

        # Run YOLO inference on the frame
        results = model(frame)

        # Loop through the detection results
        for result in results:
            # Filter detections for fire and smoke classes
            for bbox, class_id, conf in zip(result.boxes.xyxy, result.boxes.cls, result.boxes.conf):
                class_name = model.model.names[int(class_id)]
                if conf > 0.5:  # Confidence threshold
                    # Draw bounding box and label based on the class
                    x1, y1, x2, y2 = map(int, bbox)
                    if class_name == FIRE_CLASS_NAME:
                        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)  # Red box for fire
                        label = f'FIRE: {conf:.2f}'
                        cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
                    elif class_name == SMOKE_CLASS_NAME:
                        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 255), 2)  # Yellow box for smoke
                        label = f'SMOKE: {conf:.2f}'
                        cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 2)

        # Display the frame in a window for real-time detection
        cv2.imshow("Fire and Smoke Detection", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

        # Write the frame with bounding boxes to the temporary output video file
        out.write(frame)

    # Release the video capture and writer objects, and close any open windows
    # cap.release()
    # out.release()
    # cv2.destroyAllWindows()

    # Convert the temporary output file to ensure compatibility using FFmpeg
    final_output_file = output_file
    temp_output_file_path = os.path.abspath(temp_output_file)
    final_output_file_path = os.path.abspath(final_output_file)

    ffmpeg_command = [
        'ffmpeg',
        '-i', temp_output_file_path,  # Input file
        '-c:v', 'libx264',            # Use H.264 codec
        '-preset', 'fast',            # Encoding speed
        '-crf', '23',                 # Constant rate factor (quality)
        '-c:a', 'aac',                # Audio codec (if audio is present)
        '-b:a', '192k',               # Audio bitrate (if audio is present)
        '-movflags', '+faststart',    # Enable fast start for web
        final_output_file_path        # Output file
    ]

    # Run FFmpeg command
    subprocess.run(ffmpeg_command, check=True)

    # Clean up temporary files
    if os.path.exists(temp_output_file):
        os.remove(temp_output_file)

    print(f"Output video saved as {final_output_file_path}")

client = OpenAI(api_key='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')

# Assume you've already set up your OpenAI client (client) and imported other needed libraries

def get_frame_from_video(video_source, frame_number=0):
    """
    Opens the video source, jumps to the specified frame number,
    and returns that frame as a NumPy array.
    """
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
    """
    Resize and compress the frame to reduce prompt length,
    then encode it as a base64 JPEG string.
    """
    # Resize the frame to a small thumbnail to reduce token usage
    resized_frame = cv2.resize(frame, target_size)

    # Compress the image with a specified JPEG quality
    encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), jpeg_quality]
    success, buffer = cv2.imencode('.jpg', resized_frame, encode_param)
    if not success:
        raise Exception("Failed to encode image")
    # Return the base64-encoded string
    return base64.b64encode(buffer).decode("utf-8")


def get_fire_risk(lat, lon, frame):
    """
    Uses geographic coordinates and a video frame (automatically extracted)
    to ask the multimodal Chat API to classify the fire risk.

    It sends a message with a text portion (including the coordinates and instructions)
    and an image portion (with the base64-encoded image) using the new message format.

    The response should be one word: either "High", "Moderate", or "Low".
    """
    # Convert the frame to a compressed base64-encoded JPEG string
    base64_image = image_to_base64(frame)

    # Build the text part of the prompt
    prompt_text = (
        "You are an expert fire risk assessor. Evaluate the following information:\n"
        f" - Latitude: {lat}\n"
        f" - Longitude: {lon}\n\n"
        "Based on these coordinates and the image provided, classify the fire risk for this area.\n"
        "Return only one word: High, Moderate, or Low."
    )

    # Call the Chat API with a multimodal message
    response = client.chat.completions.create(
        model="gpt-4o-mini",  # Use the appropriate multimodal model
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

    # Extract and return the assistant's answer
    return response.choices[0].message.content.strip()


# Example usage:
video_source = "Fire.mp4"  # Path to your video file
# Automatically extract a frame (e.g., the first frame)
frame = get_frame_from_video(video_source, frame_number=0)

# Example coordinates (latitude and longitude)
latitude = 37.7749  # e.g., San Francisco
longitude = -122.4194

risk_level = get_fire_risk(latitude, longitude, frame)
print(f"Fire Risk: {risk_level}")
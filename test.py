import cv2
import os
from ultralytics import YOLO

# Load the YOLO model
# model = YOLO('fire_l.pt')  # Replace with your model file if different

from ultralytics import YOLO
try:
    model = YOLO('fire_l.pt')
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")


# Class names for fire and smoke
FIRE_CLASS_NAME = "fire"
SMOKE_CLASS_NAME = "smoke"


def test_image(image_path):
    # Load the image
    image = cv2.imread(image_path)
    if image is None:
        print(f"Error loading image: {image_path}")
        return

    # Run YOLO inference on the image
    results = model(image)
    detected_classes = []

    # Process the results
    for result in results:
        for bbox, class_id, conf in zip(result.boxes.xyxy, result.boxes.cls, result.boxes.conf):
            class_name = model.model.names[int(class_id)]
            if conf > 0.5:  # Confidence threshold
                # Draw bounding box and label
                x1, y1, x2, y2 = map(int, bbox)
                if class_name == FIRE_CLASS_NAME:
                    cv2.rectangle(image, (x1, y1), (x2, y2), (0, 0, 255), 2)  # Red box for fire
                    label = f'FIRE: {conf:.2f}'
                    cv2.putText(image, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
                    detected_classes.append((FIRE_CLASS_NAME, conf))
                elif class_name == SMOKE_CLASS_NAME:
                    cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 255), 2)  # Yellow box for smoke
                    label = f'SMOKE: {conf:.2f}'
                    cv2.putText(image, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 2)
                    detected_classes.append((SMOKE_CLASS_NAME, conf))

    # Print detection results
    if detected_classes:
        print(f"Detections in {os.path.basename(image_path)}:")
        for detected_class, conf in detected_classes:
            print(f"  - Detected {detected_class} with confidence: {conf:.2f}")
    else:
        print(f"No fire or smoke detected in {os.path.basename(image_path)}.")

    # Display the result
    cv2.imshow("Detection Result", image)
    print(f"Press any key to close the window for image: {os.path.basename(image_path)}")
    cv2.waitKey(0)
    cv2.destroyAllWindows()


# Test on a single image:
image_path = "Screenshot 2025-02-08 at 5.05.16 PM.png"  # Replace with your image file
test_image(image_path)


# Or, to test on multiple images from a folder:
# def test_images_in_folder(folder_path):
#     # Get a list of image files (adjust extensions if needed)
#     image_extensions = [".jpg", ".jpeg", ".png", ".bmp"]
#     image_files = [os.path.join(folder_path, f) for f in os.listdir(folder_path)
#                    if os.path.splitext(f)[1].lower() in image_extensions]
#
#     for img_file in image_files:
#         print(f"\nProcessing {img_file}...")
#         test_image(img_file)

# Example usage for multiple images:
# folder_path = "path/to/your/images/folder"
# test_images_in_folder(folder_path)

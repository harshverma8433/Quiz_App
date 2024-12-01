from flask import Flask, request, jsonify
import cv2
import numpy as np
import base64
from ultralytics import YOLO
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Load the YOLOv8 model
model = YOLO('yolov8n.pt')

MOBILE_PHONE_CLASS_ID = 67  # Class ID for 'cell phone' in COCO dataset

def process_image(image_data):
    try:
        # Decode base64 image data
        image_bytes = base64.b64decode(image_data.split(',')[1])
        np_array = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

        # Run YOLO model
        results = model(image)

        # Filter results for mobile phones
        mobile_phones = [
            box for box in results[0].boxes if int(box.cls) == MOBILE_PHONE_CLASS_ID
        ]

        return len(mobile_phones), mobile_phones
    except Exception as e:
        print(f"Error processing image: {e}")
        return 0, []

@app.route("/", methods=["GET"])
def hello():
    print("helllooo.....")
    return jsonify({'message': "Hello Harsh !!!"})

@app.route('/detect-objects', methods=['POST'])
def detect_objects():
    try:
        print("fcfmfmfvmfk")
        data = request.get_json()
        image_data = data['image']

        mobile_phone_count, boxes = process_image(image_data)
        return jsonify({
            'message': f"Detected {mobile_phone_count} mobile phone(s)." if mobile_phone_count > 0 else "No mobile phones detected.",
            'boxes': [box.xyxy.tolist() for box in boxes] if boxes else []
        })
    except Exception as e:
        print(f"Error in /detect-objects: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

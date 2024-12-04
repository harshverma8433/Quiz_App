# from flask import Flask, request, jsonify
# import cv2
# import numpy as np
# from ultralytics import YOLO
# from flask_cors import CORS
# import os
# from werkzeug.utils import secure_filename

# app = Flask(__name__)
# CORS(app
#      )

# # Load the YOLOv8 model
# model = YOLO('yolov8n.pt')

# MOBILE_PHONE_CLASS_ID = 67  # Class ID for 'cell phone' in COCO dataset

# UPLOAD_FOLDER = 'uploads'  # Specify the folder to save images temporarily
# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# if not os.path.exists(UPLOAD_FOLDER):
#     os.makedirs(UPLOAD_FOLDER)

# def process_image(image_path):
#     try:
#         # Load the image from the file
#         image = cv2.imread(image_path)

#         # Run YOLO model
#         results = model(image)

#         # Filter results for mobile phones
#         mobile_phones = [
#             box for box in results[0].boxes if int(box.cls) == MOBILE_PHONE_CLASS_ID
#         ]

#         return len(mobile_phones), mobile_phones
#     except Exception as e:
#         print(f"Error processing image: {e}")
#         return 0, []
    
# @app.route('/hello', methods=['GET'])
# def hello():
#     print("Hello")
#     return jsonify({"message": "Hello Harsh Verma!!"})



# @app.route('/receive-frame', methods=['POST'])
# def detect_objects():
#     print("hjdjicndiciedj")
#     try:
#         # Get the image from the request
#         file = request.files['image']
#         print(f"Received file: {file.filename}")
        
        
#         # Save the image to the server temporarily
#         filename = secure_filename(file.filename)
#         file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
#         file.save(file_path)
#         print(f"File saved to: {file_path}")

#         mobile_phone_count, boxes = process_image(file_path)

#         # Return the result
#         return jsonify({
#             'message': f"Detected {mobile_phone_count} mobile phone(s)." if mobile_phone_count > 0 else "No mobile phones detected.",
#             'boxes': [box.xyxy.tolist() for box in boxes] if boxes else []
#         })
#     except Exception as e:
#         print(f"Error in /detect-objects: {e}")
#         return jsonify({"error": str(e)}), 500


# if __name__ == '__main__':
#     app.run(debug=True, host='0.0.0.0', port=5000)


from flask import Flask, request, jsonify
import cv2
import numpy as np
from ultralytics import YOLO
from flask_cors import CORS
import base64
import io
from PIL import Image

app = Flask(__name__)
CORS(app)

# Load the YOLOv8 model
model = YOLO('yolov8n.pt')

MOBILE_PHONE_CLASS_ID = 67  # Class ID for 'cell phone' in COCO dataset

def process_image(image_array):
    """
    Processes the image array to detect objects using the YOLO model.
    """
    try:
        # Run YOLO model
        results = model(image_array)

        # Filter results for mobile phones
        mobile_phones = [
            box for box in results[0].boxes if int(box.cls) == MOBILE_PHONE_CLASS_ID
        ]

        return len(mobile_phones), mobile_phones
    except Exception as e:
        print(f"Error processing image: {e}")
        return 0, []

@app.route('/hello', methods=['GET'])
def hello():
    """
    Simple test endpoint.
    """
    print("Hello")
    return jsonify({"message": "Hello Harsh Verma!!"})

@app.route('/receive-frame', methods=['POST'])
def receive_frame():
    """
    Receives a frame as a Base64-encoded image string, processes it,
    and returns the detection results.
    """
    try:
        # Get the frame data from the request
        data = request.json
        if 'frame' not in data:
            return jsonify({"error": "No frame data provided"}), 400

        frame_data = data['frame']

        # Decode the Base64-encoded image
        image_bytes = base64.b64decode(frame_data.split(',')[1])  # Remove 'data:image/jpeg;base64,'
        image = Image.open(io.BytesIO(image_bytes))
        image_array = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        cv2.imwrite("debug_image.jpg", image_array)


        # Process the image
        mobile_phone_count, boxes = process_image(image_array)
        
        print(frame_data)

        # Return the result
        return jsonify({
            'message': f"Detected {mobile_phone_count} mobile phone(s)." if mobile_phone_count > 0 else "No mobile phones detected.",
            'boxes': [box.xyxy.tolist() for box in boxes] if boxes else []
        })
    except Exception as e:
        print(f"Error in /receive-frame: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

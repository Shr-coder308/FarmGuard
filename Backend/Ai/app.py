from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import numpy as np
import time
import re

# Optional TensorFlow Import (image model)
try:
    import tensorflow as tf
    from tensorflow.keras.preprocessing import image
    TF_AVAILABLE = True
except Exception:
    TF_AVAILABLE = False

# Optional: OpenAI client
try:
    from openai import OpenAI
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    AI_AVAILABLE = True
except Exception:
    AI_AVAILABLE = False

app = Flask(__name__)
CORS(app, supports_credentials=True)

# --- Configuration ---
UPLOAD_DIR = "static"
CROP_MODEL_PATH = os.path.join("model", "crop_model.h5")
DISEASE_MODEL_PATH = os.path.join("model", "disease_model.h5")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Crop classes
CROP_CLASSES = ["Wheat", "Rice", "Maize", "Sugarcane", "Cotton", "Potato", "Tomato"]

# ---------- Load Crop Model ----------
crop_model = None
if TF_AVAILABLE and os.path.exists(CROP_MODEL_PATH):
    try:
        crop_model = tf.keras.models.load_model(CROP_MODEL_PATH)
        print("✅ Loaded Crop Model:", CROP_MODEL_PATH)
    except:
        print("⚠ Error loading crop model.")
else:
    print("⚠ No crop model found — Running in DEMO mode.")

# ---------- Load Disease Model (Optional) ----------
disease_model = None
if TF_AVAILABLE and os.path.exists(DISEASE_MODEL_PATH):
    try:
        disease_model = tf.keras.models.load_model(DISEASE_MODEL_PATH)
        print("✅ Loaded Disease Model:", DISEASE_MODEL_PATH)
    except:
        print("⚠ Error loading disease model.")
else:
    print("⚠ No disease model — Using DEMO disease detection.")


@app.route("/", methods=["GET"])
def home():
    return "🌿 FarmGuard AI Backend running successfully!"


# ----------------------------------------------------
# 🌾 CROP DETECTION API
# ----------------------------------------------------
@app.route("/detect-crop", methods=["POST"])
def detect_crop():
    if "file" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    f = request.files["file"]
    save_path = os.path.join(UPLOAD_DIR, f.filename)
    f.save(save_path)

    try:
        if crop_model is not None and TF_AVAILABLE:
            img = image.load_img(save_path, target_size=(224, 224))
            arr = image.img_to_array(img)
            arr = np.expand_dims(arr, axis=0) / 255.0
            preds = crop_model.predict(arr)
            idx = np.argmax(preds)
            crop = CROP_CLASSES[idx]
            conf = float(np.max(preds))
        else:
            # DEMO fallback
            rng = np.random.default_rng()
            crop = rng.choice(CROP_CLASSES).item()
            conf = float(rng.uniform(0.82, 0.98))

        return jsonify({
            "crop": crop,
            "confidence": conf,
            "mode": "Real AI" if crop_model else "Demo AI"
        })

    finally:
        try:
            time.sleep(1)
            os.remove(save_path)
        except:
            pass


# ----------------------------------------------------
# 🦠 DISEASE DETECTION API
# ----------------------------------------------------
@app.route("/detect-disease", methods=["POST"])
def detect_disease():
    if "file" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    f = request.files["file"]
    save_path = os.path.join(UPLOAD_DIR, f.filename)
    f.save(save_path)

    # DEMO CLASSES
    DISEASE_CLASSES = [
        "Healthy",
        "Leaf Blight",
        "Rust",
        "Leaf Spot",
        "Mosaic Virus",
        "Bacterial Wilt"
    ]

    solutions = {
        "Healthy": "Your plant looks healthy! Maintain watering & add compost every 15 days.",
        "Leaf Blight": "Spray Mancozeb or Chlorothalonil. Remove affected leaves.",
        "Rust": "Use Sulfur spray. Avoid overhead irrigation.",
        "Leaf Spot": "Use Neem oil or Copper fungicide. Improve air flow.",
        "Mosaic Virus": "No cure. Remove infected plants + control insects.",
        "Bacterial Wilt": "Improve drainage. Apply bleaching powder in water channels."
    }

    try:
        if disease_model is not None and TF_AVAILABLE:
            img = image.load_img(save_path, target_size=(224, 224))
            arr = image.img_to_array(img)
            arr = np.expand_dims(arr, axis=0) / 255.0
            preds = disease_model.predict(arr)
            idx = np.argmax(preds)
            disease = DISEASE_CLASSES[idx]
            conf = float(np.max(preds))
            mode = "Real AI"
        else:
            # DEMO fallback
            rng = np.random.default_rng()
            disease = rng.choice(DISEASE_CLASSES).item()
            conf = float(rng.uniform(0.82, 0.98))
            mode = "Demo AI"

        return jsonify({
            "disease": disease,
            "confidence": conf,
            "solution": solutions[disease],
            "mode": mode
        })

    finally:
        try:
            time.sleep(1)
            os.remove(save_path)
        except:
            pass


# ----------------------------------------------------
# 🤖 CHATBOT API (multilingual + fallback)
# ----------------------------------------------------
@app.route("/chat", methods=["POST"])
def chatbot():
    try:
        data = request.get_json() or {}
        user_msg = (data.get("message") or "").strip()
        if not user_msg:
            return jsonify({"reply": "Please type a question!"})

        # detect Hindi text
        is_hindi = bool(re.search(r'[\u0900-\u097F]', user_msg))

        # Try OpenAI
        reply = None
        if AI_AVAILABLE:
            try:
                system_context = (
                    "You are FarmGuard AI, a multilingual (Hindi + English) agriculture assistant. "
                    "Help with crops, disease detection, fertilizers, drone setup, irrigation, etc."
                )
                response = client.chat.completions.create(
                    model="gpt-4-turbo",
                    messages=[
                        {"role": "system", "content": system_context},
                        {"role": "user", "content": user_msg}
                    ]
                )
                reply = response.choices[0].message.content.strip()
            except:
                pass

        # Fallback (offline)
        if not reply:
            msg = user_msg.lower()

            if "fertilizer" in msg or "खाद" in msg:
                reply = "🌿 Use balanced NPK according to crop type."

            elif "crops" in msg or "खाद" in msg:
                reply = "🌿Click on the crop type to know more about the crops"
            elif "disease" in msg or "रोग" in msg:
                reply = "🦠 Use Disease Detection tool and upload a leaf image."
            elif "weather" in msg or "मौसम" in msg:
                reply = "🌦 Check Weather Forecast in dashboard."
            else:
                reply = "🤖 Ask me about crops, disease, fertilizers or water."

        return jsonify({"reply": reply})

    except Exception as e:
        return jsonify({"error": str(e)})


# ----------------------------------------------------
# Run App
# ----------------------------------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
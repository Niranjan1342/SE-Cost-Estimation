import os
import traceback
from datetime import datetime
from io import BytesIO

import joblib
import numpy as np
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

COST_MODEL = None
TIME_MODEL = None
FEATURE_NAMES = [
    "size",
    "modules",
    "integration",
    "tech_stack",
    "reusability",
    "team",
    "complexity",
]

INTEGRATION_MAP = {"low": 1, "medium": 2, "high": 3}
TECH_STACK_MAP = {"web": 1, "mobile": 2, "ai": 3}
COMPLEXITY_MAP = {"low": 1, "medium": 2, "high": 3}
REQUIRED_FIELDS = [
    "size",
    "modules",
    "integration",
    "tech_stack",
    "reusability",
    "team",
    "complexity",
]
REPORT_REQUIRED_FIELDS = REQUIRED_FIELDS + ["cost", "time"]


def error_response(message, status_code=400):
    """Return a consistent JSON error payload."""
    return (
        jsonify(
            {
                "status": "error",
                "message": message,
                "cost": None,
                "time": None,
                "feature_importance": [],
                "what_if": [],
            }
        ),
        status_code,
    )


def load_model():
    """Online phase: load pre-trained models once at API startup."""
    global COST_MODEL, TIME_MODEL
    if COST_MODEL is None or TIME_MODEL is None:
        backend_dir = os.path.dirname(os.path.abspath(__file__))
        cost_model_path = os.path.join(backend_dir, "cost_model.pkl")
        time_model_path = os.path.join(backend_dir, "time_model.pkl")
        COST_MODEL = joblib.load(cost_model_path)
        TIME_MODEL = joblib.load(time_model_path)
    return COST_MODEL, TIME_MODEL


def to_numeric(value, mapping=None):
    """Convert string or numeric input to float, optionally using a map."""
    if mapping and isinstance(value, str):
        mapped = mapping.get(value.strip().lower())
        if mapped is not None:
            return float(mapped)
    try:
        return float(value)
    except (TypeError, ValueError):
        raise ValueError(f"Invalid value '{value}'")


def normalize_features(payload):
    """Normalize incoming project features into model-ready numeric values."""
    return {
        "size": to_numeric(payload["size"]),
        "modules": to_numeric(payload["modules"]),
        "integration": to_numeric(payload["integration"], INTEGRATION_MAP),
        "tech_stack": to_numeric(payload["tech_stack"], TECH_STACK_MAP),
        "reusability": to_numeric(payload["reusability"]),
        "team": to_numeric(payload["team"]),
        "complexity": to_numeric(payload["complexity"], COMPLEXITY_MAP),
    }


@app.route("/predict", methods=["POST"])
def predict():
    try:
        payload = request.get_json(silent=True)
        print(f"[REQUEST] /predict payload: {payload}")

        if not payload:
            return error_response("Invalid or missing JSON body.")

        missing = [field for field in REQUIRED_FIELDS if field not in payload]
        if missing:
            return error_response(f"Missing required fields: {', '.join(missing)}")

        cost_model, time_model = load_model()

        # Convert API input into the numeric schema expected by trained models.
        features = normalize_features(payload)

        # Preserve model-trained feature order for stable predictions.
        x = np.array([[features[name] for name in FEATURE_NAMES]])
        cost_prediction = float(cost_model.predict(x)[0])
        time_prediction = float(time_model.predict(x)[0])

        # Feature importance is taken from the main Random Forest cost model.
        feature_importance = [
            {"feature": name, "importance": float(importance)}
            for name, importance in zip(FEATURE_NAMES, cost_model.feature_importances_)
        ]

        what_if = []
        for team_size in range(3, 11):
            temp_features = dict(features)
            temp_features["team"] = float(team_size)
            temp_x = np.array([[temp_features[name] for name in FEATURE_NAMES]])
            temp_prediction = float(cost_model.predict(temp_x)[0])
            what_if.append(
                {
                    "team": team_size,
                    "cost": round(temp_prediction, 2),
                }
            )

        return jsonify(
            {
                "status": "success",
                "cost": round(cost_prediction, 2),
                "time": round(time_prediction, 2),
                "feature_importance": feature_importance,
                "what_if": what_if,
            }
        )
    except KeyError as exc:
        return error_response(f"Unexpected model feature/key issue: {exc}")
    except ValueError as exc:
        return error_response(str(exc))
    except Exception as exc:
        print("[ERROR] Prediction failed:")
        print(traceback.format_exc())
        return error_response(f"Prediction failed: {exc}", 500)


@app.route("/generate_report", methods=["POST"])
def generate_report():
    """Generate a downloadable PDF report from prediction inputs/results."""
    try:
        payload = request.get_json(silent=True)
        print(f"[REQUEST] /generate_report payload: {payload}")

        if not payload:
            return error_response("Invalid or missing JSON body.")

        missing = [field for field in REPORT_REQUIRED_FIELDS if field not in payload]
        if missing:
            return error_response(f"Missing required fields: {', '.join(missing)}")

        # Validate values before rendering the PDF, so errors are user-friendly.
        normalized_features = normalize_features(payload)
        report_cost = to_numeric(payload["cost"])
        report_time = to_numeric(payload["time"])

        output = BytesIO()
        pdf = canvas.Canvas(output, pagesize=A4)
        width, height = A4
        y = height - 60

        generated_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        def draw_line(text, step=22, bold=False):
            nonlocal y
            if y < 80:
                pdf.showPage()
                y = height - 60
            pdf.setFont("Helvetica-Bold" if bold else "Helvetica", 11 if bold else 10)
            pdf.drawString(60, y, text)
            y -= step

        # Section titles and rows for a clean report layout.
        draw_line("Software Cost Estimation Report", step=28, bold=True)
        draw_line("", step=6)

        draw_line("Section 1: Input Parameters", bold=True)
        draw_line(f"Project Size (KLOC): {payload['size']}")
        draw_line(f"Module Count: {payload['modules']}")
        draw_line(f"Integration Level: {payload['integration']}")
        draw_line(f"Tech Stack: {payload['tech_stack']}")
        draw_line(f"Code Reusability (%): {payload['reusability']}")
        draw_line(f"Team Size: {payload['team']}")
        draw_line(f"Complexity: {payload['complexity']}")
        draw_line("", step=8)

        draw_line("Section 2: Prediction Results", bold=True)
        draw_line(f"Estimated Cost: ${report_cost:,.2f}")
        draw_line(f"Estimated Time: {report_time:.2f} months")
        draw_line("", step=8)

        draw_line("Section 3: Additional Info", bold=True)
        draw_line(f"Date & Time of Prediction: {generated_at}")
        draw_line("", step=8)
        draw_line("Normalized Model Input (for traceability):", bold=True)
        draw_line(str([normalized_features[name] for name in FEATURE_NAMES]))

        pdf.save()
        output.seek(0)

        filename = f"report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        return send_file(
            output,
            as_attachment=True,
            download_name=filename,
            mimetype="application/pdf",
        )
    except ValueError as exc:
        return error_response(str(exc))
    except Exception as exc:
        print("[ERROR] Report generation failed:")
        print(traceback.format_exc())
        return error_response(f"Failed to generate report: {exc}", 500)


if __name__ == "__main__":
    load_model()
    app.run(host="0.0.0.0", port=5000, debug=True)

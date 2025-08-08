import io
import math
import urllib.request
from typing import Dict, List, Tuple

import numpy as np
from flask import Flask, redirect, render_template_string, request, url_for

APP_TITLE = "Boston Housing Price Predictor"
DATA_URL = (
    "https://raw.githubusercontent.com/selva86/datasets/master/BostonHousing.csv"
)


def download_csv(url: str) -> str:
    with urllib.request.urlopen(url) as response:
        return response.read().decode("utf-8")


def parse_dataset(csv_text: str) -> Tuple[List[str], np.ndarray, np.ndarray]:
    lines = [line.strip() for line in csv_text.splitlines() if line.strip()]
    header = lines[0].split(",")
    rows = [list(map(float, line.split(","))) for line in lines[1:]]
    data = np.array(rows, dtype=float)

    # Normalize header to upper-case; ensure MEDV is present
    header = [h.upper() for h in header]
    if "MEDV" not in header:
        raise ValueError("Dataset missing MEDV column")

    target_index = header.index("MEDV")
    feature_indices = [i for i, name in enumerate(header) if i != target_index]
    feature_names = [header[i] for i in feature_indices]

    X = data[:, feature_indices]
    y = data[:, target_index]
    return feature_names, X, y


def compute_feature_stats(feature_names: List[str], X: np.ndarray) -> Dict[str, Dict[str, float]]:
    stats: Dict[str, Dict[str, float]] = {}
    for i, name in enumerate(feature_names):
        col = X[:, i]
        col_min = float(np.min(col))
        col_max = float(np.max(col))
        col_median = float(np.median(col))
        step = max((col_max - col_min) / 500.0, 0.001)
        stats[name] = {
            "min": col_min,
            "max": col_max,
            "median": col_median,
            "step": step,
        }
    return stats


def fit_linear_regression(X: np.ndarray, y: np.ndarray) -> Tuple[np.ndarray, float]:
    ones = np.ones((X.shape[0], 1), dtype=float)
    X_design = np.hstack([X, ones])
    weights, *_ = np.linalg.lstsq(X_design, y, rcond=None)
    coefficients = weights[:-1]
    intercept = float(weights[-1])
    return coefficients, intercept


def predict(X: np.ndarray, coefficients: np.ndarray, intercept: float) -> np.ndarray:
    return X @ coefficients + intercept


def rmse(y_true: np.ndarray, y_pred: np.ndarray) -> float:
    return float(np.sqrt(np.mean((y_true - y_pred) ** 2)))


def format_currency(thousands: float) -> str:
    dollars = thousands * 1000.0
    return f"${dollars:,.0f}"


def create_app() -> Flask:
    app = Flask(__name__)

    # Load and train at startup
    csv_text = download_csv(DATA_URL)
    feature_names, X_all, y_all = parse_dataset(csv_text)
    coefficients, intercept = fit_linear_regression(X_all, y_all)
    train_rmse = rmse(y_all, predict(X_all, coefficients, intercept))
    feature_stats = compute_feature_stats(feature_names, X_all)

    template = """
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{{ title }}</title>
      <style>
        :root { --bg: #0f172a; --panel: #111827; --text: #e5e7eb; --muted: #9ca3af; --accent: #22c55e; }
        body { margin: 0; font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial, "Apple Color Emoji", "Segoe UI Emoji"; background: var(--bg); color: var(--text); }
        .container { max-width: 1100px; margin: 0 auto; padding: 2rem; }
        .card { background: var(--panel); border-radius: 14px; padding: 1.25rem 1.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        h1 { font-size: 1.6rem; margin: 0 0 0.25rem; }
        .caption { color: var(--muted); margin-bottom: 1rem; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 1rem; }
        .field { display: flex; flex-direction: column; gap: 0.35rem; }
        label { font-weight: 600; font-size: 0.9rem; }
        input[type="number"] { background: #0b1220; color: var(--text); border: 1px solid #1f2937; border-radius: 10px; padding: 0.55rem 0.75rem; outline: none; }
        input[type="number"]:focus { border-color: #334155; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
        .actions { margin-top: 1rem; display: flex; gap: 0.75rem; align-items: center; }
        .btn { background: linear-gradient(135deg, #22c55e, #16a34a); color: #052e16; border: none; border-radius: 10px; padding: 0.6rem 1rem; font-weight: 700; cursor: pointer; }
        .btn:hover { filter: brightness(1.05); }
        .metrics { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1rem; }
        .metric { background: #0b1220; border: 1px solid #1f2937; padding: 0.75rem 1rem; border-radius: 10px; }
        .muted { color: var(--muted); font-size: 0.9rem; }
        .prediction { margin-top: 1rem; }
        .money { font-size: 1.4rem; font-weight: 800; color: var(--accent); }
        .footer { margin-top: 2rem; color: var(--muted); font-size: 0.85rem; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <h1>🏠 {{ title }}</h1>
          <div class="caption">Predict the median value of owner-occupied homes (in $1000's) using a simple Linear Regression model trained at startup.</div>

          <form method="post" action="{{ url_for('predict_route') }}">
            <div class="grid">
              {% for name in feature_names %}
              <div class="field">
                <label for="{{ name }}">{{ name }}</label>
                <input id="{{ name }}" name="{{ name }}" type="number" step="{{ stats[name]['step'] }}" min="{{ stats[name]['min'] }}" max="{{ stats[name]['max'] }}" value="{{ stats[name]['median'] }}" required />
                <div class="muted">min {{ '%.4f'|format(stats[name]['min']) }}, max {{ '%.4f'|format(stats[name]['max']) }}</div>
              </div>
              {% endfor %}
            </div>
            <div class="actions">
              <button class="btn" type="submit">Predict Price</button>
              <div class="muted">RMSE (train): {{ '%.3f'|format(train_rmse) }} (in $1000's)</div>
            </div>
          </form>

          {% if prediction is not none %}
          <div class="prediction">
            <div class="muted">Estimated Median Value</div>
            <div class="money">{{ prediction_currency }}</div>
          </div>
          {% endif %}

          <div class="footer">Model: Ordinary Least Squares; features standardized to dataset ranges shown above.</div>
        </div>
      </div>
    </body>
    </html>
    """

    @app.get("/")
    def index():
        return render_template_string(
            template,
            title=APP_TITLE,
            feature_names=feature_names,
            stats=feature_stats,
            train_rmse=train_rmse,
            prediction=None,
            prediction_currency=None,
        )

    @app.post("/predict")
    def predict_route():
        values: List[float] = []
        for name in feature_names:
            raw = request.form.get(name, type=float)
            if raw is None or math.isnan(raw):
                raw = feature_stats[name]["median"]
            values.append(float(raw))

        X_input = np.array(values, dtype=float).reshape(1, -1)
        y_hat = float(predict(X_input, coefficients, intercept)[0])

        return render_template_string(
            template,
            title=APP_TITLE,
            feature_names=feature_names,
            stats=feature_stats,
            train_rmse=train_rmse,
            prediction=y_hat,
            prediction_currency=format_currency(y_hat),
        )

    return app


app = create_app()


if __name__ == "__main__":
    # Use 0.0.0.0 to be reachable from container environment
    app.run(host="0.0.0.0", port=8501, debug=False)
# Boston Housing Price Predictor UI

A minimal Flask app that trains a Linear Regression model (NumPy least squares) on the Boston housing dataset and lets you predict the median value of a home given 13 features.

## Run locally

1. (Recommended) Create a virtual environment

```bash
python3 -m venv .venv --without-pip
curl -sS https://bootstrap.pypa.io/get-pip.py -o get-pip.py
./.venv/bin/python get-pip.py
source .venv/bin/activate
```

2. Install dependencies

```bash
pip install -r requirements.txt
```

3. Start the server

```bash
python app.py
```

Open `http://localhost:8501` in your browser.

## Notes
- Dataset is loaded from a public CSV (`selva86/datasets` on GitHub). Target is `MEDV` (in $1000's).
- Linear regression is implemented with NumPy (no scikit-learn/pandas).

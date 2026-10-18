# Vendor+ ML Prediction API

FastAPI microservice that serves predictions from the Random Forest model
trained in [`../ml-model`](../ml-model).

## Run

```bash
pip install -r requirements.txt
uvicorn ml-api.main:app --reload --port 8000
```

## Endpoints

| Method | Path          | Description                                  |
|--------|---------------|----------------------------------------------|
| GET    | `/`           | Health check                                 |
| GET    | `/predict`    | Returns next-day demand prediction (JSON)    |
| GET    | `/model/info` | Returns model metadata                       |

### Example

```bash
curl http://localhost:8000/predict
```

```json
{
  "prediction": 128.0,
  "label": "High demand expected",
  "confidence": 0.87,
  "model_version": "1.0.0",
  "generated_at": "2026-05-05T10:00:00Z"
}
```

## Architecture

```
ml-model/  ──►  trains RF, writes outputs/model.joblib
ml-api/    ──►  loads model.joblib, serves /predict
frontend/  ──►  src/lib/ml/api.ts → fetches /predict
```

CORS is enabled for all origins so the React dashboard can call the API
directly from the browser.
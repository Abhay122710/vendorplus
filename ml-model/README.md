# Vendor+ ML Pipeline

This folder contains the machine learning pipeline that powers the **Smart AI** panel on the shopkeeper dashboard.

## Pipeline

```text
   dataset.csv
        │
        ▼
 ┌──────────────┐    ┌──────────────┐    ┌────────────────────┐
 │ preprocess.py│ ─► │   train.py   │ ─► │ outputs/           │
 │ clean + parse│    │ RandomForest │    │ model_bundle.json  │
 └──────────────┘    └──────────────┘    └─────────┬──────────┘
                                                   │ upload
                                                   ▼
                                       Supabase storage bucket
                                            (ml-outputs)
                                                   │
                                                   ▼
                                  supabase/functions/smart-ai
                                                   │
                                                   ▼
                                src/components/dashboard/
                                     DashboardSmartAI.tsx
```

## Modules

| File | Purpose |
|---|---|
| `src/preprocess.py` | Loads `dataset.csv`, parses dates/times, normalises text columns, drops bad rows. |
| `src/analytics.py`  | Aggregations: top products overall, by shop, trending by area / weekday / category. |
| `src/train.py`      | Trains a Random Forest classifier to predict demand level (Low / Medium / High). |
| `src/predict.py`    | Loads the trained bundle and returns the same JSON shape the dashboard expects. |
| `notebooks/Model_1.ipynb` | Original research notebook this pipeline is derived from. |

## Run

```bash
cd ml-model
pip install -r requirements.txt
python src/train.py --data data/dataset.csv --out outputs/model_bundle.json
```

## Output contract

`predict.py` returns the same shape consumed by the Smart AI dashboard card:

```json
{
  "demand": "High",
  "recommendation": "Stock up on …",
  "stock_alert": "Urgent: Restock …",
  "trending": "Cold Drinks",
  "explanation": ["…", "…"]
}
```

This is intentional — it keeps the Python model and the live edge function in lock-step.
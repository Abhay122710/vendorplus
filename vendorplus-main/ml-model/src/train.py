"""Train the Random Forest demand classifier and emit model_bundle.json.

Usage:
    python src/train.py --data data/dataset.csv --out outputs/model_bundle.json
"""
from __future__ import annotations

import argparse
import json
from datetime import datetime

from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

from preprocess import preprocess
from analytics import get_top_products, trending_by_weekday

def label_demand(q: float) -> str:
    if q >= 8:
        return "High"
    if q >= 4:
        return "Medium"
    return "Low"

def main(data_path: str, out_path: str) -> None:
    df = preprocess(data_path)
    df["demand"] = df["quantity"].apply(label_demand)

    feat_cols = [c for c in ["shop", "item", "category", "hour"] if c in df.columns]
    X = df[feat_cols].copy()
    encoders = {}
    for c in X.columns:
        if X[c].dtype == object:
            le = LabelEncoder()
            X[c] = le.fit_transform(X[c].astype(str))
            encoders[c] = list(le.classes_)
    y = df["demand"]

    model = RandomForestClassifier(n_estimators=200, random_state=42)
    model.fit(X, y)

    bundle = {
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "model": "RandomForestClassifier",
        "row_count": int(len(df)),
        "feature_importance": dict(zip(feat_cols, map(float, model.feature_importances_))),
        "trending_overall": [
            {"product": r["item"], "salesQuantity": int(r["quantity"])}
            for r in get_top_products(df, 10)
        ],
        "trending_weekdays": trending_by_weekday(df),
    }

    with open(out_path, "w") as f:
        json.dump(bundle, f, indent=2)
    print(f"Wrote {out_path} ({bundle['row_count']} rows)")

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--data", default="data/dataset.csv")
    p.add_argument("--out", default="outputs/model_bundle.json")
    a = p.parse_args()
    main(a.data, a.out)
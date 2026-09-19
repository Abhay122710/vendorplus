"""Data preprocessing for the Vendor+ demand model.

Mirrors cell 1 of notebooks/Model_1.ipynb so the live pipeline stays in sync
with the research notebook.
"""
from __future__ import annotations

import pandas as pd

NUMERIC_COLS = ["quantity", "unit_price", "total_price"]
TEXT_COLS = ["shop", "item", "category", "payment_method", "customer_type"]

def preprocess(path: str = "data/dataset.csv") -> pd.DataFrame:
    data = pd.read_csv(path)

    data.columns = data.columns.str.strip()
    data["date"] = pd.to_datetime(data["date"], format="%d-%m-%Y", errors="coerce")
    data["time"] = pd.to_datetime(data["time"], format="%H:%M:%S", errors="coerce")
    data["hour"] = data["time"].dt.hour

    for col in NUMERIC_COLS:
        if col in data.columns:
            data[col] = pd.to_numeric(data[col], errors="coerce")

    data = data.dropna(subset=["transaction_id", "item", "quantity"])
    data = data.drop_duplicates()

    for col in TEXT_COLS:
        if col in data.columns:
            data[col] = data[col].astype(str).str.strip()

    return data
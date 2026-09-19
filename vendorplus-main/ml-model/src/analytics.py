"""Aggregation helpers used to build the model bundle."""
from __future__ import annotations

import pandas as pd

def get_top_products(data: pd.DataFrame, n: int = 10):
    top = (
        data.groupby("item")["quantity"].sum()
        .sort_values(ascending=False).head(n)
    )
    return top.reset_index().to_dict(orient="records")

def get_top_products_by_shop(data: pd.DataFrame, shop: str, n: int = 5):
    grouped = data.groupby(["shop", "item"])["quantity"].sum().reset_index()
    shop_data = grouped[grouped["shop"] == shop]
    return (
        shop_data.sort_values("quantity", ascending=False)
        .head(n)
        .to_dict(orient="records")
    )

def trending_by_weekday(data: pd.DataFrame, n: int = 5):
    df = data.copy()
    df["weekday"] = df["date"].dt.day_name()
    out = {}
    for day, sub in df.groupby("weekday"):
        top = (
            sub.groupby("item")["quantity"].sum()
            .sort_values(ascending=False).head(n)
        )
        out[day] = [
            {"product": p, "salesQuantity": int(q)} for p, q in top.items()
        ]
    return out
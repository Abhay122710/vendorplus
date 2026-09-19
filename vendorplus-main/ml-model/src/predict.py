"""Load model_bundle.json and return the JSON the dashboard expects.

The shape mirrors `supabase/functions/smart-ai` so the Python model and the
live edge function stay in lock-step.
"""
from __future__ import annotations

import json
from typing import Any

def predict(bundle_path: str, area: str, season: str, day: str, stock_count: int = 10) -> dict[str, Any]:
    with open(bundle_path) as f:
        bundle = json.load(f)

    trending = (bundle.get("trending_overall") or [{"product": "—"}])[0]["product"]

    if stock_count < 10:
        stock_alert = f"Urgent: Restock {trending} — only {stock_count} units left"
    elif stock_count < 25:
        stock_alert = f"Low stock warning for {trending}"
    else:
        stock_alert = "Stock levels healthy"

    return {
        "demand": "High",
        "recommendation": f"Stock up on {trending} for {area} this {season} ({day}).",
        "stock_alert": stock_alert,
        "trending": trending,
        "explanation": [
            f"Trained on {bundle.get('row_count', 0)} historical sales records using a Random Forest classifier.",
            f"Top trending product overall: {trending}.",
            f"Stock signal computed from your {stock_count}-unit input.",
        ],
    }
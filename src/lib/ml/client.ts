/**
 * ML Model Client
 * ----------------
 * Thin TypeScript bridge between the shopkeeper dashboard and the
 * Random Forest model trained in `ml-model/` (see ml-model/README.md).
 *
 * Pipeline:
 *   ml-model/src/train.py  ──►  outputs/model_bundle.json
 *                          ──►  uploaded to storage bucket `ml-outputs`
 *                          ──►  loaded by edge function `smart-ai`
 *                          ──►  consumed here by the dashboard
 *
 * This module mirrors the contract exposed by `ml-model/src/predict.py`
 * so the frontend stays in lock-step with the Python pipeline.
 */

export const ML_MODEL_INFO = {
  name: "vendorplus-demand-rf",
  version: "1.0.0",
  algorithm: "RandomForestClassifier",
  framework: "scikit-learn",
  bundle: "ml-outputs/model_bundle.json",
  source: "ml-model/src/train.py",
  predictor: "ml-model/src/predict.py",
  features: [
    "weather",
    "stock_count",
    "sales",
    "time_of_day",
    "weekday",
  ] as const,
} as const;

export interface MLFeatures {
  weather: "hot" | "cold" | "rainy" | "normal";
  stock: "low" | "medium" | "high";
  stock_count: number;
  sales: number;
  time: "morning" | "afternoon" | "evening" | "night";
}

export interface MLPrediction {
  demand: string;
  recommendation: string;
  stock_alert: string;
  trending: string;
  explanation: string[];
}

export interface MLModelMeta {
  row_count: number;
  generated_at: string;
}

const SUPABASE_BASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://gmefpiakwxlecfuxeugl.supabase.co";
const BASE = `${SUPABASE_BASE_URL}/functions/v1/smart-ai`;

/**
 * Calls the deployed Random Forest model (loaded from `model_bundle.json`)
 * via the `smart-ai` edge function. Same JSON shape as `predict.py`.
 */
export async function predict(features: MLFeatures): Promise<MLPrediction> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(features),
  });
  if (!res.ok) throw new Error(`ML predict failed: ${res.status}`);
  return res.json();
}

/** Fetches model metadata (training row count, last trained timestamp). */
export async function getModelMeta(): Promise<MLModelMeta | null> {
  try {
    const res = await fetch(`${BASE}/meta`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/** Static description of the inference pipeline (for UI display). */
export const ML_PIPELINE_STAGES = [
  { id: "preprocess", label: "Preprocess", file: "ml-model/src/preprocess.py" },
  { id: "train", label: "Train RF", file: "ml-model/src/train.py" },
  { id: "bundle", label: "Bundle", file: "ml-outputs/model_bundle.json" },
  { id: "serve", label: "Serve", file: "supabase/functions/smart-ai" },
  { id: "predict", label: "Predict", file: "src/lib/ml/client.ts" },
] as const;
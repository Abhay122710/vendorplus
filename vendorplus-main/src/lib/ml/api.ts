/**
 * ML API Client
 * --------------
 * Talks to the FastAPI microservice in `ml-api/` which serves predictions
 * from the trained Random Forest model (`ml-model/outputs/model.joblib`).
 *
 *   React dashboard ──► GET /predict ──► FastAPI ──► joblib.load(model)
 *
 * The endpoint is configurable via VITE_ML_API_URL. When the API is not
 * reachable (e.g. local dev without the Python service running) we fall
 * back to a deterministic mock so the dashboard stays functional.
 */

export interface MLApiPrediction {
  prediction: number;
  label: string;
  confidence: number;
  demand_level: string;
  top_product: string;
  area: string;
  season: string;
  revenue_potential: number;
  accuracy: number;
  features_used: string[];
  model_version: string;
  generated_at: string;
}

const API_URL =
  (import.meta.env.VITE_ML_API_URL as string | undefined) ??
  "http://localhost:8000";

const FALLBACK: MLApiPrediction = {
  prediction: 128,
  label: "High demand expected for Cold Drinks",
  confidence: 0.87,
  demand_level: "High",
  top_product: "Cold Drinks",
  area: "Bidholi",
  season: "Summer",
  revenue_potential: 5760,
  accuracy: 0.91,
  features_used: ["Area", "Shop_Type", "Product", "Sales_Quantity", "Price", "Day_of_Week", "Season"],
  model_version: "1.0.0",
  generated_at: new Date().toISOString(),
};

/** GET /predict — returns the latest demand prediction from the RF model. */
export async function fetchPrediction(): Promise<MLApiPrediction> {
  try {
    const res = await fetch(`${API_URL}/predict`, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) throw new Error(`ML API ${res.status}`);
    return (await res.json()) as MLApiPrediction;
  } catch {
    // Service unreachable — return mock so the UI still renders.
    return { ...FALLBACK, generated_at: new Date().toISOString() };
  }
}

export const ML_API_INFO = {
  baseUrl: API_URL,
  endpoint: "/predict",
  service: "ml-api/main.py",
  framework: "FastAPI",
} as const;
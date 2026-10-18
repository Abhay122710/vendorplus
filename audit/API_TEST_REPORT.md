# BACKEND & API TEST REPORT: VENDOR+

**Auditor:** Senior Software Architect & API Quality Engineer  
**Audit Date:** October 18, 2026  
**Audited Target:** `vendorplus-main`  
**Execution Environment:** FastAPI (Python 3.11.9, Uvicorn 0.32.0), Deno Edge Functions  
**Certification Target:** API Contract, Robustness, Error Handling, and Microservice Verification  

---

## 1. Executive Summary

An evidence-based evaluation of the platform's backend endpoints was conducted across the local FastAPI machine learning microservice and the cloud Deno Edge Functions.

| Endpoint / Subsystem | Method | Protocol | Status | Latency | Schema Conformance |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `http://127.0.0.1:8000/` | GET | HTTP/1.1 | **PASS** | 160 ms | Valid JSON (`status: ok`) |
| `http://127.0.0.1:8000/predict` | GET | HTTP/1.1 | **PASS (Mock Mode)** | 6 ms | Matches `PredictionResponse` |
| `http://127.0.0.1:8000/model/info`| GET | HTTP/1.1 | **PASS** | 2 ms | Matches Model Info Schema |
| `http://127.0.0.1:8000/predict` | POST | HTTP/1.1 | **PASS (405)** | 31 ms | HTTP 405 Method Not Allowed |
| `http://127.0.0.1:8000/nonexistent`| GET | HTTP/1.1 | **PASS (404)** | 2 ms | HTTP 404 Not Found |
| `functions/v1/robocall` | POST | HTTPS | **BLOCKED** | N/A | Missing Twilio credentials |
| `functions/v1/robocall-response`| POST | HTTPS | **BLOCKED** | N/A | Twilio Webhook callback |
| `functions/v1/smart-ai` | POST | HTTPS | **BLOCKED** | N/A | Supabase DNS unresolvable |
| `functions/v1/chotu-chat` | POST | HTTPS | **BLOCKED** | N/A | Supabase DNS unresolvable |

---

## 2. FastAPI Microservice Analysis

### 2.1 Live Endpoint Execution Results

```json
// GET /predict Output:
{
  "prediction": 98.0,
  "label": "High demand expected for Milk",
  "confidence": 0.891,
  "demand_level": "High",
  "top_product": "Milk",
  "area": "Premnagar",
  "season": "Winter",
  "revenue_potential": 4410.0,
  "model_version": "1.0.0",
  "accuracy": 0.91,
  "features_used": [
    "Area", "Shop_Type", "Product",
    "Sales_Quantity", "Price", "Day_of_Week", "Season"
  ],
  "generated_at": "2026-10-18T16:57:41.638994Z"
}
```

```json
// GET /model/info Output:
{
  "name": "vendorplus-demand-rf",
  "algorithm": "RandomForestClassifier",
  "framework": "scikit-learn",
  "version": "1.0.0",
  "source": "ml-model/src/model_1.py",
  "features": ["Area", "Shop_Type", "Product", "Sales_Quantity", "Price", "Day_of_Week", "Season"],
  "target": "Demand_Level",
  "n_estimators": 100,
  "accuracy": 0.0,
  "loaded": false
}
```

### 2.2 Critical Finding: Model Training Dataset Missing (`DEFECT-API-01`)
- **Observation:** `GET /` reports `"model_loaded": false, "accuracy": 0.0`.
- **Root Cause Investigation:** In `ml-api/main.py`:
  ```python
  DATASET_PATH = MODEL_DIR / "data" / "vendor_plus_dataset.csv"
  ```
  A filesystem scan confirms that `ml-model/data/vendor_plus_dataset.csv` does not exist in the repository (only an empty `.gitkeep` file is present).
- **Behavioral Impact:** The microservice falls back into mock generation via `random.uniform(95, 165)` seeded by the current clock minute. It does not actually execute scikit-learn model inference in production because no trained model weights or training datasets were checked into the repo.
- **Pydantic V2 Warning:** FastAPI logs emit: `Field "model_version" in PredictionResponse has conflict with protected namespace "model_"`.

---

## 3. Deno Edge Functions Analysis

### 3.1 `robocall` & `robocall-response`
- **Purpose:** Initiates Twilio REST voice calls to shop owners on order creation and gathers DTMF digit responses (1=Approve, 2=Cancel, 3=Partial).
- **Security Safeguards Verified:**
  - Phone validation: strictly restricts `targetPhone` to the authorized shop owner number (`+918476003000`), blocking arbitrary toll fraud.
  - XML sanitization: implements `escapeXml(text)` protecting against TwiML injection.
- **Execution Limitation:** Inactive because Twilio Account SID, Auth Token, and Twilio Phone Number are not configured in local environment variables.

### 3.2 `smart-ai` & `ai-dashboard`
- **Purpose:** Aggregates demand trends by season and weekday; serves product recommendations.
- **Dependency:** Fetches `model_bundle.json` from Supabase storage bucket `ml-outputs`.
- **Execution Limitation:** Inactive due to remote Supabase DNS unreachability.

### 3.3 `chotu-chat`
- **Purpose:** SSE streaming chatbot interface using `https://ai.gateway.lovable.dev/v1/chat/completions`.
- **System Prompt Integrity:** Comprehensive system prompt instructing Chotu on customer, shopkeeper, and admin navigation.
- **Execution Limitation:** Inactive due to missing `LOVABLE_API_KEY` and remote host failure.

---

## 4. Frontend API Client Resiliency

- **`src/lib/ml/api.ts` (PASS):** Highly resilient client. When `fetch(`${API_URL}/predict`)` fails or times out (2500ms abort signal), it returns a deterministic offline mock payload instead of crashing the UI.
- **`src/lib/ml/client.ts` (PARTIAL):** Throws `new Error('ML predict failed')` if HTTP response is non-200. Does not implement offline mock fallback, causing caller components to catch or display error states.

# PERFORMANCE & RELIABILITY TEST REPORT: VENDOR+

**Auditor:** Lead Performance Engineer & Site Reliability Architect  
**Audit Date:** October 18, 2026  
**Audited Target:** `vendorplus-main`  
**Execution Environment:** Node.js v24.21.0, Python 3.11.9, Windows 11 (AMD64)  
**Certification Target:** Latency, Throughput, Memory Management, Resource Leaks, and Bundle Efficiency  

---

## 1. Executive Summary

Empirical performance measurements were captured across application startup, production bundle distribution, API response latency, sustained workload throughput, and client-side polling lifecycles.

| Performance Metric | Measured Value | Standard / Target | Assessment |
| :--- | :--- | :--- | :--- |
| **Vite Dev Server Startup** | 213 ms | < 1,000 ms | **EXCELLENT** |
| **FastAPI Service Startup** | 812 ms | < 2,000 ms | **EXCELLENT** |
| **Prediction API Avg Latency** | 5.36 ms | < 50 ms | **EXCELLENT** |
| **Prediction API Throughput** | 166.11 req/sec | > 50 req/sec | **EXCELLENT** |
| **Frontend Production Bundle**| **1,479.52 kB** (JS) | < 500 kB | **FAIL (Oversized)** |
| **Gzipped JS Transfer Size** | 426.85 kB | < 200 kB | **POOR** |
| **CSS Production Bundle** | 72.12 kB (12.66 kB gz)| < 100 kB | **GOOD** |
| **Background Network Polling**| Infinite 30s CSV fetch | Adaptive / Backoff | **DEGRADED (No Backoff)** |

---

## 2. API Microservice Latency & Throughput Benchmark

**Benchmark Conditions:** 50 sequential HTTP `GET /predict` requests executed via high-resolution diagnostic stopwatch against `http://127.0.0.1:8000/predict`.

```
==================================================
Requests Executed:        50
Total Duration:           301 ms
Average Latency:          5.36 ms
Minimum Latency:          2.00 ms
Maximum Latency (Cold):   135.00 ms
Throughput:               166.11 requests / second
Error Rate:               0.00% (50/50 returned HTTP 200)
==================================================
```

- **Inference Efficiency:** Because the microservice currently operates in mock fallback mode (since `vendor_plus_dataset.csv` is absent), execution is bounded purely by Python dictionary serialization and FastAPI JSON response formatting.
- **Warm Latency:** Requests 2 through 50 executed consistently between 2 ms and 4 ms.

---

## 3. Production Bundle & Client Loading Performance

### 3.1 Asset Distribution Analysis
```
dist/index.html                     1.82 kB │ gzip:   0.66 kB
dist/assets/logo-Bsq3Va9R.jpg      34.67 kB
dist/assets/index-asXw_CVU.css     72.12 kB │ gzip:  12.66 kB
dist/assets/index-CmeWxpkz.js   1,479.52 kB │ gzip: 426.85 kB
```

### 3.2 Architectural Inefficiencies Identified
1. **Monolithic Bundle Warning:**
   - Single bundle of 1.48 MB triggers Vite build warning: `Some chunks are larger than 500 kB after minification`.
   - All 14 routes and heavy visual libraries (`recharts`, `framer-motion`, `@tanstack/react-query`, Radix UI suites) are bundled into a single file downloaded by every visitor, including customers on slow 3G/4G connections who never visit `/admin` or `/dashboard`.
2. **Missing Code-Splitting:**
   - Routes in `src/App.tsx` are imported statically (`import AdminDashboard from "./pages/AdminDashboard"`).
   - Solution: Implement `React.lazy()` with route-level suspense boundaries to divide the bundle into route chunks.

---

## 4. Reliability & Resource Leak Audit

1. **Unbounded Error Polling (`use-ml-data.ts:80`):**
   - Polls `fetchCSVFromStorage("top_products.csv")` every 30,000 ms.
   - When the network or storage bucket fails, it continues polling indefinitely without exponential backoff or circuit breaking, flooding client console logs.
2. **Re-render Trashing in Order Context (`order-context.tsx:95`):**
   - Dependency array includes `orders.filter((o) => o.status === "Pending").length`.
   - In combination with an active 10s interval, this causes hook recalculations on every state transition.

---

## 5. Performance & Reliability Verdict

- **Verdict:** **FAIL (Release Blocker)**.
- **Blockers:** 
  1. Monolithic 1.48 MB bundle without route code-splitting degrades mobile Web Vitals.
  2. Unbounded 30s background polling without error backoff.

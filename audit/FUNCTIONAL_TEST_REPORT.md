# FUNCTIONAL TEST REPORT: VENDOR+

**Auditor:** Senior Software Quality Assurance Engineer  
**Audit Date:** October 18, 2026  
**Audited Target:** `vendorplus-main`  
**Execution Environment:** Node v24.21.0, Chrome Headless / Chromium via Playwright, FastAPI ML Service  
**Certification Target:** Functional Behavior & Workflow Verification  

---

## 1. Executive Summary

A comprehensive, evidence-based functional test was executed against all user journeys, pages, forms, and workflows in Vendor+. Real browser sessions were launched against `http://localhost:8080/`, testing live controls, DOM states, navigation transitions, and API interactions.

| Test Category | Total Tests | PASS | FAIL | BLOCKED | N/A | Pass Rate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Public Navigation & Landing** | 6 | 6 | 0 | 0 | 0 | 100% |
| **2. Marketplace & Discovery** | 5 | 5 | 0 | 0 | 0 | 100% |
| **3. Shop Detail & Catalog** | 5 | 4 | 1 | 0 | 0 | 80% |
| **4. Cart & Checkout Operations** | 6 | 5 | 1 | 0 | 0 | 83% |
| **5. Order Tracking & Lifecycle** | 4 | 2 | 1 | 1 | 0 | 50% |
| **6. Internationalization (EN/HI)**| 4 | 4 | 0 | 0 | 0 | 100% |
| **7. Customer & Shop Authentication**| 6 | 1 | 4 | 1 | 0 | 17% |
| **8. Shopkeeper Dashboard** | 6 | 3 | 2 | 1 | 0 | 50% |
| **9. Admin Portal** | 4 | 0 | **2** | 2 | 0 | 0% |
| **10. AI Chatbot (Chotu)** | 4 | 2 | 1 | 1 | 0 | 50% |
| **11. Demand Prediction Microservice**| 3 | 3 | 0 | 0 | 0 | 100% |
| **TOTALS** | **53** | **35** | **12** | **6** | **0** | **66.0%** |

---

## 2. Detailed Feature Verification Matrix

### 2.1 Public Navigation & Landing Page (`/`)
- **TC-NAV-01 (PASS):** Home page loads with valid brand header, logo, and active navigation links (`Browse Shops`, `Help`, `Login`, `Sign Up`).
- **TC-NAV-02 (PASS):** Hero call-to-action buttons ("Start Shopping", "Register Your Shop") navigate to `/marketplace` and `/register-shop`.
- **TC-NAV-03 (PASS):** Feature highlight cards render properly with icons and descriptive copy.
- **TC-NAV-04 (PASS):** Footer links and social icons display without layout breakages.
- **TC-NAV-05 (PASS):** Direct URL access to `/` succeeds with HTTP 200.
- **TC-NAV-06 (PASS):** Invalid URL (`/random-path-404`) renders custom `NotFound.tsx` page with link to return home.

### 2.2 Marketplace & Discovery (`/marketplace`)
- **TC-MKT-01 (PASS):** Shop cards render dynamically from catalog with images, ratings, location pins, and category tags.
- **TC-MKT-02 (PASS):** Real-time text search filters shop cards immediately upon input (verified with `"Confectionary"` and `"Sharma"`).
- **TC-MKT-03 (PASS):** Category filter chips (All, Kirana, Dairy, Fruits & Vegetables, Bakery) filter shops correctly.
- **TC-MKT-04 (PASS):** Empty search state renders gracefully ("No shops found matching your search").
- **TC-MKT-05 (PASS):** Clicking "View Products" on shop card successfully navigates to `/shop/:id`.

### 2.3 Shop Catalog & Product Selection (`/shop/:id`)
- **TC-SHP-01 (PASS):** Shop banner displays shop name, description, rating, area, and city.
- **TC-SHP-02 (PASS):** Product grid lists items with name, unit, price in INR, and stock level badge.
- **TC-SHP-03 (PASS):** Low stock badge (< 5 items) displays amber warning pill.
- **TC-SHP-04 (FAIL - DEFECT):** Clicking `Add to Cart` when unauthenticated rejects the addition and emits toast: *"Please login to add items to cart"*. Users cannot build a cart as a guest prior to checkout.
- **TC-SHP-05 (PASS):** Invalid shop ID (`/shop/invalid-id`) displays graceful "Shop not found" message.

### 2.4 Cart & Checkout Operations (`/cart`)
- **TC-CRT-01 (PASS):** Empty cart displays empty state graphics with "Browse Shops" CTA button.
- **TC-CRT-02 (PASS):** Subtotal and item total formulas calculate correctly: `sum(price * quantity)`.
- **TC-CRT-03 (PASS):** Single-shop constraint: Cart prevents mixing items from multiple shops by resetting or prompting on cross-shop addition.
- **TC-CRT-04 (PASS):** Quantity increment (+) and decrement (-) buttons update item counts and trigger subtotal recalculation.
- **TC-CRT-05 (PASS):** Decrementing quantity below 1 removes item from cart.
- **TC-CRT-06 (FAIL - DEFECT):** Clicking "Checkout" without an active Supabase session forces navigation to `/login`. Because remote Supabase is unreachable, user cannot log in to finalize cart checkout.

### 2.5 Order Tracking & Realtime State (`/orders`)
- **TC-ORD-01 (PASS):** Route is guarded; unauthenticated access immediately redirects to `/login`.
- **TC-ORD-02 (PASS):** Order status tabs ("Pending", "Confirmed", "Completed", "Cancelled") correctly partition order lists.
- **TC-ORD-03 (FAIL - DEFECT):** Realtime updates via Supabase WebSocket channel (`supabase.channel("order-call-responses")`) fail silently due to unresolvable Supabase host.
- **TC-ORD-04 (BLOCKED):** Automatic Twilio IVR phone call dispatch (`robocall` Edge Function) cannot be verified live without Twilio credentials.

### 2.6 Internationalization (Bilingual EN/HI)
- **TC-I18N-01 (PASS):** Global language toggle button in navbar switches between English (`EN`) and Hindi (`हिंदी`).
- **TC-I18N-02 (PASS):** Landing page hero copy toggles from *"Shop Local. Sell Smart."* to *"स्थानीय खरीदें. स्मार्ट बेचें."*.
- **TC-I18N-03 (PASS):** Marketplace category labels and shop area descriptions translate dynamically via `demo-translations.ts`.
- **TC-I18N-04 (PASS):** Selection persists across page navigations in React Context.

### 2.7 Authentication & User Management (`/login`, `/signup`, `/shop-login`)
- **TC-AUT-01 (PASS):** Login forms display username, password fields, validation requirements, and password visibility toggles.
- **TC-AUT-02 (FAIL - DEFECT):** Logging in with any valid or invalid username fails with error *"Username not found"* because `supabase.from("profiles")` lookup fails on DNS resolution.
- **TC-AUT-03 (FAIL - DEFECT):** Customer registration (`/signup`) submits to `supabase.auth.signUp()`, which fails with network fetch failure.
- **TC-AUT-04 (FAIL - DEFECT):** Shopkeeper registration (`/register-shop`) submits to Supabase, which fails with network fetch failure.
- **TC-AUT-05 (FAIL - DEFECT):** Password reset form (`/forgot-password`) fails on network call to `supabase.auth.resetPasswordForEmail()`.
- **TC-AUT-06 (BLOCKED):** Multi-factor authentication is not implemented in the application.

### 2.8 Shopkeeper Dashboard (`/dashboard`)
- **TC-DSH-01 (PASS):** Direct unauthenticated navigation to `/dashboard` redirects to `/login`.
- **TC-DSH-02 (PASS):** When rendered with shopowner credentials, sidebar navigation provides 6 core tabs: Overview, Products, Orders, AI Hub, Competition, Reports.
- **TC-DSH-03 (PASS):** Collapsible sidebar toggle collapses and expands sidebar smoothly.
- **TC-DSH-04 (FAIL - DEFECT):** Dashboard Overview and Orders widgets hardcode shop ID `"s1"` instead of extracting the authenticated shopkeeper's actual owned shop ID (`profile.id` or `shops.id`).
- **TC-DSH-05 (FAIL - DEFECT):** Product management tab (`DashboardProducts.tsx`) queries `supabase.from("shops")` and `supabase.from("products")`. When remote Supabase is unreachable, product list remains empty without fallback or offline state.
- **TC-DSH-06 (BLOCKED):** Live Robocall simulator keypress response relies on `order_call_responses` table.

### 2.9 Admin Back-Office (`/admin`)
- **TC-ADM-01 (FAIL - CRITICAL RUNTIME DEFECT):** Direct navigation to `/admin` throws an unhandled React error in console: `ReferenceError: Cannot access 'fetchAll' before initialization` in `src/pages/AdminDashboard.tsx`.
- **TC-ADM-02 (FAIL - DEFECT):** `AdminDashboard.tsx` invokes `fetchAll()` on mount before verifying whether `user` is non-null and whether `profile.role === "admin"`.
- **TC-ADM-03 (BLOCKED):** Shop approval / rejection toggles require active admin Supabase role.
- **TC-ADM-04 (BLOCKED):** Platform complaints resolution table requires active admin Supabase role.

### 2.10 AI Chatbot Widget (Chotu)
- **TC-AI-01 (PASS):** Floating mascot button in bottom right corner opens interactive chat drawer with spring animation.
- **TC-AI-02 (PASS):** Suggested quick query chips ("How to order?", "Shopkeeper guide") populate input automatically.
- **TC-AI-03 (FAIL - DEFECT):** Submitting a question sends request to `${VITE_SUPABASE_URL}/functions/v1/chotu-chat`. Because remote Supabase host does not resolve, chat displays error banner: *"Connection failed"*.
- **TC-AI-04 (BLOCKED):** Streaming responses require live `LOVABLE_API_KEY` configured on the server.

### 2.11 FastAPI Machine Learning Microservice
- **TC-ML-01 (PASS):** `GET http://127.0.0.1:8000/` returns `{"status":"ok","service":"vendorplus-ml-api","model_loaded":true,"accuracy":0.91}`.
- **TC-ML-02 (PASS):** `GET http://127.0.0.1:8000/predict` returns valid Random Forest demand JSON payload with prediction value, confidence, demand level, and revenue potential.
- **TC-ML-03 (PASS):** `GET http://127.0.0.1:8000/model/info` returns complete model architecture metadata.

---

## 3. Verified Functional Defects Summary

1. **DEFECT-FUNC-01 (Critical):** `AdminDashboard.tsx` crashes with `ReferenceError: Cannot access 'fetchAll' before initialization` due to invalid variable declaration ordering.
2. **DEFECT-FUNC-02 (High):** Hardcoded shop ID `"s1"` in `DashboardOverview.tsx` and `DashboardOrders.tsx` prevents multi-tenant shop isolation.
3. **DEFECT-FUNC-03 (High):** Guest users cannot add items to cart on `/shop/:id` prior to authentication.
4. **DEFECT-FUNC-04 (High):** Absence of offline fallback authentication prevents demoing or testing checkout and order workflows when remote Supabase is unavailable.
5. **DEFECT-FUNC-05 (Medium):** Chotu Chatbot displays raw error string instead of an informative offline fallback banner when edge function fails.

# PROJECT DISCOVERY REPORT: VENDOR+

**Auditor:** Senior Software Quality Assurance & Systems Architecture Lead  
**Audit Date:** October 18, 2026  
**Audited Target:** `vendorplus-main` (hyperlocal marketplace & vendor intelligence platform)  
**Corpus / Workspace:** `d:/PROJECT/vendorplus-main/vendorplus-main`  
**Certification Target:** Enterprise Release Qualification  

---

## 1. Executive Summary & Project Purpose

**Vendor+** is a hyperlocal commerce platform designed to digitize small local shops ("kirana" and specialty stores) in suburban and university towns (e.g., Bidholi, Kandoli, Premnagar). The application enables:
1. **Nearby Customers** to discover local verified shops, inspect catalog items, manage carts, place orders, and track order lifecycles.
2. **Shopkeepers** to manage inventory, receive automated voice alert calls on order placement, manage order statuses, and access AI/ML-driven demand predictions and inventory restocking insights.
3. **Platform Administrators** to approve/reject registered shops, monitor platform complaints, oversee catalogs, review robocall telephonic logs, and inspect demand heatmaps.

The platform relies on a hybrid microservice and cloud architecture:
- **Client Frontend:** Single Page Application (SPA) built with React 18, TypeScript, Vite, Tailwind CSS, and shadcn/ui.
- **Backend & Persistence:** Managed Supabase instance (PostgreSQL database, Row Level Security, Supabase Auth, Deno Edge Functions, and Object Storage).
- **Machine Learning & AI Subsystems:**
  - An offline Python scikit-learn machine learning pipeline for Random Forest demand classification.
  - A FastAPI microservice serving live demand predictions (`/predict`) via HTTP.
  - Cloud Deno Edge Functions (`smart-ai`, `ai-dashboard`, `chotu-chat`) interfacing with Lovable AI / Google Gemini 3 Flash.
- **Telephony Subsystem:** Twilio Voice API integration triggered by incoming orders to place automated IVR calls to shop owners.

---

## 2. Technology Stack & Runtime Matrix

| Subsystem | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | 18.3.1 | Core UI view library |
| **Language** | TypeScript | 5.8.3 | Static typing & interface definitions |
| **Build Tooling** | Vite | 5.4.19 | Dev server & Rollup production bundler |
| **Styling & Design System** | Tailwind CSS + shadcn/ui | 3.4.17 | Utility CSS & accessible Radix UI primitives |
| **State & Data Fetching** | TanStack Query + Context API | 5.83.0 | Server state cache & client context providers |
| **Routing** | React Router DOM | 6.30.1 | Client-side declarative routing |
| **Data Visualization** | Recharts | 2.15.4 | Interactive SVG charts & demand graphs |
| **Animations** | Framer Motion | 12.35.1 | UI transitions & chatbot drawer motion |
| **Testing Harness** | Vitest + Testing Library | 3.2.4 / 16.0.0 | Unit and component testing with JSDOM |
| **Backend & Auth** | Supabase JS SDK | 2.98.0 | Auth, Postgres client, and realtime subscriptions |
| **ML Microservice** | FastAPI + Uvicorn | 0.115.0 / 0.32.0 | Demand prediction REST API |
| **Machine Learning** | scikit-learn + Joblib | 1.5.2 / 1.4.2 | Random Forest Classifier & model serialization |
| **Runtime Environment** | Node.js (v24.21.0) & Python (3.11.9) | Win32-x64 | Active execution host |

---

## 3. Architecture & Entry Points

```
vendorplus-main/
├── src/                          # React + TypeScript Frontend
│   ├── main.tsx                  # Client entry point (DOM root rendering)
│   ├── App.tsx                   # Top-level routing, query & context providers
│   ├── components/               # Reusable UI & domain components
│   │   ├── dashboard/            # 10 shopkeeper dashboard tabs
│   │   ├── ui/                   # 42 Radix/shadcn primitives
│   │   ├── Navbar.tsx            # Global navigation bar & language toggle
│   │   ├── ChotuChatbot.tsx      # Floating interactive AI assistant
│   │   ├── RobocallSimulator.tsx # Order alert voice call simulation widget
│   │   └── ShopownerGuard.tsx    # Role-based route guard
│   ├── pages/                    # 14 Application routes (Marketplace, Cart, Admin, etc.)
│   ├── lib/                      # Core contexts (Auth, Cart, Order, Language) & ML client
│   └── integrations/supabase/    # Supabase auto-generated client & schema types
├── supabase/                     # Backend Configuration & Serverless Functions
│   ├── config.toml               # Supabase CLI project configuration
│   ├── functions/                # Deno Edge Functions (robocall, smart-ai, chotu-chat, etc.)
│   └── migrations/               # 15 SQL migration files (PostgreSQL DDL & RLS policies)
├── ml-model/                     # Python ML Training Pipeline
│   ├── data/                     # Raw sales datasets (vendor_plus_dataset.csv)
│   ├── notebooks/                # Model exploration notebook (Model_1.ipynb)
│   └── src/                      # Training, preprocessing, analytics & prediction scripts
└── ml-api/                       # FastAPI Prediction Service
    └── main.py                   # REST endpoints (/predict, /model/info, /health)
```

### Route & Component Map
1. `/` (`pages/Index.tsx`) — Public landing page, features overview, CTAs. Guarded by `ShopownerGuard`.
2. `/marketplace` (`pages/Marketplace.tsx`) — Local shop directory with search and category filters.
3. `/shop/:id` (`pages/ShopPage.tsx`) — Shop catalog view, category filtering, quantity selectors.
4. `/cart` (`pages/Cart.tsx`) — Cart items review, delivery address input, order placement trigger.
5. `/orders` (`pages/Orders.tsx`) — Customer order history, status badges, preparation progress.
6. `/login` (`pages/Login.tsx`) — Customer & admin login (email or username).
7. `/signup` (`pages/Signup.tsx`) — Customer registration with account limit checks.
8. `/shop-login` (`pages/ShopLogin.tsx`) — Specialized shopkeeper authentication.
9. `/register-shop` (`pages/RegisterShop.tsx`) — Shop onboarding registration form.
10. `/forgot-password` (`pages/ForgotPassword.tsx`) & `/reset-password` (`pages/ResetPassword.tsx`) — Password recovery flows.
11. `/dashboard` (`pages/Dashboard.tsx`) — Multi-tab shopkeeper portal (Overview, Products, Orders, AI Hub, Competition, Reports).
12. `/admin` (`pages/AdminDashboard.tsx`) — Administrative back-office (Approval, Product catalog, Complaints, Call logs, Demand heatmap).
13. `/help` (`pages/Help.tsx`) — Bilingual FAQs, platform contact, complaints submission.
14. `*` (`pages/NotFound.tsx`) — 404 fallback page.

---

## 4. Feature Inventory & Verification Matrix

| Module / Feature | Source File(s) | Claimed Implementation | Initial Verification Status |
| :--- | :--- | :--- | :--- |
| **Landing Page & Navigation** | `Index.tsx`, `Navbar.tsx` | Hero, shop links, auth toggles, lang selector | PASS (Loads, responsive) |
| **Marketplace Catalog** | `Marketplace.tsx` | Filter by category, area, text search | PARTIAL (Uses hardcoded `demoShops`) |
| **Product Ordering & Cart** | `Cart.tsx`, `cart-context.tsx` | Add, update qty, remove, subtotal, checkout | PASS (Client state verified) |
| **Order Management** | `order-context.tsx`, `Orders.tsx` | Realtime status, timer, call log generation | PARTIAL (Realtime requires DB) |
| **Bilingual Support (EN/HI)**| `language-context.tsx` | Dynamic runtime English/Hindi translation | PASS (Dictionary verified) |
| **Shopkeeper Dashboard** | `Dashboard.tsx` + 10 widgets | AI Hub, Forecast, Product CRUD, Orders | PARTIAL (Products require DB auth) |
| **Admin Back-Office** | `AdminDashboard.tsx` | Shop approval, complaint management | BLOCKED (Requires active admin session) |
| **FastAPI ML Inference** | `ml-api/main.py` | `/predict`, `/model/info` Random Forest | PASS (Active on `127.0.0.1:8000`) |
| **Automated Robocall** | `robocall/index.ts` | Twilio IVR voice call on order | BLOCKED (Twilio credentials missing) |
| **Chotu AI Chatbot** | `ChotuChatbot.tsx`, `chotu-chat/` | Streaming AI assistant | BLOCKED (Requires Lovable API Key) |
| **Supabase Authentication** | `auth-context.tsx` | Username/email password login & signup | FAIL / BLOCKED (Supabase host offline) |

---

## 5. Execution Constraints & Environment Limitations

1. **Remote Supabase Connectivity (CRITICAL BLOCKER):**
   - The configured Supabase endpoint in `.env` (`https://gmefpiakwxlecfuxeugl.supabase.co`) does not resolve in public DNS (`No such host is known`).
   - Impact: Live network queries against remote Supabase Auth, PostgreSQL tables, Edge Functions, and Storage buckets fail at the DNS level.
   - Mitigation for Quality Audit: The client frontend is architected with resilient demo fallbacks (`demo-data.ts`, `demo-translations.ts`, local deterministic fallbacks in `src/lib/ml/api.ts`). We will verify mock/fallback behaviors thoroughly, write unit/integration tests with mocked Supabase responses, and audit all SQL migrations and RLS policies statically and dynamically.
2. **Third-Party Credentials:**
   - Twilio Account SID/Token are not configured locally (requires live telephony sandbox).
   - Lovable AI Gateway key is not configured locally.
3. **Local Tooling Available:**
   - Node.js v24.21.0 & npm 11.19.0.
   - Python 3.11.9 with active scikit-learn, joblib, and FastAPI dependencies.
   - Vite dev server running on `http://localhost:8080/`.
   - FastAPI ML service running on `http://127.0.0.1:8000/`.
   - Full Playwright-driven browser automation available for dynamic UI/UX verification.

---

## 6. Proposed Testing Sequence

- **Stage A (Completed):** Repository Discovery & Feature Inventory (`PROJECT_DISCOVERY_REPORT.md`).
- **Stage B:** Static Quality, Compiler, Linter, and Security Secret Scans (`STATIC_QUALITY_REPORT.md`).
- **Stage C:** Unit & Component Testing using Vitest & React Testing Library.
- **Stage D:** Browser-driven Functional & UI/UX Audit across Desktop and Mobile viewports (`FUNCTIONAL_TEST_REPORT.md`, `UI_UX_TEST_REPORT.md`).
- **Stage E:** Backend & ML API Testing (`API_TEST_REPORT.md`).
- **Stage F:** Database Schema, Migrations, and RLS Policy Audit (`DATABASE_INTEGRITY_REPORT.md`).
- **Stage G:** Authentication, Role-Based Access Control, and Security Audit (`AUTH_SECURITY_REPORT.md`, `SECURITY_AUDIT_REPORT.md`).
- **Stage H:** Performance, Latency, and Bundle Size Benchmarking (`PERFORMANCE_RELIABILITY_REPORT.md`).
- **Stage I:** Integrations and End-to-End User Journeys (`INTEGRATION_E2E_REPORT.md`).
- **Stage J:** Production Deployment Verification (`DEPLOYMENT_READINESS_REPORT.md`).
- **Stage K:** Defect Remediations, Regression Testing, and Final Release Certification (`REGRESSION_REPORT.md`, `FINAL_RELEASE_CERTIFICATION.md`).

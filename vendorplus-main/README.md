# Vendor+ — Smart Local Vendor System

A web platform that helps small local shops sell online, manage their
orders, and use simple machine learning to predict daily product demand.

---

## 1. Project Overview

Vendor+ is a smart vendor management system built for small shopkeepers.
It lets a shop owner:

- List their shop and products online
- Receive orders from nearby customers
- Get phone-call alerts when a new order comes in
- See demand predictions powered by a machine learning model

The main goal is to make a small "kirana-style" shop run like a modern
digital storefront — with a dashboard, smart insights, and demand
prediction to help the owner stock the right products at the right time.

---

## 2. Tech Stack

**Frontend**
- **React** — builds the user interface as reusable components.
- **TypeScript** — adds type safety so the code is less buggy.
- **Vite** — a fast tool that runs and builds the React app.
- **Tailwind CSS + shadcn/ui** — used for clean, responsive styling.

**Backend**
- **Supabase** — handles login, the database, file storage, and edge
  functions (small server functions that run on the cloud).

**Machine Learning**
- **Python** — the language used to train the model.
- **scikit-learn** — provides the Random Forest algorithm.
- **joblib** — saves the trained model to a file so it can be reused.
- **FastAPI** — a small Python web server that serves predictions.

---

## 3. Project Structure

```
vendor-plus/
├── src/                    # React frontend
│   ├── pages/              # Full pages (routes)
│   ├── components/         # Reusable UI pieces
│   │   └── dashboard/      # Shopkeeper dashboard widgets
│   ├── lib/                # Helpers, contexts, ML client
│   └── hooks/              # Custom React hooks
├── supabase/
│   └── functions/          # Cloud edge functions (server logic)
├── ml-model/               # Python ML training pipeline
│   ├── src/                # train.py, predict.py, preprocess.py, analytics.py
│   ├── notebooks/          # Jupyter notebook for experiments
│   └── outputs/            # Trained model bundle
└── ml-api/                 # FastAPI service that serves predictions
```

### `/src` — Frontend

- **`pages/Index.tsx`** — Home page that introduces the platform.
- **`pages/Marketplace.tsx`** — Lists all shops customers can order from.
- **`pages/ShopPage.tsx`** — Single shop view with its products.
- **`pages/Cart.tsx`** / **`pages/Orders.tsx`** — Cart and order tracking.
- **`pages/Login.tsx`**, **`pages/Signup.tsx`** — User authentication.
- **`pages/ShopLogin.tsx`**, **`pages/RegisterShop.tsx`** — Shop owner side.
- **`pages/Dashboard.tsx`** — Main shopkeeper dashboard (tabs).
- **`pages/AdminDashboard.tsx`** — Admin tools for managing the platform.
- **`components/Navbar.tsx`** — Top navigation bar.
- **`components/ChotuChatbot.tsx`** — Floating help chatbot.
- **`components/RobocallSimulator.tsx`** — Demo of the order phone alert.
- **`lib/auth-context.tsx`** — Tracks the logged-in user across the app.
- **`lib/cart-context.tsx`** — Holds the shopping cart state.
- **`lib/ml/client.ts`** — Talks to the Supabase edge function for AI insights.
- **`lib/ml/api.ts`** — Talks to the FastAPI ML service for predictions.

### `/supabase/functions` — Backend

- **`smart-ai/`** — Returns demand insights and recommendations.
- **`ai-dashboard/`** — Generates dashboard analytics on the server.
- **`chotu-chat/`** — Powers the in-app chatbot replies.
- **`robocall/`** — Triggers a phone call to the shop owner on a new order.
- **`robocall-response/`** — Handles the keypress reply from the call.

### `/ml-model` — Machine Learning Pipeline

- **`src/preprocess.py`** — Cleans the raw sales data: parses dates,
  fixes missing values, and normalises product names.
- **`src/analytics.py`** — Calculates trends like top products, sales by
  weekday, and category demand.
- **`src/train.py`** — Trains a Random Forest model on the cleaned data
  and saves it to `outputs/model_bundle.json` (and `model.joblib`).
- **`src/predict.py`** — Loads the saved model and returns a prediction
  in the same JSON shape the frontend expects.
- **`notebooks/Model_1.ipynb`** — The original experiment notebook.

### `/ml-api` — Prediction API

- **`main.py`** — A small FastAPI app with a `GET /predict` endpoint that
  loads the trained model with `joblib` and returns a JSON prediction.

---

## 4. Frontend Explanation

The shopkeeper dashboard (`/dashboard`) is split into tabs. Each tab is
its own component in `src/components/dashboard/`:

- **`DashboardOverview.tsx`** — Quick stats: today's orders, revenue, etc.
- **`DashboardOrders.tsx`** — Live list of incoming and past orders.
- **`DashboardProducts.tsx`** — Add, edit, and remove products.
- **`DashboardAnalytics.tsx`** — Charts showing sales trends.
- **`DashboardForecast.tsx`** — Future demand forecast charts.
- **`DashboardInsights.tsx`** — Plain-language tips for the shop owner.
- **`DashboardCompetition.tsx`** — Compares the shop with nearby ones.
- **`DashboardReports.tsx`** — Downloadable reports.
- **`DashboardAIHub.tsx`** — One-stop view of all ML insights.
- **`DashboardSmartAI.tsx`** — Smart recommendations from the ML model,
  including a "Live ML API Prediction" card from the FastAPI service.

The UI uses **Recharts** for graphs and **shadcn/ui** cards for layout,
so data is shown in clean charts, badges, and stat cards.

---

## 5. Backend Explanation

The backend is fully managed by **Supabase**:

- **Authentication** — Sign up and login. Users log in with a username,
  which is resolved to an email behind the scenes.
- **Database (Postgres)** — Stores shops, products, orders, profiles,
  and user roles. Row-Level Security keeps each user's data private.
- **Edge Functions** — Small server functions written in TypeScript that
  run in the cloud:
  - `smart-ai` returns AI insights to the dashboard.
  - `ai-dashboard` builds dashboard analytics.
  - `chotu-chat` powers the chatbot.
  - `robocall` and `robocall-response` handle the Twilio voice call sent
    to the shop owner when a new order arrives.

---

## 6. ML Model Explanation

The model predicts **product demand** so the shop owner knows what to
stock next.

**Training flow** (`ml-model/src/train.py`):
1. `preprocess.py` cleans the raw sales CSV.
2. `analytics.py` builds aggregate features (top products, weekday demand).
3. A **Random Forest classifier** from scikit-learn is trained on these
   features.
4. The trained model is saved with **joblib** to `outputs/model.joblib`
   and a JSON bundle to `outputs/model_bundle.json`.

**Prediction flow** (`ml-model/src/predict.py` and `ml-api/main.py`):
1. The saved model is loaded from disk.
2. Given the current weather, stock, and time, the model returns a
   demand prediction.
3. The result is shipped to the dashboard as JSON.

---

## 7. Data Flow / Connection

The project has three independent modules that work together:

```
 ┌──────────────┐   GET /predict    ┌──────────────┐    joblib.load    ┌────────────┐
 │  React app   │ ────────────────► │   FastAPI    │ ────────────────► │  RF model  │
 │ (dashboard)  │ ◄──────────────── │  (ml-api)    │ ◄──────────────── │ (.joblib)  │
 └──────┬───────┘   JSON response   └──────────────┘                   └────────────┘
        │
        │  Supabase JS SDK
        ▼
 ┌──────────────┐
 │   Supabase   │  auth · database · edge functions
 └──────────────┘
```

**Current integration status**
- The frontend, Supabase backend, and ML model live as **separate
  modules** in the same repository.
- The shopkeeper dashboard fetches AI-style insights from the
  `smart-ai` edge function, and demand predictions from the FastAPI
  service in `ml-api/`.
- The Python training pipeline runs **offline** — a developer trains the
  model and uploads the bundle for the API to serve.

**How data would flow in a complete system**
1. Orders are saved in the Supabase database in real time.
2. A scheduled job exports the order history to the ML pipeline.
3. `train.py` retrains the Random Forest weekly and re-publishes the
   model bundle.
4. The FastAPI service auto-reloads the new model.
5. The dashboard calls `GET /predict` and shows fresh predictions.

---

## 8. Features

- 🛒 Online marketplace for local shops
- 👤 Username-based login with Supabase Auth
- 📦 Shop owner dashboard with products, orders, and analytics
- 📞 Automatic Twilio robocall to the shop owner on new orders
- 🤖 Smart AI insights and recommendations
- 📈 Random Forest demand prediction served via FastAPI
- 💬 In-app chatbot to help users
- 🌐 Multi-language support
- 🔒 Role-based access (customer, shopkeeper, admin)
- 📱 Fully responsive design

---

## 9. Future Improvements

- **Real-time ML integration** — Trigger model retraining automatically
  whenever new orders are added.
- **Better AI insights** — Use larger datasets and more features
  (weather API, festivals, holidays) for stronger predictions.
- **Deployment improvements** — Containerise the FastAPI service with
  Docker and host it next to the database for lower latency.
- **Mobile app** — A React Native version for shop owners on the go.
- **Payment gateway** — Add UPI / card payments at checkout.
- **Inventory automation** — Auto-place restock orders when stock is low.

---

## 10. Conclusion

Vendor+ shows how a small local shop can be turned into a smart digital
business. It combines a modern React dashboard, a managed Supabase
backend, and a Python machine learning model to give shop owners real
tools — online ordering, instant alerts, and demand predictions — in one
simple, clean platform.

Built as a student project to demonstrate full-stack development and
practical machine learning working together.
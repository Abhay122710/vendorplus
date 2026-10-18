# AUTHENTICATION & AUTHORIZATION SECURITY REPORT: VENDOR+

**Auditor:** Senior DevSecOps & Application Security Architect  
**Audit Date:** October 18, 2026  
**Audited Target:** `vendorplus-main`  
**Certification Target:** Authentication Mechanisms, RBAC, Session Management, and Access Control  

---

## 1. Executive Summary

An audit of the authentication workflows, session lifecycles, and role-based access control (RBAC) was performed across client route guards, Supabase Auth integration, and database security definer functions.

| Security Control | Implementation | Verification Status | Severity |
| :--- | :--- | :--- | :--- |
| **Password Hashing** | Supabase Auth (Argon2id/bcrypt) | **PASS** | Info |
| **Session & Token Storage** | LocalStorage JWT | **PASS** | Low |
| **Account Quota Enforcement**| PL/pgSQL function (Max 2 accounts) | **PASS** | Info |
| **Shopowner Route Protection**| `ShopownerGuard.tsx` | **PASS** | Info |
| **Admin Route Protection** | `AdminDashboard.tsx` inline guard | **FAIL** | **High** |
| **Username-Based Login** | Profile email pre-query | **FAIL (PII Breach)**| **CRITICAL** |
| **Multi-Shop Tenant Isolation**| Hardcoded `"s1"` in dashboard | **FAIL** | **High** |
| **Brute Force & Rate Limiting**| Client login handlers | **NOT IMPLEMENTED** | Medium |

---

## 2. Authentication Mechanics & Flaws

### 2.1 The Username Lookup Architecture Flaw (`VULN-AUTH-01` — Critical)
- **Problem Statement:** Supabase Auth natively authenticates via `email` and `password`. To support login by `username`, the application first queries `public.profiles`:
  ```ts
  const { data: profileData } = await supabase
    .from("profiles")
    .select("email")
    .eq("username", username)
    .single();
  ```
- **The Defect:** To allow this client query before the user has logged in, migration `20260308230955` added:
  ```sql
  CREATE POLICY "Allow username lookup for login" ON public.profiles FOR SELECT TO anon USING (true);
  ```
- **Impact:** An attacker can execute `supabase.from("profiles").select("username, email, phone, role")` anonymously and harvest the entire user database without authentication.
- **Remediation:** Remove public SELECT access to `profiles`. Expose an isolated Postgres RPC function `get_email_by_username(username)` that returns ONLY the email for that specific exact string match.

---

## 3. Role-Based Access Control (RBAC) & Route Guards

### 3.1 Three-Tier Role Model
The application defines three distinct roles in PostgreSQL (`app_role` enum and `profiles.role` column):
1. `customer`: Browses marketplace, adds items to cart, places orders, submits complaints.
2. `shopowner`: Manages shop profile, updates products, reviews orders, views AI demand forecasting.
3. `admin`: Approves/rejects shops, oversees platform analytics, resolves complaints.

### 3.2 Route Guarding Architecture
- `ShopownerGuard.tsx` prevents shopkeepers and admins from accessing customer storefront pages (`/`, `/marketplace`, `/shop/:id`, `/cart`, `/orders`, `/help`). If authenticated as a shopowner, they are redirected to `/dashboard`.
- **Flaw in Admin Guarding (`AdminDashboard.tsx`):**
  - Route `/admin` is NOT guarded by a dedicated `<AdminGuard>` wrapper in `App.tsx`.
  - Instead, `AdminDashboard.tsx` performs an inline check:
    ```ts
    if (!user || profile?.role !== "admin") return <Navigate to="/login" />;
    ```
  - However, `useEffect(() => { fetchAll(); }, [])` fires on component mount BEFORE this conditional redirect can complete. Consequently, unauthorized or unauthenticated users trigger network queries to admin endpoints upon landing on `/admin`.

---

## 4. Multi-Tenant Shop Isolation

### 4.1 Cross-Shop Data Leakage in Dashboard (`VULN-AUTH-02` — High)
- In `src/components/dashboard/DashboardOverview.tsx`:
  ```ts
  value: demoProducts.filter((p) => p.shop_id === "s1").length
  value: demoOrders.filter((o) => o.shop_id === "s1").length
  ```
- In `src/components/dashboard/DashboardOrders.tsx`:
  ```ts
  const allOrders = getShopOrders("s1");
  ```
- **Finding:** The shopkeeper dashboard hardcodes the shop identifier to `"s1"`. Any authenticated shopkeeper who registers a new shop (e.g. `s2`, `s3`) will view the orders, products, revenue, and stats belonging to shop `s1` (Sharma Kirana Store), rather than their own shop!

---

## 5. Auth Security Verdict

- **Verdict:** **FAIL (Release Blocker)**.
- **Blockers:** 
  1. Critical PII harvesting vulnerability via anonymous profile policy.
  2. Multi-tenant shopkeeper dashboard isolation broken by hardcoded `"s1"`.
  3. `AdminDashboard.tsx` mounts and fetches data before redirecting unauthorized users.

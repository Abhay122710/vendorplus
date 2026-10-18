# APPLICATION SECURITY AUDIT REPORT: VENDOR+

**Auditor:** Principal DevSecOps & Certified Application Security Specialist  
**Audit Date:** October 18, 2026  
**Audited Target:** `vendorplus-main`  
**Security Standard:** OWASP Top 10 (2021) & CWE Compliance  
**Certification Target:** Vulnerability Register, Risk Assessment, and Defensive Remediation  

---

## 1. Vulnerability Findings Register

| ID | Vulnerability Title | OWASP Category | Severity | CVSS v3.1 | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | Anonymous PII Harvesting via RLS Policy | A01: Broken Access Control | **CRITICAL** | 9.1 | Confirmed Defect |
| **SEC-02** | Remote Code Execution via Test Dependency | A06: Vulnerable Components | **CRITICAL** | 9.8 | Confirmed (`tinypool`) |
| **SEC-03** | Public Telephony Log Disclosure | A01: Broken Access Control | **HIGH** | 7.5 | Confirmed (`order_call_responses`) |
| **SEC-04** | Hardcoded Contact & Unignored `.env` | A02: Cryptographic Failures | **HIGH** | 7.4 | Confirmed |
| **SEC-05** | Multi-Tenant Data Cross-Talk | A01: Broken Access Control | **HIGH** | 7.1 | Confirmed (`shop_id: "s1"`) |
| **SEC-06** | Insecure CORS Wildcard with Credentials | A05: Security Misconfiguration | **MEDIUM** | 6.5 | Confirmed (`ml-api/main.py`) |
| **SEC-07** | Account Enumeration via Login Error Messages | A07: Identification Failures | **LOW** | 5.3 | Confirmed |

---

## 2. In-Depth Vulnerability Profiles

### SEC-01: Anonymous PII Harvesting via RLS Policy
- **Affected File:** `supabase/migrations/20260308230955_2bf082a0-2d49-4758-886a-de7472a356b1.sql:1`
- **CWE:** CWE-284: Improper Access Control
- **Description:** Migration grants `anon` full `SELECT` permission on `public.profiles` (`USING (true)`).
- **Proof of Concept:** Any visitor can open browser developer tools and run:
  ```js
  const { data } = await supabase.from('profiles').select('*');
  console.table(data);
  ```
  All user records (full names, emails, phone numbers, usernames, and roles) are retrieved immediately.
- **Remediation:** Drop policy `Allow username lookup for login`. Restrict anon access to a dedicated RPC function that returns only the matching email for a specific username.

### SEC-02: Critical Prototype Pollution to RCE in `tinypool`
- **Affected Package:** `tinypool <= 2.1.1` (transitive dependency of `vitest`)
- **Advisories:** GHSA-5gmw-xhrv-c9v3, GHSA-85c8-ppgw-ccpr
- **Description:** Prototype pollution gadget in worker options allows arbitrary command execution in worker threads.
- **Remediation:** Update `vitest` to latest non-vulnerable release via `npm audit fix`.

### SEC-03: Public Telephony Log Disclosure in `order_call_responses`
- **Affected File:** `supabase/migrations/20260308222253_00f01597-0227-42ba-8ad7-0ad28d3521ca.sql:11`
- **Policy:** `CREATE POLICY "Anyone can read order responses" ON public.order_call_responses FOR SELECT USING (true);`
- **Impact:** Any unauthenticated entity can inspect IVR robocall status, order confirmation digits, and order IDs across all vendors.
- **Remediation:** Restrict SELECT permissions to authenticated users who are either the owner of the shop or the customer who placed the order.

### SEC-04: Hardcoded Contact Details & Missing `.gitignore` Rule
- **Affected Files:**
  - `src/lib/order-context.tsx:197`: `const SHOP_OWNER_NUMBER = "+918476003000";`
  - `supabase/functions/robocall/index.ts:14`: `const shopOwnerNumber = "+918476003000";`
  - `.gitignore`: Missing `.env` exclusion.
- **Impact:** Personal phone number committed into repository; environment files containing API credentials are prone to accidental git commits.
- **Remediation:** Parameterize phone numbers via environment variables (`VITE_SHOP_OWNER_PHONE`) and add `.env*` to `.gitignore`.

### SEC-06: Insecure CORS Wildcard with Credentials in FastAPI Microservice
- **Affected File:** `ml-api/main.py:23-29`
- **Code:**
  ```python
  app.add_middleware(
      CORSMiddleware,
      allow_origins=["*"],
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
  )
  ```
- **Description:** Setting `allow_origins=["*"]` with `allow_credentials=True` violates RFC standards and creates cross-origin security exposures.
- **Remediation:** Replace `allow_origins=["*"]` with explicit allowed origin list (`["http://localhost:8080", "http://localhost:5173"]`) or set `allow_credentials=False`.

---

## 3. Security Audit Verdict

- **Verdict:** **FAIL (Release Blocker)**.
- **Blockers:** SEC-01 (PII harvesting), SEC-02 (RCE vulnerability), SEC-03 (Telephony log disclosure), SEC-04 (Hardcoded secrets).

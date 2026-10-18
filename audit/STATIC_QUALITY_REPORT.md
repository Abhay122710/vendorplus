# STATIC QUALITY REPORT: VENDOR+

**Auditor:** DevSecOps & Lead Software Architect  
**Audit Date:** October 18, 2026  
**Audited Target:** `vendorplus-main`  
**Certification Target:** Static Code Quality & Build Verification  

---

## 1. Executive Summary

Static quality evaluation was executed across the codebase using the native compiler (`tsc`), linter (`eslint`), build engine (`vite`), dependency security scanner (`npm audit`), and source secret analyzers. 

| Check Category | Command / Tool | Status | Severity | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Dependency Resolution** | `npm install` | PASS | Info | Clean install from lockfile (578 packages) |
| **TypeScript Compilation** | `npx tsc --noEmit` | PASS | None | 0 type errors across whole project |
| **Code Linting** | `npm run lint` | **FAIL** | High | 9 errors, 22 warnings |
| **Production Build** | `npm run build` | **PASS (with warnings)** | Medium | Oversized chunk (>1.4MB), CSS `@import` order |
| **Dependency Vulnerabilities** | `npm audit` | **FAIL** | Critical | 36 vulnerabilities (2 critical, 27 high, 7 mod) |
| **Secret & Credential Scan** | Static grep & AST inspection | **FAIL** | High | Hardcoded phone numbers & exposed `.env` |
| **Dead Code & Placeholders** | Static scan | **FAIL** | Medium | Fake test suite (`test/example.test.ts`), mock data |

---

## 2. Compiler & Type Checking Diagnostics

**Execution:** `npx tsc --noEmit`  
**Result:** Code 0. Zero compiler errors detected.  
- TypeScript version: 5.8.3
- Target: ES2020 with `bundler` module resolution.
- `strict` mode is enabled in `tsconfig.app.json`.

---

## 3. Linter Diagnostics & Rule Violations

**Execution:** `npm run lint` (ESLint 9.32.0)  
**Result:** Code 1. **9 Errors, 22 Warnings** across 15 files.

### 3.1 Hard Errors Breakdown (9 Errors)

1. **`src/components/dashboard/DashboardAnalytics.tsx` (Line 49:19)**
   - Rule: `@typescript-eslint/no-explicit-any`
   - Diagnostic: Explicit `any` type utilized for data mapping instead of strict schema interface.
2. **`src/components/dashboard/DashboardSmartAI.tsx` (Line 33:19)**
   - Rule: `@typescript-eslint/no-explicit-any`
   - Diagnostic: Explicit `any` parameter passed to prediction parser.
3. **`src/components/ui/command.tsx` (Line 24:11)**
   - Rule: `@typescript-eslint/no-empty-object-type`
   - Diagnostic: Empty interface declaration equivalent to supertype `CommandPrimitive`.
4. **`src/components/ui/textarea.tsx` (Line 5:18)**
   - Rule: `@typescript-eslint/no-empty-object-type`
   - Diagnostic: Empty interface declaration equivalent to supertype `React.TextareaHTMLAttributes`.
5. **`src/lib/auth-context.tsx` (Lines 96:39 & 97:54)**
   - Rule: `@typescript-eslint/no-explicit-any`
   - Diagnostic: Cast `(limitCheck as any).allowed` and `(limitCheck as any).reason` bypasses type safety for Supabase RPC output.
6. **`src/lib/order-context.tsx` (Line 80:29)**
   - Rule: `@typescript-eslint/no-explicit-any`
   - Diagnostic: `data.forEach((resp: any) => ...)` bypasses database table schema.
7. **`supabase/functions/smart-ai/index.ts` (Line 139:15)**
   - Rule: `@typescript-eslint/no-explicit-any`
   - Diagnostic: `any` cast used in payload calculation.
8. **`tailwind.config.ts` (Line 107:13)**
   - Rule: `@typescript-eslint/no-require-imports`
   - Diagnostic: CommonJS `require("tailwindcss-animate")` in TypeScript module configuration.

### 3.2 Key Warnings (22 Warnings)
- **Unsafe React Hook Dependencies (`react-hooks/exhaustive-deps`):**
  - `src/components/ChotuChatbot.tsx:88`: Missing dependency `tr`.
  - `src/components/dashboard/DashboardAnalytics.tsx:56`: Missing dependency `fetchData`.
  - `src/components/dashboard/DashboardProducts.tsx:43`: Missing dependency `fetchShopAndProducts`.
  - `src/lib/order-context.tsx:95`: Missing dependency `orders`, and complex array expression directly in dependency array (`orders.filter(...).length`), which causes unnecessary re-renders and defeats static dependency checking.
- **Fast Refresh Anti-Patterns (`react-refresh/only-export-components`):**
  - Multiple UI primitives (`badge.tsx`, `button.tsx`, `form.tsx`, `sidebar.tsx`, etc.) and contexts export helper functions/constants alongside components, breaking React Fast Refresh HMR state persistence.

---

## 4. Production Build & Bundle Metrics

**Execution:** `npm run build`  
**Result:** Code 0. Built in 9.91 seconds.

```
dist/index.html                     1.82 kB │ gzip:   0.66 kB
dist/assets/logo-Bsq3Va9R.jpg      34.67 kB
dist/assets/index-asXw_CVU.css     72.12 kB │ gzip:  12.66 kB
dist/assets/index-CmeWxpkz.js   1,479.52 kB │ gzip: 426.85 kB
```

### Build Anomalies Identified
1. **Oversized Monolithic Chunk:**
   - Single bundle is **1.48 MB (uncompressed)**, exceeding Vite's 500 kB limit warning by nearly 3x.
   - Root Cause: No route-level code splitting (`React.lazy` / dynamic `import()`). Every route (`AdminDashboard`, `Dashboard`, `Recharts`, `Framer Motion`, Radix primitives) is bundled into a single initial download for all visitors.
2. **CSS Spec Ordering Warning:**
   - Warning in `src/index.css`: `@import must precede all other statements (besides @charset or empty @layer)`. Google Fonts `@import url(...)` is placed at line 9 below custom CSS layers, violating the CSS specification and potentially stalling stylesheet rendering.

---

## 5. Security & Secret Exposure Audit

1. **Hardcoded Phone Number:**
   - `src/lib/order-context.tsx:197`: `const SHOP_OWNER_NUMBER = "+918476003000";`
   - `supabase/functions/robocall/index.ts:14`: `const shopOwnerNumber = "+918476003000";`
   - Severity: High. Real personal phone number hardcoded in client and server source files.
2. **Missing Environment File Exclusion:**
   - Inspection of `.gitignore` reveals `*.local` is ignored, but `.env` and `.env.*` are NOT ignored.
   - Result: `.env` containing `VITE_SUPABASE_PROJECT_ID`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and `VITE_SUPABASE_URL` is committed/present directly in source control.

---

## 6. Dependency Vulnerability Audit (`npm audit`)

**Execution:** `npm audit`  
**Total Vulnerabilities:** 36 (2 Critical, 27 High, 7 Moderate).

| Advisory / CVE | Package | Severity | Vector / Impact |
| :--- | :--- | :--- | :--- |
| **GHSA-5gmw-xhrv-c9v3** | `tinypool` (via `vitest`) | **CRITICAL** | Prototype Pollution in worker options leading to RCE |
| **GHSA-85c8-ppgw-ccpr** | `tinypool` (via `vitest`) | **CRITICAL** | Prototype Pollution Gadget to RCE in `run()` options |
| **GHSA-67mh-4wv8-2f99** | `esbuild` (via `vite`) | **MODERATE** | CSRF / local dev server read arbitrary responses |
| **GHSA-5j98-mcp5-4vw2** | `glob` | **HIGH** | Command injection via `-c/--cmd` |
| **GHSA-r5fr-rjxr-66jc** | `lodash` | **HIGH** | Code Injection via `_.template` imports key names |
| **GHSA-qx2v-qp2m-jg93** | `postcss` | **HIGH** | XSS via unescaped `</style>` in CSS stringify |
| **GHSA-mw96-cpmx-2vgc** | `rollup` | **HIGH** | Arbitrary File Write via Path Traversal |

---

## 7. Static Quality Verdict & Required Fixes

- **Verdict:** **FAIL (Release Blocker)**.
- **Blocking Items:**
  1. 9 ESLint errors breaking CI quality gates.
  2. 2 Critical RCE vulnerabilities in test runner dependency tree.
  3. Hardcoded phone number in source code.
  4. `.env` omitted from `.gitignore`.
  5. Invalid CSS `@import` order in `src/index.css`.

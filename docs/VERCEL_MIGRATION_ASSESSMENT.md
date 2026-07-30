# Vercel Migration Assessment: Trifecta Performance Lab

**Date:** July 30, 2026  
**Target Repository:** `trifecta-performance-lab`  
**Target Vercel Project:** `trifecta-performance-lab`  
**Assessment Result:** Compatible with limited changes  
**Estimated Risk:** Low  

---

## 1. Executive Finding

The **Trifecta Performance Lab** application is a fully client-rendered, Arabic-first bilingual trainer platform built on Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4. Originally scaffolded using `vinext` and Vite for Cloudflare Workers via OpenAI Sites, the application uses local browser persistence (`localStorage`), PWA service worker caching, and client-side state management without any backend database or server runtime dependencies.

Our technical assessment confirms that the application is **fully compatible with Vercel deployment** through a non-breaking, parallel build path. The existing OpenAI Sites Cloudflare Worker build path (`vinext build`) and hosting metadata (`.openai/hosting.json`) remain 100% intact and operational.

---

## 2. Current Architecture

- **Framework:** Next.js 16.2.6 (App Router) + React 19.2.6.
- **Language & Styling:** TypeScript 5.9.3, Tailwind CSS v4 via `@tailwindcss/postcss` and `app/globals.css`.
- **Localization:** Arabic-first default (`lang="ar"`, `dir="rtl"`), supporting dynamic English LTR switching.
- **Routing:** App Router static and dynamic section routes (`/`, `/[slug]`) mapping 14 domain sections (`overview`, `curriculum`, `domains`, `trifecta`, `comparison`, `cases`, `objective-builder`, `station-builder`, `calibration`, `profile`, `aar`, `checks`, `references`, `about`).
- **Data Persistence:** 100% local browser storage (`localStorage` key `trifecta-state-v2`). Zero external databases, zero backend API calls, zero analytics.
- **PWA & Offline:** `public/sw.js` (cache name `trifecta-core-v5`) and `public/manifest.webmanifest`.
- **Safari Resilience:** Preload recovery script embedded in `app/layout.tsx` handling dynamic chunk reload on Safari (`trifecta-preload-retry`).

---

## 3. Current OpenAI Sites Build and Deployment Path

- **Hosting Manifest:** `.openai/hosting.json` containing `project_id: "appgprj_6a6a3f0f64148191bd0579c2ae93a79e"`.
- **Build Engine:** `vinext build` powered by Vite 8 and `@cloudflare/vite-plugin`.
- **Worker Handler:** `worker/index.ts` handling Cloudflare Worker request routing and image optimization proxy.
- **Primary Script:** `"build": "WRANGLER_LOG_PATH=.wrangler/wrangler.log vinext build"`.
- **Status:** Unchanged, fully preserved as a primary/fallback deployment target.

---

## 4. Standard Next.js / Vercel Compatibility

- **Next.js Config:** `next.config.ts` was updated to explicitly bind `outputFileTracingRoot` and `turbopack.root` to `process.cwd()`. This prevents Next.js Turbopack from mis-inferring workspace root paths when standard parent directory lockfiles are present on developer environments.
- **Dedicated Build Script:** Added `"build:vercel": "next build --webpack"` to `package.json` to allow Vercel to compile standard Next.js App Router static pages and client bundles without touching the OpenAI Sites `vinext` build script.
- **Vercel Config:** Created `vercel.json` pointing `buildCommand` to `npm run build:vercel`.
- **Route Pre-rendering:** Added `generateStaticParams()` to `app/[slug]/page.tsx` so all 14 application module sections are statically pre-rendered (SSG) during Vercel builds.

---

## 5. Cloudflare-Specific Dependencies

- Cloudflare dependencies (`@cloudflare/vite-plugin`, `wrangler`, `worker/index.ts`) are scoped entirely to Vite/vinext dev and build commands.
- Standard Next.js builds ignore `worker/index.ts` and `vite.config.ts`, rendering them zero-risk for Vercel deployment.

---

## 6. Vinext / Vite Dependencies

- Vinext (`vinext`) is present in `devDependencies` and utilized solely when executing `vinext dev` or `vinext build`.
- It does not pollute React application components or Next.js App Router layouts.

---

## 7. PWA and Service-Worker Risks

- `public/sw.js` was updated to exclude `/_next/` static asset requests in addition to `/assets/` requests. Content-hashed Next.js chunks feature immutable HTTP caching; bypassing service worker interception for `/_next/` prevents stale-cache or auth-replay issues on Safari and iOS PWA instances.

---

## 8. Arabic and RTL Risks

- The root layout (`app/layout.tsx`) sets initial `<html lang="ar" dir="rtl">`.
- Interface switching handles `dir="rtl"` vs `dir="ltr"` dynamically.
- Tailwind and custom CSS rules in `app/globals.css` utilize logical properties (`margin-inline`, `padding-inline`, `text-align: start`) ensuring pixel-perfect layout mirroring across all viewports.

---

## 9. localStorage and Origin-Change Implications

- Browser `localStorage` is isolated per origin. Deploying to Vercel (e.g. `trifecta-performance-lab.vercel.app`) creates a fresh local storage boundary.
- Existing JSON export/import functions allow trainers and assessors to export local drafts from the OpenAI Sites domain and import them into the Vercel domain if needed.

---

## 10. Safari Risks

- Safari dynamic chunk load errors are mitigated by `preloadRecovery` in `app/layout.tsx`.
- Service worker `sw.js` excludes `/_next/` assets, preventing stale chunk lockup on iOS WebKit.

---

## 11. Critical Failure and Gate Risks

- Safety rules in `components/CurriculumWorkspace.tsx` and `components/TrainingApp.tsx` strictly enforce:
  `hasCritical === true => decision: "no-go"`.
- Critical Safety Failures override all aggregate or numerical scoring. No AI or scoring algorithm can override a No-Go decision.

---

## 12. Security and Privacy Assessment

- **Secrets Scan:** 0 secrets, API keys, or bearer tokens found in tracked files.
- **Privacy Posture:** 100% local-first storage. 0 external analytics, 0 remote database connections, 0 telemetry.
- **Trainee Data:** 0 real trainee, instructor, or operational performance records exist in the repository.

---

## 13. Required Changes

1. `next.config.ts`: Add `outputFileTracingRoot` and `turbopack.root`.
2. `package.json`: Add `"build:vercel": "next build --webpack"`.
3. `vercel.json`: Create file with `buildCommand: "npm run build:vercel"`.
4. `app/[slug]/page.tsx`: Add `generateStaticParams()`.
5. `public/sw.js`: Exclude `/_next/` path prefix from service worker cache.

---

## 14. Optional Changes

- Configure Vercel Preview password or Vercel Authentication protection for non-production environments.

---

## 15. Prohibited or Unnecessary Changes

- DO NOT remove `.openai/hosting.json` or `worker/index.ts`.
- DO NOT replace `vinext` or break the OpenAI Sites deployment.
- DO NOT introduce external backend databases or cloud state synchronization.

---

## 16. Estimated Migration Risk

**LOW**

---

## 17. Assessment Decision

**Compatible with limited changes.** Parallel Vercel build path verified locally. Ready for Phase 3 (GitHub repository preparation) and Phase 4 (GitHub repository creation).

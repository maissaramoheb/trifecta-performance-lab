# Trifecta Performance Lab

Arabic-first bilingual trainer-development application for Learning Domains, the Trifecta, evidence-based assessment, station design, and AAR.

## Application Purpose

- Explains Cognitive, Psychomotor, and Affective Learning Domains with five/six-level interactive progressions.
- Explains Physical, Technical, and Cognitive / Neurophysiological Performance, including all ten cognitive families in the internal course reference.
- Organizes the ten cognitive families through the source-derived four-phase operational map.
- Makes the build-versus-diagnose distinction explicit.
- Uses an interactive Trifecta performance instrument and a cause–evidence–intervention comparison deck.
- Implements the authoritative Curriculum → Levels → Stations → Drills hierarchy.
- Places an evidence-based Gate between consecutive Stations with Go, No-Go, Need More Data, and Retest decisions.
- Rolls Drill evidence into Station, Level, and Curriculum progress without creating a compensating total performance score.
- Visualizes that roll-up as an Evidence Chain and progressively discloses each Drill workspace.
- Includes 15 guided cases at basic, intermediate, and advanced levels.
- Provides objective, station, calibration, performance-profile, AAR, and intervention tools.
- Enforces Critical Safety Failure as a non-compensable No-Go gate.
- Saves progress and drafts locally on the user’s device.
- Supports Arabic RTL, English LTR, keyboard use, responsive layouts, print/PDF output, JSON station export, and offline core content.

## Local Development

Requires Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Open the local URL printed by the development server.

## Build Targets

The repository supports two parallel production build targets without duplicating source code:

1. **OpenAI Sites (Cloudflare Worker runtime):**
   ```bash
   npm run build
   ```
   Generates Cloudflare Worker bundle using `vinext`.

2. **Vercel (Standard Next.js App Router):**
   ```bash
   npm run build:vercel
   ```
   Generates standard Next.js optimized build (`.next`) configured via `vercel.json` and `next.config.ts`.

## Verification and Testing

Reruns both build targets, linter, type checker, and automated HTML/RTL/PWA tests:

```bash
npm run lint
npx tsc --noEmit
npm run build:vercel
npm test
```

## OpenAI Sites Deployment

- Hosting configuration is declared in `.openai/hosting.json`.
- Uses `vinext build` and `worker/index.ts`.
- Preserved as primary/fallback hosting environment.

## Vercel Deployment

- Configured via `vercel.json` and `next.config.ts`.
- Uses `"buildCommand": "npm run build:vercel"`.
- Tested and optimized for Vercel App Router serverless deployment.

## Privacy Model and Local Storage

- **100% Local-First:** All user inputs, drafts, curriculum progress, station designs, and assessment notes are stored exclusively in the browser's `localStorage` (key: `trifecta-state-v2`).
- **Zero Cloud Transmission:** No data, metrics, or logs are transmitted to any remote database, backend server, or analytics service.
- **Privacy Assurance:** No credentials, real trainee names, or operational secrets are collected or stored.

## PWA and Offline Behaviour

- Service worker (`public/sw.js`, cache `trifecta-core-v5`) provides offline functionality for core application routes.
- Content-hashed Next.js assets (`/_next/`) and Vite bundles (`/assets/`) bypass service worker caching for seamless updates.
- Safari chunk reload recovery script (`preloadRecovery`) is embedded in `app/layout.tsx`.

## Critical Safety Gate Rule

A **Critical Safety Failure** (e.g. Range Safety Breach, Muzzle Direction Violation) immediately forces a **No-Go** decision. Critical failures are non-compensable and cannot be overridden by high numerical or aggregate scores across other rubrics.

## Source Boundary

The internal course documents are the primary source for terminology, structure, examples, and framework framing. Additional validation and workflow rules are marked inside the application as “Applied recommendation / توصية تطبيقية.” The product is not a clinical, neurological, or personality assessment and does not teach operational tactics.

## Known Limitations

- Local progress does not sync between devices.
- The included curriculum is an applied, editable demonstration structure rather than a centrally governed curriculum library.
- Printable outputs use the browser’s print/PDF capability rather than generating signed or centrally managed records.
- The calibration consistency view is descriptive, not a validated inter-rater reliability statistic.
- Sleep/circadian and other longitudinal interpretations require data gathered outside a single session.

# Trifecta Performance Lab

Arabic-first bilingual trainer-development application for Learning Domains, the Trifecta, evidence-based assessment, station design, and AAR.

## What the application does

- Explains Cognitive, Psychomotor, and Affective Learning Domains with five/six-level interactive progressions.
- Explains Physical, Technical, and Cognitive / Neurophysiological Performance, including all ten cognitive families in the internal course reference.
- Makes the build-versus-diagnose distinction explicit.
- Includes 15 guided cases at basic, intermediate, and advanced levels.
- Provides objective, station, calibration, performance-profile, AAR, and intervention tools.
- Enforces Critical Safety Failure as a non-compensable No-Go gate.
- Saves progress and drafts locally on the user’s device.
- Supports Arabic RTL, English LTR, keyboard use, responsive layouts, print/PDF output, JSON station export, and offline core content.

## Source boundary

The attached internal course documents are the primary source for terminology, structure, examples, and framework framing. Additional validation and workflow rules are marked inside the application as “Applied recommendation / توصية تطبيقية.” The product is not a clinical, neurological, or personality assessment and does not teach operational tactics.

## Local use

Requires Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Open the local URL printed by the development server.

## Verification

```bash
npm run lint
npx tsc --noEmit
npm run build
npm test
```

## Architecture

- `app/` — Next.js routes, metadata, PWA manifest, and global design system.
- `components/TrainingApp.tsx` — accessible application shell and interactive modules.
- `lib/content.ts` — typed bilingual source content, cases, checks, and references.
- `public/sw.js` — offline-first cache for the core learning routes.
- `docs/` — source analysis, content architecture, assessment logic, and test report.

No backend or authentication is used. User-entered content is stored only in `localStorage`.

## Deployment

The application builds with vinext for the OpenAI Sites / Cloudflare Worker runtime. Hosting configuration is stored in `.openai/hosting.json`.

## Known limitations

- Local progress does not sync between devices.
- Printable outputs use the browser’s print/PDF capability rather than generating signed or centrally managed records.
- The calibration consistency view is descriptive, not a validated inter-rater reliability statistic.
- Sleep/circadian and other longitudinal interpretations require data gathered outside a single session.


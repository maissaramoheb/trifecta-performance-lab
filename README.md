# Trifecta Performance Lab

Arabic-first bilingual trainer-development application for Learning Domains, the Trifecta, evidence-based assessment, station design, and AAR.

## What the application does

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

- `app/` — Next.js routes, metadata, global error recovery, and global design system.
- `components/TrainingApp.tsx` — accessible application shell and interactive modules.
- `components/CurriculumWorkspace.tsx` — interactive Levels, Stations, Drills, evidence records, and Gate decisions.
- `lib/content.ts` — typed bilingual source content, cases, checks, and references.
- `lib/curriculum.ts` — typed bilingual curriculum hierarchy and safe sample curriculum.
- `public/manifest.webmanifest` — static install metadata compatible with the production host.
- `public/sw.js` — guarded offline cache for core learning routes; content-hashed modules bypass it.
- `docs/` — source analysis, content architecture, assessment logic, and test report.
- `docs/UPGRADE_GAP_MAP.md` — comparison of previous coverage, source gaps, and implemented upgrades.
- `docs/UI_UX_BENCHMARK_2026.md` — inspiration-source assessment, audit findings, adopted patterns, and rejected directions.

No backend or authentication is used. User-entered content is stored only in `localStorage`.

## Deployment

The application builds with vinext for the OpenAI Sites / Cloudflare Worker runtime. Hosting configuration is stored in `.openai/hosting.json`.

## Known limitations

- Local progress does not sync between devices.
- The included curriculum is an applied, editable demonstration structure rather than a centrally governed curriculum library.
- Printable outputs use the browser’s print/PDF capability rather than generating signed or centrally managed records.
- The calibration consistency view is descriptive, not a validated inter-rater reliability statistic.
- Sleep/circadian and other longitudinal interpretations require data gathered outside a single session.

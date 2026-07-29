---
name: performance-trifecta-profile
description: Repository profile for the bilingual Learning Domains and Trifecta trainer-support application.
---

# Performance Trifecta Project Profile

## Purpose and users

- Build an Arabic-first, bilingual trainer-support application that explains Learning Domains and the Trifecta, then turns both into objectives, stations, evidence-based diagnosis, assessment, AAR, and curriculum improvement.
- Primary users are experienced firearms and Special Forces trainers, Training-of-Trainers participants, team leaders, curriculum developers, evaluators, and station assessors.

## Stack and architecture

- Next.js 16 / React 19 / TypeScript, built through the vinext and Vite Cloudflare-compatible starter.
- Tailwind CSS 4 is available, with global styles in `app/globals.css`.
- The product is local-first. Device-local preferences, drafts, and progress use browser storage; no authentication or backend is required for the initial release.
- Site hosting is declared through `.openai/hosting.json` and deployed with OpenAI Sites.

## Authoritative sources

- Product requirements in the initiating task are the acceptance criteria.
- `work/pdfs/trifecta.txt` is the extracted internal course reference for the Cognitive / Neurophysiological Performance pillar and its ten families.
- `work/pdfs/full-performance.txt` is the extracted internal course reference for Learning Domains + Trifecta, progressions, comparisons, and the non-compensable safety rule.
- Original PDFs remain the visual source of truth; extracted text is used for search and content modeling.
- Applied rules not directly supported by source documents must be labeled `Applied recommendation` / `توصية تطبيقية`.

## Stable terminology and behavior

- Arabic is the default language and the interface must fully mirror for RTL. Useful English terms remain in Latin script: Learning Domains, Trifecta, Checklist, Go / No-Go, Critical Failure, Station Card, AAR, Cognitive Load, Baseline, Authorized Variation, Performance Gap, SMART Objective.
- Core message: Learning Domains build the learning; the Trifecta diagnoses actual performance.
- Learning Domains: Cognitive, Psychomotor, Affective.
- Trifecta pillars: Physical, Technical, Cognitive / Neurophysiological Performance.
- A Critical Safety Failure always produces No-Go and cannot be compensated by a total score.
- A single observation does not prove a diagnosis. The interface separates observable evidence, assumptions, alternative explanations, confidence, and missing data.
- Content remains within curriculum design, safe training progression, assessment, and human performance; it excludes offensive tactics, clinical diagnosis, and detailed weapon-manipulation instruction.

## Visual and interaction constraints

- Professional operational-training aesthetic: charcoal surfaces, restrained amber/gold accents, crisp high-contrast type, clean cards, practical diagrams, minimal motion.
- Avoid game styling, sensational imagery, generic e-learning templates, and PowerPoint-like page composition.
- Support keyboard operation, visible focus, reduced motion, readable typography, responsive layouts, print output, Arabic mixed-direction content, and RTL interaction.
- Learner and Instructor modes must remain easy to switch.

## Quality commands

- Install: `npm ci`
- Local preview: `npm run dev`
- Lint: `npm run lint`
- Production build: `npm run build`
- Automated tests: `npm test`

## Deployment

- Build output must remain Cloudflare Worker-compatible through vinext.
- `.openai/hosting.json` is the hosting source of truth; reuse its exact `project_id` once assigned.
- Deployment is authorized by the user’s explicit request to build, test, and deploy the complete application.

## Current status

- New starter project initialized on 2026-07-29.
- Source PDFs have been extracted and rendered for content and visual inspection.
- No existing production behavior or user data exists to preserve.

# UI/UX Baseline Audit V2: Trifecta Performance Lab

**Date:** July 30, 2026  
**Auditor:** Senior Product Designer & UX Architect  
**Scope:** Complete repository, components, layouts, typography, accessibility, and bilingual interfaces.  
**Baseline Commit:** `e45b42e` on `main` / `design/ui-ux-v2`  

---

## 1. Executive Baseline Summary

The **Trifecta Performance Lab** application is an Arabic-first bilingual trainer-development and performance-assessment platform built on Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4. While the application possesses strong domain-specific evidence structures and safety invariants, the visual presentation suffers from visual monotony ("card wall syndrome"), flat information architecture, under-utilized wide desktop viewports, and insufficient visual distinction between distinct workspace functions (learning vs building vs diagnosing vs deciding).

This audit establishes the baseline findings across 14 application routes, 4 viewports, and both Arabic RTL and English LTR modes.

---

## 2. Information Architecture & Navigation Audit

### Findings:
- **Flat Navigation:** The sidebar renders 14 flat section links (`overview`, `curriculum`, `domains`, `trifecta`, `comparison`, `cases`, `objective-builder`, `station-builder`, `calibration`, `profile`, `aar`, `checks`, `references`, `about`) without structural grouping into functional archetypes.
- **Unclear Location Indicator:** The top bar location indicator (`.top-context`) presents static category text with low visual contrast (`font-size: 0.65rem`).
- **Mode Switching:** Learner and Instructor mode switches exist as a segmented control, but switching modes does not sufficiently alter the workspace styling to signify elevated instructor privileges.
- **Navigation Indicators:** Sidebar items use generic 5px circular dots (`.nav-indicator`), making scannability difficult for busy trainers.

---

## 3. Visual Hierarchy & Surface Design Audit

### Findings:
- **Card Wall Syndrome:** Over 80% of interface sections are wrapped in uniform `.card` or `.explorer` containers sharing identical background colors (`#15191a`), 1px borders (`#343a38`), and 16px radii.
- **Flat Depth Layering:** The design system defines `--bg` (`#090b0c`), `--panel` (`#15191a`), and `--panel-2` (`#1b2021`), but lacks visual contrast between interactive surfaces and background terrain.
- **Amber Accent Saturation:** Amber (`#d6a35f` / `#f0c077`) is used indiscriminately for primary action buttons, active navigation, active tabs, kickers, highlights, and borders, reducing its effectiveness for critical focus.
- **Critical Safety Failure Styling:** Critical failures use `.badge-danger` (`#dc786b`), but lack dedicated unmissable surface container styling, distinctive iconography, or non-compensable warning banners.

---

## 4. Typography & Localization Audit

### Findings:
- **Arabic Typography:** Default font stack relies on system fallbacks (`DIN Next Arabic`, `IBM Plex Sans Arabic`, `Noto Sans Arabic`). Headings use heavy weight (`font-weight: 790`) with tight line heights (`1.16`), causing minor descender overlap on specific Arabic glyphs (`ج`, `ح`, `خ`, `ع`, `غ`, `ي`).
- **Mixed-Direction Terminology:** Embedded Latin terms (e.g. `SMART Objective`, `No-Go`, `AAR`, `Trifecta`, `Cognitive Load`) inside Arabic sentences occasionally display punctuation misplacement when `<bdi>` wrapper elements are omitted.
- **Font Size Range:** Excessive reliance on small metadata typography (`0.58rem` - `0.68rem`) to create a "technical" look compromises readability on 390px mobile screens.

---

## 5. Viewport & Responsive Layout Audit

### 390 × 844 (Mobile)
- Topbar controls stack tightly; language switch button and save status indicator crowd the header.
- Sidebar collapses into a drawer, but backdrop click dismiss and focus trapping require accessibility hardening.

### 768 × 1024 (Tablet Portrait)
- Builder forms render in single-column layouts with excessive vertical scrolling required to view preview cards.

### 1024 × 768 & 1440 × 900 (Desktop)
- Main container max-width (`1720px`) causes wide line lengths (`> 120 characters`) in text-heavy sections (`/overview`, `/about`, `/references`).
- Workspace tools (`/objective-builder`, `/station-builder`) leave large blank gutters on 1440px+ screens.

---

## 6. Functional & Safety-Critical Invariants

- **Curriculum Hierarchy:** `Curriculum → Levels → Stations → Drills` is correctly implemented in `components/CurriculumWorkspace.tsx`.
- **Gate Decisions:** `Go`, `No-Go`, `Need More Data`, `Retest`, `Reset` logic functions correctly.
- **Critical Safety Failure Rule:** Non-compensable `hasCritical => decision: "no-go"` is enforced in code, but requires unmissable visual emphasis in the UI.

---

## 7. Audit Conclusion & Priorities for Vercel Release

1. **Restructure Navigation & Topbar:** Organize navigation into 5 clear page archetypes with grouped headers.
2. **Establish Design System V2:** Create rich surface tokens, elevated depth levels, distinct card roles, refined amber/gold accents, and clear status colors.
3. **Redesign Curriculum & Gate Experience:** Build a visual progression map with distinct status indicators for Drills, Stations, and Gates.
4. **Redesign Builder Workspaces:** Create focused 2-column workspace layouts for Objective Builder and Station Builder with live preview cards.
5. **Enforce Accessibility & Motion Discipline:** Implement WCAG 2.2 AA compliant focus states, accessible names, smooth 200ms transitions, and `prefers-reduced-motion` support.

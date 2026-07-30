# UI/UX Improvement Strategy V2: Trifecta Performance Lab

**Date:** July 30, 2026  
**Author:** UX Architect & Senior Next.js Engineer  
**Target:** Complete UI/UX transformation across Tier 1, Tier 2, and Tier 3 routes.  

---

## 1. Page Archetypes Architecture

The application is structured into 6 deliberate page archetypes to eliminate generic "card wall" layouts:

```text
Trifecta Performance Lab
├── 1. Orientation & Framework (Home, Overview, Domains, Trifecta, About)
├── 2. Curriculum & Progression (Curriculum, Levels, Stations, Drills, Gates)
├── 3. Builder Workspaces (Objective Builder, Station Builder)
├── 4. Diagnostic Laboratories (Cases, Calibration, Performance Profiles)
├── 5. Learning & References (Knowledge Checks, Reference Library)
└── 6. Review & Intervention (AAR, Remediation, Retest Workspace)
```

---

## 2. Prioritized Improvement Tiers

### Tier 1 — Flagship Experience (Immediate Priority)
1. **Application Shell & Grouped Sidebar Navigation:**
   - Group 14 routes into 5 distinct categories (`Orientation`, `Curriculum`, `Builders`, `Diagnostics`, `Review & Reference`).
   - Add category headers, active pill indicators, and high-contrast Arabic/English labels.
   - Refine Topbar with clear breadcrumb location path, mode switcher, and safe local storage indicator.
2. **Home & Overview Redesign:**
   - Create a premium editorial hero section explaining the core message: *"Learning Domains build the learning. The Trifecta diagnoses actual performance."*
   - Add responsive framework overview cards and direct action entry points to Curriculum and Station Builder.
3. **Curriculum & Gate Progression Experience:**
   - Redesign `CurriculumWorkspace.tsx` to visualize the 4-level hierarchy: `Curriculum → Level → Station → Drill → Gate`.
   - Add an unmissable Critical Safety Gate banner with non-compensable `No-Go` enforcement.
   - Display drill evidence progress bars without creating a false compensating total score.
4. **Builder Workspaces (Objective & Station Builders):**
   - Implement a responsive 2-column workspace layout (Form Inputs on start, Live Preview Card on end).
   - Add step indicators, inline validation, and sticky action bar (Save, Export JSON, Print).
5. **Case Diagnostic Lab (`/cases`):**
   - Enhance evidence vs assumption visual separation with dedicated tag badges (`badge-evidence`, `badge-assumption`).

### Tier 2 — System Consistency
- **Domains & Trifecta Explorer:** Interactive tabbed explorer for Cognitive, Psychomotor, and Affective domains.
- **Calibration Lab:** Descriptive inter-rater consistency view with rating comparison tables.
- **Performance Profiles & AAR:** Structured After-Action Review forms with expected vs observed performance fields.
- **Knowledge Checks & References:** High-readability source bibliography with filterable cards.

### Tier 3 — Micro-interactions & Polish
- 200ms cubic-bezier transition easing on tab switches, hover states, and drawer slides.
- `@media (prefers-reduced-motion: reduce)` accessibility overrides.
- Print/PDF CSS optimizations for clean page breaks and high-contrast typography.

---

## 3. Risk Assessment & Validation Safeguards

- **Functional Risk:** Zero changes to underlying data structures (`CurriculumProgress`, `SavedState`) or safety rules (`hasCritical => "no-go"`).
- **Build Target Compatibility:** Must pass both `vinext build` (OpenAI Sites target) and `next build --webpack` (Vercel target) with 0 errors.
- **Automated Regression:** All 10 unit tests and 176 Playwright browser tests across Chromium and WebKit must pass 100%.

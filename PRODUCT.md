# PRODUCT.md — Trifecta Performance Lab

## 1. Product Identity & Purpose
**Trifecta Performance Lab** is a bilingual (Arabic-first) professional workspace for designing, evaluating, diagnosing, and continuously improving performance-based training curricula in high-stakes operational environments.

## 2. Target Audience & Primary Users
- **Experienced Instructors & Field Evaluators**: Require rapid operational decision-making and low-ambiguity evaluation tools.
- **Instructor Developers & Master Trainers**: Need deep diagnostic insights into why performance succeeded or failed across physical, technical, and cognitive lenses.
- **Curriculum Designers & Unit Leaders**: Build structured multi-tier training frameworks with strict progression criteria and safety gates.
- **High-Stakes Operational Professionals**: Work under stringent safety constraints where ambiguity or improper diagnosis carries high operational cost.

## 3. Authoritative Core Workflow
The application enforces an authoritative, multi-tiered curriculum progression:
```
Curriculum ➔ Level ➔ Station ➔ Drill ➔ Evidence ➔ Gate ➔ Remediation or Progression (Go / No-Go / Retest / Need More Data)
```

## 4. Core Performance Model (The Trifecta)
Actual performance results strictly from the mutual interaction of three interdependent performance dimensions:
1. **Physical Performance**: Movement stability, control, physical readiness, endurance under load, baseline recovery.
2. **Technical Performance**: Standard compliance, direct safety, accuracy, stability, and repeatability of execution.
3. **Cognitive / Neurophysiological Performance**: Situational awareness, cognitive load management, decision speed, emotional regulation.

**Key Rule**: The Trifecta graphic is an explanatory diagnostic tool, not a visual decoration. It must visually demonstrate how these three dimensions converge into observable actual performance.

## 5. Non-Compensable Safety Invariant
An observed Critical Safety Failure always forces a non-compensable **No-Go** decision, regardless of aggregate numerical scores or perfect technical execution in other areas.

## 6. Technical Platform & Operating Context
- **Web Application & PWA**: Offline-capable, fast load times, client-side persistence with staged migration.
- **Bilingual & Directional**: Full Arabic RTL (default) and English LTR mirroring.
- **Responsive Matrix**: Native composability across Mobile (<768px), Tablet (768–1024px), Laptop (1025–1280px), and Large Desktop (>=1280px).
- **UX Requirement**: Supports long structured forms, rapid visual scanning, zero text clipping, and high contrast clarity.

## 7. Desired Character & Tone
- **Disciplined**: Focused on operational clarity and task completion.
- **Intelligent & Authoritative**: Grounded in empirical evidence and structured learning domains.
- **Calm & Precise**: Free from visual noise, artificial urgency, or unnecessary UI distraction.
- **Distinctive & Modern**: Clean, sophisticated, and contemporary without chasing ephemeral design fads.

## 8. Explicitly Rejected Anti-Patterns
- Generic SaaS dashboard templates & card walls.
- Glassmorphism & backdrop-blur gimmicks.
- Undifferentiated black-on-black geometry.
- Military cosplay & tactical visual clichés.
- Excessive amber hues & glowing sci-fi neon lines.
- Decorative background grid lines & dark pattern overlays.
- Text rendered directly over complex geometric shapes.
- Microscopic Arabic text sizes or compressed line heights.
- Raw mixed Arabic/English text collisions without bidi isolation.
- Oversized empty hero spaces & cramped content columns.
- Imperceptible or continuously looping animations.
- Mobile views that are merely scaled-down desktop layouts.

## 9. Non-Negotiable Preserved Invariants
- Schema-v3 data migration pipeline and atomic local storage.
- Immutable Gate-attempt history and evidence logs.
- Referential integrity for deletions and entity import/export.
- All 11 public routes and Builder Suite components.
- Critical Failure logic and all unit, contract, and E2E regression tests.

## 10. Primary User Jobs
1. Understand the Trifecta performance model.
2. Define measurable performance objectives.
3. Build a curriculum hierarchy: Level ➔ Station ➔ Drill ➔ Evidence ➔ Gate.
4. Identify missing or invalid curriculum information.
5. Evaluate observed performance against defined standards.
6. Distinguish authored Critical Failure criteria from observed failures.
7. Make and document defensible Gate decisions.
8. Assign remediation and preserve retest history.
9. Diagnose why performance succeeded or failed.
10. Export, import, review, and improve curriculum structures.

## 11. Information Hierarchy
The application visually distinguishes between:
- **Product Navigation**: Where the user is in the application.
- **Curriculum Hierarchy**: Curriculum ➔ Level ➔ Station ➔ Drill ➔ Evidence ➔ Gate.
- **Builder Progress**: Incomplete ➔ Valid ➔ Saved.
- **Operational Decision State**: Pending ➔ Go ➔ No-Go ➔ Need More Data ➔ Retest.
- **Safety State**: Normal ➔ Warning ➔ Observed Critical Safety Failure.

*Rules*: Systems are never visually conflated. A completed Builder does not mean a learner passed a Gate. A high aggregate score does not override an observed Critical Safety Failure.

## 12. Objective Builder Position
The Objective Builder is a supporting design tool and is not a hierarchical layer between Curriculum, Level, Station, Drill, Evidence, and Gate. Objectives may be referenced by Levels, Stations, or Drills, but remain visually and conceptually separate from the ordered Curriculum Builder Suite.

## 13. Critical Interface States
Clearly supports: empty state, draft state, valid state, saved state, unsaved changes, validation warning, validation error, incomplete evidence, Need More Data, Go, No-Go, observed Critical Safety Failure, remediation assigned, retest required, historical Gate attempt, import rejected, migration recovery, offline state. All critical states are understandable without relying on colour alone.

## 14. Arabic-First Design Principles
- Natural Arabic terminology and strong Arabic typographic hierarchy.
- Comfortable Arabic line height and appropriate line lengths.
- Correct directional isolation for English acronyms and technical terms.
- Numerals, metadata, icons, and progress indicators aligned correctly in RTL.
- Equal visual-review priority to English.

## 15. Responsive Product Priorities
- **Mobile**: Focused on reviewing information, checking curriculum structures, recording limited evidence, reviewing Gate status, making focused edits. Long forms broken into manageable sections.
- **Tablet**: Practical field use, evaluation, facilitation, and Station review.
- **Laptop & Desktop**: Full curriculum construction, hierarchy comparison, live preview, evidence review, side-by-side diagnostic analysis.

## 16. Motion Principles
- Demonstrating Trifecta convergence, transitioning between Builder stages, revealing validation results, confirming saved state, showing Gate decision changes, exposing remediation/retest relationships.
- Perceptible, restrained, non-looping, interruptible, transform/opacity-based, `prefers-reduced-motion` compatible.

## 17. Visual Priority Order
1. Safety-critical information
2. Current task and primary action
3. Curriculum hierarchy and context
4. Evidence and decision rationale
5. Validation and completion state
6. Supporting guidance
7. Secondary metadata

## 18. Content and Voice
Direct, professional, operational, concise, calm, evidence-oriented. Free from motivational marketing language or vague commands. Errors explain both problem and corrective action.

## 19. Accessibility Requirements
WCAG 2.2 AA target: full keyboard navigation, visible focus, semantic headings, labelled form controls, screen-reader announcements, min 44x44px touch targets, non-colour-only meaning, reduced-motion support, accessible reading order.

## 20. Redesign Success Criteria
1. Users explain Trifecta relationship after viewing landing-page model.
2. Users identify ordered Builder sequence without instruction.
3. Users distinguish Builder completion from Gate outcomes.
4. Users recognize observed Critical Safety Failure forces No-Go.
5. Users navigate Arabic & English without directional confusion.
6. Core workflows complete on mobile, tablet, and desktop.
7. Validation messages explain corrective actions clearly.
8. Gate-attempt history is reviewed without losing evidence.
9. Zero text overlap, clipping, or horizontal document overflow.
10. Product described as disciplined, precise, distinctive, and operational.

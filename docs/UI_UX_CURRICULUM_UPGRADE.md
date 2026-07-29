# UI/UX and curriculum architecture upgrade

## Impeccable audit

Physical scene: experienced trainers use the product in a dim classroom or evaluation area, often moving between a laptop and a tablet while discussing evidence. The retained charcoal surface reduces glare; amber remains reserved for current position, progression, and decisive actions.

| Dimension | Before | Key finding | Response |
|---|---:|---|---|
| Accessibility | 3/4 | The closed mobile navigation remained in the accessibility and keyboard flow | Hidden navigation now uses visibility and pointer-state control, with a dismissible scrim |
| Performance | 3/4 | Progress bars animated width/height and the interface used several broad shadows | Progress uses transforms; elevation is shorter and more controlled |
| Responsive design | 3/4 | The product adapted, but complex workflow relationships had no dedicated mobile strategy | Curriculum maps scroll as an intact sequence; workspaces and forms stack structurally |
| Theming | 3/4 | Strong tokens existed, but decorative grid and repeated treatment weakened the hierarchy | Removed the decorative body grid and reserved surface treatments for clear roles |
| Anti-patterns | 2/4 | Flat numbered navigation, repetitive cards, side-stripe notes, and metric-card repetition read as generated scaffolding | Added task groups, removed decorative numbering and side stripes, and replaced metrics with the curriculum anatomy |

Baseline audit health: **14/20 — Good, with structural improvements required.**

## Product decisions

- Signature interaction: the evidence-gated curriculum track.
- Navigation groups: Build understanding, Apply and assess, Instructor tools, Sources and boundaries.
- Authoritative hierarchy: Curriculum → Levels → Stations → Drills.
- Gate placement: only between consecutive Stations.
- Gate decisions: Go, No-Go, Need More Data, and Retest.
- Critical Safety Failure: stored as No-Go and enforced again in the effective-decision logic.
- Progress: evidence and Gate completion only; no default total performance score.
- Level access: learners progress sequentially; instructors may preview later Levels for design and facilitation.

## Applied recommendations

The hierarchy, Gate interaction, navigation grouping, device-local progress model, completion anchors, and sample curriculum content are applied product recommendations built on the user-approved architecture. They are not presented as independently validated training standards.

## Persistence migration

The existing `performance-lab-state` key remains unchanged. The saved object now carries `schemaVersion: 2` and an optional curriculum progress record. Older saved objective, station, case, quiz, language, and mode data load without alteration; absent curriculum data receives safe defaults.

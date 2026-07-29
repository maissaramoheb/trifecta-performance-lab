# Content architecture, data model, and assessment logic

## Information architecture

1. Home / Framework overview
2. Curriculum pathway
3. Learning Domains explorer
4. Trifecta explorer
5. Domains vs Trifecta comparison centre
6. Case diagnostic lab
7. Objective builder
8. Station builder
9. Assessment calibration
10. Performance profile
11. AAR and intervention
12. Knowledge checks
13. Reference library
14. About and framework boundaries

The interface exposes Learner mode for explanations, cases, checks, and progress. Instructor mode adds all builders, calibration, profiles, and printable outputs.

## Authoritative curriculum hierarchy

Curriculum → Levels → Stations → Drills, with an evidence-based Gate between Station N and Station N+1.

Drill evidence → Station performance record → Gate decision → Level progress → Curriculum progress.

The Gate supports Go, No-Go, Need More Data, and Retest. A Critical Safety Failure always forces No-Go and cannot be offset by another Drill or an aggregate score.

“Lesson” and “Module” are supporting instructional material only. They are not competing hierarchy layers.

## Primary workflow

Learning Requirement → Learning Domain → Learning Level → Station → Drill → Observable Evidence → Trifecta Diagnosis → Gate Decision → AAR → Training Intervention → Curriculum Improvement.

## Data model

- `Bi`: Arabic and English text pair.
- `Level`: definition, evidence, example, activity, assessment, mistake, and sample SMART objective.
- `CognitiveFamily`: definition, operational question, observable evidence, metric, common misdiagnosis, alternative explanation, safe training method, and interpretation limit.
- `Case`: level, scenario, facts, assumptions, domain, pillar, primary/secondary causes, missing evidence, intervention, and decision.
- `ObjectiveState`: requirement, gap, domain, level, behaviour, condition, criterion, critical failure, and evidence.
- `StationState`: full Station Card including baseline, variables, loads, checklist, critical failures, collected data, AAR, remediation, and retest.
- `Assessor`: observation, checklist, framework selections, critical failure, decision, evidence, confidence, and missing information.
- `Curriculum`: bilingual curriculum identity and ordered Levels.
- `CurriculumLevel`: outcome, ordered Stations, and transition Gates.
- `CurriculumStation`: performance requirement, baseline, purpose, and Drills.
- `CurriculumDrill`: condition, required evidence, Learning Domain, and Trifecta pillar.
- `CurriculumProgress`: versioned device-local Drill records, Gate decisions, and current location.

All content models are typed in TypeScript and stored in editable source files.

## Assessment logic

1. Observation is recorded before interpretation.
2. Facts and assumptions are presented separately.
3. Primary and secondary causes are both required.
4. Missing evidence and alternative explanations increase diagnostic quality.
5. `Need More Data` is a valid decision, not a failure to decide.
6. A Critical Safety Failure always overrides additive scoring and produces No-Go.
7. Profiles contain dimensional ratings and evidence notes; there is no default total.
8. Calibration displays descriptive agreement/disagreement only and states that it is not formal scientific validation.
9. Drill evidence rolls up to a Station summary without becoming a compensating total score.
10. A following Station unlocks only when the preceding Gate’s effective decision is Go.

## MVP delivered

- All source learning content and comparison logic.
- Fifteen realistic cases at three levels.
- Objective and Station Card builders with validation.
- Calibration, profile, AAR, intervention, checks, references, local persistence, print/export, and PWA core.

## Advanced phase candidates

- Instructor-authored reusable case packs.
- Optional encrypted team sync with explicit data governance.
- Versioned station/checklist libraries and approval workflows.
- Longitudinal performance imports with provenance and confidence rules.
- Formal assessor-study module only after an appropriate measurement design is approved.

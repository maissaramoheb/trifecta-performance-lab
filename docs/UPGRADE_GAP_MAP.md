# Visual and content upgrade gap map

## Audit basis

- Existing application routes, interactive tools, persistence, print/export, PWA files, tests, and deployment configuration.
- `Trifecta .docx` and `Learning Domains + The Trifecta.docx`, including their examples, tables, speaker notes, visual directions, cognitive-family tree, assessment logic, and stated coverage gaps.

## Gap map

| Area | Existing coverage | Gap found | Implemented response |
|---|---|---|---|
| Core framework | Correct build-versus-diagnose distinction | The relationship was explained but not embodied in a distinctive interaction | Added an interactive Trifecta performance instrument and a six-stage evidence workflow |
| Visual hierarchy | Consistent dark cards | Most cards had similar proportions and depth | Added metric, comparison, feature, and diagnostic card roles with explicit spacing and responsive spans |
| Motion | Basic hover and progress transitions | No coordinated page, diagram, workflow, or diagnostic transitions | Added short page, detail, workflow, instrument, profile, and interaction motion with reduced-motion support |
| Cognitive map | All ten families present | Four source phases were only labels inside family details | Added a selectable four-phase operational map linked to all ten families |
| Diagnosis | Timer case and case lab present | “Same result, different cause” was not shown as a compact intervention matrix | Added four No-Go patterns linking cause, discriminating evidence, and intervention |
| Weaker source coverage | ERSI, RSVMI, FRFRC, and SCR cases already present; SA included in the explorer | The source warns that these families need cautious, stronger interpretation | Elevated phase navigation and retained explicit limits against single-metric or single-observation diagnosis |
| Arabic/RTL | Arabic-first and functional RTL | Dense cards needed more expansion space and stronger mixed-direction handling | Increased responsive card space, preserved logical CSS properties, and retained `bdi`/direction controls |
| Safety and scope | Critical Failure gate and safe examples present | No content gap | Preserved the non-compensable gate and excluded offensive tactics, detailed manipulation, and clinical diagnosis |

## Source-derived additions

- The four-phase cognitive/neurophysiological organization.
- The explicit “same result, different cause, different intervention” structure.
- The distinction between psychomotor development and technical output.
- The progression from Baseline to isolated load, first breakdown, Reset, and Retest.
- The rule that not every station should measure every cognitive family.

## Applied product recommendations

- The interactive triangle, card-role system, animation choreography, and responsive diagnostic decks.
- The use of short motion to communicate selection, sequence, and state change.
- The responsive layout and content-density rules used to protect Arabic readability.

## Preserved behavior

- Arabic default, English parity, RTL/LTR switching.
- Learner and Instructor modes.
- Fifteen diagnostic cases and immediate feedback.
- Objective and Station builders.
- Calibration, profiles, AAR, knowledge checks, references, persistence, print/export, and PWA behavior.
- Critical Safety Failure always produces No-Go and cannot be offset by a score.

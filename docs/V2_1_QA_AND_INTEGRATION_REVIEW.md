# V2.1 QA and Antigravity integration review

## Contract-test inventory

### Migration and compatibility

- v1 ambiguous rating zero becomes unselected.
- v2 evidence, rating zero chosen explicitly, failure flags, active IDs and Gate notes survive migration.
- missing collections produce safe empty/default collections without inferred Go.
- unknown legacy fields are retained without being executed or rendered as trusted HTML.
- corrupt JSON leaves original storage untouched and exposes recovery.
- future schema is rejected without overwriting data.
- running migration twice produces an equivalent v3 store.
- backup restore returns byte-identical pre-migration data.

### IDs and references

- rename/reorder/language switch/export round-trip preserves every ID.
- duplicate Level, Station, Drill and Gate IDs are rejected.
- every foreign key is validated in both directions.
- copy creates new IDs and rewrites descendant references.
- deletion cannot leave orphan Drills or Gates.
- self-loop, cycle and unintended multiple outgoing Gates are blocked.
- active IDs always resolve after import, deletion and rollback.

### Gate safety

- configured critical-failure criteria alone do not force No-Go.
- one observed Critical Failure forces No-Go at rating 0, 1, 2 and 3.
- one observed Critical Failure forces No-Go even when every other Drill scores 3.
- UI, stored record, export and re-import all preserve the forced No-Go.
- manual Go selection is disabled/rejected while a failure event exists.
- clearing a failure event requires an auditable correction; it must not silently change No-Go to Go.
- missing evidence cannot produce Go.
- Retest creates or references a new attempt; it does not erase the failed attempt.

### Import/export

- valid wrapped and documented legacy payloads are accepted through explicit version routes.
- malformed, oversized, deeply nested and unsupported payloads are rejected.
- duplicate IDs, broken references, invalid enums, cycles and unsafe decisions block import.
- preview summarizes create/update/conflict counts before mutation.
- cancel leaves current data byte-identical.
- failed commit restores the pre-import backup.
- Arabic/English strings and mixed-direction text round-trip without corruption.

## Playwright plan

Run each critical workflow in Chromium and WebKit at 390×844, 768×1024 and 1440×900:

1. Create Level → Station → Drill → Gate, save, reload and confirm persistence.
2. Rename and reorder entities; confirm IDs and relationships remain stable.
3. Attempt deletion with dependants; verify explicit impact review and atomic result.
4. Record sufficient evidence and complete a Go path.
5. Record a Critical Failure after high scores; verify forced No-Go everywhere.
6. Exercise Need More Data → remediation → Reset → Retest without losing history.
7. Export, import-preview, cancel, import-confirm and rollback.
8. Switch Arabic/English during partially completed forms; verify values and direction.
9. Verify empty, validation, conflict, storage-quota and corrupt-import states.
10. Assert no console errors, hydration errors or document-level horizontal overflow.

## Accessibility plan

- semantic heading order and one page-level heading;
- complete keyboard operation with logical tab order;
- visible focus and focus restoration after dialogs;
- error summary focus plus `aria-describedby` field errors;
- live announcements for save, import, Gate decision and rollback;
- status text/icons in addition to colour;
- 44×44 CSS-pixel touch targets where practical;
- dialog focus trap, Escape handling and labelled title/description;
- RTL arrow/icon mirroring and safe mixed-direction text;
- 200% zoom and reflow without loss of function;
- reduced-motion behavior;
- automated axe scan with zero serious/critical findings, followed by manual screen-reader sampling.

## Integration-review checklist

- [ ] Antigravity commits touch only the approved V2.1 scope.
- [ ] Schema version is exactly 3 and migration is deterministic and side-effect free.
- [ ] Definition criteria and observed performance events use different fields/types.
- [ ] No code infers Go from score, migration defaults, missing data or aggregate results.
- [ ] Critical Failure forces persisted and displayed No-Go.
- [ ] Stable IDs survive rename, reorder, localization and round-trip.
- [ ] Referential integrity is enforced on create, update, copy, delete and import.
- [ ] Import validation is structural and semantic, not array-presence only.
- [ ] Cycles are blocking for the sequential model.
- [ ] Backup is created before mutation and rollback is tested.
- [ ] Existing schema-v2 progress and unrelated preferences remain available.
- [ ] Arabic is default; all labels, errors and empty states have equivalent English.
- [ ] Forms expose accessible names, descriptions, errors and status announcements.
- [ ] Critical workflows pass on Chromium and WebKit, desktop and mobile.
- [ ] `npm ci`, lint, TypeScript, unit tests, both builds and Playwright pass.
- [ ] No secrets, environment changes, new analytics or unnecessary dependencies.
- [ ] Production remains unchanged; merge requires owner approval.

## Issues Antigravity must address before integration

1. Current `GateBuilder` derives `hasCritical` from non-empty authored `criticalFailures` criteria. Seeded criteria are non-empty, so this incorrectly forces every Gate to No-Go. Introduce observed failure records/flags and base the override only on actual events.
2. Current import validation checks mainly for array presence and treats circular progression as a warning. Add duplicate-ID, field, enum, bilingual-value and complete referential-integrity validation; cycles must block the sequential curriculum model.
3. Current migration accepts entity arrays through unchecked type assertions. Validate each entity before persistence and reject unsupported future schema versions.
4. Current migration performs localStorage backup as an internal side effect. Move backup/atomic promotion/rollback to storage orchestration and test byte-identical recovery.
5. Current deletion helpers can change only one active ID while leaving other active descendants invalid. Recalculate all active selections after cascading deletion.
6. Current Gate model stores only one mutable decision and evidence string. Preserve attempt/event history so Retest does not erase the original No-Go and its evidence.

# V2.1 schema-v3 migration and data contract

Status: integration contract for the V2.1 Curriculum Builder Suite. This document does not change application implementation.

## Safety invariants

1. A configured `criticalFailureCriteria` value describes what would count as a failure. It is not evidence that a failure occurred.
2. An observed critical-failure event always makes the effective Gate decision `no-go`.
3. A score, average, completed Drill, manual selection, import, or migration can never override that `no-go`.
4. Missing or ambiguous evidence can produce only `pending` or `need-more-data`; migration must never infer `go`.
5. IDs are immutable identity keys. User-visible names may change without changing IDs.

## Required schema-v3 separation

The implementation must keep authoring data separate from performance records:

- Gate definition: criteria, required evidence, permitted transitions, remediation, Reset and Retest rules.
- Gate record: observed evidence, critical-failure events, decision, rationale, assessor and timestamp when available.
- Drill definition: objective, conditions, standard and critical-failure criteria.
- Drill record: rating, evidence and observed critical-failure events.

Do not derive an observed event from a non-empty criteria field.

## Stable IDs

- IDs MUST be opaque, non-empty, unique within their entity type and stable across rename, reorder, language change, export/import and migration.
- New IDs SHOULD use UUID/ULID or another collision-resistant generator. Slugs derived from titles are not stable IDs.
- `Level.stationIds`, `Station.levelId`, `Station.drillIds`, `Station.gateId`, `Drill.stationId`, `Gate.fromStationId` and `Gate.nextStationId` are foreign keys.
- The same ID MUST NOT silently identify a different entity after import.
- Copy/duplicate creates new IDs for the copied entity and all copied descendants, then rewrites internal references atomically.

## Referential-integrity rules

Validation must reject, rather than silently repair, imports containing:

- duplicate IDs;
- a Station whose `levelId` does not exist;
- a Drill whose `stationId` does not exist;
- a Level `stationIds` entry that is missing or belongs to another Level;
- a Station `drillIds` entry that is missing or belongs to another Station;
- a Station `gateId` that is missing or has a different `fromStationId`;
- a Gate source or target that does not exist;
- a self-referencing Gate;
- multiple outgoing progression Gates for a Station unless the product explicitly introduces branching;
- a cycle in a curriculum defined as sequential.

Deletion must be an explicit transaction: cancel, delete dependants, or reassign them. It must update active selections and both sides of every relationship atomically. No orphan may be persisted.

## Migration matrix

| Input | Expected result |
|---|---|
| absent/corrupt storage | fresh v3 defaults; original raw value retained for recovery when available |
| schema v1 rating `0` created ambiguously | rating becomes unselected; never infer Go |
| valid schema v2 progress | preserve active Level/Station, Drill evidence, ratings, failure flags and Gate records; create v3 authoring defaults without overwriting evidence |
| partial schema v2 | preserve valid fields; report field-level warnings; use safe defaults only for missing fields |
| schema v3 | validate, normalize optional fields and preserve IDs |
| future schema | reject as unsupported; do not downgrade or overwrite storage |

Migration must be pure and deterministic. Browser backup is an orchestration concern, not a side effect inside the migration function.

## Storage and rollback

- Read the current raw value first.
- Write an immutable backup key containing source schema and timestamp before the first v3 write.
- Validate the migrated store fully before replacing the active key.
- Write via a temporary key, re-read/parse/validate it, then promote it.
- On any exception, retain the original active value and show a recoverable error.
- Rollback restores the exact pre-migration bytes, not a re-serialized approximation.
- Retain at least the most recent successful backup and document storage quota behaviour.

## Import/export contract

Exports require `format`, `schemaVersion`, `exportedAt`, `generator`, `curriculumId`, `store` and an integrity digest when practical. Import is preview-first and must not mutate active data until validation and user confirmation succeed.

Reject malformed JSON, unsupported versions, duplicate IDs, broken references, unsafe Gate decisions, invalid enums, invalid bilingual values, invalid dates and excessive payload size/depth. Report cycles and structural ambiguity as blocking errors, not warnings.

An imported `go` with any observed critical-failure event is invalid. The safe normalized result is `no-go`, but the import must require explicit review rather than silently changing the decision.

Rollback after import uses the same atomic backup mechanism as migration. Exported content must never include unrelated local preferences or hidden performance data.

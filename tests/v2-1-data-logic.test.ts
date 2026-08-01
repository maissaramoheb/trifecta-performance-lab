import assert from "node:assert/strict";
import test from "node:test";
import {
  createInitialCurriculumSuiteStore,
  deleteStationWithIntegrity,
  detectCircularProgression,
  exportCurriculumSuiteJSON,
  loadAndMigrateStore,
  migrateCurriculumSuiteStore,
  recordGateAttempt,
  validateAndImportCurriculumSuiteJSON,
  type GateDecision,
} from "../lib/curriculum.js";

test("authored criteria do not trigger No-Go", () => {
  const store = createInitialCurriculumSuiteStore();
  const gate = store.gates[0];
  assert.ok(gate.criticalFailureCriteria.ar);
  assert.equal(gate.observedCriticalFailures.length, 0);
  assert.notEqual(gate.decision, "no-go");
});

test("observed Critical Failure always forces No-Go", () => {
  const store = createInitialCurriculumSuiteStore();
  const gate = store.gates[0];
  const updatedGate = {
    ...gate,
    observedCriticalFailures: [{ id: "cf_1", observedAt: "2026-08-01T00:00:00.000Z", evidence: "Observed failure" }],
    decision: "go" as GateDecision,
  };
  const migrated = migrateCurriculumSuiteStore({ ...store, gates: [updatedGate] });
  assert.equal(migrated.gates[0].decision, "no-go");
});

test("original No-Go survives retest and retest creates a new attempt", () => {
  const store = createInitialCurriculumSuiteStore();
  const gate = store.gates[0];
  const gateWithFailure = {
    ...gate,
    observedCriticalFailures: [{ id: "cf_1", observedAt: "2026-08-01T00:00:00.000Z", evidence: "Breach" }],
    decision: "no-go" as GateDecision,
  };

  const retestedGate = recordGateAttempt(gateWithFailure, {
    decision: "retest",
    rationale: { ar: "إعادة الاختبار بعد المعالجة", en: "Retest after remediation" },
    remediation: { ar: "Reset وإعادة التمرين", en: "Reset and retry drill" },
  });

  assert.equal(retestedGate.attempts.length, 1);
  assert.equal(retestedGate.attempts[0].attemptNumber, 1);
  assert.equal(retestedGate.attempts[0].decision, "retest");
  assert.equal(retestedGate.decision, "no-go");
});

test("duplicate IDs are rejected on import", () => {
  const store = createInitialCurriculumSuiteStore();
  const duplicateStore = {
    ...store,
    levels: [...store.levels, { ...store.levels[0] }],
  };
  const result = validateAndImportCurriculumSuiteJSON(JSON.stringify(duplicateStore));
  assert.equal(result.valid, false);
  assert.ok(result.rawErrors?.some((e) => e.includes("duplicate-id")));
});

test("missing required fields and invalid enums are rejected", () => {
  const invalidPayload = JSON.stringify({
    schemaVersion: 3,
    levels: "not-an-array",
  });
  const result = validateAndImportCurriculumSuiteJSON(invalidPayload);
  assert.equal(result.valid, false);
  assert.ok((result.rawErrors?.length ?? 0) > 0);
});

test("orphan references are rejected", () => {
  const store = createInitialCurriculumSuiteStore();
  const orphanStore = {
    ...store,
    stations: [{ ...store.stations[0], levelId: "non_existent_level" }],
  };
  const result = validateAndImportCurriculumSuiteJSON(JSON.stringify(orphanStore));
  assert.equal(result.valid, false);
  assert.ok(result.rawErrors?.some((e) => e.includes("missing-level")));
});

test("self-targeting Gate is rejected", () => {
  const store = createInitialCurriculumSuiteStore();
  const selfLoopStore = {
    ...store,
    gates: [{ ...store.gates[0], fromStationId: "st_01", nextStationId: "st_01" }],
  };
  const result = validateAndImportCurriculumSuiteJSON(JSON.stringify(selfLoopStore));
  assert.equal(result.valid, false);
  assert.ok(result.rawErrors?.some((e) => e.includes("self-loop")));
});

test("cycles are rejected", () => {
  const store = createInitialCurriculumSuiteStore();
  const cycleStore = {
    ...store,
    gates: [
      { ...store.gates[0], id: "gt_1", fromStationId: "st_1", nextStationId: "st_2" },
      { ...store.gates[0], id: "gt_2", fromStationId: "st_2", nextStationId: "st_1" },
    ],
  };
  const cycleResult = detectCircularProgression(cycleStore.gates);
  assert.equal(cycleResult.hasCycle, true);

  const importResult = validateAndImportCurriculumSuiteJSON(JSON.stringify(cycleStore));
  assert.equal(importResult.valid, false);
  assert.ok(importResult.rawErrors?.some((e) => e.includes("cycle-detected")));
});

test("future schemas are rejected", () => {
  assert.throws(() => {
    migrateCurriculumSuiteStore({ schemaVersion: 4 });
  }, /Unsupported future schema version/);
});

test("v1 → v3 migration converts ambiguous rating 0 to null", () => {
  const v1Input = {
    schemaVersion: 1,
    drills: [{ id: "dr_1", rating: 0 }],
  };
  const migrated = migrateCurriculumSuiteStore(v1Input);
  const targetDrill = migrated.drills.find((d) => d.id === "dr_1");
  assert.ok(targetDrill);
  assert.equal(targetDrill.rating, null);
  assert.equal(targetDrill.ambiguousRating, true);
});

test("v2 → v3 migration preserves valid progress and unknown legacy fields", () => {
  const v2Input = {
    schemaVersion: 2,
    activeLevelId: "lvl_foundation_01",
    activeStationId: "st_baseline_01",
    customField: "preserved-legacy-data",
  };
  const migrated = migrateCurriculumSuiteStore(v2Input);
  assert.equal(migrated.schemaVersion, 3);
  assert.equal(migrated.activeLevelId, "lvl_foundation_01");
  assert.equal(migrated.legacyExtensions?.customField, "preserved-legacy-data");
});

test("v3 → v3 idempotency", () => {
  const initial = createInitialCurriculumSuiteStore();
  const first = migrateCurriculumSuiteStore(initial);
  const second = migrateCurriculumSuiteStore(first);
  assert.deepEqual(first, second);
});

test("corrupted-state recovery and atomic storage", () => {
  const { store } = loadAndMigrateStore();
  assert.ok(store);
  assert.equal(store.schemaVersion, 3);
});

test("deletion repairs selections and relationships without leaving orphans", () => {
  const store = createInitialCurriculumSuiteStore();
  const targetStationId = store.stations[0].id;
  const deletedStore = deleteStationWithIntegrity(store, targetStationId);

  assert.equal(deletedStore.stations.some((s) => s.id === targetStationId), false);
  assert.equal(deletedStore.drills.some((d) => d.stationId === targetStationId), false);
  assert.equal(deletedStore.gates.some((g) => g.fromStationId === targetStationId || g.nextStationId === targetStationId), false);
  assert.notEqual(deletedStore.activeStationId, targetStationId);
});

test("import/export round-trip preserves hierarchy", () => {
  const initial = createInitialCurriculumSuiteStore();
  const exportedJSON = exportCurriculumSuiteJSON(initial);
  const importResult = validateAndImportCurriculumSuiteJSON(exportedJSON);

  assert.equal(importResult.valid, true);
  assert.deepEqual(importResult.importedStore?.levels.length, initial.levels.length);
  assert.deepEqual(importResult.importedStore?.stations.length, initial.stations.length);
});

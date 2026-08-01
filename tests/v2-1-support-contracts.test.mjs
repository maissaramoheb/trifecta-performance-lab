import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const fixture = async (name) => JSON.parse(await readFile(new URL(`./fixtures/v2-1/${name}`, import.meta.url), "utf8"));

function integrityErrors(store) {
  const errors = [];
  const unique = (items, type) => {
    const ids = new Set();
    for (const item of items) {
      if (!item.id || ids.has(item.id)) errors.push(`${type}:duplicate-or-empty:${item.id ?? ""}`);
      ids.add(item.id);
    }
    return ids;
  };
  const levelIds = unique(store.levels, "level");
  const stationIds = unique(store.stations, "station");
  const drillIds = unique(store.drills, "drill");
  const gateIds = unique(store.gates, "gate");

  for (const level of store.levels) for (const id of level.stationIds) if (!stationIds.has(id)) errors.push(`level:missing-station:${id}`);
  for (const station of store.stations) {
    if (!levelIds.has(station.levelId)) errors.push(`station:missing-level:${station.levelId}`);
    for (const id of station.drillIds) if (!drillIds.has(id)) errors.push(`station:missing-drill:${id}`);
    if (station.gateId && !gateIds.has(station.gateId)) errors.push(`station:missing-gate:${station.gateId}`);
  }
  for (const drill of store.drills) if (!stationIds.has(drill.stationId)) errors.push(`drill:missing-station:${drill.stationId}`);
  for (const gate of store.gates) {
    if (!stationIds.has(gate.fromStationId)) errors.push(`gate:missing-source:${gate.fromStationId}`);
    if (gate.nextStationId && !stationIds.has(gate.nextStationId)) errors.push(`gate:missing-target:${gate.nextStationId}`);
    if (gate.fromStationId === gate.nextStationId) errors.push(`gate:self-loop:${gate.id}`);
  }
  return errors;
}

test("valid schema-v3 fixture has stable unique IDs and complete references", async () => {
  const store = await fixture("schema-v3-valid.json");
  assert.equal(store.schemaVersion, 3);
  assert.deepEqual(integrityErrors(store), []);
});

test("broken schema-v3 references are blocking validation errors", async () => {
  const errors = integrityErrors(await fixture("schema-v3-broken-references.json"));
  assert.ok(errors.length >= 6, errors.join("\n"));
  assert.ok(errors.some((error) => error.startsWith("gate:self-loop:")));
});

test("authored failure criteria alone do not indicate an observed failure", async () => {
  const store = await fixture("schema-v3-valid.json");
  const gate = store.gates[0];
  assert.ok(gate.criticalFailureCriteria.ar);
  assert.equal(gate.observedCriticalFailures.length, 0);
  assert.equal(gate.decision, "pending");
});

test("one observed Critical Failure is non-compensable despite perfect ratings", async () => {
  const store = await fixture("schema-v3-critical-failure.json");
  assert.ok(store.drills.every((drill) => drill.rating === 3));
  assert.ok(store.drills.some((drill) => drill.observedCriticalFailures.length > 0));
  assert.equal(store.gates[0].decision, "no-go");
});

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Arabic-first application shell", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<html[^>]*lang="ar"[^>]*dir="rtl"/i);
  assert.match(html, /Trifecta Performance Lab/i);
  assert.match(html, /اقرأ الأداء كاملًا/);
  assert.match(html, /Learning Domains/);
  assert.match(html, /لا تشرح الأداء الكامل/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("all public module routes return the application", async () => {
  const routes = [
    "overview", "curriculum", "domains", "trifecta", "comparison", "cases",
    "objective-builder", "station-builder", "calibration", "profile",
    "aar", "checks", "references", "about",
  ];
  for (const route of routes) {
    const response = await render(`/${route}`);
    assert.equal(response.status, 200, route);
    assert.match(await response.text(), /TRIFECTA/i, route);
  }
});

test("critical safety and diagnostic-restraint rules are encoded", async () => {
  const [component, content] = await Promise.all([
    readFile(new URL("../components/TrainingApp.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/content.ts", import.meta.url), "utf8"),
  ]);
  assert.match(component, /Critical Safety Gate/);
  assert.match(component, /NON-COMPENSABLE/);
  assert.match(component, /Need More Data/);
  assert.match(content, /لا تشخّص من ملاحظة واحدة|لا نستنتج SA/);
  assert.match(content, /تتطلب بيانات طولية|Requires longitudinal data/);
  assert.equal((content.match(/\bC\(\d+,/g) ?? []).length, 15);
});

test("curriculum hierarchy, evidence roll-up, and Gate safety are encoded", async () => {
  const [workspace, curriculum, component] = await Promise.all([
    readFile(new URL("../components/CurriculumWorkspace.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/curriculum.ts", import.meta.url), "utf8"),
    readFile(new URL("../components/TrainingApp.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(curriculum, /CurriculumLevel/);
  assert.match(curriculum, /CurriculumStation/);
  assert.match(curriculum, /CurriculumDrill/);
  assert.match(curriculum, /fromStationId/);
  assert.match(workspace, /"need-more-data"/);
  assert.match(workspace, /"retest"/);
  assert.match(workspace, /if \(hasCritical\) return "no-go"/);
  assert.match(workspace, /decision: "no-go"/);
  assert.match(component, /schemaVersion:\s*2/);
  assert.match(component, /x\.curriculum\?\.schemaVersion === 1/);
});

test("source-driven cognitive phases and diagnostic intervention patterns are present", async () => {
  const [component, styles] = await Promise.all([
    readFile(new URL("../components/TrainingApp.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  assert.match(component, /أربع مراحل · عشر عائلات/);
  assert.match(component, /Same decision · different causes/);
  assert.match(component, /Four No-Go cases do not need the same remedy/);
  assert.match(component, /mobile-mode/);
  assert.match(styles, /\.card-role-metric/);
  assert.match(styles, /\.card-role-diagnostic/);
  assert.match(styles, /prefers-reduced-motion/);
});

test("PWA core and privacy controls are present", async () => {
  const [manifest, sw, component, layout] = await Promise.all([
    readFile(new URL("../public/manifest.webmanifest", import.meta.url), "utf8"),
    readFile(new URL("../public/sw.js", import.meta.url), "utf8"),
    readFile(new URL("../components/TrainingApp.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(manifest, /"display":\s*"standalone"/);
  assert.match(manifest, /icon-192\.png/);
  assert.match(manifest, /icon-512\.png/);
  assert.match(sw, /caches\.open/);
  assert.match(sw, /trifecta-core-v4/);
  assert.match(sw, /"\/curriculum"/);
  assert.match(sw, /response\.ok/);
  assert.match(sw, /pathname\.startsWith\("\/assets\/"\)/);
  assert.match(component, /localStorage/);
  assert.match(component, /navigator\.serviceWorker/);
  assert.match(layout, /vite:preloadError/);
  assert.match(layout, /trifecta-preload-retry/);
});

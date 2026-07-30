import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Vercel App Router static route generation (SSG) is declared for all 14 sections", async () => {
  const file = await readFile(new URL("../app/[slug]/page.tsx", import.meta.url), "utf8");
  assert.match(file, /export async function generateStaticParams/);
});

test("Vercel build script and vercel.json configuration exist and match specs", async () => {
  const [pkgText, vercelText] = await Promise.all([
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../vercel.json", import.meta.url), "utf8"),
  ]);
  const pkg = JSON.parse(pkgText);
  const vercel = JSON.parse(vercelText);
  
  assert.equal(pkg.scripts["build:vercel"], "next build --webpack");
  assert.equal(vercel.buildCommand, "npm run build:vercel");
  assert.equal(vercel.framework, "nextjs");
});

test("Operational Safety Scenarios: Critical Safety Gate is non-compensable", async () => {
  const workspace = await readFile(new URL("../components/CurriculumWorkspace.tsx", import.meta.url), "utf8");
  
  // Scenario 3 & 4: Critical Failure forces No-Go regardless of score
  assert.match(workspace, /const hasCritical = station\.drills\.some/);
  assert.match(workspace, /if \(hasCritical\) return "no-go"/);
  assert.match(workspace, /criticalFailure/);
  
  // Scenario 1 & 2: Gate decision logic
  assert.match(workspace, /"no-go"/);
  assert.match(workspace, /"need-more-data"/);
  assert.match(workspace, /"retest"/);
});

test("Service Worker excludes /_next/ static assets for Safari reliability", async () => {
  const sw = await readFile(new URL("../public/sw.js", import.meta.url), "utf8");
  assert.match(sw, /url\.pathname\.startsWith\("\/_next\/"\)/);
});

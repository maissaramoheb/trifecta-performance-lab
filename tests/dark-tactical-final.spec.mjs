import { test, expect } from "@playwright/test";

const BASE_URL = process.env.TEST_URL || "http://localhost:3000";
const output = "docs/dark-tactical-final";

async function openReady(page, path = "/", viewport = { width: 1440, height: 900 }) {
  await page.setViewportSize(viewport);
  await page.goto(`${BASE_URL}${path}`, { waitUntil: "networkidle" });
  await page.locator("html[data-app-ready='true']").waitFor();
}

async function ensureLanguage(page, language) {
  const current = await page.locator("html").getAttribute("lang");
  if (current !== language) await page.locator(".language").click();
  await expect(page.locator("html")).toHaveAttribute("lang", language);
  await expect(page.locator("html")).toHaveAttribute("dir", language === "ar" ? "rtl" : "ltr");
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    window.scrollTo(0, 0);
  });
}

async function enableInstructor(page) {
  const menu = page.locator(".menu-button:visible");
  if (await menu.count()) {
    await menu.click();
    await page.locator(".mobile-mode button").filter({ hasText: /وضع المدرب|المدرب|Instructor/ }).click();
  } else {
    await page.locator(".top-actions .segmented button").filter({ hasText: /وضع المدرب|المدرب|Instructor/ }).click();
  }
  await expect(page.locator("#main-nav")).not.toHaveClass(/open/);
}

async function assertNoPageOverflow(page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
}

test("signature pyramid settles with three visible faces and collision-free external controls", async ({ page }) => {
  await openReady(page);
  await ensureLanguage(page, "ar");
  const instrument = page.locator(".trifecta-instrument");
  await expect(instrument).toBeVisible();
  await expect(instrument).toHaveClass(/stage-[0-5]/);
  await expect(instrument).toHaveClass(/stage-5/, { timeout: 2500 });

  const faces = page.locator(".pyramid-face.visible");
  await expect(faces).toHaveCount(3);
  const faceOpacity = await faces.evaluateAll((nodes) => nodes.map((node) => Number(getComputedStyle(node).opacity)));
  expect(faceOpacity.every((opacity) => opacity >= 0.85)).toBeTruthy();

  const instrumentBox = await instrument.boundingBox();
  const svgBox = await page.locator(".trifecta-pyramid-svg").boundingBox();
  expect(instrumentBox).not.toBeNull();
  expect(svgBox).not.toBeNull();
  expect(svgBox.x).toBeGreaterThanOrEqual(instrumentBox.x);
  expect(svgBox.x + svgBox.width).toBeLessThanOrEqual(instrumentBox.x + instrumentBox.width + 1);

  const controls = await page.locator(".architecture-node").evaluateAll((nodes) => nodes.map((node) => {
    const rect = node.getBoundingClientRect();
    return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
  }));
  for (let first = 0; first < controls.length; first += 1) {
    for (let second = first + 1; second < controls.length; second += 1) {
      const a = controls[first];
      const b = controls[second];
      const overlaps = a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
      expect(overlaps).toBeFalsy();
    }
  }
  await assertNoPageOverflow(page);
});

test("reduced motion renders the complete model immediately", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openReady(page, "/", { width: 390, height: 844 });
  const settled = await page.locator(".pyramid-face").evaluateAll((faces) => faces.map((face) => {
    const style = getComputedStyle(face);
    return { opacity: Number(style.opacity), transform: style.transform, duration: style.animationDuration };
  }));
  expect(settled).toHaveLength(3);
  expect(settled.every(({ opacity, transform }) => opacity === 1 && transform === "none")).toBeTruthy();
  await page.screenshot({ path: `${output}/reduced-motion-settled-mobile.png` });
  await assertNoPageOverflow(page);
});

test("Critical Safety Failure interrupts progression and locks mandatory No-Go", async ({ page }) => {
  await openReady(page, "/curriculum-builder", { width: 390, height: 844 });
  await ensureLanguage(page, "ar");
  await enableInstructor(page);
  await page.locator(".suite-tab-btn").nth(3).click();
  await page.locator("#observed-cf-toggle").check();
  const alert = page.locator(".critical-safety-alert").first();
  await expect(alert).toContainText("CRITICAL SAFETY FAILURE OBSERVED");
  await expect(alert).toContainText("PROGRESSION INTERRUPTED");
  await expect(alert).toContainText("MANDATORY NO-GO");
  await expect(page.locator(".effective-decision")).toContainText("No-Go");
  const decisionButtons = page.locator(".decision-options button");
  await expect(decisionButtons.nth(0)).toBeDisabled();
  await expect(decisionButtons.nth(1)).toHaveAttribute("aria-pressed", "true");
  await assertNoPageOverflow(page);
});

test("Arabic route matrix has no clipping, bidi corruption, or horizontal overflow", async ({ page }) => {
  const routes = ["/", "/domains", "/trifecta", "/comparison", "/curriculum", "/cases", "/objective-builder", "/curriculum-builder", "/calibration", "/profile", "/aar", "/checks", "/references", "/about"];
  for (const path of routes) {
    await openReady(page, path, { width: 320, height: 568 });
    await ensureLanguage(page, "ar");
    await assertNoPageOverflow(page);
    const text = await page.locator("body").innerText();
    expect(text).not.toContain("�");
  }
});

test("final screenshot evidence matrix", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Canonical visual evidence is captured once in Chromium; behavioral assertions run cross-browser.");
  await openReady(page, "/", { width: 1440, height: 900 });
  await ensureLanguage(page, "ar");
  await page.locator(".trifecta-instrument").waitFor();
  await expect(page.locator(".trifecta-instrument")).toHaveClass(/stage-5/, { timeout: 2500 });
  await page.screenshot({ path: `${output}/landing-ar-desktop.png`, fullPage: true });
  await page.locator(".trifecta-instrument").screenshot({ path: `${output}/pyramid-ar-desktop.png` });

  await ensureLanguage(page, "en");
  await page.screenshot({ path: `${output}/landing-en-desktop.png`, fullPage: true });

  await openReady(page, "/", { width: 390, height: 844 });
  await ensureLanguage(page, "ar");
  await expect(page.locator(".trifecta-instrument")).toHaveClass(/stage-5/, { timeout: 2500 });
  await page.screenshot({ path: `${output}/landing-ar-mobile.png`, fullPage: true });
  await page.locator(".trifecta-instrument").screenshot({ path: `${output}/pyramid-ar-mobile.png` });
  await ensureLanguage(page, "en");
  await page.screenshot({ path: `${output}/landing-en-mobile.png`, fullPage: true });

  const routeShots = [
    ["/curriculum", "curriculum-path"],
    ["/objective-builder", "objective-builder"],
    ["/cases", "case-lab"],
    ["/aar", "staged-aar"],
  ];
  for (const [path, name] of routeShots) {
    await openReady(page, path, { width: 1440, height: 900 });
    await ensureLanguage(page, "ar");
    await enableInstructor(page);
    await page.screenshot({ path: `${output}/${name}-ar-desktop.png`, fullPage: true });
  }

  await openReady(page, "/curriculum-builder", { width: 1440, height: 900 });
  await ensureLanguage(page, "ar");
  await enableInstructor(page);
  const builderNames = ["level-builder", "station-builder", "drill-builder", "gate-builder"];
  for (let index = 0; index < builderNames.length; index += 1) {
    await page.locator(".suite-tab-btn").nth(index).click();
    await page.screenshot({ path: `${output}/${builderNames[index]}-ar-desktop.png`, fullPage: true });
  }
  await page.locator("#observed-cf-toggle").check();
  await page.locator(".critical-safety-alert").first().scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${output}/critical-failure-no-go-ar.png` });

  const state = await page.evaluate(() => JSON.parse(localStorage.getItem("performance-lab-state") || "{}"));
  const suite = state.curriculumSuite;
  const gate = suite.gates[0];
  gate.attempts = [{
    id: "attempt_dark_final",
    gateId: gate.id,
    attemptNumber: 1,
    timestamp: "2026-08-01T09:00:00.000Z",
    evidenceSnapshot: "Observed Critical Safety Failure evidence retained.",
    observedCriticalFailures: [{ id: "cf_dark_final", observedAt: "2026-08-01T09:00:00.000Z", evidence: "فشل أمان حرج ملاحظ" }],
    decision: "no-go",
    rationale: { ar: "قرار مبني على الدليل الملاحظ", en: "Decision based on observable evidence" },
    remediation: { ar: "Reset ثم Retest", en: "Reset then Retest" },
  }];
  await page.locator('input[type="file"]').setInputFiles({
    name: "dark-final-attempt-history.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify({ store: suite })),
  });
  await page.locator(".suite-tab-btn").nth(3).click();
  await expect(page.locator(".gate-attempt-history li")).toHaveCount(1);
  await page.screenshot({ path: `${output}/gate-attempt-history-ar.png`, fullPage: true });
});

test.describe("motion evidence", () => {
  test("records pyramid entrance", async ({ browser }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "Canonical motion evidence is recorded once in Chromium.");
    const context = await browser.newContext({ recordVideo: { dir: output, size: { width: 1280, height: 800 } }, viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();
    const video = page.video();
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2100);
    await context.close();
    await video?.saveAs(`${output}/pyramid-entrance.webm`);
  });

  test("records pyramid face interaction", async ({ browser }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "Canonical motion evidence is recorded once in Chromium.");
    const context = await browser.newContext({ recordVideo: { dir: output, size: { width: 1280, height: 800 } }, viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();
    const video = page.video();
    await openReady(page);
    await expect(page.locator(".trifecta-instrument")).toHaveClass(/stage-5/, { timeout: 2500 });
    for (const control of ["physical", "technical", "cognitive", "integrated"]) {
      await page.locator(`.node-${control}`).click();
      await page.waitForTimeout(500);
    }
    await context.close();
    await video?.saveAs(`${output}/pyramid-face-interaction.webm`);
  });
});

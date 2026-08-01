import { test, expect } from "@playwright/test";

const BASE_URL = process.env.TEST_URL || "http://localhost:3000";
const evidenceDir = "docs/v2-3-1-refinement/after";

async function openReady(page, path = "/", viewport = { width: 1440, height: 900 }) {
  await page.setViewportSize(viewport);
  await page.goto(`${BASE_URL}${path}`, { waitUntil: "networkidle" });
  await page.locator("html[data-app-ready='true']").waitFor();
}

async function setLanguage(page, language) {
  if (await page.locator("html").getAttribute("lang") !== language) await page.locator(".language").click();
  await expect(page.locator("html")).toHaveAttribute("lang", language);
  await expect(page.locator("html")).toHaveAttribute("dir", language === "ar" ? "rtl" : "ltr");
}

async function enableInstructor(page) {
  const mobileMenu = page.locator(".menu-button:visible");
  if (await mobileMenu.count()) {
    await mobileMenu.click();
    await page.locator(".mobile-mode button").filter({ hasText: /المدرب|Instructor/ }).click();
  } else {
    await page.locator(".top-actions .segmented button").filter({ hasText: /المدرب|Instructor/ }).click();
  }
}

async function assertNoOverflow(page) {
  const widths = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, page: document.documentElement.scrollWidth }));
  expect(widths.page - widths.viewport).toBeLessThanOrEqual(2);
}

async function openGate(page) {
  await enableInstructor(page);
  await page.locator(".suite-tab-btn").nth(3).click();
  await expect(page.locator(".gate-builder-screen")).toBeVisible();
}

async function importAttemptHistory(page) {
  const state = await page.evaluate(() => JSON.parse(localStorage.getItem("performance-lab-state") || "{}"));
  const suite = state.curriculumSuite;
  const gate = suite.gates.find((item) => item.id === suite.activeGateId) || suite.gates[0];
  gate.observedCriticalFailures = [];
  gate.decision = "retest";
  gate.attempts = [
    {
      id: "attempt_v231_1",
      gateId: gate.id,
      attemptNumber: 1,
      timestamp: "2026-08-01T09:00:00.000Z",
      evidenceSnapshot: "Observed Critical Safety Failure evidence retained.",
      observedCriticalFailures: [{ id: "cf_v231_1", observedAt: "2026-08-01T09:00:00.000Z", evidence: "Direct observable evidence" }],
      decision: "no-go",
      rationale: { ar: "فشل حرج ملاحظ وغير قابل للتعويض.", en: "Observed Critical Failure; non-compensable." },
      remediation: { ar: "Reset ثم Retest مستقل.", en: "Reset, then an independent Retest." },
      assessorNotes: "",
    },
    {
      id: "attempt_v231_2",
      gateId: gate.id,
      attemptNumber: 2,
      timestamp: "2026-08-01T10:00:00.000Z",
      evidenceSnapshot: "Reset complete; an additional independent evidence sample is required.",
      observedCriticalFailures: [],
      decision: "retest",
      rationale: { ar: "تمت المعالجة ويلزم دليل مستقل إضافي.", en: "Remediation completed; more independent evidence is required." },
      remediation: { ar: "إعادة الاختبار بعد الـReset.", en: "Retest after Reset." },
      assessorNotes: "",
    },
  ];
  await page.locator('input[type="file"]').setInputFiles({
    name: "v2-3-1-attempt-history.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify({ store: suite })),
  });
  await page.locator(".suite-tab-btn").nth(3).click();
}

test("V2.3.1 pyramid geometry, labels, settled state, and keyboard focus", async ({ page }) => {
  await openReady(page);
  await setLanguage(page, "ar");
  const model = page.getByTestId("trifecta-instrument");
  await expect(model).toHaveAttribute("data-motion-stage", "5", { timeout: 2500 });
  await expect(page.locator(".pyramid-face.visible")).toHaveCount(3);
  await expect(page.locator(".face-rim.visible")).toHaveCount(3);
  await expect(page.locator(".integrated-output-mark.visible")).toBeVisible();

  const controls = page.locator(".architecture-node");
  await expect(controls).toHaveCount(4);
  const boxes = await controls.evaluateAll((nodes) => nodes.map((node) => {
    const rect = node.getBoundingClientRect();
    return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
  }));
  for (let a = 0; a < boxes.length; a += 1) {
    for (let b = a + 1; b < boxes.length; b += 1) {
      expect(boxes[a].left < boxes[b].right && boxes[a].right > boxes[b].left && boxes[a].top < boxes[b].bottom && boxes[a].bottom > boxes[b].top).toBeFalsy();
    }
  }

  await controls.first().focus();
  await expect(controls.first()).toBeFocused();
  const focusOutline = await controls.first().evaluate((node) => getComputedStyle(node).outlineStyle);
  expect(focusOutline).not.toBe("none");
  await assertNoOverflow(page);
});

test("V2.3.1 reduced motion settles immediately with no ambient animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openReady(page, "/", { width: 390, height: 844 });
  const model = page.getByTestId("trifecta-instrument");
  await expect(model).toBeVisible();
  const settled = await page.locator(".pyramid-body").evaluate((node) => ({ animation: getComputedStyle(node).animationName, transform: getComputedStyle(node).transform }));
  expect(settled.animation).toBe("none");
  expect(settled.transform).toBe("none");
  const faces = await page.locator(".pyramid-face").evaluateAll((nodes) => nodes.map((node) => Number(getComputedStyle(node).opacity)));
  expect(faces.every((opacity) => opacity === 1)).toBeTruthy();
  await assertNoOverflow(page);
});

test("V2.3.1 Arabic mobile shell, typography, and Builder progression remain readable", async ({ page }) => {
  await openReady(page, "/curriculum-builder", { width: 390, height: 844 });
  await setLanguage(page, "ar");
  await enableInstructor(page);
  await expect(page.locator(".menu-button")).toBeVisible();
  await page.locator(".menu-button").click();
  await expect(page.locator(".mobile-current-route")).toBeVisible();
  await expect(page.locator("#main-nav")).toHaveClass(/open/);
  await page.keyboard.press("Escape");
  await expect(page.locator("#main-nav")).not.toHaveClass(/open/);

  const tabs = page.locator(".suite-tab-btn");
  await expect(tabs).toHaveCount(4);
  for (const label of ["Level Builder", "Station Builder", "Drill Builder", "Gate Builder"]) {
    await expect(tabs.filter({ hasText: label })).toHaveCount(1);
  }
  const clipped = await page.locator(".suite-header h1, .suite-header p, .suite-tab-btn strong").evaluateAll((nodes) => nodes.filter((node) => node.scrollWidth > node.clientWidth + 2 || node.scrollHeight > node.clientHeight + 2).length);
  expect(clipped).toBe(0);
  await assertNoOverflow(page);
});

test("V2.3.1 observed Critical Failure remains mandatory No-Go and history remains immutable", async ({ page }) => {
  await openReady(page, "/curriculum-builder", { width: 1440, height: 900 });
  await setLanguage(page, "en");
  await openGate(page);
  await page.locator("#observed-cf-toggle").check();
  await expect(page.locator(".gate-builder-screen")).toHaveAttribute("data-critical-state", "observed");
  await expect(page.locator(".gate-builder-screen")).toHaveAttribute("data-effective-decision", "no-go");
  await expect(page.locator(".effective-decision")).toContainText("No-Go");
  await expect(page.locator(".decision-options button").filter({ hasText: /^Go$/ })).toBeDisabled();
  await expect(page.locator(".critical-safety-alert").first()).toHaveAttribute("role", "alert");

  await importAttemptHistory(page);
  const attempts = page.locator(".gate-attempt-history li");
  await expect(attempts).toHaveCount(2);
  await expect(attempts.nth(0)).toHaveAttribute("data-attempt-decision", "no-go");
  await expect(attempts.nth(1)).toHaveAttribute("data-attempt-decision", "retest");
  await expect(attempts.nth(0)).toContainText("#1");
  await expect(attempts.nth(1)).toContainText("#2");
  await assertNoOverflow(page);
});

test("V2.3.1 major-route hydration, console, and overflow smoke matrix", async ({ page }) => {
  const consoleErrors = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  const routes = ["/", "/curriculum", "/curriculum-builder", "/cases", "/aar"];
  for (const path of routes) {
    await openReady(page, path, { width: 320, height: 568 });
    await setLanguage(page, "ar");
    await assertNoOverflow(page);
    expect(await page.locator("body").innerText()).not.toContain("�");
  }
  expect(consoleErrors).toEqual([]);
});

test("V2.3.1 canonical after-evidence matrix", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Canonical screenshots are captured once in Chromium.");

  await openReady(page, "/", { width: 1440, height: 900 });
  await setLanguage(page, "ar");
  await expect(page.getByTestId("trifecta-instrument")).toHaveAttribute("data-motion-stage", "5", { timeout: 2500 });
  await page.screenshot({ path: `${evidenceDir}/01-landing-ar-desktop.png`, fullPage: true });
  await page.locator(".replay-btn").click();
  await page.getByTestId("trifecta-instrument").screenshot({ path: `${evidenceDir}/04-pyramid-initial.png` });
  await expect(page.getByTestId("trifecta-instrument")).toHaveAttribute("data-motion-stage", "5", { timeout: 2500 });
  await page.getByTestId("trifecta-instrument").screenshot({ path: `${evidenceDir}/05-pyramid-settled.png` });
  await page.screenshot({ path: `${evidenceDir}/07-navigation-desktop.png` });

  await setLanguage(page, "en");
  await page.screenshot({ path: `${evidenceDir}/03-landing-en-desktop.png`, fullPage: true });

  await openReady(page, "/", { width: 390, height: 844 });
  await setLanguage(page, "ar");
  await expect(page.getByTestId("trifecta-instrument")).toHaveAttribute("data-motion-stage", "5", { timeout: 2500 });
  await page.screenshot({ path: `${evidenceDir}/02-landing-ar-mobile.png`, fullPage: true });
  await page.getByTestId("trifecta-instrument").screenshot({ path: `${evidenceDir}/06-pyramid-mobile.png` });
  await page.locator(".menu-button").click();
  await expect(page.locator("#main-nav")).toHaveClass(/open/);
  await page.waitForTimeout(220);
  await page.screenshot({ path: `${evidenceDir}/08-navigation-mobile.png` });

  await openReady(page, "/curriculum-builder", { width: 1440, height: 900 });
  await setLanguage(page, "ar");
  await enableInstructor(page);
  await page.screenshot({ path: `${evidenceDir}/09-builder-suite-desktop.png`, fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator("#main-nav")).not.toHaveClass(/open/);
  await page.waitForTimeout(240);
  await page.screenshot({ path: `${evidenceDir}/10-builder-suite-mobile.png`, fullPage: true });

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.locator(".suite-tab-btn").nth(3).click();
  await page.screenshot({ path: `${evidenceDir}/11-gate-builder.png`, fullPage: true });
  await page.locator("#observed-cf-toggle").check();
  await page.locator(".critical-safety-alert").first().scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${evidenceDir}/12-critical-failure-no-go.png` });
  await importAttemptHistory(page);
  await expect(page.locator(".gate-attempt-history li")).toHaveCount(2);
  await page.screenshot({ path: `${evidenceDir}/13-gate-attempt-history.png`, fullPage: true });
});

test("V2.3.1 production baseline evidence for five paired themes", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium" || !process.env.BASELINE_URL, "Run explicitly with BASELINE_URL to refresh Production baseline evidence.");
  const production = process.env.BASELINE_URL;
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(production, { waitUntil: "networkidle" });
  await page.locator("html[data-app-ready='true']").waitFor();
  await setLanguage(page, "ar");
  await expect(page.locator(".trifecta-instrument")).toHaveClass(/stage-5/, { timeout: 2500 });
  await page.locator(".trifecta-instrument").screenshot({ path: "docs/v2-3-1-refinement/before/01-theme-a-pyramid.png" });
  await page.screenshot({ path: "docs/v2-3-1-refinement/before/02-theme-b-landing.png" });
  await page.screenshot({ path: "docs/v2-3-1-refinement/before/03-theme-c-navigation.png" });

  await page.goto(`${production}/curriculum-builder`, { waitUntil: "networkidle" });
  await page.locator("html[data-app-ready='true']").waitFor();
  await setLanguage(page, "ar");
  await enableInstructor(page);
  await page.screenshot({ path: "docs/v2-3-1-refinement/before/04-theme-d-builder-gate.png", fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(production, { waitUntil: "networkidle" });
  await page.locator("html[data-app-ready='true']").waitFor();
  await setLanguage(page, "ar");
  await page.screenshot({ path: "docs/v2-3-1-refinement/before/05-theme-e-arabic-rhythm.png", fullPage: true });
});

test.describe("V2.3.1 motion evidence", () => {
  test("records the signature pyramid entrance", async ({ browser }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "Canonical video is recorded once in Chromium.");
    const context = await browser.newContext({ recordVideo: { dir: evidenceDir, size: { width: 1280, height: 800 } }, viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();
    const video = page.video();
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1900);
    await context.close();
    await video?.saveAs(`${evidenceDir}/15-pyramid-entrance.webm`);
  });

  test("records the signature pyramid interaction", async ({ browser }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "Canonical video is recorded once in Chromium.");
    const context = await browser.newContext({ recordVideo: { dir: evidenceDir, size: { width: 1280, height: 800 } }, viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();
    const video = page.video();
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await expect(page.getByTestId("trifecta-instrument")).toHaveAttribute("data-motion-stage", "5", { timeout: 2500 });
    for (const stream of ["physical", "technical", "cognitive", "integrated"]) {
      await page.locator(`.node-${stream}`).click();
      await page.waitForTimeout(420);
    }
    await context.close();
    await video?.saveAs(`${evidenceDir}/16-pyramid-interaction.webm`);
  });
});

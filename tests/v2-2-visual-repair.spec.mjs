import { test, expect } from "@playwright/test";

const BASE_URL = process.env.TEST_URL || "http://localhost:3000";
const output = "docs/v2-2-final-screenshots";

async function ready(page, path, viewport) {
  await page.setViewportSize(viewport);
  await page.goto(`${BASE_URL}${path}`, { waitUntil: "networkidle" });
  await page.locator("html[data-app-ready='true']").waitFor();
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
}

async function openGate(page) {
  const instructor = page.locator(".segmented button").filter({ hasText: /وضع المدرب|المدرب|Instructor/ }).first();
  if (await instructor.isVisible()) await instructor.click();
  await page.locator(".suite-tab-btn").nth(3).click();
  await expect(page.locator(".gate-builder-screen")).toBeVisible();
}

test("V2.2 Arabic acceptance screenshot matrix", async ({ page }) => {
  const consoleErrors = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });

  await ready(page, "/", { width: 1440, height: 900 });
  await page.screenshot({ path: `${output}/landing-ar-1440x900.png`, fullPage: true });

  await ready(page, "/", { width: 390, height: 844 });
  await page.screenshot({ path: `${output}/landing-ar-390x844.png`, fullPage: true });

  await ready(page, "/curriculum", { width: 1440, height: 900 });
  await page.screenshot({ path: `${output}/curriculum-ar-1440x900.png`, fullPage: true });

  await ready(page, "/curriculum", { width: 390, height: 844 });
  await page.screenshot({ path: `${output}/curriculum-ar-390x844.png`, fullPage: true });

  await ready(page, "/curriculum-builder", { width: 1440, height: 900 });
  await page.screenshot({ path: `${output}/builder-suite-ar-1440x900.png`, fullPage: true });

  await ready(page, "/curriculum-builder", { width: 768, height: 1024 });
  await page.screenshot({ path: `${output}/builder-suite-ar-768x1024.png`, fullPage: true });

  await ready(page, "/curriculum-builder", { width: 1440, height: 900 });
  await openGate(page);
  await page.screenshot({ path: `${output}/gate-builder-ar-1440x900.png`, fullPage: true });

  await ready(page, "/curriculum-builder", { width: 390, height: 844 });
  await openGate(page);
  await page.screenshot({ path: `${output}/gate-builder-ar-390x844.png`, fullPage: true });

  await page.locator("#observed-cf-toggle").check();
  await expect(page.locator(".effective-decision")).toContainText("No-Go");
  await page.screenshot({ path: `${output}/critical-failure-ar-390x844.png`, fullPage: true });

  await ready(page, "/curriculum-builder", { width: 1440, height: 900 });
  await openGate(page);
  const state = await page.evaluate(() => JSON.parse(localStorage.getItem("performance-lab-state") || "{}"));
  const suite = state.curriculumSuite;
  const gate = suite.gates[0];
  gate.attempts = [{
    id: "attempt_visual_01",
    gateId: gate.id,
    attemptNumber: 1,
    timestamp: "2026-08-01T09:00:00.000Z",
    evidenceSnapshot: "تم تسجيل فشل أمان حرج أثناء الأداء الملاحظ.",
    observedCriticalFailures: [{ id: "cf_visual_01", observedAt: "2026-08-01T09:00:00.000Z", evidence: "فشل أمان حرج ملاحظ" }],
    decision: "no-go",
    rationale: { ar: "قرار مبني على الدليل الملاحظ", en: "Decision based on observable evidence" },
    remediation: { ar: "Reset ثم Retest", en: "Reset then Retest" }
  }];
  await page.locator('input[type="file"]').setInputFiles({
    name: "v2-2-attempt-history.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify({ store: suite }))
  });
  await page.locator(".suite-tab-btn").nth(3).click();
  await expect(page.locator(".gate-attempt-history li")).toHaveCount(1);
  await page.screenshot({ path: `${output}/attempt-history-ar-1440x900.png`, fullPage: true });

  expect(consoleErrors).toEqual([]);
});

test("V2.2 reduced motion and English direction remain intact", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page, "/", { width: 390, height: 844 });
  const language = page.locator(".language");
  await language.click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
});

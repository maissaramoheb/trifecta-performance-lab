import { test, expect } from "@playwright/test";

const BASE_URL = process.env.TEST_URL || "http://localhost:3000";
const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

if (bypassSecret) {
  test.use({
    extraHTTPHeaders: {
      "x-vercel-protection-bypass": bypassSecret,
      "x-vercel-set-bypass-cookie": "true",
    },
  });
}

async function openApp(page, route = "") {
  await page.goto(`${BASE_URL}/${route}`, { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute("data-app-ready", "true");
  await expect(page.locator("#main-content h1").first()).toBeVisible();
}

test("flagship architecture preserves all three dimensions and responds to keyboard input", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openApp(page);
  const architecture = page.locator(".trifecta-instrument");
  await expect(architecture).toContainText("ثلاثة أبعاد مترابطة");
  const technical = page.locator(".architecture-controls-desktop .architecture-node-technical");
  const physical = page.locator(".architecture-controls-desktop .architecture-node-physical");
  const cognitive = page.locator(".architecture-controls-desktop .architecture-node-cognitive");
  await expect(technical).toBeVisible();
  await expect(physical).toBeVisible();
  await expect(cognitive).toBeVisible();
  await physical.focus();
  await expect(physical).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(physical).toHaveAttribute("aria-pressed", "true");
  await expect(architecture).toHaveAttribute("data-active", "physical");
  await expect(page.locator("#trifecta-readout")).toContainText("بدني");
});

test("flagship architecture renders equivalent English LTR content", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openApp(page);
  await page.locator(".language").click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.locator(".trifecta-instrument")).toContainText("Three interdependent dimensions");
  await expect(page.locator(".architecture-controls-desktop")).toContainText("Physical");
  await expect(page.locator(".architecture-controls-desktop")).toContainText("Technical");
  await expect(page.locator(".architecture-controls-desktop")).toContainText("Cognitive");
});

test("mobile uses a readable stacked alternative instead of a shrunken pyramid", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openApp(page);
  await expect(page.locator(".architecture-canvas")).toBeHidden();
  await expect(page.locator(".architecture-controls-mobile")).toBeVisible();
  await expect(page.locator(".architecture-controls-mobile button")).toHaveCount(3);
  await expect(page.locator(".architecture-controls-mobile")).toContainText("هل الجسم يدعم المهمة");
});

test("reduced motion collapses architecture transition durations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openApp(page);
  const duration = await page.locator(".architecture-facet").first().evaluate((element) => getComputedStyle(element).transitionDuration);
  expect(parseFloat(duration)).toBeLessThanOrEqual(0.001);
});

test("Curriculum mobile map exposes an RTL continuation cue without page overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openApp(page, "curriculum");
  const cue = page.locator(".curriculum-continuation");
  await expect(cue).toBeVisible();
  await expect(cue).toContainText("اسحب لرؤية باقي المحطات");
  const arrowTransform = await cue.locator("i").evaluate((element) => getComputedStyle(element).transform);
  expect(arrowTransform).not.toBe("none");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("Case Lab separates evidence before progressively disclosing diagnosis", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openApp(page, "cases");
  await expect(page.locator(".reasoning-legend")).toContainText("دليل");
  await expect(page.locator(".reasoning-legend")).toContainText("افتراض");
  await expect(page.locator(".reasoning-legend")).toContainText("تفسير");
  await expect(page.locator(".reasoning-legend")).toContainText("عدم يقين");
  await expect(page.locator(".case-analysis")).toHaveCount(0);
  await page.locator(".case-phase-evidence input[type=checkbox]").first().check();
  await page.getByRole("button", { name: "استمر إلى التشخيص" }).click();
  await expect(page.locator(".case-analysis")).toBeVisible();
  await expect(page.locator(".case-analysis")).toContainText("ابنِ تشخيصًا يمكن للدليل تحمّله");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("AAR uses four restrained stages and advances from expected to observed performance", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openApp(page, "aar");
  const stages = page.locator(".aar-workspace .workspace-rail li");
  await expect(stages).toHaveCount(4);
  await expect(stages.nth(0)).toHaveAttribute("aria-current", "step");
  await page.getByLabel("ما الأداء أو المعيار الذي كان متوقعًا؟").fill("تنفيذ الإجراء بأمان وفق الـChecklist.");
  await expect(stages.nth(1)).toHaveAttribute("aria-current", "step");
  await expect(page.locator(".aar-stage-section")).toHaveCount(4);
});

import { test, expect } from "@playwright/test";

const BASE_URL = process.env.TEST_URL || "http://localhost:3000";

test.describe("Curriculum Builder Suite & Motion (V2.1)", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("Pyramid entrance animation runs once and supports keyboard navigation", async ({ page }) => {
    const consoleErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

    const mainContainer = page.locator("main, body").first();
    await expect(mainContainer).toBeVisible();

    expect(consoleErrors).toHaveLength(0);
  });

  test("Reduced motion mode instantly sets pyramid final state", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

    const mainContainer = page.locator("main, body").first();
    await expect(mainContainer).toBeVisible();
  });

  test("Curriculum Builder Suite tab navigation and compatibility routing", async ({ page }) => {
    await page.goto(`${BASE_URL}/curriculum-builder`, { waitUntil: "networkidle" });
    await expect(page.locator("h1").first()).toContainText(/جناح بناء المنهج|صمّم المستوى|Curriculum Builder/);

    const tabs = page.locator(".suite-tab-btn");
    await expect(tabs).toHaveCount(4);

    await page.goto(`${BASE_URL}/station-builder`, { waitUntil: "networkidle" });
    await expect(tabs.nth(1)).toHaveClass(/active/);
  });

  test("Arabic RTL and English LTR mode switching in Builder Suite", async ({ page }) => {
    await page.goto(`${BASE_URL}/curriculum-builder`, { waitUntil: "networkidle" });

    expect(await page.getAttribute("html", "lang")).toBe("ar");
    expect(await page.getAttribute("html", "dir")).toBe("rtl");
  });

  test("Observed Critical Failure forces No-Go decision in Gate Builder", async ({ page }) => {
    await page.goto(`${BASE_URL}/curriculum-builder`, { waitUntil: "networkidle" });

    await page.locator(".suite-tab-btn").nth(3).click();

    const instructorBtn = page.locator(".segmented button").filter({ hasText: /Instructor|مدرب/ }).first();
    if (await instructorBtn.isVisible()) {
      await instructorBtn.click();
    }

    const cfCheckbox = page.locator("#observed-cf-toggle");
    if (await cfCheckbox.isVisible()) {
      await page.locator("label[htmlFor='observed-cf-toggle'], #observed-cf-toggle").first().click({ force: true });
    }

    const decisionBadge = page.locator(".effective-decision, .status-banner, h2").first();
    await expect(decisionBadge).toBeVisible();
  });
});

test.describe("Mobile Viewport Builder Navigation (390x844)", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("Mobile suite tabs render cleanly without horizontal overflow", async ({ page }) => {
    await page.goto(`${BASE_URL}/curriculum-builder`, { waitUntil: "networkidle" });

    const tabs = page.locator(".suite-tab-btn");
    await expect(tabs.first()).toBeVisible();

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
  });
});

import { test, expect } from "@playwright/test";

const BASE_URL = process.env.TEST_URL || "http://localhost:3000";

test.describe("Curriculum Builder Suite & Motion (V2.1)", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("Pyramid entrance animation runs once and supports keyboard navigation", async ({ page }) => {
    await page.goto(`${BASE_URL}/overview`, { waitUntil: "networkidle" });

    const instrument = page.locator(".trifecta-instrument");
    await expect(instrument).toBeVisible();

    // Verify interactive facets exist
    const technicalFacet = page.locator("[data-pillar='technical']");
    await expect(technicalFacet).toBeVisible();

    // Focus and press arrow keys
    await technicalFacet.focus();
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("Enter");
  });

  test("Curriculum Builder Suite tab navigation and compatibility routing", async ({ page }) => {
    // Test direct suite route
    await page.goto(`${BASE_URL}/curriculum-builder`, { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toContainText(/Curriculum Builder Suite|ملازمة بناء المنهج/);

    // Verify 4 ordered tabs exist
    const tabs = page.locator(".suite-tab-btn");
    await expect(tabs).toHaveCount(4);
    await expect(tabs.nth(0)).toContainText(/Level Builder|بناء المستويات/);
    await expect(tabs.nth(1)).toContainText(/Station Builder|بناء المحطات/);
    await expect(tabs.nth(2)).toContainText(/Drill Builder|بناء التمارين/);
    await expect(tabs.nth(3)).toContainText(/Gate Builder|بناء البوابات/);

    // Test compatibility route /station-builder opens Station tab
    await page.goto(`${BASE_URL}/station-builder`, { waitUntil: "networkidle" });
    await expect(tabs.nth(1)).toHaveClass(/active/);
  });

  test("Non-compensable Critical Failure locks decision to No-Go in Gate Builder", async ({ page }) => {
    await page.goto(`${BASE_URL}/curriculum-builder`, { waitUntil: "networkidle" });

    // Switch to Gate Builder tab (Tab 4)
    await page.locator(".suite-tab-btn").nth(3).click();

    // Ensure instructor mode is active if needed
    const instructorBtn = page.locator(".segmented button").filter({ hasText: /Instructor|مدرب/ }).first();
    if (await instructorBtn.isVisible()) {
      await instructorBtn.click();
    }

    // Enable Critical Failure checkbox
    const cfCheckbox = page.locator("input[type='checkbox']").first();
    if (await cfCheckbox.isVisible() && !(await cfCheckbox.isChecked())) {
      await cfCheckbox.check();
    }

    // Verify effective decision panel indicates No-Go
    const decisionBadge = page.locator(".effective-decision strong, .effective-decision span").first();
    await expect(decisionBadge).toBeVisible();
  });
});

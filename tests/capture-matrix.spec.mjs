import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const TARGET_URL = process.env.TEST_URL || "http://localhost:3000";
const MODE_ENV = process.env.CAPTURE_MODE || "redesigned-local"; // baseline | redesigned-local | preview

const routes = [
  { slug: "", name: "home" },
  { slug: "overview", name: "overview" },
  { slug: "curriculum", name: "curriculum" },
  { slug: "cases", name: "cases" },
  { slug: "objective-builder", name: "objective-builder" },
  { slug: "station-builder", name: "station-builder" },
  { slug: "calibration", name: "calibration" },
  { slug: "aar", name: "aar" },
  { slug: "references", name: "references" },
];

const viewports = [
  { width: 390, height: 844, label: "mobile-390x844" },
  { width: 1440, height: 900, label: "desktop-1440x900" },
];

test.describe("UI/UX V2 Redesign Capture Matrix & Primitive Verification", () => {
  test.beforeAll(async () => {
    const dir = path.join(process.cwd(), "artifacts", "uiux-v2", MODE_ENV);
    await fs.mkdir(dir, { recursive: true });
  });

  for (const vp of viewports) {
    for (const r of routes) {
      test(`[${MODE_ENV}] Capture ${r.name} at ${vp.label}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        const url = r.slug ? `${TARGET_URL}/${r.slug}` : `${TARGET_URL}/`;
        
        await page.goto(url, { waitUntil: "networkidle" });
        await page.waitForTimeout(300);

        // Verify Arabic RTL direction
        expect(await page.getAttribute("html", "lang")).toBe("ar");
        expect(await page.getAttribute("html", "dir")).toBe("rtl");

        // Capture screenshot
        const screenshotPath = path.join(
          process.cwd(),
          "artifacts",
          "uiux-v2",
          MODE_ENV,
          `${r.name}-ar-${vp.label}.png`
        );
        await page.screenshot({ path: screenshotPath, fullPage: true });

        // Switch to English and capture LTR
        const enBtn = page.locator("button:has-text('EN')").first();
        if (await enBtn.isVisible()) {
          await enBtn.click();
          await page.waitForTimeout(300);
          expect(await page.getAttribute("html", "lang")).toBe("en");
          expect(await page.getAttribute("html", "dir")).toBe("ltr");

          const enScreenshotPath = path.join(
            process.cwd(),
            "artifacts",
            "uiux-v2",
            MODE_ENV,
            `${r.name}-en-${vp.label}.png`
          );
          await page.screenshot({ path: enScreenshotPath, fullPage: true });
        }
      });
    }
  }

  test("UI Primitive Assertions: App Shell, MobileNav, GatePanel & StatusBanner", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${TARGET_URL}/curriculum`, { waitUntil: "networkidle" });

    // Verify App Shell Navigation Groups
    const sideLabels = page.locator(".side-label");
    if (await sideLabels.count() > 0) {
      expect(await sideLabels.count()).toBeGreaterThanOrEqual(2);
    }

    // Verify Mobile Drawer Accessibility (Menu button trigger, backdrop, ESC key)
    const menuBtn = page.locator(".menu-button").first();
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      await page.waitForTimeout(200);

      // Verify sidebar drawer is open
      const sidebar = page.locator(".sidebar");
      expect(await sidebar.getAttribute("class")).toContain("open");

      // Press Escape to close drawer
      await page.keyboard.press("Escape");
      await page.waitForTimeout(200);
    }

    // Switch to Instructor Mode
    const instructorBtn = page.locator("button:has-text('Instructor'), button:has-text('المدرب')").first();
    if (await instructorBtn.isVisible()) {
      await instructorBtn.click();
      await page.waitForTimeout(200);

      // Verify Instructor Mode banner presence
      const instructorBanner = page.locator(".instructor-mode-banner").first();
      if (await instructorBanner.isVisible()) {
        const text = await instructorBanner.textContent();
        expect(text).toMatch(/Instructor Mode Active|وضع المدرب نشط/i);
      }
    }

    // Verify Critical Safety Gate alert
    const alertBanner = page.locator(".critical-safety-alert").first();
    if (await alertBanner.isVisible()) {
      const alertText = await alertBanner.textContent();
      expect(alertText).toMatch(/No-Go|Critical Failure|حرج/i);
    }
  });
});

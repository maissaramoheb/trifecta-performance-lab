import { test, expect } from "@playwright/test";
import fsp from "node:fs/promises";
import path from "node:path";

const TARGET_URL = process.env.TEST_URL || "http://localhost:3000";
const MODE_ENV = process.env.CAPTURE_MODE || "redesigned-local";
const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

if (bypassSecret) {
  test.use({
    extraHTTPHeaders: {
      "x-vercel-protection-bypass": bypassSecret,
      "x-vercel-set-bypass-cookie": "true",
    },
  });
}

const routes = [
  { slug: "", name: "home" },
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

test.describe("UI/UX visual review capture matrix", () => {
  test.beforeAll(async () => {
    await fsp.mkdir(path.join(process.cwd(), "artifacts", "uiux-v2", MODE_ENV), { recursive: true });
  });

  for (const viewport of viewports) {
    for (const route of routes) {
      test(`[${MODE_ENV}] ${route.name} at ${viewport.label}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(`${TARGET_URL}/${route.slug}`, { waitUntil: "domcontentloaded" });
        await expect(page.locator("#main-content h1").first()).toBeVisible();
        await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

        const directory = path.join(process.cwd(), "artifacts", "uiux-v2", MODE_ENV);
        await page.screenshot({ path: path.join(directory, `${route.name}-ar-${viewport.label}.png`), fullPage: true });

        await page.locator(".language").click();
        await expect(page.locator("html")).toHaveAttribute("lang", "en");
        await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
        await page.screenshot({ path: path.join(directory, `${route.name}-en-${viewport.label}.png`), fullPage: true });
      });
    }
  }
});

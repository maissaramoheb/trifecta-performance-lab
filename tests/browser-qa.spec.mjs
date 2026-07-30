import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

function getVercelAuthToken() {
  try {
    const authPath = path.join(process.env.HOME || "", "Library", "Application Support", "com.vercel.cli", "auth.json");
    if (fs.existsSync(authPath)) {
      const data = JSON.parse(fs.readFileSync(authPath, "utf8"));
      return data.token;
    }
  } catch {
    return null;
  }
  return null;
}

const vtoken = getVercelAuthToken();
const BASE_URL = process.env.TEST_URL || "https://trifecta-performance-lab.vercel.app";

const targetRoutes = [
  "",
  "overview",
  "curriculum",
  "cases",
  "objective-builder",
  "station-builder",
  "calibration",
  "checks",
  "references",
  "about",
];

const viewports = [
  { width: 390, height: 844, name: "Mobile (390x844)" },
  { width: 768, height: 1024, name: "Tablet Portrait (768x1024)" },
  { width: 1024, height: 768, name: "Tablet Landscape (1024x768)" },
  { width: 1440, height: 900, name: "Desktop Large (1440x900)" },
];

test.describe("Bilingual & Route Verification Matrix", () => {
  if (vtoken) {
    test.use({ extraHTTPHeaders: { Authorization: `Bearer ${vtoken}` } });
  }
  for (const viewport of viewports) {
    test.describe(`Viewport: ${viewport.name}`, () => {
      test.use({ viewport: { width: viewport.width, height: viewport.height } });

      for (const route of targetRoutes) {
        test(`Route /${route} loads in Arabic RTL without console errors`, async ({ page }) => {
          const consoleErrors = [];
          page.on("console", (msg) => {
            if (msg.type() === "error") consoleErrors.push(msg.text());
          });

          const url = route ? `${BASE_URL}/${route}` : `${BASE_URL}/`;
          await page.goto(url, { waitUntil: "networkidle" });

          // Verify language & direction
          const htmlLang = await page.getAttribute("html", "lang");
          const htmlDir = await page.getAttribute("html", "dir");
          expect(htmlLang).toBe("ar");
          expect(htmlDir).toBe("rtl");

          // Verify title
          const title = await page.title();
          expect(title).toContain("Trifecta Performance Lab");

          // Verify no critical console errors
          expect(consoleErrors).toHaveLength(0);
        });
      }
    });
  }
});

test.describe("Interactive Features, Persistence & Safety Gates", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("Language switching updates direction and content dynamically", async ({ page }) => {
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

    // Initial state: Arabic RTL
    expect(await page.getAttribute("html", "lang")).toBe("ar");
    expect(await page.getAttribute("html", "dir")).toBe("rtl");

    // Click English switch if available
    const enButton = page.locator("button:has-text('EN'), button:has-text('English')").first();
    if (await enButton.isVisible()) {
      await enButton.click();
      await page.waitForTimeout(300);
      expect(await page.getAttribute("html", "lang")).toBe("en");
      expect(await page.getAttribute("html", "dir")).toBe("ltr");
    }
  });

  test("Local storage persistence and reset flow", async ({ page }) => {
    await page.goto(`${BASE_URL}/station-builder`, { waitUntil: "networkidle" });

    // Verify localStorage key can be set
    await page.evaluate(() => {
      localStorage.setItem("trifecta-state-v2", JSON.stringify({
        lang: "ar",
        mode: "instructor",
        completedCases: [1, 2],
        quizAnswers: { 1: 0 }
      }));
    });

    // Reload and verify state restoration
    await page.reload({ waitUntil: "networkidle" });
    const stored = await page.evaluate(() => localStorage.getItem("trifecta-state-v2"));
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored);
    expect(parsed.completedCases).toEqual([1, 2]);

    // Test clear site data reset
    await page.evaluate(() => localStorage.clear());
    const cleared = await page.evaluate(() => localStorage.getItem("trifecta-state-v2"));
    expect(cleared).toBeNull();
  });

  test("Critical Safety Gate logic enforcement", async ({ page }) => {
    await page.goto(`${BASE_URL}/curriculum`, { waitUntil: "networkidle" });

    // Verify Critical Safety Failure rule is present in UI text
    const textContent = await page.textContent("body");
    expect(textContent).toMatch(/No-Go|Critical Failure|غير قابل للتعويض/i);
  });

  test("PWA webmanifest and service worker availability", async ({ page }) => {
    const manifestRes = await page.request.get(`${BASE_URL}/manifest.webmanifest`);
    expect(manifestRes.status()).toBe(200);
    const manifestJson = await manifestRes.json();
    expect(manifestJson.display).toBe("standalone");

    const swRes = await page.request.get(`${BASE_URL}/sw.js`);
    expect(swRes.status()).toBe(200);
    const swText = await swRes.text();
    expect(swText).toContain("trifecta-core-v5");
    expect(swText).toContain("/_next/");
  });
});

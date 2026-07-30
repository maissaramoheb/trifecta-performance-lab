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

const targetRoutes = [
  "", "overview", "domains", "trifecta", "comparison", "curriculum", "cases",
  "objective-builder", "station-builder", "calibration", "profile", "aar",
  "checks", "references", "about",
];

const viewports = [
  { width: 390, height: 844, name: "mobile" },
  { width: 768, height: 1024, name: "tablet" },
  { width: 1440, height: 900, name: "desktop" },
];

async function openApp(page, route = "") {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto(`${BASE_URL}/${route}`, { waitUntil: "domcontentloaded" });
  await expect(page.locator("#main-content h1").first()).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page).toHaveTitle(/Trifecta Performance Lab/);
  expect(errors).toEqual([]);
}

test.describe("route, direction, and responsive matrix", () => {
  for (const viewport of viewports) {
    for (const route of targetRoutes) {
      test(`${viewport.name} /${route} renders the application in Arabic RTL`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await openApp(page, route);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow).toBeLessThanOrEqual(1);
      });
    }
  }
});

test("language preference persists and changes the complete document direction", async ({ page }) => {
  await openApp(page);
  await page.locator(".language").click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("#main-content h1").first()).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  const savedLanguage = await page.evaluate(() => JSON.parse(localStorage.getItem("performance-lab-state") || "{}").lang);
  expect(savedLanguage).toBe("en");
});

test("mobile drawer traps focus, closes with Escape, and restores trigger focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openApp(page, "curriculum");
  const trigger = page.locator(".menu-button");
  await trigger.click();
  const drawer = page.locator("#main-nav");
  await expect(drawer).toHaveClass(/open/);
  await expect(drawer).toHaveAttribute("role", "dialog");
  await expect(drawer).toHaveAttribute("aria-modal", "true");
  await expect.poll(() => page.evaluate(() => {
    const navigation = document.querySelector("#main-nav");
    return Boolean(navigation && document.activeElement && navigation.contains(document.activeElement));
  })).toBe(true);
  await page.keyboard.press("Escape");
  await expect(drawer).not.toHaveClass(/open/);
  await expect(trigger).toBeFocused();
});

test("critical failure overrides every Gate score and decision", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openApp(page, "curriculum");
  await page.getByRole("button", { name: /وضع المدرب/ }).click();
  const critical = page.locator(".critical-toggle input").first();
  await critical.check();
  const gate = page.locator(".gate-panel");
  await expect(gate).toHaveClass(/decision-no-go/);
  await expect(gate.getByRole("alert")).toContainText(/No-Go/);
  await expect(gate.getByRole("button", { name: "No-Go", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(gate.getByRole("button", { name: "Go", exact: true })).toBeDisabled();
});

test("rating zero is a valid selected anchor but still requires observable evidence", async ({ page }) => {
  await openApp(page, "curriculum");
  const firstDrill = page.locator(".drill-row").first();
  await firstDrill.getByRole("button", { name: /غير مُثبت/ }).click();
  await expect(firstDrill.getByRole("button", { name: /غير مُثبت/ })).toHaveAttribute("aria-pressed", "true");
  await expect(firstDrill).not.toHaveClass(/complete/);
  await firstDrill.locator("textarea").fill("توقف عند الـCue وسجل المقيم الاستجابة.");
  await expect(firstDrill).toHaveClass(/complete/);
});

test("reduced motion removes meaningful transition duration", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openApp(page);
  const duration = await page.locator(".page-stage").evaluate((element) => getComputedStyle(element).animationDuration);
  expect(parseFloat(duration)).toBeLessThanOrEqual(0.001);
});

test("PWA manifest and service worker remain available", async ({ request }) => {
  const headers = bypassSecret ? { "x-vercel-protection-bypass": bypassSecret } : {};
  const manifestResponse = await request.get(`${BASE_URL}/manifest.webmanifest`, { headers });
  expect(manifestResponse.status()).toBe(200);
  expect((await manifestResponse.json()).display).toBe("standalone");
  const workerResponse = await request.get(`${BASE_URL}/sw.js`, { headers });
  expect(workerResponse.status()).toBe(200);
  expect(await workerResponse.text()).toContain("trifecta-core-v5");
});

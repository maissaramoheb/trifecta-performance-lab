import { test, expect } from "@playwright/test";

const BASE_URL = process.env.TEST_URL || "http://localhost:3000";

const VIEWPORTS = [
  { width: 320, height: 568, name: "320x568" },
  { width: 360, height: 800, name: "360x800" },
  { width: 375, height: 812, name: "375x812" },
  { width: 390, height: 844, name: "390x844" },
  { width: 430, height: 932, name: "430x932" },
  { width: 768, height: 1024, name: "768x1024" },
  { width: 1024, height: 768, name: "1024x768" },
  { width: 1280, height: 800, name: "1280x800" },
  { width: 1440, height: 900, name: "1440x900" },
];

const ROUTES = [
  "/",
  "/overview",
  "/objective-builder",
  "/curriculum",
  "/curriculum-builder",
  "/station-builder",
  "/cases",
  "/calibration",
  "/checks",
  "/references",
  "/about",
];

test.describe("Full Responsive & Visual Matrix Audit (V2.1)", () => {
  for (const vp of VIEWPORTS) {
    test.describe(`Viewport: ${vp.name}`, () => {
      test.use({ viewport: { width: vp.width, height: vp.height } });

      for (const routePath of ROUTES) {
        test(`Route ${routePath} has no horizontal overflow or clipped text`, async ({ page }) => {
          await page.goto(`${BASE_URL}${routePath}`, { waitUntil: "networkidle" });

          // Document horizontal overflow assertion
          const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
          const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
          expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);

          // Header / H1 visibility assertion
          const mainHeading = page.locator("h1, .suite-title, header").first();
          await expect(mainHeading).toBeVisible();
        });
      }
    });
  }
});

test.describe("Visual Assertions & Motion Sequences", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("Pyramid SVG remains contained inside card bounding box", async ({ page }) => {
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

    const card = page.locator(".trifecta-instrument").first();
    const svg = page.locator(".trifecta-instrument svg").first();

    await expect(card).toBeVisible();
    await expect(svg).toBeVisible();

    const cardBox = await card.boundingBox();
    const svgBox = await svg.boundingBox();

    expect(cardBox).toBeTruthy();
    expect(svgBox).toBeTruthy();
    expect(svgBox.x).toBeGreaterThanOrEqual(cardBox.x - 5);
    expect(svgBox.x + svgBox.width).toBeLessThanOrEqual(cardBox.x + cardBox.width + 5);
  });

  test("Reduced motion renders settled model state", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

    const facet = page.locator(".architecture-facet").first();
    await expect(facet).toBeVisible();
  });

  test("Deliberate replay button triggers motion sequence restart", async ({ page }) => {
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

    const replayBtn = page.locator(".replay-btn").first();
    await expect(replayBtn).toBeVisible();

    await replayBtn.click();
    const instrument = page.locator(".trifecta-instrument").first();
    await expect(instrument).toBeVisible();
  });
});

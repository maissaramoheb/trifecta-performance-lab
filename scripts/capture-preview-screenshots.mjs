import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const PREVIEW_URL = process.env.PREVIEW_URL || "http://localhost:3000";
const SCREENSHOT_DIR = join(process.cwd(), "docs", "preview-screenshots");

await mkdir(SCREENSHOT_DIR, { recursive: true });

const browser = await chromium.launch();

try {
  // Desktop Context (with video recording for entrance motion)
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: SCREENSHOT_DIR, size: { width: 1280, height: 720 } },
  });
  const page1 = await desktopContext.newPage();

  // 1. Arabic Pyramid Desktop
  await page1.goto(`${PREVIEW_URL}/`, { waitUntil: "networkidle" });
  await page1.waitForTimeout(1500); // Allow entrance motion sequence to complete
  await page1.screenshot({ path: join(SCREENSHOT_DIR, "01_arabic_pyramid_desktop.png") });

  // 2. English Pyramid Desktop
  const langBtn = page1.locator("button.language, button:has-text('EN'), button:has-text('العربية')").first();
  if (await langBtn.isVisible()) {
    await langBtn.click();
    await page1.waitForTimeout(300);
  }
  await page1.screenshot({ path: join(SCREENSHOT_DIR, "02_english_pyramid_desktop.png") });

  // Replay motion capture
  const replayBtn = page1.locator(".replay-btn").first();
  if (await replayBtn.isVisible()) {
    await replayBtn.click();
    await page1.waitForTimeout(1800);
  }

  // 3. Level Builder
  await page1.goto(`${PREVIEW_URL}/curriculum-builder`, { waitUntil: "networkidle" });
  const tabs = page1.locator(".suite-tabbar .suite-tab-btn");
  if (await tabs.count() >= 4) {
    await tabs.nth(0).click({ force: true });
    await page1.waitForTimeout(200);
  }
  await page1.screenshot({ path: join(SCREENSHOT_DIR, "07_level_builder.png") });

  // 4. Station Builder
  if (await tabs.count() >= 4) {
    await tabs.nth(1).click({ force: true });
    await page1.waitForTimeout(200);
  }
  await page1.screenshot({ path: join(SCREENSHOT_DIR, "08_station_builder.png") });

  // 5. Drill Builder
  if (await tabs.count() >= 4) {
    await tabs.nth(2).click({ force: true });
    await page1.waitForTimeout(200);
  }
  await page1.screenshot({ path: join(SCREENSHOT_DIR, "09_drill_builder.png") });

  // 6. Gate Builder
  if (await tabs.count() >= 4) {
    await tabs.nth(3).click({ force: true });
    await page1.waitForTimeout(200);
  }
  await page1.screenshot({ path: join(SCREENSHOT_DIR, "10_gate_builder.png") });

  // 7. Critical Failure No-Go
  const cfToggle = page1.locator("#observed-cf-toggle, input[type='checkbox']").first();
  if (await cfToggle.isVisible()) {
    await cfToggle.click({ force: true });
    await page1.waitForTimeout(200);
  }
  await page1.screenshot({ path: join(SCREENSHOT_DIR, "11_critical_failure_no_go.png") });

  // 8. Gate-Attempt History
  const recordBtn = page1.locator("button").filter({ hasText: /تسجيل محاولة|Record Attempt/ }).first();
  if (await recordBtn.isVisible()) {
    await recordBtn.click({ force: true });
    await page1.waitForTimeout(200);
  }
  await page1.screenshot({ path: join(SCREENSHOT_DIR, "12_gate_attempt_history.png") });

  // 9. Deletion Confirmation
  const deleteBtn = page1.locator("button.btn-danger, button:has-text('حذف'), button:has-text('Delete')").first();
  if (await deleteBtn.isVisible()) {
    await deleteBtn.click({ force: true });
    await page1.waitForTimeout(200);
  }
  await page1.screenshot({ path: join(SCREENSHOT_DIR, "14_deletion_confirmation.png") });

  // 10. Import Rejection
  const fileInput = page1.locator("input[type='file']");
  if (await fileInput.count() > 0) {
    await fileInput.setInputFiles({
      name: "invalid.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify({ schemaVersion: 99, levels: "corrupted" })),
    });
    await page1.waitForTimeout(300);
  }
  await page1.screenshot({ path: join(SCREENSHOT_DIR, "13_import_rejection.png") });

  await desktopContext.close();

  // Tablet Context (1024x768)
  const tabletContext = await browser.newContext({ viewport: { width: 1024, height: 768 } });
  const pageTablet = await tabletContext.newPage();
  await pageTablet.goto(`${PREVIEW_URL}/`, { waitUntil: "networkidle" });
  await pageTablet.screenshot({ path: join(SCREENSHOT_DIR, "03_arabic_tablet.png") });

  const tabletLangBtn = pageTablet.locator("button.language, button:has-text('EN'), button:has-text('العربية')").first();
  if (await tabletLangBtn.isVisible()) {
    await tabletLangBtn.click();
    await pageTablet.waitForTimeout(300);
  }
  await pageTablet.screenshot({ path: join(SCREENSHOT_DIR, "04_english_tablet.png") });
  await tabletContext.close();

  // Mobile Context (390x844)
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const page2 = await mobileContext.newPage();

  // 11. Arabic Pyramid Mobile
  await page2.goto(`${PREVIEW_URL}/`, { waitUntil: "networkidle" });
  await page2.screenshot({ path: join(SCREENSHOT_DIR, "05_arabic_pyramid_mobile.png") });

  // 12. English Pyramid Mobile
  const langBtnMobile = page2.locator("button.language, button:has-text('EN'), button:has-text('العربية')").first();
  if (await langBtnMobile.isVisible()) {
    await langBtnMobile.click();
    await page2.waitForTimeout(300);
  }
  await page2.screenshot({ path: join(SCREENSHOT_DIR, "06_english_pyramid_mobile.png") });

  await mobileContext.close();

  console.log("ALL PREVIEW SCREENSHOTS & MOTION CAPTURE COMPLETED SUCCESSFULLY!");
} finally {
  await browser.close();
}

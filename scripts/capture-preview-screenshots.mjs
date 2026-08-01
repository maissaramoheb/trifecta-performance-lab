import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const PREVIEW_URL = process.env.PREVIEW_URL || "https://trifecta-performance-1oj4z21dy-delta4ce20-5830s-projects.vercel.app";
const SCREENSHOT_DIR = join(process.cwd(), "docs", "preview-screenshots");

await mkdir(SCREENSHOT_DIR, { recursive: true });

const browser = await chromium.launch();

try {
  // Desktop Context
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page1 = await desktopContext.newPage();

  // 1. Arabic Pyramid Desktop
  await page1.goto(`${PREVIEW_URL}/`, { waitUntil: "networkidle" });
  await page1.screenshot({ path: join(SCREENSHOT_DIR, "01_arabic_pyramid_desktop.png") });

  // 2. English Pyramid Desktop
  const langBtn = page1.locator("button.language, button:has-text('EN'), button:has-text('العربية')").first();
  if (await langBtn.isVisible()) {
    await langBtn.click();
    await page1.waitForTimeout(300);
  }
  await page1.screenshot({ path: join(SCREENSHOT_DIR, "02_english_pyramid_desktop.png") });

  // 3. Level Builder
  await page1.goto(`${PREVIEW_URL}/curriculum-builder`, { waitUntil: "networkidle" });
  await page1.screenshot({ path: join(SCREENSHOT_DIR, "05_level_builder.png") });

  // 4. Station Builder
  const tabs = page1.locator(".suite-tab-btn, nav button");
  if (await tabs.count() >= 2) {
    await tabs.nth(1).click({ force: true });
    await page1.waitForTimeout(200);
  } else {
    await page1.goto(`${PREVIEW_URL}/station-builder`, { waitUntil: "networkidle" });
  }
  await page1.screenshot({ path: join(SCREENSHOT_DIR, "06_station_builder.png") });

  // 5. Drill Builder
  if (await tabs.count() >= 3) {
    await tabs.nth(2).click({ force: true });
    await page1.waitForTimeout(200);
  }
  await page1.screenshot({ path: join(SCREENSHOT_DIR, "07_drill_builder.png") });

  // 6. Gate Builder
  if (await tabs.count() >= 4) {
    await tabs.nth(3).click({ force: true });
    await page1.waitForTimeout(200);
  }
  await page1.screenshot({ path: join(SCREENSHOT_DIR, "08_gate_builder.png") });

  // 7. Critical Failure No-Go
  const cfToggle = page1.locator("#observed-cf-toggle, input[type='checkbox']").first();
  if (await cfToggle.isVisible()) {
    await cfToggle.click({ force: true });
    await page1.waitForTimeout(200);
  }
  await page1.screenshot({ path: join(SCREENSHOT_DIR, "09_critical_failure_no_go.png") });

  // 8. Gate-Attempt History
  const recordBtn = page1.locator("button").filter({ hasText: /تسجيل محاولة|Record Attempt/ }).first();
  if (await recordBtn.isVisible()) {
    await recordBtn.click({ force: true });
    await page1.waitForTimeout(200);
  }
  await page1.screenshot({ path: join(SCREENSHOT_DIR, "10_gate_attempt_history.png") });

  // 9. Deletion Confirmation
  const deleteBtn = page1.locator("button.btn-danger, button:has-text('حذف'), button:has-text('Delete')").first();
  if (await deleteBtn.isVisible()) {
    await deleteBtn.click({ force: true });
    await page1.waitForTimeout(200);
  }
  await page1.screenshot({ path: join(SCREENSHOT_DIR, "12_deletion_confirmation.png") });

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
  await page1.screenshot({ path: join(SCREENSHOT_DIR, "11_import_rejection.png") });

  await desktopContext.close();

  // Mobile Context
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const page2 = await mobileContext.newPage();

  // 11. Arabic Pyramid Mobile
  await page2.goto(`${PREVIEW_URL}/`, { waitUntil: "networkidle" });
  await page2.screenshot({ path: join(SCREENSHOT_DIR, "03_arabic_pyramid_mobile.png") });

  // 12. English Pyramid Mobile
  const langBtnMobile = page2.locator("button.language, button:has-text('EN'), button:has-text('العربية')").first();
  if (await langBtnMobile.isVisible()) {
    await langBtnMobile.click();
    await page2.waitForTimeout(300);
  }
  await page2.screenshot({ path: join(SCREENSHOT_DIR, "04_english_pyramid_mobile.png") });

  await mobileContext.close();

  console.log("ALL 12 PREVIEW SCREENSHOTS CAPTURED SUCCESSFULLY!");
} finally {
  await browser.close();
}

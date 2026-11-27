import assert from "node:assert/strict";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const baseUrl = process.env.CVD_TEST_BASE_URL ?? "http://127.0.0.1:4321";
const routes = [
  "/index.html", "/about.html", "/projects.html", "/experience.html",
  "/missions.html", "/socialmedia.html", "/contact.html", "/join.html",
  "/403.html", "/404.html", "/418.html", "/429.html",
];
const results = [];
const record = (name, details = {}) => results.push({ name, ...details });
const launchOptions = { headless: true, args: ["--no-sandbox"] };
if (process.env.CVD_CHROMIUM_EXECUTABLE) launchOptions.executablePath = process.env.CVD_CHROMIUM_EXECUTABLE;
const browser = await chromium.launch(launchOptions);

try {
  for (const route of routes) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    const response = await page.goto(new URL(route, baseUrl).toString(), { waitUntil: "domcontentloaded" });
    assert.equal(response?.status(), 200, route + " must return HTTP 200");
    await page.locator("#hg-cvd-launcher").waitFor({ state: "visible" });
    assert.equal(await page.getByRole("button", { name: "Display support", exact: true }).count(), 1, route + " launcher accessible name must match its visible label");
    assert.equal(pageErrors.length, 0, route + " must not throw uncaught page errors");
    const axe = await new AxeBuilder({ page }).analyze();
    assert.equal(axe.violations.length, 0, route + " has axe violations: " + axe.violations.map((item) => item.id).join(", "));
    record("route " + route, { status: response.status(), axeViolations: axe.violations.length });
    await context.close();
  }

  const context = await browser.newContext({ viewport: { width: 320, height: 700 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto(new URL("/index.html", baseUrl).toString(), { waitUntil: "domcontentloaded" });
  const launcher = page.locator("#hg-cvd-launcher");
  await launcher.click();
  const dialog = page.locator("#hg-cvd-dialog");
  await dialog.waitFor({ state: "visible" });

  const dialogAxe = await new AxeBuilder({ page }).analyze();
  assert.equal(dialogAxe.violations.length, 0, "Open dialog must have no axe violations");
  const geometry320 = await dialog.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { left: rect.left, right: rect.right, viewport: innerWidth };
  });
  assert.ok(geometry320.left >= 0 && geometry320.right <= geometry320.viewport, "Dialog must fit a 320px viewport");
  const checkboxBox = await dialog.locator("#hg-cvd-boundaries").boundingBox();
  assert.ok(checkboxBox && checkboxBox.width >= 24 && checkboxBox.height >= 24, "Checkbox target must be at least 24x24 CSS pixels");
  assert.ok(await dialog.evaluate((element) => element.contains(document.activeElement)), "Focus must enter the dialog");
  assert.equal(await dialog.locator("#hg-cvd-profile option").count(), 10, "All ten profiles must be available");

  await page.keyboard.press("Tab");
  assert.ok(await dialog.evaluate((element) => element.contains(document.activeElement)), "Tab focus must remain inside the modal dialog");
  await page.keyboard.press("Shift+Tab");
  assert.ok(await dialog.evaluate((element) => element.contains(document.activeElement)), "Reverse Tab focus must remain inside the modal dialog");

  const expected = {
    p00: { boundaries: "false", neutral: "false" },
    p01: { boundaries: "true", neutral: "false" },
    p02: { boundaries: "true", neutral: "false" },
    p03: { boundaries: "true", neutral: "false" },
    p04: { boundaries: "true", neutral: "false" },
    p05: { boundaries: "true", neutral: "false" },
    p06: { boundaries: "true", neutral: "false" },
    p07: { boundaries: "false", neutral: "true" },
    p08: { boundaries: "true", neutral: "false" },
    p09: { boundaries: "false", neutral: "false" },
  };
  for (const [profile, state] of Object.entries(expected)) {
    await dialog.locator("#hg-cvd-profile").selectOption(profile);
    const actual = await page.evaluate(() => ({
      profile: document.documentElement.dataset.hgCvdProfile,
      boundaries: document.documentElement.dataset.hgCvdBoundaries,
      neutral: document.documentElement.dataset.hgCvdNeutralSurfaces,
    }));
    assert.deepEqual(actual, { profile, ...state }, profile + " must apply its documented presentation state");
  }
  for (const strength of ["subtle", "balanced", "stronger"]) {
    await dialog.locator("#hg-cvd-strength").selectOption(strength);
    assert.equal(await page.evaluate(() => document.documentElement.dataset.hgCvdStrength), strength);
  }
  await dialog.locator("#hg-cvd-profile").selectOption("p09");
  await dialog.locator("#hg-cvd-boundaries").check();
  await dialog.locator("#hg-cvd-neutral-surfaces").check();
  const manual = await page.evaluate(() => ({
    boundaries: document.documentElement.dataset.hgCvdBoundaries,
    neutral: document.documentElement.dataset.hgCvdNeutralSurfaces,
  }));
  assert.deepEqual(manual, { boundaries: "true", neutral: "true" }, "Manual calibration toggles must apply");

  await dialog.locator("#hg-cvd-profile").selectOption("p07");
  await dialog.locator("#hg-cvd-strength").selectOption("subtle");
  await dialog.locator("#hg-cvd-done").click();
  assert.ok(await launcher.evaluate((element) => document.activeElement === element), "Closing the dialog must restore focus to the launcher");
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator("#hg-cvd-launcher").click();
  assert.equal(await page.locator("#hg-cvd-profile").inputValue(), "p07", "Profile must persist locally");
  assert.equal(await page.locator("#hg-cvd-strength").inputValue(), "subtle", "Emphasis must persist locally");
  await page.locator("#hg-cvd-reset").click();
  assert.equal(await page.locator("#hg-cvd-profile").inputValue(), "p00", "Reset must restore the accessible default");
  assert.equal(await page.locator("#hg-cvd-strength").inputValue(), "balanced", "Reset must restore balanced emphasis");

  await page.setViewportSize({ width: 280, height: 600 });
  const geometry280 = await dialog.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { left: rect.left, right: rect.right, viewport: innerWidth };
  });
  assert.ok(geometry280.left >= 0 && geometry280.right <= geometry280.viewport, "Dialog must fit a 280px viewport");
  await page.setViewportSize({ width: 320, height: 420 });
  const shortViewport = await dialog.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top, bottom: rect.bottom, viewportHeight: innerHeight,
      scrollHeight: element.scrollHeight, clientHeight: element.clientHeight,
    };
  });
  assert.ok(shortViewport.top >= 0 && shortViewport.bottom <= shortViewport.viewportHeight, "Dialog must remain within a short viewport");
  assert.ok(shortViewport.scrollHeight >= shortViewport.clientHeight, "Dialog content must remain scrollable");
  await page.keyboard.press("Escape");
  assert.equal(await dialog.evaluate((element) => element.open), false, "Escape must close the dialog");
  assert.ok(await launcher.evaluate((element) => document.activeElement === element), "Escape must restore focus to the launcher");
  assert.equal(pageErrors.length, 0, "Main page must not throw uncaught page errors");
  record("dialog, profiles, keyboard, persistence, and responsive geometry", {
    axeViolations: dialogAxe.violations.length, profileCount: 10, strengthLevels: 3,
    checkboxBox, geometry320, geometry280, shortViewport,
  });
  await context.close();

  const blockedContext = await browser.newContext({ viewport: { width: 360, height: 780 } });
  await blockedContext.addInitScript(() => {
    const originalGet = Storage.prototype.getItem;
    const originalSet = Storage.prototype.setItem;
    Storage.prototype.getItem = function (key) {
      if (key === "hg-cvd-display-preferences-v1") throw new DOMException("Storage disabled", "SecurityError");
      return originalGet.call(this, key);
    };
    Storage.prototype.setItem = function (key, value) {
      if (key === "hg-cvd-display-preferences-v1") throw new DOMException("Storage disabled", "SecurityError");
      return originalSet.call(this, key, value);
    };
  });
  const blockedPage = await blockedContext.newPage();
  const blockedErrors = [];
  blockedPage.on("pageerror", (error) => blockedErrors.push(error.message));
  await blockedPage.goto(new URL("/index.html", baseUrl).toString(), { waitUntil: "domcontentloaded" });
  await blockedPage.locator("#hg-cvd-launcher").click();
  await blockedPage.locator("#hg-cvd-profile").selectOption("p08");
  assert.equal(await blockedPage.evaluate(() => document.documentElement.dataset.hgCvdProfile), "p08");
  assert.equal(blockedErrors.length, 0, "Storage-disabled mode must not throw uncaught errors");
  record("storage-disabled fallback", { profile: "p08", pageErrors: blockedErrors.length });
  await blockedContext.close();

  const mobileContext = await browser.newContext({
    viewport: { width: 360, height: 780 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(new URL("/index.html", baseUrl).toString(), { waitUntil: "domcontentloaded" });
  await mobilePage.locator("#hg-cvd-launcher").tap();
  const mobileDialog = mobilePage.locator("#hg-cvd-dialog");
  const mobileTarget = await mobileDialog.locator("#hg-cvd-boundaries").boundingBox();
  assert.ok(await mobileDialog.isVisible(), "Touch must open the dialog");
  assert.ok(mobileTarget && mobileTarget.width >= 24 && mobileTarget.height >= 24, "Mobile checkbox target must meet 24x24 CSS pixels");
  await mobileDialog.locator("#hg-cvd-profile").selectOption("p07");
  assert.equal(await mobilePage.evaluate(() => document.documentElement.dataset.hgCvdProfile), "p07");
  record("mobile touch emulation", { checkboxTarget: mobileTarget });
  await mobileContext.close();

  const reducedContext = await browser.newContext({ viewport: { width: 360, height: 780 } });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.emulateMedia({ reducedMotion: "reduce" });
  await reducedPage.goto(new URL("/index.html", baseUrl).toString(), { waitUntil: "domcontentloaded" });
  const motion = await reducedPage.evaluate(() => ({
    scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    reducedClass: document.documentElement.classList.contains("hg-reduced-motion"),
  }));
  assert.equal(motion.scrollBehavior, "auto");
  assert.equal(motion.reducedClass, true);
  record("reduced motion", motion);
  await reducedContext.close();

  console.log(JSON.stringify({ total: results.length, passed: results.length, failed: 0, results }, null, 2));
} finally {
  await browser.close();
}

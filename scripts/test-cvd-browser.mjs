import assert from "node:assert/strict";
import { chromium, firefox, webkit } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const baseUrl = process.env.CVD_TEST_BASE_URL ?? "http://127.0.0.1:4321";
const routes = [
  "/index.html", "/about.html", "/projects.html", "/experience.html",
  "/missions.html", "/socialmedia.html", "/contact.html", "/join.html",
  "/403.html", "/404.html", "/418.html", "/429.html",
];
const results = [];
const record = (name, details = {}) => results.push({ name, ...details });
const browserName = process.env.CVD_BROWSER_ENGINE ?? "chromium";
const engines = { chromium, firefox, webkit };
assert.ok(engines[browserName], "CVD_BROWSER_ENGINE must be chromium, firefox, or webkit");
const launchOptions = { headless: true, args: browserName === "chromium" ? ["--no-sandbox"] : [] };
if (browserName === "chromium" && process.env.CVD_CHROMIUM_EXECUTABLE) launchOptions.executablePath = process.env.CVD_CHROMIUM_EXECUTABLE;
const browser = await engines[browserName].launch(launchOptions);

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

    const reflowContext = await browser.newContext({ viewport: { width: 320, height: 780 }, reducedMotion: "reduce" });
    const reflowPage = await reflowContext.newPage();
    await reflowPage.goto(new URL(route, baseUrl).toString(), { waitUntil: "domcontentloaded" });
    const reflow = await reflowPage.evaluate(() => ({ viewport: innerWidth, documentWidth: document.documentElement.scrollWidth }));
    assert.ok(reflow.documentWidth <= reflow.viewport, route + " must reflow at 320 CSS pixels without horizontal overflow");
    const reflowAxe = await new AxeBuilder({ page: reflowPage }).analyze();
    assert.equal(reflowAxe.violations.length, 0, route + " has 320px axe violations: " + reflowAxe.violations.map((item) => item.id).join(", "));
    record("reflow " + route, { ...reflow, axeViolations: reflowAxe.violations.length });
    await reflowPage.evaluate(() => document.documentElement.style.setProperty("font-size", "200%", "important"));
    const textResize = await reflowPage.evaluate(() => ({ viewport: innerWidth, documentWidth: document.documentElement.scrollWidth, bodyWidth: document.body.scrollWidth }));
    assert.ok(textResize.documentWidth <= textResize.viewport && textResize.bodyWidth <= textResize.viewport, route + " must remain usable without horizontal overflow at 200% text size");
    record("200% text resize " + route, textResize);
    await reflowContext.close();
  }

  const statusPages = [
    { route: "/projects.html", selector: ".project-status" },
    { route: "/socialmedia.html", selector: ".social-status" },
    { route: "/contact.html", selector: ".response-speed" },
  ];
  for (const item of statusPages) {
    const statusContext = await browser.newContext({ viewport: { width: 900, height: 760 }, reducedMotion: "reduce" });
    const statusPage = await statusContext.newPage();
    await statusPage.goto(new URL(item.route, baseUrl).toString(), { waitUntil: "domcontentloaded" });
    const statuses = statusPage.locator(item.selector);
    const count = await statuses.count();
    assert.ok(count > 0, item.route + " must expose status information");
    for (let index = 0; index < count; index += 1) {
      const status = statuses.nth(index);
      assert.equal(await status.getAttribute("data-cvd-text-status"), "true", item.route + " status must be marked for redundant text support");
      assert.ok((await status.innerText()).trim().length > 0, item.route + " status must retain a visible text label");
      const dots = status.locator(".status-dot");
      for (let dotIndex = 0; dotIndex < await dots.count(); dotIndex += 1) {
        assert.equal(await dots.nth(dotIndex).getAttribute("aria-hidden"), "true", "Decorative status shapes must be hidden from assistive technology");
      }
    }
    record("redundant status labels " + item.route, { count, textLabels: true, decorativeShapesHidden: true });
    await statusContext.close();
  }

  const context = await browser.newContext({ viewport: { width: 320, height: 700 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto(new URL("/index.html", baseUrl).toString(), { waitUntil: "domcontentloaded" });
  const launcher = page.locator("#hg-cvd-launcher");
  await launcher.focus();
  await page.keyboard.press("Enter");
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
  const focusedState = await page.evaluate(() => {
    const element = document.activeElement;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    const dialogRect = document.querySelector("#hg-cvd-dialog").getBoundingClientRect();
    return { outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth, top: rect.top, bottom: rect.bottom, dialogTop: dialogRect.top, dialogBottom: dialogRect.bottom };
  });
  assert.equal(focusedState.outlineStyle, "solid", "Keyboard focus must have a visible outline");
  assert.ok(Number.parseFloat(focusedState.outlineWidth) >= 3, "Keyboard focus outline must be at least 3px");
  assert.ok(focusedState.top >= focusedState.dialogTop && focusedState.bottom <= focusedState.dialogBottom, "Focused control must not be obscured by the dialog viewport");
  record("visible and unobscured keyboard focus", focusedState);
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
    const announcement = await dialog.locator("#hg-cvd-live").textContent();
    assert.ok(announcement.includes("selected. Support emphasis:"), profile + " changes must be announced through the live region");
    if (/^p0[1-6]$/.test(profile)) {
      assert.ok((await dialog.locator("#hg-cvd-profile-note").textContent()).includes("not a diagnosis"), profile + " must be clearly labelled as a preference, not a diagnosis");
    }
    if (["p00", "p01", "p07", "p08", "p09"].includes(profile)) {
      const profileAxe = await new AxeBuilder({ page }).include("#hg-cvd-dialog").analyze();
      assert.equal(profileAxe.violations.length, 0, profile + " representative dialog state must have no axe violations: " + profileAxe.violations.map((item) => item.id).join(", "));
    }
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
  assert.ok((await dialog.locator("#hg-cvd-profile option:checked").textContent()).includes("Simplified Surfaces"), "P07 must describe its actual surface treatment");
  assert.ok((await dialog.locator("#hg-cvd-profile-note").textContent()).includes("decorative gradients and shadows"), "P07 must not imply an unimplemented chroma or monochrome filter");
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
  await launcher.click();
  await page.mouse.click(2, 70);
  assert.equal(await dialog.evaluate((element) => element.open), false, "Clicking the modal backdrop must close the dialog");
  assert.ok(await launcher.evaluate((element) => document.activeElement === element), "Backdrop dismissal must restore focus to the launcher");
  record("modal backdrop dismissal", { closed: true, focusRestored: true });
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

  const invalidContext = await browser.newContext({ viewport: { width: 360, height: 780 } });
  await invalidContext.addInitScript(() => {
    localStorage.setItem("hg-cvd-display-preferences-v1", JSON.stringify({
      profile: "p99", strength: "critical", boundaries: "yes", neutralSurfaces: 1,
    }));
  });
  const invalidPage = await invalidContext.newPage();
  await invalidPage.goto(new URL("/index.html", baseUrl).toString(), { waitUntil: "domcontentloaded" });
  await invalidPage.locator("#hg-cvd-launcher").click();
  assert.equal(await invalidPage.locator("#hg-cvd-profile").inputValue(), "p00", "Unknown stored profiles must fall back to Accessible Default");
  assert.equal(await invalidPage.locator("#hg-cvd-strength").inputValue(), "balanced", "Unknown stored emphasis must fall back to Balanced");
  assert.equal(await invalidPage.evaluate(() => document.documentElement.dataset.hgCvdBoundaries), "false", "Invalid boundary preference types must be ignored");
  assert.equal(await invalidPage.evaluate(() => document.documentElement.dataset.hgCvdNeutralSurfaces), "false", "Invalid neutral-surface preference types must be ignored");
  record("invalid stored preference fallback", { profile: "p00", strength: "balanced", invalidBooleansIgnored: true });
  await invalidContext.close();

  if (browserName === "firefox") {
    record("mobile touch emulation", { skipped: "Playwright Firefox does not expose mobile viewport emulation" });
  } else {
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
  }

  const textSpacingContext = await browser.newContext({ viewport: { width: 320, height: 780 }, reducedMotion: "reduce" });
  const textSpacingPage = await textSpacingContext.newPage();
  await textSpacingPage.goto(new URL("/index.html", baseUrl).toString(), { waitUntil: "domcontentloaded" });
  await textSpacingPage.addStyleTag({ content: `
    p, li, dd { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
    p { margin-bottom: 2em !important; }
  ` });
  const spacingLayout = await textSpacingPage.evaluate(() => ({ viewport: innerWidth, documentWidth: document.documentElement.scrollWidth }));
  assert.ok(spacingLayout.documentWidth <= spacingLayout.viewport, "Text-spacing overrides must not cause horizontal overflow at 320 CSS pixels");
  const spacingAxe = await new AxeBuilder({ page: textSpacingPage }).analyze();
  assert.equal(spacingAxe.violations.length, 0, "Text-spacing override state must have no axe violations: " + spacingAxe.violations.map((item) => item.id + " (" + item.nodes.map((node) => node.target.join(" ") + ": " + node.failureSummary).join(" | ") + ")").join("; "));
  record("WCAG text-spacing override", { ...spacingLayout, axeViolations: spacingAxe.violations.length });
  await textSpacingContext.close();

  const forcedColorsContext = await browser.newContext({ viewport: { width: 360, height: 780 }, reducedMotion: "reduce" });
  const forcedColorsPage = await forcedColorsContext.newPage();
  await forcedColorsPage.emulateMedia({ forcedColors: "active" });
  await forcedColorsPage.goto(new URL("/index.html", baseUrl).toString(), { waitUntil: "domcontentloaded" });
  const forcedLauncher = forcedColorsPage.locator("#hg-cvd-launcher");
  assert.ok(await forcedLauncher.isVisible(), "Display support launcher must remain visible in forced-colors mode");
  await forcedLauncher.focus();
  const forcedFocus = await forcedLauncher.evaluate((element) => {
    const style = getComputedStyle(element);
    return { outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth, outlineColor: style.outlineColor };
  });
  assert.equal(forcedFocus.outlineStyle, "solid", "Forced-colors keyboard focus must remain visible");
  assert.ok(Number.parseFloat(forcedFocus.outlineWidth) >= 3, "Forced-colors focus outline must be at least 3px");
  await forcedColorsPage.keyboard.press("Enter");
  const forcedDialog = forcedColorsPage.locator("#hg-cvd-dialog");
  assert.ok(await forcedDialog.isVisible(), "Display support dialog must open in forced-colors mode");
  const forcedAxe = await new AxeBuilder({ page: forcedColorsPage }).analyze();
  assert.equal(forcedAxe.violations.length, 0, "Forced-colors state must have no axe violations: " + forcedAxe.violations.map((item) => item.id + " (" + item.nodes.map((node) => node.target.join(" ") + ": " + node.failureSummary).join(" | ") + ")").join("; "));
  record("forced-colors mode", { launcherVisible: true, dialogVisible: true, focus: forcedFocus, axeViolations: forcedAxe.violations.length });
  await forcedColorsContext.close();

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

  const skipped = results.filter((result) => result.skipped).length;
  console.log(JSON.stringify({ engine: browserName, total: results.length, passed: results.length - skipped, skipped, failed: 0, results }, null, 2));
} finally {
  await browser.close();
}

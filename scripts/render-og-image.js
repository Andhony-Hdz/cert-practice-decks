// Renders assets/og-image.html to assets/og-image.png at 1200x630
// (the standard Open Graph / Twitter Card image size).
//
// This is a one-off dev tool, not part of the live site — it needs
// playwright-chromium, which isn't a project dependency:
//   npm install --no-save playwright-chromium
//   node scripts/render-og-image.js
const path = require("path");
const { chromium } = require("playwright-chromium");

(async () => {
  const root = path.join(__dirname, "..");
  const src = "file:///" + path.join(root, "assets", "og-image.html").replace(/\\/g, "/");
  const out = path.join(root, "assets", "og-image.png");

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 });
  await page.goto(src);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  await browser.close();
  console.log("Wrote", out);
})();

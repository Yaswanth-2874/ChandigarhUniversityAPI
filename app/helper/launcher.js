const playwright = require("playwright");

const launchBot = async (userId, password) => {
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://students.cuchd.in/");
  await page.fill("#txtUserId", userId);
  await page.click("#btnNext");
  await page.fill("#txtLoginPassword", password);

  const captchaElement = await page.waitForSelector("#imgCaptcha");
  const captchaBuffer = await captchaElement.screenshot();

  return {
    captcha: captchaBuffer.toString("base64"),
    page,
    browser,
  };
};

module.exports = { launchBot };

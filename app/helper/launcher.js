let browser, page, context;
const playwright = require("playwright");

const launchBot = async (req, res) => {
  const { userId, password } = req.body;

  browser = await playwright.chromium.launch();
  context = await browser.newContext();
  page = await context.newPage();

  await page.goto("https://students.cuchd.in/");
  await page.fill("#txtUserId", userId);
  await page.click("#btnNext");
  await page.fill("#txtLoginPassword", password);

  const captchaElement = await page.waitForSelector("#imgCaptcha");
  const captchaBuffer = await captchaElement.screenshot();

  res.json({ captcha: captchaBuffer.toString("base64") });
};
const getPage = () => page;
const getBrowser = () => browser;

module.exports = { launchBot, getPage, getBrowser };

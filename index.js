const express = require("express");
const bodyParser = require("body-parser");
const playwright = require("playwright");
const cors = require("cors");

const app = express();
const port = 4000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let browserContextMap = new Map();

app.post("/submit", async (req, res) => {
  const { userId, password } = req.body;

  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://students.cuchd.in/");
  await page.fill("#txtUserId", userId);
  await page.click("#btnNext");
  await page.fill("#txtLoginPassword", password);

  const captchaElement = await page.waitForSelector("#imgCaptcha");
  const captchaBuffer = await captchaElement.screenshot();

  const sessionId = `${userId}_${Date.now()}`;
  browserContextMap.set(sessionId, { browser, context, page });

  res.json({ sessionId, captcha: captchaBuffer.toString("base64") });
});

app.post("/submit-captcha", async (req, res) => {
  const { sessionId, captcha } = req.body;

  const session = browserContextMap.get(sessionId);
  if (!session) {
    return res.status(400).send("Invalid session ID");
  }

  const { browser, context, page } = session;

  await page.fill("#txtcaptcha", captcha);
  await page.click("#btnSubmit");

  await page.screenshot({ path: "after_submit.png" });

  await browser.close();
  browserContextMap.delete(sessionId);

  res.send("Captcha submitted successfully!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

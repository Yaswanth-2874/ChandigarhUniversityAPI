const express = require("express");
const { launchBot } = require("../services/launcher");
const { fillCaptchaAndExtractMarks } = require("../services/captchaHandler");
const router = express.Router();
const sessions = {};

router.post("/", async (req, res) => {
  try {
    const { userId, password } = req.body;
    const { captcha, page, browser } = await launchBot(userId, password);

    const sessionId = Date.now().toString();
    sessions[sessionId] = { page, browser };

    res.json({ sessionId, captcha });
  } catch (error) {
    console.error("Error launching bot:", error);
    res.status(500).json({ error: "Failed to launch bot" });
  }
});

router.post("/captcha", async (req, res) => {
  try {
    const { sessionId, captcha } = req.body;
    const session = sessions[sessionId];

    if (!session || !session.page || !session.browser) {
      res.status(500).json({ error: "Page or browser not initialized" });
      console.log("Page or Browser not loaded");
      return;
    }

    const studentMarks = await fillCaptchaAndExtractMarks(
      session.page,
      captcha
    );
    await session.browser.close();
    delete sessions[sessionId];

    res.json({ studentMarks });
  } catch (error) {
    console.error("Error processing captcha:", error);
    res.status(500).json({ error: "Failed to process captcha" });
  }
});

module.exports = { router };

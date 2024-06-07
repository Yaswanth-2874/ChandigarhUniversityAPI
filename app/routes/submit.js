const express = require("express");
const { launchBot } = require("../helper/launcher");
const { fillCaptchaAndExtractMarks } = require("../helper/captchaHandler");
const router = express.Router();

router.post("/", launchBot);
router.post("/captcha", fillCaptchaAndExtractMarks);

module.exports = { router };

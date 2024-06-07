const { calculateTotals } = require("./calculateTotals");
const { getPage, getBrowser } = require("./launcher");
const { extractMarks, getSubjectNames } = require("./marksExtracter");

const fillCaptchaAndExtractMarks = async (req, res) => {
  console.log("Received captcha");
  const { captcha } = req.body;

  const page = getPage();
  const browser = getBrowser();

  if (!page || !browser) {
    res.status(500).json({ error: "Page or browser not initialized" });
    console.log("Page or Browser not loaded");
    return;
  }

  await page.fill("#txtcaptcha", captcha);
  await page.click("#btnLogin");
  await page.goto("https://students.cuchd.in/frmStudentMarksView.aspx");
  const marks = await extractMarks(page);
  const subjectNames = getSubjectNames();
  const studentMarks = calculateTotals(subjectNames, marks);
  console.log("Displayed Marks");
  await browser.close();

  res.json({ studentMarks });
};

module.exports = { fillCaptchaAndExtractMarks };

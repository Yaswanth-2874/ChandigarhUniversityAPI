const { calculateTotals } = require("./calculateTotals");
const { extractMarks, getSubjectNames } = require("../helper/marksExtracter");

const fillCaptchaAndExtractMarks = async (page, captcha) => {
  await page.fill("#txtcaptcha", captcha);
  await page.click("#btnLogin");
  await page.goto("https://students.cuchd.in/frmStudentMarksView.aspx");

  const marks = await extractMarks(page);
  const subjectNames = getSubjectNames();
  const studentMarks = calculateTotals(subjectNames, marks);
  console.log("Displayed Marks");

  return studentMarks;
};

module.exports = { fillCaptchaAndExtractMarks };

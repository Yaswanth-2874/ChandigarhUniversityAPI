const { calculateTotals } = require("../util/calculateTotals");
const { extractMarks, getSubjectNames } = require("../util/marksExtracter");

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

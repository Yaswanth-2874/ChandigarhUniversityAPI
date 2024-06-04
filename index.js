const express = require("express");
const bodyParser = require("body-parser");
const playwright = require("playwright");
const cors = require("cors");

const app = express();
const port = 4000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let browser, context, page;
const extractMarks = async (page) => {
  let index = 0;
  const marksData = [];
  while (true) {
    let identifier = `#ui-accordion-accordion-header-${index}`;
    const element = await page.$(identifier);
    if (!element) {
      break;
    }
    await page.click(identifier);
    const marks = await page.$$eval(
      `#ui-accordion-accordion-panel-${index} table tbody tr`,
      (rows) => {
        return rows.map((row) => {
          const columns = row.querySelectorAll("td");
          return {
            examDescription: columns[0].innerText.trim(),
            maxMarks: columns[1].innerText.trim(),
            marksObtained: columns[2].innerText.trim(),
          };
        });
      }
    );
    await page.screenshot({ path: `Marks${index}.png` });
    marksData.push({ index, marks });
    await page.click(identifier);
    index++;
  }

  return marksData;
};

app.post("/submit", async (req, res) => {
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
});

app.post("/submit-captcha", async (req, res) => {
  console.log("Received captcha");
  const { captcha } = req.body;
  await page.fill("#txtcaptcha", captcha);
  await page.click("#btnLogin");
  await page.goto("https://students.cuchd.in/frmStudentMarksView.aspx");
  await page.screenshot({ path: `CurrentStatus.png` });
  const marks = await extractMarks(page);
  console.log("Extracted Marks, marks ready ", marks);
  marks.forEach((mark) => {
    let subjectName, totalMarks;
    switch (mark.index) {
      case 0: {
        subjectName = "Probability and Statistics";
        break;
      }
      case 1: {
        subjectName = "Operating System";
        break;
      }
      case 3: {
        subjectName = "Numerical Methods and Optimization";
        break;
      }
      case 6: {
        subjectName = "Database Management System";
        break;
      }
    }
    if (mark.index === 0 || mark.index === 1) {
      totalMarks =
        parseFloat(mark.marks[0].marksObtained) +
        parseFloat(mark.marks[1].marksObtained) +
        parseFloat(mark.marks[2].marksObtained) / 2 +
        parseFloat(mark.marks[3].marksObtained) +
        parseFloat(mark.marks[4].marksObtained) / 3 +
        parseFloat(mark.marks[5].marksObtained) / 2;
    } else if (mark.index === 3 || mark.index === 6) {
      totalMarks =
        parseFloat(mark.marks[0].marksObtained) / 2 +
        parseFloat(mark.marks[1].marksObtained) / 4 +
        parseFloat(mark.marks[2].marksObtained) / 4 +
        parseFloat(mark.marks[3].marksObtained) / 6 +
        parseFloat(mark.marks[4].marksObtained) / 6 +
        parseFloat(mark.marks[5].marksObtained) / 6 +
        parseFloat(mark.marks[6].marksObtained) / 6 +
        parseFloat(mark.marks[7].marksObtained) / 4 +
        (parseFloat(mark.marks[8].marksObtained) * 1.5) / 2 +
        parseFloat(mark.marks[9].marksObtained) / 2 +
        parseFloat(mark.marks[10].marksObtained) / 2 +
        parseFloat(mark.marks[11].marksObtained) / 2 +
        parseFloat(mark.marks[12].marksObtained) / 6;
    }
    if (
      mark.index === 0 ||
      mark.index === 1 ||
      mark.index === 3 ||
      mark.index === 6
    )
      console.log(subjectName, " : ", totalMarks);
  });
  console.log("Displayed Marks");
  await browser.close();

  res.send("Captcha submitted successfully!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

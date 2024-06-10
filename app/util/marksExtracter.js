let subjectNames;
const extractMarks = async (page) => {
  let index = 0;
  const marksData = [];
  subjectNames = await page.$$eval("h3.ui-accordion-header", (elements) =>
    elements.map((element) => element.textContent.trim())
  );
  while (true) {
    let identifier = `#ui-accordion-accordion-header-${index}`;
    const element = await page.$(identifier);
    if (!element) {
      break;
    }

    await page.waitForSelector("h3.ui-accordion-header");
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
    marksData.push({ index, marks });
    await page.click(identifier);
    index++;
  }

  return marksData;
};

const getSubjectNames = () => subjectNames;
module.exports = { extractMarks, getSubjectNames };

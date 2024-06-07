const calculateTotals = (subjectNames, marks) => {
  const studentMarks = [];
  marks.forEach((mark) => {
    let subjectName, totalMarks;
    subjectName = subjectNames[mark.index];
    if (
      subjectName == "Probability and  Statistics (22SMT-257)" ||
      subjectName == "Operating System (22CST-253)"
    ) {
      totalMarks =
        parseFloat(mark.marks[0].marksObtained) +
        parseFloat(mark.marks[1].marksObtained) +
        parseFloat(mark.marks[2].marksObtained) / 2 +
        parseFloat(mark.marks[3].marksObtained) +
        parseFloat(mark.marks[4].marksObtained) / 3 +
        parseFloat(mark.marks[5].marksObtained) / 2;
    } else if (
      subjectName == "Database Management System (22CSH-254)" ||
      subjectName ==
        "Numerical Methods and Optimization using Python (22CSH-259)"
    ) {
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
      subjectName == "Probability and  Statistics (22SMT-257)" ||
      subjectName == "Operating System (22CST-253)" ||
      subjectName == "Database Management System (22CSH-254)" ||
      subjectName ==
        "Numerical Methods and Optimization using Python (22CSH-259)"
    ) {
      totalMarks = parseFloat(totalMarks.toFixed(2));
      console.log(subjectName, " : ", totalMarks);
      studentMarks.push({ subjectName, totalMarks });
    }
  });
  return studentMarks;
};
module.exports = { calculateTotals };

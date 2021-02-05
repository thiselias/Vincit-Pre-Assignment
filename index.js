import readlineSync from "readline-sync";
import csv from "csvtojson";
import {
  longestTrends,
  volumesAndPriceChanges,
  bestSMA5,
  entriesByDate,
} from "./finders.js";

function analyzeStocks(data, mode, dates) {
  let selected = [];
  selected = entriesByDate(data, mode, dates);
  if (mode == 1) {
    longestTrends(selected, dates);
  } else if (mode == 0) {
    volumesAndPriceChanges(selected, dates);
  } else if (mode == 5) {
    bestSMA5(selected, dates);
  }
}

// async function readFileToJson(file) {
//   let entries = await csv().fromFile(file);
//   n;
//   return entries;
// }

let path;
let stillAnalyzing = true;
let startOver = true;
let data;
let mode;
let dates = { custom: false, first: {}, last: {} };
path = "HistoricalQuotes.csv";
console.log("Welcome to MVP stock analysist");
let fileFirst;
let fileLast;
while (stillAnalyzing) {
  if (startOver) {
    console.log("now choosing file");
    // (path = readlineSync.question(
    //   "Please provide the name of a csv file (located in this folder): "
    // )),
    console.log("selected file " + path);
    data = await csv().fromFile(path);
    // data.forEach((item) => console.log(item));

    fileFirst = new Date(data[0].Date);
    fileLast = new Date(data[data.length - 1].Date);

    console.log(
      `File read succesfully. Date range of entries is ${
        fileFirst.getTime() < fileLast.getTime()
          ? fileFirst.toDateString()
          : fileLast.toDateString()
      } - ${
        fileFirst.getTime() < fileLast.getTime()
          ? fileLast.toDateString()
          : fileFirst.toDateString()
      }`
    );
  }
  if (
    readlineSync.keyInYN(
      "Do you want to provide a custom date range within the data?"
    )
  ) {
    dates.custom = true;
    (dates.first = new Date(
      readlineSync.question(`Provide a starting day (m/d/y): `)
    )),
      (dates.last = new Date(
        readlineSync.question(`Provide an ending day (m/d/y): `)
      ));
  } else {
    dates.custom = false;
    dates.first =
      fileFirst.getTime() < fileLast.getTime() ? fileFirst : fileLast;
    dates.last =
      fileLast.getTime() > fileFirst.getTime() ? fileLast : fileFirst;
  }
  console.log(`first is ${dates.first.toDateString()}`);
  console.log(`last is ${dates.last.toDateString()}`);
  let modes = [
      "Find bullish (upward) trends",
      "Find highest trading volumes and most significant price changes within a day",
      "Find which dates had the best opening price compared to 5 days simple moving average",
    ],
    index = readlineSync.keyInSelect(
      modes,
      "In which mode do you want to analyze this data?"
    );
  console.log(`Ok, mode ${index + 1} selected`);
  // According to user's selection, mode is set to 1, 0 or 5. This number means how many
  // entries we need to pick from the data before the starting day, so it works properly
  // on each main function.
  if (index === 0) {
    mode = 1;
  } else if (index === 1) {
    mode = 0;
  } else if (index === 2) {
    mode = 5;
  }
  console.log(`selected mode is ${mode}`);
  console.log(`now going to anal`);
  analyzeStocks(data, mode, dates);

  if (
    readlineSync.keyInYN(
      `Do you want to continue analyzing this file "${path}"?`
    )
  ) {
    // 'Y' key was pressed.
    startOver = false;
    console.log("Okay, lets start again.");
    // Do something...
  } else {
    // Another key was pressed.
    if (readlineSync.keyInYN(`Do you want to continue with another file?`)) {
      // 'Y' key was pressed.
      startOver = true;
      stillAnalyzing = true;
      // Do something...
    } else {
      startOver = false;
      stillAnalyzing = false;
    }
  }
}
console.log("Okay, bye bye.");
process.exit();

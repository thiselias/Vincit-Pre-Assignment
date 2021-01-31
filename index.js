// Pseudo

// 1. Import and process CSV Data
// 2. Define what to look for from the Data
// 3. Return output

const csv = require("csvtojson");
const json = require("json");
const path = "HistoricalQuotes-2.csv";

function printNow(obj) {
  for (let i = 0; i < obj.length; i++) {
    console.log(`${obj[i].Date} ${obj[i].High}`);
  }
}

async function app(file) {
  let a = await csv().fromFile(file);
  return a;
}
app(path).then((result) => printNow(result));
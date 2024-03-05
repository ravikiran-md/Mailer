const { MongoClient } = require("mongodb");
const XLSX = require("xlsx");
const fs = require("fs");
const client = new MongoClient(process.env.connection_string);
const startOfDay = require("./firstSheet");
const endOfDay = require("./firstSheet");
const db = client.db(process.env.dbName);
const shona_logs = db.collection("shona_click_logs");
const secondFilePath = "./excelSheets/click_log_stats.xlsx";

const GetSecondSheetData = async () => {
  const secondSheet = await shona_logs
    .find({ timestamp: { $gte: startOfDay, $lte: endOfDay } })
    .toArray(); // finding all the documents of shona_logs
  const map = new Map(); // creating Map

  secondSheet.forEach((log) => {
    const { ip_address, clicked_query } = log;
    if (!map.has(ip_address)) {
      map.set(ip_address, new Map()); /// using set to store the unique key value pairs
    }
    const queryMap = map.get(ip_address);
    if (!queryMap.has(clicked_query)) {
      queryMap.set(clicked_query, 0);
    }
    queryMap.set(clicked_query, queryMap.get(clicked_query) + 1);
  });

  const result = [];
  for (const [Ip, queryMap] of map.entries()) {
    for (const [Clicked_query, Count] of queryMap.entries()) {
      result.push({ Ip, Clicked_query, Count });
    }
  }

  if (result.length > 0) {
    const workSheet2 = XLSX.utils.json_to_sheet(result);
    const workBook2 = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook2, workSheet2, "Second Sheet");

    // Write Excel files

    XLSX.writeFile(workBook2, "./excelSheets/click_log_stats.xlsx");

    console.log("Got data and created Second Excel sheet.");
  } else {
    if (fs.existsSync(secondFilePath)) {
      fs.unlinkSync(secondFilePath);
      console.log("ThirdSheet.xlsx deleted successfully");
    } else {
      console.log("No Data from Second Sheet");
    }
  }
};

module.exports = GetSecondSheetData;

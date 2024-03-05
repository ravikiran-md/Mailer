const { MongoClient } = require("mongodb");
const XLSX = require("xlsx");
const fs = require("fs");
const buttonFilePath = "./excelSheets/click_logs.xlsx";
const client = new MongoClient(process.env.connection_string);
const db = client.db(process.env.dbName);
const shona_logs = db.collection("shona_click_logs");



const GetFirstSheetData = async () => {
  // First Sheet
  const firstSheet = await shona_logs
    .find({
      timestamp: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    })
    .toArray();

  const FirstData = firstSheet.map(
    ({ conversation_id, timestamp, ip_address, clicked_query }) => ({
      conversation_id,
      timestamp: new Date(timestamp).toISOString(),
      ip_address,
      clicked_query
    })
  );
  const casingData = FirstData.map((obj) => {
    const newObj = {};
    for (let key in obj) {
      newObj[capitalizeFirstLetter(key)] = obj[key];
    }
    return newObj;
  });

  // Checking the length of the Data for the Buttons Excel Sheet
  if (casingData.length > 0) {
    const workSheet1 = XLSX.utils.json_to_sheet(casingData);
    const workBook1 = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook1, workSheet1, "Buttons");
    XLSX.writeFile(workBook1, "./excelSheets/Button.xlsx");
    console.log("Button Sheet Created");
  } else {
    if (fs.existsSync(buttonFilePath)) {
      fs.unlinkSync(buttonFilePath);
      console.log("click_logs.xlsx deleted successfully");
    } else {
      console.log("No Data from Button ");
    }
  }
};

const today = new Date();
const offset = today.getTimezoneOffset() * 60000; // Get the time zone offset in milliseconds
const startOfDay = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate(),
  0,
  0 - offset / 60000,
  0
); // Start of the day (12:00 AM) adjusted for time zone
const endOfDay = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate(),
  23,
  59 - offset / 60000,
  59
);

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = GetFirstSheetData, startOfDay, endOfDay;

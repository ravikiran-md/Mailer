const { MongoClient } = require("mongodb");
const XLSX = require("xlsx");
const fs = require("fs");
const client = new MongoClient(process.env.connection_string);
const startOfDay = require("./firstSheet");
const endOfDay = require("./firstSheet");
const db = client.db(process.env.dbName);
const logs = db.collection("logs");
const thirdSheetFilePath = "./excelSheets/ThirdSheet.xlsx";

const GetThirdSheetData = async () => {
  const thirdSheet = await logs
    .find({
      "meta_data.Timestamp": {
        $gte: startOfDay,
        $lte: endOfDay
      },
      bot_type: "Sales+CRM-Bot"
    })
    .toArray();

  // Setting all the bot_type and converting timestamp to ISO string
  thirdSheet.forEach((item) => {
    item.meta_data.Timestamp = new Date(item.meta_data.Timestamp).toISOString();
    delete item.meta_data["Intent Name"];
  });
  const thirdSheetData = thirdSheet.map(({ meta_data }) => ({ ...meta_data }));

  if (thirdSheetData.length > 0) {
    const workSheet3 = XLSX.utils.json_to_sheet(thirdSheetData);
    const workBook3 = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook3, workSheet3, "ThirdSheet");

    // Write Excel files

    XLSX.writeFile(workBook3, "./excelSheets/ThirdSheet.xlsx");

    console.log("Got data and created Excel sheets.");
  } else {
    if (fs.existsSync(thirdSheetFilePath)) {
      fs.unlinkSync(thirdSheetFilePath);
      console.log("ThirdSheet.xlsx deleted successfully");
    } else {
      console.log("No Data from Third Sheet");
    }
  }
};

module.exports = GetThirdSheetData;

const nodemailer = require("nodemailer");
const GetFirstSheetData = require("./getSheets/firstSheet");
const GetSecondSheetData = require("./getSheets/secondSheet");
const GetThirdSheetData = require("./getSheets/thirdSheet");
const fs = require("fs");
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.NODE_MAILER_USER,
    pass: process.env.NODE_MAILER_PASS
  }
});
const secondFilePath = "./excelSheets/SecondSheet.xlsx";
const buttonFilePath = "./excelSheets/Button.xlsx";
const thirdSheetFilePath = "./excelSheets/ThirdSheet.xlsx";
async function MailSender() {
  GetFirstSheetData();
  GetSecondSheetData();
  GetThirdSheetData();
  let myAttachments = [];
  if (fs.existsSync(buttonFilePath)) {
    myAttachments.push({
      filename: "Button.xlsx",
      path: "./excelSheets/Button.xlsx"
    });
  }
  if (fs.existsSync(secondFilePath)) {
    myAttachments.push({
      filename: "SecondSheet.xlsx",
      path: "./excelSheets/SecondSheet.xlsx"
    });
  }
  if (fs.existsSync(thirdSheetFilePath)) {
    myAttachments.push({
      filename: "ThirdSheet.xsls",
      path: "./excelSheets/ThirdSheet.xlsx"
    });
  }

  const info = await transporter.sendMail({
    from: '"Aman Sharma 👻" <aman@ethereal.email>', // sender address
    to: "amansharma@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    html: "<b>Hello world?</b>", // html body

    attachments: myAttachments
  });

  console.log("Message sent successfully");
}

module.exports = MailSender;

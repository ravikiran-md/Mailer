"use strict";

var nodemailer = require("nodemailer");

var GetFirstSheetData = require("./getSheets/firstSheet");

var GetSecondSheetData = require("./getSheets/secondSheet");

var GetThirdSheetData = require("./getSheets/thirdSheet");

var fs = require("fs");

var transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.NODE_MAILER_USER,
    pass: process.env.NODE_MAILER_PASS
  }
});
var secondFilePath = "./excelSheets/SecondSheet.xlsx";
var buttonFilePath = "./excelSheets/Button.xlsx";
var thirdSheetFilePath = "./excelSheets/ThirdSheet.xlsx";

function MailSender() {
  var myAttachments, info;
  return regeneratorRuntime.async(function MailSender$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          GetFirstSheetData();
          GetSecondSheetData();
          GetThirdSheetData();
          myAttachments = [];

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

          _context.next = 9;
          return regeneratorRuntime.awrap(transporter.sendMail({
            from: '"Aman Sharma 👻" <aman@ethereal.email>',
            // sender address
            to: "amansharma@gmail.com",
            // list of receivers
            subject: "Hello ✔",
            // Subject line
            html: "<b>Hello world?</b>",
            // html body
            attachments: myAttachments
          }));

        case 9:
          info = _context.sent;
          console.log("Message sent successfully");

        case 11:
        case "end":
          return _context.stop();
      }
    }
  });
}

module.exports = MailSender;
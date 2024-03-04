"use strict";

var express = require("express");

var connectDb = require("./connection");

var cron = require("node-cron");

var MailSender = require("./mailer");

var app = express();
var PORT = 3000;
connectDb(); // Scheduling the mail at 11:59 pm Daily so that the full day is covered

cron.schedule("59 23 * * * ", function _callee() {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          MailSender();

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
});
app.listen(PORT, function () {
  console.log("Server Running on Port ", PORT);
});
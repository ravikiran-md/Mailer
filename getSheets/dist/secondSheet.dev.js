"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _require = require("mongodb"),
    MongoClient = _require.MongoClient;

var XLSX = require("xlsx");

var fs = require("fs");

var client = new MongoClient(process.env.connection_string);

var startOfDay = require("./firstSheet");

var endOfDay = require("./firstSheet");

var db = client.db(process.env.dbName);
var shona_logs = db.collection("shona_click_logs");
var secondFilePath = "./excelSheets/SecondSheet.xlsx";

var GetSecondSheetData = function GetSecondSheetData() {
  var secondSheet, map, result, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _step$value, Ip, queryMap, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _step2$value, Clicked_query, Count, workSheet2, workBook2;

  return regeneratorRuntime.async(function GetSecondSheetData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(shona_logs.find({
            timestamp: {
              $gte: startOfDay,
              $lte: endOfDay
            }
          }).toArray());

        case 2:
          secondSheet = _context.sent;
          // finding all the documents of shona_logs
          map = new Map(); // creating Map

          secondSheet.forEach(function (log) {
            var ip_address = log.ip_address,
                clicked_query = log.clicked_query;

            if (!map.has(ip_address)) {
              map.set(ip_address, new Map()); /// using set to store the unique key value pairs
            }

            var queryMap = map.get(ip_address);

            if (!queryMap.has(clicked_query)) {
              queryMap.set(clicked_query, 0);
            }

            queryMap.set(clicked_query, queryMap.get(clicked_query) + 1);
          });
          result = [];
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 9;
          _iterator = map.entries()[Symbol.iterator]();

        case 11:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 35;
            break;
          }

          _step$value = _slicedToArray(_step.value, 2), Ip = _step$value[0], queryMap = _step$value[1];
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context.prev = 16;

          for (_iterator2 = queryMap.entries()[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            _step2$value = _slicedToArray(_step2.value, 2), Clicked_query = _step2$value[0], Count = _step2$value[1];
            result.push({
              Ip: Ip,
              Clicked_query: Clicked_query,
              Count: Count
            });
          }

          _context.next = 24;
          break;

        case 20:
          _context.prev = 20;
          _context.t0 = _context["catch"](16);
          _didIteratorError2 = true;
          _iteratorError2 = _context.t0;

        case 24:
          _context.prev = 24;
          _context.prev = 25;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 27:
          _context.prev = 27;

          if (!_didIteratorError2) {
            _context.next = 30;
            break;
          }

          throw _iteratorError2;

        case 30:
          return _context.finish(27);

        case 31:
          return _context.finish(24);

        case 32:
          _iteratorNormalCompletion = true;
          _context.next = 11;
          break;

        case 35:
          _context.next = 41;
          break;

        case 37:
          _context.prev = 37;
          _context.t1 = _context["catch"](9);
          _didIteratorError = true;
          _iteratorError = _context.t1;

        case 41:
          _context.prev = 41;
          _context.prev = 42;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 44:
          _context.prev = 44;

          if (!_didIteratorError) {
            _context.next = 47;
            break;
          }

          throw _iteratorError;

        case 47:
          return _context.finish(44);

        case 48:
          return _context.finish(41);

        case 49:
          if (result.length > 0) {
            workSheet2 = XLSX.utils.json_to_sheet(result);
            workBook2 = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workBook2, workSheet2, "Second Sheet"); // Write Excel files

            XLSX.writeFile(workBook2, "./excelSheets/SecondSheet.xlsx");
            console.log("Got data and created Second Excel sheet.");
          } else {
            if (fs.existsSync(secondFilePath)) {
              fs.unlinkSync(secondFilePath);
              console.log("ThirdSheet.xlsx deleted successfully");
            } else {
              console.log("No Data from Second Sheet");
            }
          }

        case 50:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[9, 37, 41, 49], [16, 20, 24, 32], [25,, 27, 31], [42,, 44, 48]]);
};

module.exports = GetSecondSheetData;
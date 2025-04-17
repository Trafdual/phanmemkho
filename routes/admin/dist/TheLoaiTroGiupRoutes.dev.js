"use strict";

var router = require('express').Router();

var TheloaiTrogiup = require('../../models/TheLoaiTroGiupModel');

var TroGiup = require('../../models/TroGiupModel');

function toSlug(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
}

router.get('/theloaitrogiup', function _callee(req, res) {
  var page, limit, skip, total, theloaitg;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          page = parseInt(req.query.page) || 1;
          limit = parseInt(req.query.limit) || 10;
          skip = (page - 1) * limit;
          _context.next = 6;
          return regeneratorRuntime.awrap(TheloaiTrogiup.countDocuments());

        case 6:
          total = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(TheloaiTrogiup.find().skip(skip).limit(limit).lean());

        case 9:
          theloaitg = _context.sent;
          res.json({
            data: theloaitg,
            total: total,
            page: page,
            limit: limit,
            totalPages: Math.ceil(total / limit)
          });
          _context.next = 17;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          res.status(500).json({
            message: 'Lỗi server'
          });

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
});
router.post('/posttheloaitrogiup', function _callee2(req, res) {
  var name, theloaitg;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          name = req.body.name;
          theloaitg = new TheloaiTrogiup({
            name: name,
            namekhongdau: toSlug(name)
          });
          _context2.next = 5;
          return regeneratorRuntime.awrap(theloaitg.save());

        case 5:
          res.json(theloaitg);
          _context2.next = 12;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);
          res.status(500).json({
            message: 'Lỗi server'
          });

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
});
router.post('/updatetrogiup/:idtltrogiup', function _callee3(req, res) {
  var idtltrogiup, name, theloaitrogiup;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          idtltrogiup = req.params.idtltrogiup;
          name = req.body.name;
          _context3.next = 5;
          return regeneratorRuntime.awrap(TheloaiTrogiup.findById(idtltrogiup));

        case 5:
          theloaitrogiup = _context3.sent;

          if (theloaitrogiup) {
            _context3.next = 8;
            break;
          }

          return _context3.abrupt("return", res.json({
            error: 'không tìm thấy thể loại trợ giúp'
          }));

        case 8:
          if (name) {
            theloaitrogiup.name = name;
          }

          _context3.next = 11;
          return regeneratorRuntime.awrap(theloaitrogiup.save());

        case 11:
          res.json(theloaitrogiup);
          _context3.next = 18;
          break;

        case 14:
          _context3.prev = 14;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0);
          res.status(500).json({
            message: 'Lỗi server'
          });

        case 18:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 14]]);
});
router.post('/deletetheloaitg/:idtltrogiup', function _callee5(req, res) {
  var idtltrogiup, theloaitrogiup;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          idtltrogiup = req.params.idtltrogiup;
          _context5.next = 4;
          return regeneratorRuntime.awrap(TheloaiTrogiup.findById(idtltrogiup));

        case 4:
          theloaitrogiup = _context5.sent;
          _context5.next = 7;
          return regeneratorRuntime.awrap(Promise.all(theloaitrogiup.trogiup.map(function _callee4(tg) {
            return regeneratorRuntime.async(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.next = 2;
                    return regeneratorRuntime.awrap(TroGiup.findByIdAndDelete(tg._id));

                  case 2:
                  case "end":
                    return _context4.stop();
                }
              }
            });
          })));

        case 7:
          _context5.next = 9;
          return regeneratorRuntime.awrap(TheloaiTrogiup.findByIdAndDelete(idtltrogiup));

        case 9:
          res.json({
            message: 'xóa thành công'
          });
          _context5.next = 16;
          break;

        case 12:
          _context5.prev = 12;
          _context5.t0 = _context5["catch"](0);
          console.log(_context5.t0);
          res.status(500).json({
            message: 'Lỗi server'
          });

        case 16:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 12]]);
});
module.exports = router;
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
router.post('/updatetltrogiup/:idtltrogiup', function _callee3(req, res) {
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
router.get('/chitiettltrogiup/:idtltrogiup', function _callee4(req, res) {
  var idtltrogiup, theloaitrogiup;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          idtltrogiup = req.params.idtltrogiup;
          _context4.next = 4;
          return regeneratorRuntime.awrap(TheloaiTrogiup.findById(idtltrogiup));

        case 4:
          theloaitrogiup = _context4.sent;

          if (theloaitrogiup) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.json({
            error: 'không tìm thấy thể loại trợ giúp'
          }));

        case 7:
          res.json(theloaitrogiup);
          _context4.next = 14;
          break;

        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](0);
          console.log(_context4.t0);
          res.status(500).json({
            message: 'Lỗi server'
          });

        case 14:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
router.post('/deletetheloaitg', function _callee6(req, res) {
  var ids, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, id, theloai;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          ids = req.body.ids;

          if (!(!Array.isArray(ids) || ids.length === 0)) {
            _context6.next = 4;
            break;
          }

          return _context6.abrupt("return", res.status(400).json({
            message: 'Không có ID nào được cung cấp'
          }));

        case 4:
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context6.prev = 7;
          _iterator = ids[Symbol.iterator]();

        case 9:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context6.next = 22;
            break;
          }

          id = _step.value;
          _context6.next = 13;
          return regeneratorRuntime.awrap(TheloaiTrogiup.findById(id));

        case 13:
          theloai = _context6.sent;

          if (!theloai) {
            _context6.next = 19;
            break;
          }

          _context6.next = 17;
          return regeneratorRuntime.awrap(Promise.all(theloai.trogiup.map(function _callee5(tg) {
            return regeneratorRuntime.async(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    _context5.next = 2;
                    return regeneratorRuntime.awrap(TroGiup.findByIdAndDelete(tg._id));

                  case 2:
                  case "end":
                    return _context5.stop();
                }
              }
            });
          })));

        case 17:
          _context6.next = 19;
          return regeneratorRuntime.awrap(TheloaiTrogiup.findByIdAndDelete(id));

        case 19:
          _iteratorNormalCompletion = true;
          _context6.next = 9;
          break;

        case 22:
          _context6.next = 28;
          break;

        case 24:
          _context6.prev = 24;
          _context6.t0 = _context6["catch"](7);
          _didIteratorError = true;
          _iteratorError = _context6.t0;

        case 28:
          _context6.prev = 28;
          _context6.prev = 29;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 31:
          _context6.prev = 31;

          if (!_didIteratorError) {
            _context6.next = 34;
            break;
          }

          throw _iteratorError;

        case 34:
          return _context6.finish(31);

        case 35:
          return _context6.finish(28);

        case 36:
          res.json({
            message: 'Đã xoá các thể loại trợ giúp thành công'
          });
          _context6.next = 43;
          break;

        case 39:
          _context6.prev = 39;
          _context6.t1 = _context6["catch"](0);
          console.log('Lỗi xóa hàng loạt:', _context6.t1);
          res.status(500).json({
            message: 'Lỗi server khi xóa thể loại trợ giúp'
          });

        case 43:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 39], [7, 24, 28, 36], [29,, 31, 35]]);
});
module.exports = router;
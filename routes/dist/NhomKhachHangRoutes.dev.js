"use strict";

var router = require('express').Router();

var NhomKhacHang = require('../models/NhomKhacHangModel');

var User = require('../models/UserModel');

var NhanVien = require('../models/NhanVienModel');

router.get('/getnhomkhachhang/:userId', function _callee2(req, res) {
  var userid, user, nhomkhachhang;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          userid = req.params.userId;
          _context2.next = 4;
          return regeneratorRuntime.awrap(User.findById(userid));

        case 4:
          user = _context2.sent;
          _context2.next = 7;
          return regeneratorRuntime.awrap(Promise.all(user.nhomkhachhang.map(function _callee(nkh) {
            var nkh1;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return regeneratorRuntime.awrap(NhomKhacHang.findById(nkh._id));

                  case 2:
                    nkh1 = _context.sent;
                    return _context.abrupt("return", {
                      _id: nkh1._id,
                      manhomkh: nkh1.manhomkh,
                      name: nkh1.name
                    });

                  case 4:
                  case "end":
                    return _context.stop();
                }
              }
            });
          })));

        case 7:
          nhomkhachhang = _context2.sent;
          res.json(nhomkhachhang);
          _context2.next = 15;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 11]]);
});
router.post('/postnhomkhachhang/:userId', function _callee3(req, res) {
  var userId, user, name, nhomkhachhang, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, nhanvien, nv, usernv;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          userId = req.params.userId;
          _context3.next = 4;
          return regeneratorRuntime.awrap(User.findById(userId));

        case 4:
          user = _context3.sent;
          name = req.body.name;
          nhomkhachhang = new NhomKhacHang({
            name: name
          });
          nhomkhachhang.manhomkh = 'NKH' + nhomkhachhang._id.toString().slice(-4);
          nhomkhachhang.user = user._id;
          _context3.next = 11;
          return regeneratorRuntime.awrap(nhomkhachhang.save());

        case 11:
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context3.prev = 14;
          _iterator = user.nhanvien[Symbol.iterator]();

        case 16:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context3.next = 34;
            break;
          }

          nhanvien = _step.value;
          _context3.next = 20;
          return regeneratorRuntime.awrap(NhanVien.findById(nhanvien._id));

        case 20:
          nv = _context3.sent;

          if (nv) {
            _context3.next = 23;
            break;
          }

          return _context3.abrupt("continue", 31);

        case 23:
          _context3.next = 25;
          return regeneratorRuntime.awrap(User.findById(nv.user));

        case 25:
          usernv = _context3.sent;

          if (usernv) {
            _context3.next = 28;
            break;
          }

          return _context3.abrupt("continue", 31);

        case 28:
          usernv.nhomkhachhang.push(nhomkhachhang._id);
          _context3.next = 31;
          return regeneratorRuntime.awrap(usernv.save());

        case 31:
          _iteratorNormalCompletion = true;
          _context3.next = 16;
          break;

        case 34:
          _context3.next = 40;
          break;

        case 36:
          _context3.prev = 36;
          _context3.t0 = _context3["catch"](14);
          _didIteratorError = true;
          _iteratorError = _context3.t0;

        case 40:
          _context3.prev = 40;
          _context3.prev = 41;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 43:
          _context3.prev = 43;

          if (!_didIteratorError) {
            _context3.next = 46;
            break;
          }

          throw _iteratorError;

        case 46:
          return _context3.finish(43);

        case 47:
          return _context3.finish(40);

        case 48:
          user.nhomkhachhang.push(nhomkhachhang._id);
          _context3.next = 51;
          return regeneratorRuntime.awrap(user.save());

        case 51:
          res.json(nhomkhachhang);
          _context3.next = 58;
          break;

        case 54:
          _context3.prev = 54;
          _context3.t1 = _context3["catch"](0);
          console.error(_context3.t1);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 58:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 54], [14, 36, 40, 48], [41,, 43, 47]]);
});
router.post('/deletenhomkh', function _callee4(req, res) {
  var ids, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, id, nhomkhachhang;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          ids = req.body.ids;
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context4.prev = 5;
          _iterator2 = ids[Symbol.iterator]();

        case 7:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context4.next = 18;
            break;
          }

          id = _step2.value;
          _context4.next = 11;
          return regeneratorRuntime.awrap(NhomKhacHang.findById(id));

        case 11:
          nhomkhachhang = _context4.sent;
          nhomkhachhang.status = -1;
          _context4.next = 15;
          return regeneratorRuntime.awrap(nhomkhachhang.save());

        case 15:
          _iteratorNormalCompletion2 = true;
          _context4.next = 7;
          break;

        case 18:
          _context4.next = 24;
          break;

        case 20:
          _context4.prev = 20;
          _context4.t0 = _context4["catch"](5);
          _didIteratorError2 = true;
          _iteratorError2 = _context4.t0;

        case 24:
          _context4.prev = 24;
          _context4.prev = 25;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 27:
          _context4.prev = 27;

          if (!_didIteratorError2) {
            _context4.next = 30;
            break;
          }

          throw _iteratorError2;

        case 30:
          return _context4.finish(27);

        case 31:
          return _context4.finish(24);

        case 32:
          res.json({
            message: 'xóa thành công'
          });
          _context4.next = 39;
          break;

        case 35:
          _context4.prev = 35;
          _context4.t1 = _context4["catch"](0);
          console.error(_context4.t1);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 39:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 35], [5, 20, 24, 32], [25,, 27, 31]]);
});
module.exports = router;
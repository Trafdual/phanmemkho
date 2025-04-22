"use strict";

var router = require('express').Router();

var LoaiChungTu = require('../models/LoaiChungTuModel');

var User = require('../models/UserModel');

var NhanVien = require('../models/NhanVienModel');

router.get('/getloaichungtu/:userId', function _callee2(req, res) {
  var userId, user, loaichungtu, filtered;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          userId = req.params.userId;
          _context2.next = 4;
          return regeneratorRuntime.awrap(User.findById(userId));

        case 4:
          user = _context2.sent;
          _context2.next = 7;
          return regeneratorRuntime.awrap(Promise.all(user.loaichungtu.map(function _callee(lct) {
            var lct1;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return regeneratorRuntime.awrap(LoaiChungTu.findOne({
                      _id: lct._id,
                      $or: [{
                        status: 1
                      }, {
                        status: {
                          $exists: false
                        }
                      }]
                    }));

                  case 2:
                    lct1 = _context.sent;

                    if (lct1) {
                      _context.next = 5;
                      break;
                    }

                    return _context.abrupt("return", null);

                  case 5:
                    return _context.abrupt("return", {
                      _id: lct1._id,
                      maloaict: lct1.maloaict,
                      name: lct1.name,
                      method: lct1.method
                    });

                  case 6:
                  case "end":
                    return _context.stop();
                }
              }
            });
          })));

        case 7:
          loaichungtu = _context2.sent;
          filtered = loaichungtu.filter(function (item) {
            return item !== null;
          });
          res.json(filtered);
          _context2.next = 16;
          break;

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 12]]);
});
router.get('/getloaichungtuadmin/:userId', function _callee4(req, res) {
  var userId, page, limit, skip, user, loaichungtu, filtered, paginated;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          userId = req.params.userId;
          page = parseInt(req.query.page) || 1;
          limit = parseInt(req.query.limit) || 10;
          skip = (page - 1) * limit;
          _context4.next = 7;
          return regeneratorRuntime.awrap(User.findById(userId));

        case 7:
          user = _context4.sent;
          _context4.next = 10;
          return regeneratorRuntime.awrap(Promise.all(user.loaichungtu.map(function _callee3(lct) {
            var lct1;
            return regeneratorRuntime.async(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return regeneratorRuntime.awrap(LoaiChungTu.findOne({
                      _id: lct._id,
                      $or: [{
                        status: 1
                      }, {
                        status: {
                          $exists: false
                        }
                      }]
                    }));

                  case 2:
                    lct1 = _context3.sent;

                    if (lct1) {
                      _context3.next = 5;
                      break;
                    }

                    return _context3.abrupt("return", null);

                  case 5:
                    return _context3.abrupt("return", {
                      _id: lct1._id,
                      maloaict: lct1.maloaict,
                      name: lct1.name,
                      method: lct1.method
                    });

                  case 6:
                  case "end":
                    return _context3.stop();
                }
              }
            });
          })));

        case 10:
          loaichungtu = _context4.sent;
          filtered = loaichungtu.filter(function (item) {
            return item !== null;
          });
          paginated = filtered.slice(skip, skip + limit);
          res.json({
            data: paginated,
            currentPage: page,
            totalPages: Math.ceil(filtered.length / limit),
            totalItems: filtered.length
          });
          _context4.next = 20;
          break;

        case 16:
          _context4.prev = 16;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 20:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 16]]);
});
router.post('/postloaichungtu/:userid', function _callee5(req, res) {
  var userId, _req$body, name, method, user, loaichungtu, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, nhanvien, nv, usernv;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          userId = req.params.userid;
          _req$body = req.body, name = _req$body.name, method = _req$body.method;
          _context5.next = 5;
          return regeneratorRuntime.awrap(User.findById(userId));

        case 5:
          user = _context5.sent;
          loaichungtu = new LoaiChungTu({
            name: name,
            method: method
          });
          loaichungtu.maloaict = 'LCT' + loaichungtu._id.toString().slice(-5);
          loaichungtu.user = user._id;
          _context5.next = 11;
          return regeneratorRuntime.awrap(loaichungtu.save());

        case 11:
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context5.prev = 14;
          _iterator = user.nhanvien[Symbol.iterator]();

        case 16:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context5.next = 34;
            break;
          }

          nhanvien = _step.value;
          _context5.next = 20;
          return regeneratorRuntime.awrap(NhanVien.findById(nhanvien._id));

        case 20:
          nv = _context5.sent;

          if (nv) {
            _context5.next = 23;
            break;
          }

          return _context5.abrupt("continue", 31);

        case 23:
          _context5.next = 25;
          return regeneratorRuntime.awrap(User.findById(nv.user));

        case 25:
          usernv = _context5.sent;

          if (usernv) {
            _context5.next = 28;
            break;
          }

          return _context5.abrupt("continue", 31);

        case 28:
          usernv.loaichungtu.push(loaichungtu._id);
          _context5.next = 31;
          return regeneratorRuntime.awrap(usernv.save());

        case 31:
          _iteratorNormalCompletion = true;
          _context5.next = 16;
          break;

        case 34:
          _context5.next = 40;
          break;

        case 36:
          _context5.prev = 36;
          _context5.t0 = _context5["catch"](14);
          _didIteratorError = true;
          _iteratorError = _context5.t0;

        case 40:
          _context5.prev = 40;
          _context5.prev = 41;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 43:
          _context5.prev = 43;

          if (!_didIteratorError) {
            _context5.next = 46;
            break;
          }

          throw _iteratorError;

        case 46:
          return _context5.finish(43);

        case 47:
          return _context5.finish(40);

        case 48:
          user.loaichungtu.push(loaichungtu._id);
          _context5.next = 51;
          return regeneratorRuntime.awrap(user.save());

        case 51:
          res.json(loaichungtu);
          _context5.next = 58;
          break;

        case 54:
          _context5.prev = 54;
          _context5.t1 = _context5["catch"](0);
          console.error(_context5.t1);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 58:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 54], [14, 36, 40, 48], [41,, 43, 47]]);
});
router.get('/getchitietloaichungtu/:idloaichungtu', function _callee6(req, res) {
  var idloaichungtu, loaichungtu;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          idloaichungtu = req.params.idloaichungtu;
          _context6.next = 4;
          return regeneratorRuntime.awrap(LoaiChungTu.findById(idloaichungtu));

        case 4:
          loaichungtu = _context6.sent;

          if (loaichungtu) {
            _context6.next = 7;
            break;
          }

          return _context6.abrupt("return", res.json({
            error: 'không tìm thấy loại chứng từ'
          }));

        case 7:
          res.json(loaichungtu);
          _context6.next = 14;
          break;

        case 10:
          _context6.prev = 10;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 14:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
router.post('/updateloaichungtu/:idloaichungtu', function _callee7(req, res) {
  var idloaichungtu, _req$body2, name, method, loaichungtu;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          idloaichungtu = req.params.idloaichungtu;
          _req$body2 = req.body, name = _req$body2.name, method = _req$body2.method;
          _context7.next = 5;
          return regeneratorRuntime.awrap(LoaiChungTu.findById(idloaichungtu));

        case 5:
          loaichungtu = _context7.sent;

          if (loaichungtu) {
            _context7.next = 8;
            break;
          }

          return _context7.abrupt("return", res.json({
            error: 'không tìm thấy loại chứng từ'
          }));

        case 8:
          loaichungtu.name = name;
          loaichungtu.method = method;
          _context7.next = 12;
          return regeneratorRuntime.awrap(loaichungtu.save());

        case 12:
          res.json(loaichungtu);
          _context7.next = 19;
          break;

        case 15:
          _context7.prev = 15;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 19:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 15]]);
});
router.post('/deleteloaichungtu', function _callee8(req, res) {
  var ids, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, id, loaichungtu;

  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          ids = req.body.ids;
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context8.prev = 5;
          _iterator2 = ids[Symbol.iterator]();

        case 7:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context8.next = 18;
            break;
          }

          id = _step2.value;
          _context8.next = 11;
          return regeneratorRuntime.awrap(LoaiChungTu.findById(id));

        case 11:
          loaichungtu = _context8.sent;
          loaichungtu.status = -1;
          _context8.next = 15;
          return regeneratorRuntime.awrap(loaichungtu.save());

        case 15:
          _iteratorNormalCompletion2 = true;
          _context8.next = 7;
          break;

        case 18:
          _context8.next = 24;
          break;

        case 20:
          _context8.prev = 20;
          _context8.t0 = _context8["catch"](5);
          _didIteratorError2 = true;
          _iteratorError2 = _context8.t0;

        case 24:
          _context8.prev = 24;
          _context8.prev = 25;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 27:
          _context8.prev = 27;

          if (!_didIteratorError2) {
            _context8.next = 30;
            break;
          }

          throw _iteratorError2;

        case 30:
          return _context8.finish(27);

        case 31:
          return _context8.finish(24);

        case 32:
          res.json({
            message: 'xóa thành công'
          });
          _context8.next = 39;
          break;

        case 35:
          _context8.prev = 35;
          _context8.t1 = _context8["catch"](0);
          console.error(_context8.t1);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 39:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 35], [5, 20, 24, 32], [25,, 27, 31]]);
});
module.exports = router;
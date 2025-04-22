"use strict";

var router = require('express').Router();

var NganHang = require('../models/NganHangKhoModel');

var Depot = require('../models/DepotModel');

var User = require('../models/UserModel');

var NhanVien = require('../models/NhanVienModel');

router.post('/postnganhang/:userID', function _callee(req, res) {
  var _req$body, name, sotaikhoan, chusohuu, userID, user, nganhang, maNH, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, nhanvien, nv, usernv;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, name = _req$body.name, sotaikhoan = _req$body.sotaikhoan, chusohuu = _req$body.chusohuu;
          userID = req.params.userID;
          _context.next = 5;
          return regeneratorRuntime.awrap(User.findById(userID));

        case 5:
          user = _context.sent;
          nganhang = new NganHang({
            name: name,
            sotaikhoan: sotaikhoan,
            chusohuu: chusohuu
          });
          maNH = 'NHK' + nganhang._id.toString().slice(-4);
          nganhang.manganhangkho = maNH;
          nganhang.user = user._id;
          _context.next = 12;
          return regeneratorRuntime.awrap(nganhang.save());

        case 12:
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 15;
          _iterator = user.nhanvien[Symbol.iterator]();

        case 17:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 35;
            break;
          }

          nhanvien = _step.value;
          _context.next = 21;
          return regeneratorRuntime.awrap(NhanVien.findById(nhanvien._id));

        case 21:
          nv = _context.sent;

          if (nv) {
            _context.next = 24;
            break;
          }

          return _context.abrupt("continue", 32);

        case 24:
          _context.next = 26;
          return regeneratorRuntime.awrap(User.findById(nv.user));

        case 26:
          usernv = _context.sent;

          if (usernv) {
            _context.next = 29;
            break;
          }

          return _context.abrupt("continue", 32);

        case 29:
          usernv.nganhangkho.push(nganhang._id);
          _context.next = 32;
          return regeneratorRuntime.awrap(usernv.save());

        case 32:
          _iteratorNormalCompletion = true;
          _context.next = 17;
          break;

        case 35:
          _context.next = 41;
          break;

        case 37:
          _context.prev = 37;
          _context.t0 = _context["catch"](15);
          _didIteratorError = true;
          _iteratorError = _context.t0;

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
          user.nganhangkho.push(nganhang._id);
          _context.next = 52;
          return regeneratorRuntime.awrap(user.save());

        case 52:
          res.json(nganhang);
          _context.next = 59;
          break;

        case 55:
          _context.prev = 55;
          _context.t1 = _context["catch"](0);
          console.error(_context.t1);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 59:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 55], [15, 37, 41, 49], [42,, 44, 48]]);
});
router.get('/getnganhang/:userId', function _callee3(req, res) {
  var userId, user, nganhang, filtered;
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
          _context3.next = 7;
          return regeneratorRuntime.awrap(Promise.all(user.nganhangkho.map(function _callee2(nganhang) {
            var nganHangkho;
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return regeneratorRuntime.awrap(NganHang.findOne({
                      _id: nganhang._id,
                      $or: [{
                        status: 1
                      }, {
                        status: {
                          $exists: false
                        }
                      }]
                    }));

                  case 2:
                    nganHangkho = _context2.sent;

                    if (nganHangkho) {
                      _context2.next = 5;
                      break;
                    }

                    return _context2.abrupt("return", null);

                  case 5:
                    return _context2.abrupt("return", {
                      _id: nganHangkho._id,
                      manganhangkho: nganHangkho.manganhangkho,
                      name: nganHangkho.name,
                      sotaikhoan: nganHangkho.sotaikhoan,
                      chusohuu: nganHangkho.chusohuu
                    });

                  case 6:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          })));

        case 7:
          nganhang = _context3.sent;
          filtered = nganhang.filter(function (item) {
            return item !== null;
          });
          res.json(filtered);
          _context3.next = 16;
          break;

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 12]]);
});
router.get('/getnganhangadmin/:userId', function _callee5(req, res) {
  var userId, page, limit, skip, user, nganhang, filtered, totalItems, totalPages, paginatedData;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          userId = req.params.userId;
          page = parseInt(req.query.page) || 1;
          limit = parseInt(req.query.limit) || 10;
          skip = (page - 1) * limit;
          _context5.next = 7;
          return regeneratorRuntime.awrap(User.findById(userId));

        case 7:
          user = _context5.sent;
          _context5.next = 10;
          return regeneratorRuntime.awrap(Promise.all(user.nganhangkho.map(function _callee4(nganhang) {
            var nganHangkho;
            return regeneratorRuntime.async(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.next = 2;
                    return regeneratorRuntime.awrap(NganHang.findOne({
                      _id: nganhang._id,
                      $or: [{
                        status: 1
                      }, {
                        status: {
                          $exists: false
                        }
                      }]
                    }));

                  case 2:
                    nganHangkho = _context4.sent;

                    if (nganHangkho) {
                      _context4.next = 5;
                      break;
                    }

                    return _context4.abrupt("return", null);

                  case 5:
                    return _context4.abrupt("return", {
                      _id: nganHangkho._id,
                      manganhangkho: nganHangkho.manganhangkho,
                      name: nganHangkho.name,
                      sotaikhoan: nganHangkho.sotaikhoan,
                      chusohuu: nganHangkho.chusohuu
                    });

                  case 6:
                  case "end":
                    return _context4.stop();
                }
              }
            });
          })));

        case 10:
          nganhang = _context5.sent;
          filtered = nganhang.filter(function (item) {
            return item !== null;
          });
          totalItems = filtered.length;
          totalPages = Math.ceil(totalItems / limit);
          paginatedData = filtered.slice(skip, skip + limit);
          res.json({
            totalItems: totalItems,
            totalPages: totalPages,
            currentPage: page,
            data: paginatedData
          });
          _context5.next = 22;
          break;

        case 18:
          _context5.prev = 18;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 22:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 18]]);
});
router.get('/getchitietnganhang/:idnganhang', function _callee6(req, res) {
  var idnganhang, nganhang;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          idnganhang = req.params.idnganhang;
          _context6.next = 4;
          return regeneratorRuntime.awrap(NganHang.findById(idnganhang));

        case 4:
          nganhang = _context6.sent;
          res.json(nganhang);
          _context6.next = 12;
          break;

        case 8:
          _context6.prev = 8;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 12:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 8]]);
});
router.post('/updatenganhang/:idnganhang', function _callee7(req, res) {
  var idnganhang, nganhang, _req$body2, name, sotaikhoan, chusohuu;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          idnganhang = req.params.idnganhang;
          _context7.next = 4;
          return regeneratorRuntime.awrap(NganHang.findById(idnganhang));

        case 4:
          nganhang = _context7.sent;
          _req$body2 = req.body, name = _req$body2.name, sotaikhoan = _req$body2.sotaikhoan, chusohuu = _req$body2.chusohuu;

          if (nganhang) {
            _context7.next = 8;
            break;
          }

          return _context7.abrupt("return", res.json({
            message: 'ngân hàng không tồn tại'
          }));

        case 8:
          nganhang.name = name;
          nganhang.sotaikhoan = sotaikhoan;
          nganhang.chusohuu = chusohuu;
          _context7.next = 13;
          return regeneratorRuntime.awrap(nganhang.save());

        case 13:
          res.json(nganhang);
          _context7.next = 20;
          break;

        case 16:
          _context7.prev = 16;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 20:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 16]]);
});
router.post('/deletenganhang', function _callee8(req, res) {
  var ids, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, id, nganhang;

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
          return regeneratorRuntime.awrap(NganHang.findById(id));

        case 11:
          nganhang = _context8.sent;
          nganhang.status = -1;
          _context8.next = 15;
          return regeneratorRuntime.awrap(nganhang.save());

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
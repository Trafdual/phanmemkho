"use strict";

var router = require('express').Router();

var User = require('../../models/UserModel');

var Depot = require('../../models/DepotModel');

var NganHang = require('../../models/NganHangKhoModel');

var Sku = require('../../models/SkuModel');

var MucThuChi = require('../../models/MucThuChiModel');

var LoaiChungTu = require('../../models/LoaiChungTuModel');

var NhomKhacHang = require('../../models/NhomKhacHangModel');

router.get('/getkhochua/:iduser', function _callee2(req, res) {
  var iduser, user, kho;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          iduser = req.params.iduser;
          _context2.next = 4;
          return regeneratorRuntime.awrap(User.findById(iduser));

        case 4:
          user = _context2.sent;
          _context2.next = 7;
          return regeneratorRuntime.awrap(Promise.all(user.depot.map(function _callee(khochua) {
            var kho1;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return regeneratorRuntime.awrap(Depot.findById(khochua._id));

                  case 2:
                    kho1 = _context.sent;
                    return _context.abrupt("return", {
                      _id: kho1._id,
                      name: kho1.name,
                      address: kho1.address,
                      user: kho1.user.length
                    });

                  case 4:
                  case "end":
                    return _context.stop();
                }
              }
            });
          })));

        case 7:
          kho = _context2.sent;
          res.json(kho);
          _context2.next = 14;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 11]]);
});
router.get('/getnhanvienadmin/:idkho', function _callee4(req, res) {
  var idkho, kho, user;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          idkho = req.params.idkho;
          _context4.next = 4;
          return regeneratorRuntime.awrap(Depot.findById(idkho));

        case 4:
          kho = _context4.sent;
          _context4.next = 7;
          return regeneratorRuntime.awrap(Promise.all(kho.user.map(function _callee3(user) {
            var user1;
            return regeneratorRuntime.async(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return regeneratorRuntime.awrap(User.findById(user._id));

                  case 2:
                    user1 = _context3.sent;
                    return _context3.abrupt("return", {
                      _id: user1._id,
                      name: user1.name,
                      email: user1.email,
                      phone: user1.phone,
                      birthday: user1.birthday,
                      ngaydangky: user1.date,
                      role: user1.role
                    });

                  case 4:
                  case "end":
                    return _context3.stop();
                }
              }
            });
          })));

        case 7:
          user = _context4.sent;
          res.json(user);
          _context4.next = 14;
          break;

        case 11:
          _context4.prev = 11;
          _context4.t0 = _context4["catch"](0);
          console.log(_context4.t0);

        case 14:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 11]]);
});
module.exports = router;
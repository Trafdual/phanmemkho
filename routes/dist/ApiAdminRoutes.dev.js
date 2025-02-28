"use strict";

var router = require('express').Router();

var User = require('../models/UserModel');

var Depot = require('../models/DepotModel');

var NganHang = require('../models/NganHangKhoModel');

var Sku = require('../models/SkuModel');

var MucThuChi = require('../models/MucThuChiModel');

var LoaiChungTu = require('../models/LoaiChungTuModel');

var NhomKhacHang = require('../models/NhomKhacHangModel');

router.get('/getuser/:iduser', function _callee2(req, res) {
  var iduser, user, userjson;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          iduser = req.params.iduser;
          _context2.next = 4;
          return regeneratorRuntime.awrap(User.find({
            _id: {
              $ne: iduser
            }
          }).lean());

        case 4:
          user = _context2.sent;
          _context2.next = 7;
          return regeneratorRuntime.awrap(Promise.all(user.map(function _callee(u) {
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    return _context.abrupt("return", {
                      _id: u._id,
                      name: u.name,
                      email: u.email,
                      phone: u.phone,
                      birthday: u.birthday,
                      ngaydangky: u.date,
                      role: u.role
                    });

                  case 1:
                  case "end":
                    return _context.stop();
                }
              }
            });
          })));

        case 7:
          userjson = _context2.sent;
          res.json(userjson);
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
router.post('/registeradmin', function _callee3(req, res) {
  var _req$body, name, email, password, phone, birthday, role, vietnamTime, exitphone, existingemail, hashedPassword, user;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$body = req.body, name = _req$body.name, email = _req$body.email, password = _req$body.password, phone = _req$body.phone, birthday = _req$body.birthday, role = _req$body.role;
          vietnamTime = momenttimezone().toDate();

          if (/^\d{4}-\d{2}-\d{2}$/.test(birthday)) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", res.json({
            message: 'Ngày sinh không hợp lệ'
          }));

        case 5:
          if (!(!phone || !/^\d{10}$/.test(phone))) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.json({
            message: 'Số điện thoại không hợp lệ'
          }));

        case 7:
          if (emailRegex.test(email)) {
            _context3.next = 9;
            break;
          }

          return _context3.abrupt("return", res.json({
            message: 'email không hợp lệ'
          }));

        case 9:
          _context3.next = 11;
          return regeneratorRuntime.awrap(User.findOne({
            phone: phone
          }));

        case 11:
          exitphone = _context3.sent;

          if (!exitphone) {
            _context3.next = 14;
            break;
          }

          return _context3.abrupt("return", res.json({
            message: 'số điện thoại này đã được đăng kí'
          }));

        case 14:
          _context3.next = 16;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 16:
          existingemail = _context3.sent;

          if (!existingemail) {
            _context3.next = 19;
            break;
          }

          return _context3.abrupt("return", res.json({
            message: 'email này đã được đăng kí'
          }));

        case 19:
          _context3.next = 21;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

        case 21:
          hashedPassword = _context3.sent;
          user = new User({
            name: name,
            email: email,
            password: hashedPassword,
            phone: phone,
            date: vietnamTime,
            isVerified: false,
            birthday: birthday,
            role: role
          });
          _context3.next = 25;
          return regeneratorRuntime.awrap(user.save());

        case 25:
          res.json(user);
          _context3.next = 32;
          break;

        case 28:
          _context3.prev = 28;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 32:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 28]]);
});
router.post('/deleteuser', function _callee4(req, res) {
  var ids, users, depotIds, nganhangkhoIds, skuIds, mucthuchiIds, loaichungtuIds, nhomkhachhangIds, deleteOperations;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          ids = req.body.ids;

          if (!(!Array.isArray(ids) || ids.length === 0)) {
            _context4.next = 4;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            message: 'Danh sách ID không hợp lệ.'
          }));

        case 4:
          _context4.next = 6;
          return regeneratorRuntime.awrap(User.find({
            _id: {
              $in: ids
            }
          }));

        case 6:
          users = _context4.sent;

          if (!(users.length === 0)) {
            _context4.next = 9;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: 'Không tìm thấy người dùng.'
          }));

        case 9:
          depotIds = users.flatMap(function (user) {
            return user.depot.map(function (d) {
              return d._id;
            });
          });
          nganhangkhoIds = users.flatMap(function (user) {
            return user.nganhangkho.map(function (n) {
              return n._id;
            });
          });
          skuIds = users.flatMap(function (user) {
            return user.sku;
          });
          mucthuchiIds = users.flatMap(function (user) {
            return user.mucthuchi.map(function (m) {
              return m._id;
            });
          });
          loaichungtuIds = users.flatMap(function (user) {
            return user.loaichungtu.map(function (l) {
              return l._id;
            });
          });
          nhomkhachhangIds = users.flatMap(function (user) {
            return user.nhomkhachhang.map(function (n) {
              return n._id;
            });
          });
          deleteOperations = [Depot.deleteMany({
            _id: {
              $in: depotIds
            }
          }), NganHang.deleteMany({
            _id: {
              $in: nganhangkhoIds
            }
          }), Sku.deleteMany({
            _id: {
              $in: skuIds
            }
          }), MucThuChi.deleteMany({
            _id: {
              $in: mucthuchiIds
            }
          }), LoaiChungTu.deleteMany({
            _id: {
              $in: loaichungtuIds
            }
          }), NhomKhacHang.deleteMany({
            _id: {
              $in: nhomkhachhangIds
            }
          }), User.deleteMany({
            _id: {
              $in: ids
            }
          })];
          _context4.next = 18;
          return regeneratorRuntime.awrap(Promise.all(deleteOperations));

        case 18:
          res.json({
            message: 'Xóa thành công.'
          });
          _context4.next = 25;
          break;

        case 21:
          _context4.prev = 21;
          _context4.t0 = _context4["catch"](0);
          console.error('Lỗi khi xóa người dùng:', _context4.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi trong quá trình xử lý.'
          });

        case 25:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 21]]);
});
module.exports = router;
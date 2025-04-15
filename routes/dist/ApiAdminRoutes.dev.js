"use strict";

var router = require('express').Router();

var User = require('../models/UserModel');

var Depot = require('../models/DepotModel');

var NganHang = require('../models/NganHangKhoModel');

var Sku = require('../models/SkuModel');

var MucThuChi = require('../models/MucThuChiModel');

var LoaiChungTu = require('../models/LoaiChungTuModel');

var NhomKhacHang = require('../models/NhomKhacHangModel');

var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
router.get('/getuser/:iduser', function _callee2(req, res) {
  var iduser, page, limit, skip, users, userjson, totalEmployees;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          iduser = req.params.iduser;
          page = parseInt(req.query.page) || 1;
          limit = parseInt(req.query.limit) || 10;
          skip = (page - 1) * limit;
          _context2.next = 7;
          return regeneratorRuntime.awrap(User.find({
            _id: {
              $ne: iduser
            },
            role: 'manager'
          }).skip(skip).limit(limit).lean());

        case 7:
          users = _context2.sent;
          _context2.next = 10;
          return regeneratorRuntime.awrap(Promise.all(users.map(function _callee(u) {
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

        case 10:
          userjson = _context2.sent;
          _context2.next = 13;
          return regeneratorRuntime.awrap(User.countDocuments({
            role: 'manager',
            _id: {
              $ne: iduser
            }
          }));

        case 13:
          totalEmployees = _context2.sent;
          res.json({
            page: page,
            limit: limit,
            total: totalEmployees,
            totalPages: Math.ceil(totalEmployees / limit),
            data: userjson
          });
          _context2.next = 21;
          break;

        case 17:
          _context2.prev = 17;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);
          res.status(500).json({
            message: 'Internal Server Error'
          });

        case 21:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 17]]);
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
router.post('/updateuser/:iduser', function _callee5(req, res) {
  var iduser, _req$body2, name, email, password, phone, birthday, role, user, exitphone, existingemail, hashedPassword;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          iduser = req.params.iduser;
          _req$body2 = req.body, name = _req$body2.name, email = _req$body2.email, password = _req$body2.password, phone = _req$body2.phone, birthday = _req$body2.birthday, role = _req$body2.role;
          _context5.next = 5;
          return regeneratorRuntime.awrap(User.findById(iduser));

        case 5:
          user = _context5.sent;

          if (!(birthday && !/^\d{4}-\d{2}-\d{2}$/.test(birthday))) {
            _context5.next = 8;
            break;
          }

          return _context5.abrupt("return", res.json({
            message: 'Ngày sinh không hợp lệ'
          }));

        case 8:
          if (!(phone && !/^\d{10}$/.test(phone))) {
            _context5.next = 10;
            break;
          }

          return _context5.abrupt("return", res.json({
            message: 'Số điện thoại không hợp lệ'
          }));

        case 10:
          if (!(email && !emailRegex.test(email))) {
            _context5.next = 12;
            break;
          }

          return _context5.abrupt("return", res.json({
            message: 'email không hợp lệ'
          }));

        case 12:
          _context5.next = 14;
          return regeneratorRuntime.awrap(User.findOne({
            phone: phone,
            _id: {
              $ne: iduser
            }
          }));

        case 14:
          exitphone = _context5.sent;

          if (!exitphone) {
            _context5.next = 17;
            break;
          }

          return _context5.abrupt("return", res.json({
            message: 'số điện thoại này đã được đăng kí'
          }));

        case 17:
          _context5.next = 19;
          return regeneratorRuntime.awrap(User.findOne({
            email: email,
            _id: {
              $ne: iduser
            }
          }));

        case 19:
          existingemail = _context5.sent;

          if (!existingemail) {
            _context5.next = 22;
            break;
          }

          return _context5.abrupt("return", res.json({
            message: 'email này đã được đăng kí'
          }));

        case 22:
          if (!password) {
            _context5.next = 27;
            break;
          }

          _context5.next = 25;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

        case 25:
          hashedPassword = _context5.sent;
          user.password = hashedPassword;

        case 27:
          if (name) {
            user.name = name;
          }

          if (email) {
            user.email = email;
          }

          if (phone) {
            user.phone = phone;
          }

          if (birthday) {
            user.birthday = birthday;
          }

          if (role) {
            user.role = role;
          }

          _context5.next = 34;
          return regeneratorRuntime.awrap(user.save());

        case 34:
          res.json(user);
          _context5.next = 41;
          break;

        case 37:
          _context5.prev = 37;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 41:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 37]]);
});
router.get('/getchitietuser/:iduser', function _callee6(req, res) {
  var iduser, user, userjson;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          iduser = req.params.iduser;
          _context6.next = 4;
          return regeneratorRuntime.awrap(User.findById(iduser).select('name email phone birthday role'));

        case 4:
          user = _context6.sent;

          if (user) {
            _context6.next = 7;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            message: 'Người dùng không tồn tại'
          }));

        case 7:
          userjson = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            birthday: user.birthday,
            role: user.role
          };
          res.json(userjson);
          _context6.next = 15;
          break;

        case 11:
          _context6.prev = 11;
          _context6.t0 = _context6["catch"](0);
          console.error('Lỗi khi lấy chi tiết người dùng:', _context6.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi trong quá trình xử lý.'
          });

        case 15:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 11]]);
});
router.post('/updaterole/:iduser', function _callee7(req, res) {
  var iduser, role, user;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          iduser = req.params.iduser;
          role = req.body.role;
          _context7.next = 5;
          return regeneratorRuntime.awrap(User.findById(iduser));

        case 5:
          user = _context7.sent;

          if (user) {
            _context7.next = 8;
            break;
          }

          return _context7.abrupt("return", res.status(404).json({
            message: 'Người dùng không tồn tại'
          }));

        case 8:
          user.role = role;
          _context7.next = 11;
          return regeneratorRuntime.awrap(user.save());

        case 11:
          res.json(user);
          _context7.next = 18;
          break;

        case 14:
          _context7.prev = 14;
          _context7.t0 = _context7["catch"](0);
          console.error('Lỗi khi cập nhật người dùng:', _context7.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi trong quá trình xử lý.'
          });

        case 18:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 14]]);
});
module.exports = router;
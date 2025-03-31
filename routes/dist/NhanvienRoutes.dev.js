"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var router = require('express').Router();

var User = require('../models/UserModel');

var Depot = require('../models/DepotModel');

var crypto = require('crypto');

var momenttimezone = require('moment-timezone');

var moment = require('moment');

var NhanVien = require('../models/NhanVienModel');

function encrypt(text) {
  var key = crypto.randomBytes(32); // Khóa ngẫu nhiên 32 byte

  var iv = crypto.randomBytes(16); // IV ngẫu nhiên 16 byte

  var cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  var encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher["final"]('hex');
  return {
    iv: iv.toString('hex'),
    key: key.toString('hex'),
    content: encrypted
  };
} // Hàm giải mã


function decrypt(encrypted) {
  var iv = Buffer.from(encrypted.iv, 'hex');
  var key = Buffer.from(encrypted.key, 'hex');
  var decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  var decrypted = decipher.update(encrypted.content, 'hex', 'utf8');
  decrypted += decipher["final"]('utf8');
  return decrypted;
}

var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
router.post('/postnhanvien/:depotid', function _callee(req, res) {
  var depotId, vietnamTime, _req$body, name, email, password, phone, birthday, hovaten, cccd, chucvu, exitphone, existingemail, encryptedPassword, nhanvien, user, depot, admin;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          depotId = req.params.depotid;
          vietnamTime = momenttimezone().toDate();
          _req$body = req.body, name = _req$body.name, email = _req$body.email, password = _req$body.password, phone = _req$body.phone, birthday = _req$body.birthday, hovaten = _req$body.hovaten, cccd = _req$body.cccd, chucvu = _req$body.chucvu;

          if (!(!phone || !/^\d{10}$/.test(phone))) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return", res.json({
            message: 'Số điện thoại không hợp lệ'
          }));

        case 6:
          if (emailRegex.test(email)) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return", res.json({
            message: 'Email không hợp lệ'
          }));

        case 8:
          _context.next = 10;
          return regeneratorRuntime.awrap(User.findOne({
            phone: phone
          }));

        case 10:
          exitphone = _context.sent;
          _context.next = 13;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 13:
          existingemail = _context.sent;

          if (!existingemail) {
            _context.next = 16;
            break;
          }

          return _context.abrupt("return", res.json({
            message: 'Email này đã được đăng ký'
          }));

        case 16:
          encryptedPassword = encrypt(password);

          if (!exitphone) {
            _context.next = 19;
            break;
          }

          return _context.abrupt("return", res.json({
            message: 'Số điện thoại đã tồn tại trong hệ thống'
          }));

        case 19:
          nhanvien = new NhanVien({
            name: hovaten,
            depot: depotId,
            chucvu: chucvu
          });
          nhanvien.manhanvien = 'NV' + nhanvien._id.toString().slice(-4);

          if (cccd) {
            nhanvien.cccd = cccd;
          }

          user = new User({
            name: name,
            email: email,
            password: JSON.stringify(encryptedPassword),
            phone: phone,
            date: vietnamTime,
            isVerified: false,
            birthday: birthday
          });
          user.role = 'staff';
          nhanvien.user = user._id;
          _context.next = 27;
          return regeneratorRuntime.awrap(Depot.findById(depotId));

        case 27:
          depot = _context.sent;
          _context.next = 30;
          return regeneratorRuntime.awrap(User.findById(depot.user[0]._id));

        case 30:
          admin = _context.sent;
          depot.user.push(user._id);
          user.depot = admin.depot;
          admin.nhanvien.push(nhanvien._id);
          _context.next = 36;
          return regeneratorRuntime.awrap(user.save());

        case 36:
          _context.next = 38;
          return regeneratorRuntime.awrap(nhanvien.save());

        case 38:
          _context.next = 40;
          return regeneratorRuntime.awrap(admin.save());

        case 40:
          _context.next = 42;
          return regeneratorRuntime.awrap(depot.save());

        case 42:
          res.json(nhanvien);
          _context.next = 49;
          break;

        case 45:
          _context.prev = 45;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 49:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 45]]);
});
router.get('/getnhanvien/:userid', function _callee3(req, res) {
  var userid, user, _req$query, _req$query$page, page, _req$query$limit, limit, startIndex, endIndex, totalEmployees, paginatedNhanvien, nhanvien;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          userid = req.params.userid;
          _context3.next = 4;
          return regeneratorRuntime.awrap(User.findById(userid));

        case 4:
          user = _context3.sent;
          _req$query = req.query, _req$query$page = _req$query.page, page = _req$query$page === void 0 ? 1 : _req$query$page, _req$query$limit = _req$query.limit, limit = _req$query$limit === void 0 ? 10 : _req$query$limit;
          page = parseInt(page);
          limit = parseInt(limit);

          if (!(page < 1 || limit < 1)) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            message: 'Page và limit phải lớn hơn 0'
          }));

        case 10:
          startIndex = (page - 1) * limit;
          endIndex = startIndex + limit;
          totalEmployees = user.nhanvien.length;
          paginatedNhanvien = user.nhanvien.slice(startIndex, endIndex);
          _context3.next = 16;
          return regeneratorRuntime.awrap(Promise.all(paginatedNhanvien.map(function _callee2(nv) {
            var nhanvien1, usernv, encryptedPassword;
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return regeneratorRuntime.awrap(NhanVien.findById(nv._id));

                  case 2:
                    nhanvien1 = _context2.sent;
                    _context2.next = 5;
                    return regeneratorRuntime.awrap(User.findById(nhanvien1.user));

                  case 5:
                    usernv = _context2.sent;
                    encryptedPassword = JSON.parse(usernv.password);
                    return _context2.abrupt("return", {
                      _id: nhanvien1._id,
                      manhanvien: nhanvien1.manhanvien,
                      name: nhanvien1.name,
                      email: usernv.email,
                      password: decrypt(encryptedPassword),
                      phone: usernv.phone,
                      birthday: moment(usernv.birthday).format('DD/MM/YYYY'),
                      date: moment(usernv.date).format('HH:mm DD/MM/YYYY'),
                      chucvu: nhanvien1.chucvu
                    });

                  case 8:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          })));

        case 16:
          nhanvien = _context3.sent;
          res.json({
            total: totalEmployees,
            page: page,
            limit: limit,
            totalPages: Math.ceil(totalEmployees / limit),
            data: nhanvien
          });
          _context3.next = 24;
          break;

        case 20:
          _context3.prev = 20;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 24:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 20]]);
});
router.post('/khoanhanvien/:nhanvienid', function _callee4(req, res) {
  var nhanvienid, nhanvien;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          nhanvienid = req.params.nhanvienid;
          _context4.next = 4;
          return regeneratorRuntime.awrap(NhanVien.findById(nhanvienid));

        case 4:
          nhanvien = _context4.sent;
          nhanvien.khoa = true;
          _context4.next = 8;
          return regeneratorRuntime.awrap(nhanvien.save());

        case 8:
          res.json(nhanvien);
          _context4.next = 15;
          break;

        case 11:
          _context4.prev = 11;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 15:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 11]]);
});
router.post('/mokhoanhanvien/:nhanvienid', function _callee5(req, res) {
  var nhanvienid, nhanvien;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          nhanvienid = req.params.nhanvienid;
          _context5.next = 4;
          return regeneratorRuntime.awrap(NhanVien.findById(nhanvienid));

        case 4:
          nhanvien = _context5.sent;
          nhanvien.khoa = false;
          _context5.next = 8;
          return regeneratorRuntime.awrap(nhanvien.save());

        case 8:
          res.json(nhanvien);
          _context5.next = 15;
          break;

        case 11:
          _context5.prev = 11;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 15:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 11]]);
});
router.post('/addquyennv/:nhanvienid', function _callee6(req, res) {
  var nhanvienid, quyen, nhanvien, quyenMoi, _nhanvien$quyen;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          nhanvienid = req.params.nhanvienid;
          quyen = req.body.quyen;

          if (!Array.isArray(quyen)) {
            quyen = [quyen];
          }

          _context6.next = 6;
          return regeneratorRuntime.awrap(NhanVien.findById(nhanvienid));

        case 6:
          nhanvien = _context6.sent;

          if (nhanvien) {
            _context6.next = 9;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            message: 'Nhân viên không tồn tại.'
          }));

        case 9:
          quyenMoi = quyen.filter(function (q) {
            return !nhanvien.quyen.includes(q);
          });

          if (!(quyenMoi.length > 0)) {
            _context6.next = 14;
            break;
          }

          (_nhanvien$quyen = nhanvien.quyen).push.apply(_nhanvien$quyen, _toConsumableArray(quyenMoi));

          _context6.next = 14;
          return regeneratorRuntime.awrap(nhanvien.save());

        case 14:
          res.json(nhanvien);
          _context6.next = 21;
          break;

        case 17:
          _context6.prev = 17;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 21:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 17]]);
});
router.post('/putnhanvien/:nhanvienid', function _callee7(req, res) {
  var nhanvienid, _req$body2, name, phone, birthday, hovaten, cccd, chucvu, email, nhanvien, user;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          nhanvienid = req.params.nhanvienid;
          _req$body2 = req.body, name = _req$body2.name, phone = _req$body2.phone, birthday = _req$body2.birthday, hovaten = _req$body2.hovaten, cccd = _req$body2.cccd, chucvu = _req$body2.chucvu, email = _req$body2.email;
          _context7.next = 5;
          return regeneratorRuntime.awrap(NhanVien.findById(nhanvienid));

        case 5:
          nhanvien = _context7.sent;

          if (nhanvien) {
            _context7.next = 8;
            break;
          }

          return _context7.abrupt("return", res.status(404).json({
            message: 'Nhân viên không tồn tại.'
          }));

        case 8:
          _context7.next = 10;
          return regeneratorRuntime.awrap(User.findById(nhanvien.user));

        case 10:
          user = _context7.sent;
          if (name) user.name = name;
          if (phone) user.phone = phone;
          if (birthday) user.birthday = birthday;
          if (hovaten) nhanvien.hovaten = hovaten;
          if (cccd) nhanvien.cccd = cccd;
          if (chucvu) nhanvien.chucvu = chucvu;
          if (email) user.email = email;
          _context7.next = 20;
          return regeneratorRuntime.awrap(nhanvien.save());

        case 20:
          _context7.next = 22;
          return regeneratorRuntime.awrap(user.save());

        case 22:
          res.json(nhanvien);
          _context7.next = 29;
          break;

        case 25:
          _context7.prev = 25;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 29:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 25]]);
});
router.post('/doimknv/:nhanvienid', function _callee8(req, res) {
  var nhanvienid, password, nhanvien, encryptedPassword, user;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          nhanvienid = req.params.nhanvienid;
          password = req.body.password;
          _context8.next = 5;
          return regeneratorRuntime.awrap(NhanVien.findById(nhanvienid));

        case 5:
          nhanvien = _context8.sent;

          if (nhanvien) {
            _context8.next = 8;
            break;
          }

          return _context8.abrupt("return", res.status(404).json({
            message: 'Nhân viên không tồn tại.'
          }));

        case 8:
          encryptedPassword = encrypt(password);
          _context8.next = 11;
          return regeneratorRuntime.awrap(User.findById(nhanvien.user));

        case 11:
          user = _context8.sent;
          user.password = JSON.stringify(encryptedPassword);
          _context8.next = 15;
          return regeneratorRuntime.awrap(user.save());

        case 15:
          res.json(nhanvien);
          _context8.next = 22;
          break;

        case 18:
          _context8.prev = 18;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 22:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 18]]);
});
module.exports = router;
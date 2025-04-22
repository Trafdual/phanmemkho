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
          user.sku = admin.sku;
          user.nganhangkho = admin.nganhangkho;
          user.mucthuchi = admin.mucthuchi;
          user.loaichungtu = admin.loaichungtu;
          user.nhomkhachhang = admin.nhomkhachhang;
          admin.nhanvien.push(nhanvien._id);
          _context.next = 41;
          return regeneratorRuntime.awrap(user.save());

        case 41:
          _context.next = 43;
          return regeneratorRuntime.awrap(nhanvien.save());

        case 43:
          _context.next = 45;
          return regeneratorRuntime.awrap(admin.save());

        case 45:
          _context.next = 47;
          return regeneratorRuntime.awrap(depot.save());

        case 47:
          res.json(nhanvien);
          _context.next = 54;
          break;

        case 50:
          _context.prev = 50;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 54:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 50]]);
});
router.get('/getnhanvien/:userid', function _callee4(req, res) {
  var userid, user, _req$query, _req$query$page, page, _req$query$limit, limit, status, filteredNhanvien, totalEmployees, startIndex, endIndex, paginatedNhanvien, nhanvien;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          userid = req.params.userid;
          _context4.next = 4;
          return regeneratorRuntime.awrap(User.findById(userid));

        case 4:
          user = _context4.sent;
          _req$query = req.query, _req$query$page = _req$query.page, page = _req$query$page === void 0 ? 1 : _req$query$page, _req$query$limit = _req$query.limit, limit = _req$query$limit === void 0 ? 10 : _req$query$limit, status = _req$query.status;
          page = parseInt(page);
          limit = parseInt(limit);

          if (!(page < 1 || limit < 1)) {
            _context4.next = 10;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            message: 'Page và limit phải lớn hơn 0'
          }));

        case 10:
          _context4.next = 12;
          return regeneratorRuntime.awrap(Promise.all(user.nhanvien.map(function _callee2(nv) {
            var nhanvien;
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return regeneratorRuntime.awrap(NhanVien.findById(nv._id));

                  case 2:
                    nhanvien = _context2.sent;

                    if (nhanvien) {
                      _context2.next = 5;
                      break;
                    }

                    return _context2.abrupt("return", null);

                  case 5:
                    if (!(status === 'active' && nhanvien.khoa === true)) {
                      _context2.next = 7;
                      break;
                    }

                    return _context2.abrupt("return", null);

                  case 7:
                    if (!(status === 'locked' && nhanvien.khoa === false)) {
                      _context2.next = 9;
                      break;
                    }

                    return _context2.abrupt("return", null);

                  case 9:
                    return _context2.abrupt("return", nhanvien._id);

                  case 10:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          })));

        case 12:
          filteredNhanvien = _context4.sent;
          filteredNhanvien = filteredNhanvien.filter(function (nv) {
            return nv !== null;
          });
          totalEmployees = filteredNhanvien.length;
          startIndex = (page - 1) * limit;
          endIndex = startIndex + limit;
          paginatedNhanvien = filteredNhanvien.slice(startIndex, endIndex);
          _context4.next = 20;
          return regeneratorRuntime.awrap(Promise.all(paginatedNhanvien.map(function _callee3(nvId) {
            var nhanvien1, usernv, encryptedPassword;
            return regeneratorRuntime.async(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return regeneratorRuntime.awrap(NhanVien.findById(nvId));

                  case 2:
                    nhanvien1 = _context3.sent;
                    _context3.next = 5;
                    return regeneratorRuntime.awrap(User.findById(nhanvien1.user));

                  case 5:
                    usernv = _context3.sent;
                    encryptedPassword = JSON.parse(usernv.password);
                    return _context3.abrupt("return", {
                      _id: nhanvien1._id,
                      manhanvien: nhanvien1.manhanvien,
                      name: usernv.name,
                      hovaten: nhanvien1.name,
                      email: usernv.email,
                      password: decrypt(encryptedPassword),
                      phone: usernv.phone,
                      birthday: moment(usernv.birthday).format('DD/MM/YYYY'),
                      date: moment(usernv.date).format('HH:mm DD/MM/YYYY'),
                      chucvu: nhanvien1.chucvu,
                      khoa: nhanvien1.khoa,
                      quyen: nhanvien1.quyen
                    });

                  case 8:
                  case "end":
                    return _context3.stop();
                }
              }
            });
          })));

        case 20:
          nhanvien = _context4.sent;
          res.json({
            total: totalEmployees,
            page: page,
            limit: limit,
            totalPages: Math.ceil(totalEmployees / limit),
            data: nhanvien
          });
          _context4.next = 28;
          break;

        case 24:
          _context4.prev = 24;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 28:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 24]]);
});
router.post('/khoanhanvien', function _callee5(req, res) {
  var ids, result;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          ids = req.body.ids;

          if (!(!ids || !Array.isArray(ids))) {
            _context5.next = 4;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            message: 'Danh sách nhân viên không hợp lệ.'
          }));

        case 4:
          _context5.next = 6;
          return regeneratorRuntime.awrap(NhanVien.updateMany({
            _id: {
              $in: ids
            }
          }, {
            $set: {
              khoa: true
            }
          }));

        case 6:
          result = _context5.sent;
          res.json({
            message: 'Đã khóa nhân viên.',
            updatedCount: result.modifiedCount
          });
          _context5.next = 14;
          break;

        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 14:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
router.post('/mokhoanhanvien', function _callee6(req, res) {
  var ids, result;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          ids = req.body.ids;

          if (!(!ids || !Array.isArray(ids))) {
            _context6.next = 4;
            break;
          }

          return _context6.abrupt("return", res.status(400).json({
            message: 'Danh sách nhân viên không hợp lệ.'
          }));

        case 4:
          _context6.next = 6;
          return regeneratorRuntime.awrap(NhanVien.updateMany({
            _id: {
              $in: ids
            }
          }, {
            $set: {
              khoa: false
            }
          }));

        case 6:
          result = _context6.sent;
          res.json({
            message: 'Đã mở khóa nhân viên.',
            updatedCount: result.modifiedCount
          });
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
router.post('/addquyennv/:nhanvienid', function _callee7(req, res) {
  var nhanvienid, _req$body2, quyen, userid, validRoles, user, nhanvien, usernv, quyenMoi, _nhanvien$quyen;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          nhanvienid = req.params.nhanvienid;
          _req$body2 = req.body, quyen = _req$body2.quyen, userid = _req$body2.userid;
          validRoles = ['quanly', 'banhang', 'ketoan'];

          if (!Array.isArray(quyen)) {
            quyen = [quyen];
          }

          quyen = quyen.filter(function (q) {
            return validRoles.includes(q);
          });
          _context7.next = 8;
          return regeneratorRuntime.awrap(User.findById(userid));

        case 8:
          user = _context7.sent;

          if (user) {
            _context7.next = 11;
            break;
          }

          return _context7.abrupt("return", res.status(404).json({
            message: 'tài khoản không tồn tại.'
          }));

        case 11:
          _context7.next = 13;
          return regeneratorRuntime.awrap(NhanVien.findById(nhanvienid));

        case 13:
          nhanvien = _context7.sent;

          if (nhanvien) {
            _context7.next = 16;
            break;
          }

          return _context7.abrupt("return", res.status(404).json({
            message: 'Nhân viên không tồn tại.'
          }));

        case 16:
          _context7.next = 18;
          return regeneratorRuntime.awrap(User.findById(nhanvien.user));

        case 18:
          usernv = _context7.sent;

          if (usernv) {
            _context7.next = 21;
            break;
          }

          return _context7.abrupt("return", res.status(404).json({
            message: 'tài khoản Nhân viên không tồn tại.'
          }));

        case 21:
          quyenMoi = quyen.filter(function (q) {
            return !nhanvien.quyen.includes(q);
          });

          if (!(quyenMoi.length > 0)) {
            _context7.next = 26;
            break;
          }

          (_nhanvien$quyen = nhanvien.quyen).push.apply(_nhanvien$quyen, _toConsumableArray(quyenMoi));

          _context7.next = 26;
          return regeneratorRuntime.awrap(nhanvien.save());

        case 26:
          if (!(quyen.includes('ketoan') || quyen.includes('quanly'))) {
            _context7.next = 31;
            break;
          }

          usernv.nhanvien = user.nhanvien;

          if (!usernv.nhanvien.includes(user._id)) {
            usernv.nhanvien.push(user._id);
          }

          _context7.next = 31;
          return regeneratorRuntime.awrap(usernv.save());

        case 31:
          res.json(nhanvien);
          _context7.next = 38;
          break;

        case 34:
          _context7.prev = 34;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 38:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 34]]);
});
router.post('/removequyennv/:nhanvienid', function _callee8(req, res) {
  var nhanvienid, quyen, nhanvien, usernv, stillHasImportantRoles;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          nhanvienid = req.params.nhanvienid;
          quyen = req.body.quyen;

          if (!Array.isArray(quyen)) {
            quyen = [quyen];
          }

          _context8.next = 6;
          return regeneratorRuntime.awrap(NhanVien.findById(nhanvienid));

        case 6:
          nhanvien = _context8.sent;

          if (nhanvien) {
            _context8.next = 9;
            break;
          }

          return _context8.abrupt("return", res.status(404).json({
            message: 'Nhân viên không tồn tại.'
          }));

        case 9:
          _context8.next = 11;
          return regeneratorRuntime.awrap(User.findById(nhanvien.user));

        case 11:
          usernv = _context8.sent;

          if (usernv) {
            _context8.next = 14;
            break;
          }

          return _context8.abrupt("return", res.status(404).json({
            message: 'tài khoản Nhân viên không tồn tại.'
          }));

        case 14:
          nhanvien.quyen = nhanvien.quyen.filter(function (q) {
            return !quyen.includes(q);
          });
          stillHasImportantRoles = nhanvien.quyen.some(function (q) {
            return q === 'ketoan' || q === 'quanly';
          });

          if (stillHasImportantRoles) {
            _context8.next = 20;
            break;
          }

          usernv.nhanvien = [];
          _context8.next = 20;
          return regeneratorRuntime.awrap(usernv.save());

        case 20:
          _context8.next = 22;
          return regeneratorRuntime.awrap(nhanvien.save());

        case 22:
          res.json(nhanvien);
          _context8.next = 29;
          break;

        case 25:
          _context8.prev = 25;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 29:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 25]]);
});
router.get('/quyennv/:nhanvienid', function _callee9(req, res) {
  var nhanvienid, nhanvien;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          nhanvienid = req.params.nhanvienid;
          _context9.next = 4;
          return regeneratorRuntime.awrap(NhanVien.findById(nhanvienid));

        case 4:
          nhanvien = _context9.sent;

          if (nhanvien) {
            _context9.next = 7;
            break;
          }

          return _context9.abrupt("return", res.status(404).json({
            message: 'Nhân viên không tồn tại.'
          }));

        case 7:
          res.json({
            quyen: nhanvien.quyen
          });
          _context9.next = 14;
          break;

        case 10:
          _context9.prev = 10;
          _context9.t0 = _context9["catch"](0);
          console.error(_context9.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 14:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
router.get('/chitietnv/:nhanvineid', function _callee10(req, res) {
  var nhanvienid, nhanvien, user, nhanvienjson;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          nhanvienid = req.params.nhanvineid;
          _context10.next = 4;
          return regeneratorRuntime.awrap(NhanVien.findById(nhanvienid));

        case 4:
          nhanvien = _context10.sent;
          _context10.next = 7;
          return regeneratorRuntime.awrap(User.findById(nhanvien.user));

        case 7:
          user = _context10.sent;
          nhanvienjson = {
            _id: nhanvien._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            birthday: moment(user.birthday).format('YYYY-MM-DD'),
            chucvu: nhanvien.chucvu,
            hovaten: nhanvien.name,
            password: decrypt(JSON.parse(user.password))
          };
          res.json(nhanvienjson);
          _context10.next = 16;
          break;

        case 12:
          _context10.prev = 12;
          _context10.t0 = _context10["catch"](0);
          console.error(_context10.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 16:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 12]]);
});
router.post('/putnhanvien/:nhanvienid', function _callee11(req, res) {
  var nhanvienid, _req$body3, name, phone, birthday, hovaten, cccd, chucvu, email, nhanvien, user;

  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          nhanvienid = req.params.nhanvienid;
          _req$body3 = req.body, name = _req$body3.name, phone = _req$body3.phone, birthday = _req$body3.birthday, hovaten = _req$body3.hovaten, cccd = _req$body3.cccd, chucvu = _req$body3.chucvu, email = _req$body3.email;
          _context11.next = 5;
          return regeneratorRuntime.awrap(NhanVien.findById(nhanvienid));

        case 5:
          nhanvien = _context11.sent;

          if (nhanvien) {
            _context11.next = 8;
            break;
          }

          return _context11.abrupt("return", res.status(404).json({
            message: 'Nhân viên không tồn tại.'
          }));

        case 8:
          _context11.next = 10;
          return regeneratorRuntime.awrap(User.findById(nhanvien.user));

        case 10:
          user = _context11.sent;
          if (name) user.name = name;
          if (phone) user.phone = phone;
          if (birthday) user.birthday = birthday;
          if (hovaten) nhanvien.name = hovaten;
          if (cccd) nhanvien.cccd = cccd;
          if (chucvu) nhanvien.chucvu = chucvu;
          if (email) user.email = email;
          _context11.next = 20;
          return regeneratorRuntime.awrap(nhanvien.save());

        case 20:
          _context11.next = 22;
          return regeneratorRuntime.awrap(user.save());

        case 22:
          res.json(nhanvien);
          _context11.next = 29;
          break;

        case 25:
          _context11.prev = 25;
          _context11.t0 = _context11["catch"](0);
          console.error(_context11.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 29:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 25]]);
});
router.post('/doimknv/:nhanvienid', function _callee12(req, res) {
  var nhanvienid, password, nhanvien, encryptedPassword, user;
  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          nhanvienid = req.params.nhanvienid;
          password = req.body.password;
          _context12.next = 5;
          return regeneratorRuntime.awrap(NhanVien.findById(nhanvienid));

        case 5:
          nhanvien = _context12.sent;

          if (nhanvien) {
            _context12.next = 8;
            break;
          }

          return _context12.abrupt("return", res.status(404).json({
            message: 'Nhân viên không tồn tại.'
          }));

        case 8:
          encryptedPassword = encrypt(password);
          _context12.next = 11;
          return regeneratorRuntime.awrap(User.findById(nhanvien.user));

        case 11:
          user = _context12.sent;
          user.password = JSON.stringify(encryptedPassword);
          _context12.next = 15;
          return regeneratorRuntime.awrap(user.save());

        case 15:
          res.json(nhanvien);
          _context12.next = 22;
          break;

        case 18:
          _context12.prev = 18;
          _context12.t0 = _context12["catch"](0);
          console.error(_context12.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 22:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 18]]);
});
module.exports = router;
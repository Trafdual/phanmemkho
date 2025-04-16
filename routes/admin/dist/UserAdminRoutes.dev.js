"use strict";

var router = require('express').Router();

var User = require('../../models/UserModel');

var Depot = require('../../models/DepotModel');

var NganHang = require('../../models/NganHangKhoModel');

var Sku = require('../../models/SkuModel');

var MucThuChi = require('../../models/MucThuChiModel');

var LoaiChungTu = require('../../models/LoaiChungTuModel');

var NhomKhacHang = require('../../models/NhomKhacHangModel');

var NhanVien = require('../../models/NhanVienModel');

router.get('/getkhochua/:iduser', function _callee2(req, res) {
  var iduser, page, limit, skip, user, totalKho, paginatedDepots, kho;
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
          return regeneratorRuntime.awrap(User.findById(iduser));

        case 7:
          user = _context2.sent;

          if (user) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: 'Người dùng không tồn tại'
          }));

        case 10:
          totalKho = user.depot.length;
          paginatedDepots = user.depot.slice(skip, skip + limit);
          _context2.next = 14;
          return regeneratorRuntime.awrap(Promise.all(paginatedDepots.map(function _callee(khochua) {
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

        case 14:
          kho = _context2.sent;
          res.json({
            currentPage: page,
            totalPages: Math.ceil(totalKho / limit),
            totalItems: totalKho,
            data: kho
          });
          _context2.next = 22;
          break;

        case 18:
          _context2.prev = 18;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);
          res.status(500).json({
            message: 'Lỗi server'
          });

        case 22:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 18]]);
});
router.get('/getnhanvienadmin/:idkho', function _callee4(req, res) {
  var idkho, page, limit, skip, kho, totalUsers, paginatedUsers, user;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          idkho = req.params.idkho;
          page = parseInt(req.query.page) || 1;
          limit = parseInt(req.query.limit) || 10;
          skip = (page - 1) * limit;
          _context4.next = 7;
          return regeneratorRuntime.awrap(Depot.findById(idkho));

        case 7:
          kho = _context4.sent;

          if (kho) {
            _context4.next = 10;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: 'Không tìm thấy kho'
          }));

        case 10:
          totalUsers = kho.user.length;
          paginatedUsers = kho.user.slice(skip, skip + limit);
          _context4.next = 14;
          return regeneratorRuntime.awrap(Promise.all(paginatedUsers.map(function _callee3(user) {
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

        case 14:
          user = _context4.sent;
          res.json({
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            totalItems: totalUsers,
            data: user
          });
          _context4.next = 22;
          break;

        case 18:
          _context4.prev = 18;
          _context4.t0 = _context4["catch"](0);
          console.log(_context4.t0);
          res.status(500).json({
            message: 'Lỗi server'
          });

        case 22:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 18]]);
});
router.post('/khoauser', function _callee7(req, res) {
  var ids;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          ids = req.body.ids;

          if (!(!Array.isArray(ids) || ids.length === 0)) {
            _context7.next = 4;
            break;
          }

          return _context7.abrupt("return", res.status(400).json({
            message: 'Danh sách user rỗng'
          }));

        case 4:
          _context7.next = 6;
          return regeneratorRuntime.awrap(Promise.all(ids.map(function _callee6(iduser) {
            var user;
            return regeneratorRuntime.async(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    _context6.next = 2;
                    return regeneratorRuntime.awrap(User.findById(iduser));

                  case 2:
                    user = _context6.sent;

                    if (user) {
                      _context6.next = 5;
                      break;
                    }

                    return _context6.abrupt("return");

                  case 5:
                    _context6.next = 7;
                    return regeneratorRuntime.awrap(Promise.all((user.nhanvien || []).map(function _callee5(nv) {
                      var nhanvien, usernv;
                      return regeneratorRuntime.async(function _callee5$(_context5) {
                        while (1) {
                          switch (_context5.prev = _context5.next) {
                            case 0:
                              _context5.next = 2;
                              return regeneratorRuntime.awrap(NhanVien.findById(nv._id));

                            case 2:
                              nhanvien = _context5.sent;

                              if (nhanvien) {
                                _context5.next = 5;
                                break;
                              }

                              return _context5.abrupt("return");

                            case 5:
                              _context5.next = 7;
                              return regeneratorRuntime.awrap(User.findById(nhanvien.user));

                            case 7:
                              usernv = _context5.sent;

                              if (!usernv) {
                                _context5.next = 12;
                                break;
                              }

                              usernv.khoa = true;
                              _context5.next = 12;
                              return regeneratorRuntime.awrap(usernv.save());

                            case 12:
                            case "end":
                              return _context5.stop();
                          }
                        }
                      });
                    })));

                  case 7:
                    user.khoa = true;
                    _context6.next = 10;
                    return regeneratorRuntime.awrap(user.save());

                  case 10:
                  case "end":
                    return _context6.stop();
                }
              }
            });
          })));

        case 6:
          res.json({
            message: 'Đã khóa tất cả user thành công'
          });
          _context7.next = 13;
          break;

        case 9:
          _context7.prev = 9;
          _context7.t0 = _context7["catch"](0);
          console.log(_context7.t0);
          res.status(500).json({
            message: 'Lỗi server'
          });

        case 13:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 9]]);
});
router.post('/mokhoauser', function _callee9(req, res) {
  var ids;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          ids = req.body.ids;

          if (!(!Array.isArray(ids) || ids.length === 0)) {
            _context9.next = 4;
            break;
          }

          return _context9.abrupt("return", res.status(400).json({
            message: 'Danh sách user rỗng'
          }));

        case 4:
          _context9.next = 6;
          return regeneratorRuntime.awrap(Promise.all(ids.map(function _callee8(iduser) {
            var user;
            return regeneratorRuntime.async(function _callee8$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    _context8.next = 2;
                    return regeneratorRuntime.awrap(User.findById(iduser));

                  case 2:
                    user = _context8.sent;

                    if (user) {
                      _context8.next = 5;
                      break;
                    }

                    return _context8.abrupt("return");

                  case 5:
                    user.khoa = false;
                    _context8.next = 8;
                    return regeneratorRuntime.awrap(user.save());

                  case 8:
                  case "end":
                    return _context8.stop();
                }
              }
            });
          })));

        case 6:
          res.json({
            message: 'Đã mở khóa tất cả user thành công'
          });
          _context9.next = 13;
          break;

        case 9:
          _context9.prev = 9;
          _context9.t0 = _context9["catch"](0);
          console.log(_context9.t0);
          res.status(500).json({
            message: 'Lỗi server'
          });

        case 13:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 9]]);
});
module.exports = router;
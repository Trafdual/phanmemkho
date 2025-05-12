"use strict";

var router = require('express').Router();

var HoaDon = require('../models/HoaDonModel');

var User = require('../models/UserModel');

var KhachHang = require('../models/KhachHangModel');

var LoaiSanPham = require('../models/LoaiSanPhamModel');

var SanPham = require('../models/SanPhamModel');

var moment = require('moment');

var momenttimezone = require('moment-timezone');

var DePot = require('../models/DepotModel');

var DungLuong = require('../models/DungluongSkuModel');

var Sku = require('../models/SkuModel');

router.get('/hoadon/:khoId', function _callee3(req, res) {
  var khoid, kho, hoadon;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          khoid = req.params.khoId;
          _context3.next = 4;
          return regeneratorRuntime.awrap(DePot.findById(khoid));

        case 4:
          kho = _context3.sent;
          _context3.next = 7;
          return regeneratorRuntime.awrap(Promise.all(kho.hoadon.map(function _callee2(hd) {
            var hd1, khachhang, sanpham;
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return regeneratorRuntime.awrap(HoaDon.findById(hd._id));

                  case 2:
                    hd1 = _context2.sent;
                    _context2.next = 5;
                    return regeneratorRuntime.awrap(KhachHang.findById(hd1.khachhang));

                  case 5:
                    khachhang = _context2.sent;
                    _context2.next = 8;
                    return regeneratorRuntime.awrap(Promise.all(hd1.sanpham.map(function _callee(sp) {
                      var sp1, loaisanpham;
                      return regeneratorRuntime.async(function _callee$(_context) {
                        while (1) {
                          switch (_context.prev = _context.next) {
                            case 0:
                              _context.next = 2;
                              return regeneratorRuntime.awrap(SanPham.findById(sp.sp._id));

                            case 2:
                              sp1 = _context.sent;
                              _context.next = 5;
                              return regeneratorRuntime.awrap(LoaiSanPham.findById(sp1.loaisanpham));

                            case 5:
                              loaisanpham = _context.sent;
                              return _context.abrupt("return", {
                                malohang: loaisanpham.malsp,
                                masp: sp1.masp,
                                tenmay: sp1.name,
                                price: sp1.price,
                                mausac: sp1.color,
                                dungluong: sp1.dungluongsku
                              });

                            case 7:
                            case "end":
                              return _context.stop();
                          }
                        }
                      });
                    })));

                  case 8:
                    sanpham = _context2.sent;
                    return _context2.abrupt("return", {
                      _id: hd1._id,
                      mahd: hd1.mahoadon,
                      makh: khachhang.makh,
                      tenkhach: khachhang.name,
                      phone: khachhang.phone,
                      email: khachhang.email,
                      address: khachhang.address,
                      date: moment(hd1.date).format('DD/MM/YYYY'),
                      tongtien: hd1.tongtien,
                      sanpham: sanpham
                    });

                  case 10:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          })));

        case 7:
          hoadon = _context3.sent;
          res.json(hoadon);
          _context3.next = 15;
          break;

        case 11:
          _context3.prev = 11;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 15:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 11]]);
});
router.get('/getchitiethoadon/:idhoadon', function _callee5(req, res) {
  var idhoadon, hoadon, user, khachhang, loaisanpham, hoadonjson;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          idhoadon = req.params.idhoadon;
          _context5.next = 4;
          return regeneratorRuntime.awrap(HoaDon.findById(idhoadon));

        case 4:
          hoadon = _context5.sent;
          _context5.next = 7;
          return regeneratorRuntime.awrap(User.findById(hoadon.nhanvien));

        case 7:
          user = _context5.sent;
          _context5.next = 10;
          return regeneratorRuntime.awrap(KhachHang.findById(hoadon.khachhang));

        case 10:
          khachhang = _context5.sent;
          _context5.next = 13;
          return regeneratorRuntime.awrap(Promise.all(hoadon.loaisanpham.map(function _callee4(loaisp) {
            var loai;
            return regeneratorRuntime.async(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.next = 2;
                    return regeneratorRuntime.awrap(LoaiSanPham.findById(loaisp.id));

                  case 2:
                    loai = _context4.sent;
                    return _context4.abrupt("return", {
                      _id: loai._id,
                      soluong: loaisp.soluong
                    });

                  case 4:
                  case "end":
                    return _context4.stop();
                }
              }
            });
          })));

        case 13:
          loaisanpham = _context5.sent;
          hoadonjson = {
            _id: hd._id,
            manhanvien: user._id,
            nhanvien: user.name,
            makhachhang: khachhang._id,
            khachhang: khachhang.name,
            loaisanpham: loaisanpham,
            date: moment(hd.date).format('DD/MM/YYYY'),
            tongtien: hd.tongtien
          };
          res.json(hoadonjson);
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
router.post('/posthoadon/:khoid', function _callee6(req, res) {
  var khoid, _req$body, makhachhang, masanpham, kho, vietnamTime, kh, hoadon, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, masp, sanpham, mahd;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          khoid = req.params.khoid;
          _req$body = req.body, makhachhang = _req$body.makhachhang, masanpham = _req$body.masanpham;
          _context6.next = 5;
          return regeneratorRuntime.awrap(DePot.findById(khoid));

        case 5:
          kho = _context6.sent;
          vietnamTime = momenttimezone().toDate();
          _context6.next = 9;
          return regeneratorRuntime.awrap(KhachHang.findOne({
            makh: makhachhang
          }));

        case 9:
          kh = _context6.sent;
          hoadon = new HoaDon({
            khachhang: kh._id,
            date: vietnamTime,
            tongtien: 0
          });
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context6.prev = 14;
          _iterator = masanpham[Symbol.iterator]();

        case 16:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context6.next = 30;
            break;
          }

          masp = _step.value;
          _context6.next = 20;
          return regeneratorRuntime.awrap(SanPham.findOne({
            masp: masp
          }));

        case 20:
          sanpham = _context6.sent;

          if (!sanpham) {
            _context6.next = 26;
            break;
          }

          hoadon.sanpham.push(sanpham._id);
          hoadon.tongtien = hoadon.tongtien + sanpham.price;
          _context6.next = 27;
          break;

        case 26:
          return _context6.abrupt("return", res.json({
            message: "S\u1EA3n ph\u1EA9m v\u1EDBi m\xE3 ".concat(masp, " kh\xF4ng t\xECm th\u1EA5y.")
          }));

        case 27:
          _iteratorNormalCompletion = true;
          _context6.next = 16;
          break;

        case 30:
          _context6.next = 36;
          break;

        case 32:
          _context6.prev = 32;
          _context6.t0 = _context6["catch"](14);
          _didIteratorError = true;
          _iteratorError = _context6.t0;

        case 36:
          _context6.prev = 36;
          _context6.prev = 37;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 39:
          _context6.prev = 39;

          if (!_didIteratorError) {
            _context6.next = 42;
            break;
          }

          throw _iteratorError;

        case 42:
          return _context6.finish(39);

        case 43:
          return _context6.finish(36);

        case 44:
          mahd = 'HD' + hoadon._id.toString().slice(-5);
          hoadon.mahoadon = mahd;
          kho.hoadon.push(hoadon._id);
          _context6.next = 49;
          return regeneratorRuntime.awrap(hoadon.save());

        case 49:
          _context6.next = 51;
          return regeneratorRuntime.awrap(kho.save());

        case 51:
          res.json(hoadon);
          _context6.next = 58;
          break;

        case 54:
          _context6.prev = 54;
          _context6.t1 = _context6["catch"](0);
          console.error(_context6.t1);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 58:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 54], [14, 32, 36, 44], [37,, 39, 43]]);
});
router.get('/gethoadonstore/:idkho', function _callee8(req, res) {
  var idkho, kho, _req$query, fromdate, enddate, from, end, filteredHoadons, hoadonjson;

  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          idkho = req.params.idkho;
          _context8.next = 4;
          return regeneratorRuntime.awrap(DePot.findById(idkho));

        case 4:
          kho = _context8.sent;
          _req$query = req.query, fromdate = _req$query.fromdate, enddate = _req$query.enddate;

          if (!(!fromdate || !enddate)) {
            _context8.next = 8;
            break;
          }

          return _context8.abrupt("return", res.status(400).json({
            message: 'Vui lòng cung cấp từ ngày và đến ngày.'
          }));

        case 8:
          from = new Date(fromdate);
          end = new Date(enddate);
          end.setUTCHours(23, 59, 59, 999);
          _context8.next = 13;
          return regeneratorRuntime.awrap(HoaDon.find({
            _id: {
              $in: kho.hoadon
            },
            date: {
              $gte: from,
              $lte: end
            }
          }));

        case 13:
          filteredHoadons = _context8.sent;
          _context8.next = 16;
          return regeneratorRuntime.awrap(Promise.all(filteredHoadons.map(function _callee7(hoadon) {
            var hd, khachhang, namenhnavien, nhanvienbanhang;
            return regeneratorRuntime.async(function _callee7$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    _context7.next = 2;
                    return regeneratorRuntime.awrap(HoaDon.findById(hoadon._id));

                  case 2:
                    hd = _context7.sent;
                    _context7.next = 5;
                    return regeneratorRuntime.awrap(KhachHang.findById(hd.khachhang));

                  case 5:
                    khachhang = _context7.sent;
                    namenhnavien = '';

                    if (!hd.nhanvienbanhang) {
                      _context7.next = 12;
                      break;
                    }

                    _context7.next = 10;
                    return regeneratorRuntime.awrap(User.findById(hd.nhanvienbanhang._id));

                  case 10:
                    nhanvienbanhang = _context7.sent;
                    namenhnavien = nhanvienbanhang.name;

                  case 12:
                    return _context7.abrupt("return", {
                      _id: hd._id,
                      mahd: hd.mahoadon,
                      date: moment(hd.date).format('DD/MM/YYYY - HH:mm'),
                      ghino: hd.ghino || false,
                      makh: khachhang.makh,
                      namekh: khachhang.name,
                      phone: khachhang.phone,
                      tongtien: hd.tongtien,
                      nhanvienbanhang: namenhnavien
                    });

                  case 13:
                  case "end":
                    return _context7.stop();
                }
              }
            });
          })));

        case 16:
          hoadonjson = _context8.sent;
          res.status(200).json(hoadonjson);
          _context8.next = 24;
          break;

        case 20:
          _context8.prev = 20;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 24:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 20]]);
});
router.get('/gethoadonchitiet/:idhoadon', function _callee10(req, res) {
  var idhoadon, hoadon, khachhang, nhanvienbanhang, sanphamjson, groupedSanpham, hoadonjson;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          idhoadon = req.params.idhoadon;
          _context10.next = 4;
          return regeneratorRuntime.awrap(HoaDon.findById(idhoadon));

        case 4:
          hoadon = _context10.sent;
          _context10.next = 7;
          return regeneratorRuntime.awrap(KhachHang.findById(hoadon.khachhang));

        case 7:
          khachhang = _context10.sent;
          _context10.next = 10;
          return regeneratorRuntime.awrap(User.findById(hoadon.nhanvienbanhang._id));

        case 10:
          nhanvienbanhang = _context10.sent;
          _context10.next = 13;
          return regeneratorRuntime.awrap(Promise.all(hoadon.sanpham.map(function _callee9(sanpham) {
            var sp, loaisanpham, dungluongsku, sku;
            return regeneratorRuntime.async(function _callee9$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    _context9.next = 2;
                    return regeneratorRuntime.awrap(SanPham.findById(sanpham.sp._id));

                  case 2:
                    sp = _context9.sent;
                    _context9.next = 5;
                    return regeneratorRuntime.awrap(LoaiSanPham.findById(sp.loaisanpham));

                  case 5:
                    loaisanpham = _context9.sent;
                    _context9.next = 8;
                    return regeneratorRuntime.awrap(DungLuong.findById(sp.dungluongsku));

                  case 8:
                    dungluongsku = _context9.sent;
                    _context9.next = 11;
                    return regeneratorRuntime.awrap(Sku.findById(dungluongsku.sku));

                  case 11:
                    sku = _context9.sent;
                    return _context9.abrupt("return", {
                      namesanpham: "".concat(sku.name, " (").concat(dungluongsku.name, ")"),
                      imel: sp.imel || '',
                      dongia: sanpham.dongia,
                      loaihanghoa: loaisanpham.loaihanghoa
                    });

                  case 13:
                  case "end":
                    return _context9.stop();
                }
              }
            });
          })));

        case 13:
          sanphamjson = _context10.sent;
          groupedSanpham = sanphamjson.reduce(function (acc, item) {
            var existingProduct = acc.find(function (sp) {
              return sp.namesanpham === item.namesanpham;
            });

            if (existingProduct) {
              existingProduct.details.push({
                imel: item.imel || '',
                dongia: item.dongia
              });
              existingProduct.tongdongia += item.dongia;
            } else {
              acc.push({
                namesanpham: item.namesanpham,
                loaihanghoa: item.loaihanghoa,
                details: [{
                  imel: item.imel || '',
                  dongia: item.dongia
                }],
                tongdongia: item.dongia
              });
            }

            return acc;
          }, []);
          hoadonjson = {
            mahd: hoadon.mahoadon,
            date: moment(hoadon.date).format('DD/MM/YYYY - HH:mm'),
            namekhachhang: khachhang.name,
            phone: khachhang.phone,
            ghino: hoadon.ghino,
            congno: hoadon.ghino || false,
            tongtien: hoadon.tongtien,
            sanpham: groupedSanpham,
            method: hoadon.method,
            nhanvienbanhang: nhanvienbanhang.name
          };
          res.json(hoadonjson);
          _context10.next = 23;
          break;

        case 19:
          _context10.prev = 19;
          _context10.t0 = _context10["catch"](0);
          console.error(_context10.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 23:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 19]]);
});
module.exports = router;
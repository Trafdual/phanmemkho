"use strict";

var router = require('express').Router();

var SanPham = require('../models/SanPhamModel');

var Depot = require('../models/DepotModel');

var DungLuongSku = require('../models/DungluongSkuModel');

var Sku = require('../models/SkuModel');

var User = require('../models/UserModel');

var HoaDon = require('../models/HoaDonModel');

var momenttimezone = require('moment-timezone');

var moment = require('moment');

var LoaiSanPham = require('../models/LoaiSanPhamModel');

var KhachHang = require('../models/KhachHangModel');

var LenhDieuChuyen = require('../models/LenhDieuChuyenModel');

var CongNo = require('../models/CongNoModel');

var NhomKhacHang = require('../models/NhomKhacHangModel');

router.get('/banhang/:idsku/:idkho/:userid', function _callee3(req, res) {
  var _req$params, idsku, idkho, userid, user, allKho, khoHienTai, cacKhoKhac, sku, dungluongskujson;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$params = req.params, idsku = _req$params.idsku, idkho = _req$params.idkho, userid = _req$params.userid;
          _context3.next = 4;
          return regeneratorRuntime.awrap(User.findById(userid).populate('depot'));

        case 4:
          user = _context3.sent;

          if (!(!user || !user.depot.length)) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: 'Người dùng không có kho nào.'
          }));

        case 7:
          allKho = user.depot;
          khoHienTai = allKho.find(function (kho) {
            return kho._id.toString() === idkho;
          });

          if (khoHienTai) {
            _context3.next = 11;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: 'Kho hiện tại không tồn tại.'
          }));

        case 11:
          cacKhoKhac = allKho.filter(function (kho) {
            return kho._id.toString() !== idkho;
          });
          _context3.next = 14;
          return regeneratorRuntime.awrap(Sku.findById(idsku));

        case 14:
          sku = _context3.sent;

          if (sku) {
            _context3.next = 17;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: 'SKU không tồn tại.'
          }));

        case 17:
          _context3.next = 19;
          return regeneratorRuntime.awrap(Promise.all(sku.dungluong.map(function _callee2(dungluong) {
            var dl, sku1, loaihanghoa, sanpham, filteredSanpham, tonkho, soluongTrongKhoHienTai, totalSoLuongCacKhoKhac, soLuongCacKhoKhac;
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return regeneratorRuntime.awrap(DungLuongSku.findById(dungluong._id));

                  case 2:
                    dl = _context2.sent;

                    if (dl) {
                      _context2.next = 5;
                      break;
                    }

                    return _context2.abrupt("return", null);

                  case 5:
                    _context2.next = 7;
                    return regeneratorRuntime.awrap(Sku.findById(dl.sku));

                  case 7:
                    sku1 = _context2.sent;
                    _context2.next = 10;
                    return regeneratorRuntime.awrap(Promise.all(dl.sanpham.map(function _callee(sp) {
                      var sp1, loaisanpham;
                      return regeneratorRuntime.async(function _callee$(_context) {
                        while (1) {
                          switch (_context.prev = _context.next) {
                            case 0:
                              _context.next = 2;
                              return regeneratorRuntime.awrap(SanPham.findById(sp._id));

                            case 2:
                              sp1 = _context.sent;
                              _context.next = 5;
                              return regeneratorRuntime.awrap(LoaiSanPham.findById(sp1.loaisanpham));

                            case 5:
                              loaisanpham = _context.sent;
                              loaihanghoa = loaisanpham.loaihanghoa;

                              if (!(sp1.xuat === false)) {
                                _context.next = 9;
                                break;
                              }

                              return _context.abrupt("return", {
                                _id: sp1._id,
                                name: sp1.name,
                                idsku: sp1._id,
                                masku: dl.madungluong,
                                price: sp1.price,
                                kho: sp1.kho.toString()
                              });

                            case 9:
                              return _context.abrupt("return", null);

                            case 10:
                            case "end":
                              return _context.stop();
                          }
                        }
                      });
                    })));

                  case 10:
                    sanpham = _context2.sent;
                    filteredSanpham = sanpham.filter(Boolean);
                    tonkho = filteredSanpham.reduce(function (acc, sp) {
                      acc[sp.kho] = (acc[sp.kho] || 0) + 1;
                      return acc;
                    }, {});
                    soluongTrongKhoHienTai = tonkho[idkho] || 0;
                    totalSoLuongCacKhoKhac = cacKhoKhac.reduce(function (acc, kho) {
                      acc += tonkho[kho._id.toString()] || 0;
                      return acc;
                    }, 0);
                    soLuongCacKhoKhac = cacKhoKhac.map(function (kho) {
                      return {
                        khoId: kho._id,
                        tenkho: kho.name,
                        soluong: tonkho[kho._id.toString()] || 0
                      };
                    });
                    return _context2.abrupt("return", {
                      masku: dl.madungluong,
                      idsku: dl._id,
                      name: dl.name,
                      loaihanghoa: loaihanghoa,
                      tenkhohientai: khoHienTai.name,
                      tensp: dl.name === '' ? sku1.name : "".concat(sku1.name, " (").concat(dl.name, ")"),
                      tonkho: soluongTrongKhoHienTai,
                      cacKhoKhac: soLuongCacKhoKhac,
                      tongSoLuongCacKhoKhac: totalSoLuongCacKhoKhac
                    });

                  case 17:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          })));

        case 19:
          dungluongskujson = _context3.sent;
          res.json(dungluongskujson.filter(Boolean));
          _context3.next = 27;
          break;

        case 23:
          _context3.prev = 23;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 27:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 23]]);
});
router.get('/banhangtest/:idsku/:idkho/:userid', function _callee6(req, res) {
  var _req$params2, idsku, idkho, userid, user, allKho, khoHienTai, cacKhoKhac, sku, dungluongskujson;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _req$params2 = req.params, idsku = _req$params2.idsku, idkho = _req$params2.idkho, userid = _req$params2.userid;
          _context6.next = 4;
          return regeneratorRuntime.awrap(User.findById(userid).populate('depot'));

        case 4:
          user = _context6.sent;

          if (!(!user || !user.depot.length)) {
            _context6.next = 7;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            message: 'Người dùng không có kho nào.'
          }));

        case 7:
          allKho = user.depot;
          khoHienTai = allKho.find(function (kho) {
            return kho._id.toString() === idkho;
          });

          if (khoHienTai) {
            _context6.next = 11;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            message: 'Kho hiện tại không tồn tại.'
          }));

        case 11:
          cacKhoKhac = allKho.filter(function (kho) {
            return kho._id.toString() !== idkho;
          });
          _context6.next = 14;
          return regeneratorRuntime.awrap(Sku.findById(idsku));

        case 14:
          sku = _context6.sent;

          if (sku) {
            _context6.next = 17;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            message: 'SKU không tồn tại.'
          }));

        case 17:
          _context6.next = 19;
          return regeneratorRuntime.awrap(Promise.all(sku.dungluong.map(function _callee5(dungluong) {
            var dl, sku1, loaihanghoa, sanphamLinhKien, filteredSanpham, tonkho, soluongTrongKhoHienTai, soLuongCacKhoKhac, totalSoLuongCacKhoKhac;
            return regeneratorRuntime.async(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    _context5.next = 2;
                    return regeneratorRuntime.awrap(DungLuongSku.findById(dungluong._id));

                  case 2:
                    dl = _context5.sent;

                    if (dl) {
                      _context5.next = 5;
                      break;
                    }

                    return _context5.abrupt("return", null);

                  case 5:
                    _context5.next = 7;
                    return regeneratorRuntime.awrap(Sku.findById(dl.sku));

                  case 7:
                    sku1 = _context5.sent;
                    _context5.next = 10;
                    return regeneratorRuntime.awrap(Promise.all(dl.sanpham.map(function _callee4(sp) {
                      var sp1, loaisanpham;
                      return regeneratorRuntime.async(function _callee4$(_context4) {
                        while (1) {
                          switch (_context4.prev = _context4.next) {
                            case 0:
                              _context4.next = 2;
                              return regeneratorRuntime.awrap(SanPham.findById(sp._id));

                            case 2:
                              sp1 = _context4.sent;
                              _context4.next = 5;
                              return regeneratorRuntime.awrap(LoaiSanPham.findById(sp1.loaisanpham));

                            case 5:
                              loaisanpham = _context4.sent;
                              loaihanghoa = loaisanpham.loaihanghoa;

                              if (!(!sp1 || !loaisanpham)) {
                                _context4.next = 9;
                                break;
                              }

                              return _context4.abrupt("return", null);

                            case 9:
                              if (!(sp1.xuat === false && loaisanpham.loaihanghoa === 'Linh kiện')) {
                                _context4.next = 11;
                                break;
                              }

                              return _context4.abrupt("return", {
                                _id: sp1._id,
                                name: sp1.name,
                                masku: dl.madungluong,
                                price: sp1.price,
                                kho: sp1.kho.toString()
                              });

                            case 11:
                              return _context4.abrupt("return", null);

                            case 12:
                            case "end":
                              return _context4.stop();
                          }
                        }
                      });
                    })));

                  case 10:
                    sanphamLinhKien = _context5.sent;
                    filteredSanpham = sanphamLinhKien.filter(Boolean);

                    if (!(filteredSanpham.length === 0)) {
                      _context5.next = 14;
                      break;
                    }

                    return _context5.abrupt("return", null);

                  case 14:
                    tonkho = filteredSanpham.reduce(function (acc, sp) {
                      acc[sp.kho] = (acc[sp.kho] || 0) + 1;
                      return acc;
                    }, {});
                    soluongTrongKhoHienTai = tonkho[idkho] || 0;
                    soLuongCacKhoKhac = cacKhoKhac.map(function (kho) {
                      return {
                        khoId: kho._id,
                        tenkho: kho.name,
                        soluong: tonkho[kho._id.toString()] || 0
                      };
                    });
                    totalSoLuongCacKhoKhac = soLuongCacKhoKhac.reduce(function (acc, kho) {
                      return acc + kho.soluong;
                    }, 0);
                    return _context5.abrupt("return", {
                      idsku: dl._id,
                      name: dl.name,
                      tenkhohientai: khoHienTai.name,
                      loaihanghoa: loaihanghoa,
                      tensp: dl.name === '' ? sku1.name : "".concat(sku1.name, " (").concat(dl.name, ")"),
                      tonkho: soluongTrongKhoHienTai,
                      cacKhoKhac: soLuongCacKhoKhac,
                      tongSoLuongCacKhoKhac: totalSoLuongCacKhoKhac
                    });

                  case 19:
                  case "end":
                    return _context5.stop();
                }
              }
            });
          })));

        case 19:
          dungluongskujson = _context6.sent;
          res.json(dungluongskujson.filter(Boolean));
          _context6.next = 27;
          break;

        case 23:
          _context6.prev = 23;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 27:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 23]]);
});
router.get('/getspbanhang/:iduser', function _callee8(req, res) {
  var iduser, user, skujson;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          iduser = req.params.iduser;
          _context8.next = 4;
          return regeneratorRuntime.awrap(User.findById(iduser));

        case 4:
          user = _context8.sent;
          _context8.next = 7;
          return regeneratorRuntime.awrap(Promise.all(user.sku.map(function _callee7(sku) {
            var sku1;
            return regeneratorRuntime.async(function _callee7$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    _context7.next = 2;
                    return regeneratorRuntime.awrap(Sku.findById(sku._id));

                  case 2:
                    sku1 = _context7.sent;
                    return _context7.abrupt("return", {
                      _id: sku1._id,
                      name: sku1.name
                    });

                  case 4:
                  case "end":
                    return _context7.stop();
                }
              }
            });
          })));

        case 7:
          skujson = _context8.sent;
          res.json(skujson);
          _context8.next = 15;
          break;

        case 11:
          _context8.prev = 11;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 15:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 11]]);
});
router.post('/postchonsanpham/:idkho', function _callee11(req, res) {
  var _req$body, products, idnganhang, method, makh, datcoc, tienkhachtra, ghino, idkho, depot, khachhang, nhomkhachhang, hoadon, processedDepots, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, sanpham, groupedSanpham, result, congno, hoadonjson;

  return regeneratorRuntime.async(function _callee11$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          _req$body = req.body, products = _req$body.products, idnganhang = _req$body.idnganhang, method = _req$body.method, makh = _req$body.makh, datcoc = _req$body.datcoc, tienkhachtra = _req$body.tienkhachtra, ghino = _req$body.ghino;
          idkho = req.params.idkho;
          _context14.next = 5;
          return regeneratorRuntime.awrap(Depot.findById(idkho));

        case 5:
          depot = _context14.sent;
          _context14.next = 8;
          return regeneratorRuntime.awrap(KhachHang.findOne({
            makh: makh
          }));

        case 8:
          khachhang = _context14.sent;
          _context14.next = 11;
          return regeneratorRuntime.awrap(NhomKhacHang.findById(khachhang.nhomkhachhang));

        case 11:
          nhomkhachhang = _context14.sent;

          if (khachhang) {
            _context14.next = 14;
            break;
          }

          return _context14.abrupt("return", res.status(404).json({
            message: 'Khách hàng không tồn tại.'
          }));

        case 14:
          hoadon = new HoaDon({
            date: momenttimezone().toDate(),
            method: method,
            khachhang: khachhang._id,
            tongtien: 0
          });

          if (method === 'chuyển khoản') {
            hoadon.nganhang = idnganhang;
          }

          processedDepots = new Set();
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context14.prev = 20;

          _loop = function _loop() {
            var product, dongia, imelist, soluong, idsku, _sanpham, sortedSanpham, selectedSanpham, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _loop2, _iterator2, _step2, _ret, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _loop3, _iterator3, _step3, _ret2;

            return regeneratorRuntime.async(function _loop$(_context13) {
              while (1) {
                switch (_context13.prev = _context13.next) {
                  case 0:
                    product = _step.value;
                    dongia = product.dongia, imelist = product.imelist, soluong = product.soluong, idsku = product.idsku;
                    hoadon.tongtien += dongia;

                    if (!(!imelist || !Array.isArray(imelist))) {
                      _context13.next = 40;
                      break;
                    }

                    _context13.next = 6;
                    return regeneratorRuntime.awrap(Promise.all(depot.sanpham.map(function _callee10(sp) {
                      var sp1;
                      return regeneratorRuntime.async(function _callee10$(_context10) {
                        while (1) {
                          switch (_context10.prev = _context10.next) {
                            case 0:
                              _context10.next = 2;
                              return regeneratorRuntime.awrap(SanPham.findById(sp._id));

                            case 2:
                              sp1 = _context10.sent;

                              if (!(sp1.dungluongsku.toString() === idsku.toString())) {
                                _context10.next = 5;
                                break;
                              }

                              return _context10.abrupt("return", sp1);

                            case 5:
                            case "end":
                              return _context10.stop();
                          }
                        }
                      });
                    })));

                  case 6:
                    _sanpham = _context13.sent;
                    sortedSanpham = _sanpham.filter(function (sp) {
                      return sp !== undefined;
                    }).sort(function (a, b) {
                      return a._id > b._id ? 1 : -1;
                    });
                    selectedSanpham = sortedSanpham.slice(0, soluong);
                    _iteratorNormalCompletion2 = true;
                    _didIteratorError2 = false;
                    _iteratorError2 = undefined;
                    _context13.prev = 12;

                    _loop2 = function _loop2() {
                      var sp, loaisanpham, kho;
                      return regeneratorRuntime.async(function _loop2$(_context11) {
                        while (1) {
                          switch (_context11.prev = _context11.next) {
                            case 0:
                              sp = _step2.value;
                              _context11.next = 3;
                              return regeneratorRuntime.awrap(LoaiSanPham.findById(sp.loaisanpham));

                            case 3:
                              loaisanpham = _context11.sent;

                              if (loaisanpham) {
                                _context11.next = 6;
                                break;
                              }

                              return _context11.abrupt("return", "continue");

                            case 6:
                              _context11.next = 8;
                              return regeneratorRuntime.awrap(Depot.findById(loaisanpham.depot));

                            case 8:
                              kho = _context11.sent;

                              if (kho) {
                                _context11.next = 11;
                                break;
                              }

                              return _context11.abrupt("return", "continue");

                            case 11:
                              loaisanpham.sanpham = loaisanpham.sanpham.filter(function (spItem) {
                                return spItem._id.toString() !== sp._id.toString();
                              });
                              hoadon.sanpham.push({
                                sp: sp._id,
                                dongia: dongia
                              });
                              sp.xuat = true;
                              sp.datexuat = momenttimezone().toDate();
                              kho.xuatkho.push(sp._id);

                              if (!processedDepots.has(kho._id.toString())) {
                                kho.hoadon.push(hoadon._id);
                                processedDepots.add(kho._id.toString());
                              }

                              _context11.next = 19;
                              return regeneratorRuntime.awrap(kho.save());

                            case 19:
                              _context11.next = 21;
                              return regeneratorRuntime.awrap(loaisanpham.save());

                            case 21:
                              _context11.next = 23;
                              return regeneratorRuntime.awrap(sp.save());

                            case 23:
                            case "end":
                              return _context11.stop();
                          }
                        }
                      });
                    };

                    _iterator2 = selectedSanpham[Symbol.iterator]();

                  case 15:
                    if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                      _context13.next = 24;
                      break;
                    }

                    _context13.next = 18;
                    return regeneratorRuntime.awrap(_loop2());

                  case 18:
                    _ret = _context13.sent;

                    if (!(_ret === "continue")) {
                      _context13.next = 21;
                      break;
                    }

                    return _context13.abrupt("continue", 21);

                  case 21:
                    _iteratorNormalCompletion2 = true;
                    _context13.next = 15;
                    break;

                  case 24:
                    _context13.next = 30;
                    break;

                  case 26:
                    _context13.prev = 26;
                    _context13.t0 = _context13["catch"](12);
                    _didIteratorError2 = true;
                    _iteratorError2 = _context13.t0;

                  case 30:
                    _context13.prev = 30;
                    _context13.prev = 31;

                    if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                      _iterator2["return"]();
                    }

                  case 33:
                    _context13.prev = 33;

                    if (!_didIteratorError2) {
                      _context13.next = 36;
                      break;
                    }

                    throw _iteratorError2;

                  case 36:
                    return _context13.finish(33);

                  case 37:
                    return _context13.finish(30);

                  case 38:
                    _context13.next = 69;
                    break;

                  case 40:
                    _iteratorNormalCompletion3 = true;
                    _didIteratorError3 = false;
                    _iteratorError3 = undefined;
                    _context13.prev = 43;

                    _loop3 = function _loop3() {
                      var imel, sanpham, loaisanpham, kho;
                      return regeneratorRuntime.async(function _loop3$(_context12) {
                        while (1) {
                          switch (_context12.prev = _context12.next) {
                            case 0:
                              imel = _step3.value;
                              _context12.next = 3;
                              return regeneratorRuntime.awrap(SanPham.findOne({
                                imel: imel
                              }));

                            case 3:
                              sanpham = _context12.sent;

                              if (sanpham) {
                                _context12.next = 6;
                                break;
                              }

                              return _context12.abrupt("return", "continue");

                            case 6:
                              _context12.next = 8;
                              return regeneratorRuntime.awrap(LoaiSanPham.findById(sanpham.loaisanpham));

                            case 8:
                              loaisanpham = _context12.sent;

                              if (loaisanpham) {
                                _context12.next = 11;
                                break;
                              }

                              return _context12.abrupt("return", "continue");

                            case 11:
                              _context12.next = 13;
                              return regeneratorRuntime.awrap(Depot.findById(loaisanpham.depot));

                            case 13:
                              kho = _context12.sent;

                              if (kho) {
                                _context12.next = 16;
                                break;
                              }

                              return _context12.abrupt("return", "continue");

                            case 16:
                              loaisanpham.sanpham = loaisanpham.sanpham.filter(function (sp) {
                                return sp._id.toString() !== sanpham._id.toString();
                              });
                              hoadon.sanpham.push({
                                sp: sanpham._id,
                                dongia: dongia
                              });
                              sanpham.xuat = true;
                              sanpham.datexuat = momenttimezone().toDate();
                              kho.xuatkho.push(sanpham._id);

                              if (!processedDepots.has(kho._id.toString())) {
                                kho.hoadon.push(hoadon._id);
                                processedDepots.add(kho._id.toString());
                              }

                              _context12.next = 24;
                              return regeneratorRuntime.awrap(kho.save());

                            case 24:
                              _context12.next = 26;
                              return regeneratorRuntime.awrap(loaisanpham.save());

                            case 26:
                              _context12.next = 28;
                              return regeneratorRuntime.awrap(sanpham.save());

                            case 28:
                            case "end":
                              return _context12.stop();
                          }
                        }
                      });
                    };

                    _iterator3 = imelist[Symbol.iterator]();

                  case 46:
                    if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                      _context13.next = 55;
                      break;
                    }

                    _context13.next = 49;
                    return regeneratorRuntime.awrap(_loop3());

                  case 49:
                    _ret2 = _context13.sent;

                    if (!(_ret2 === "continue")) {
                      _context13.next = 52;
                      break;
                    }

                    return _context13.abrupt("continue", 52);

                  case 52:
                    _iteratorNormalCompletion3 = true;
                    _context13.next = 46;
                    break;

                  case 55:
                    _context13.next = 61;
                    break;

                  case 57:
                    _context13.prev = 57;
                    _context13.t1 = _context13["catch"](43);
                    _didIteratorError3 = true;
                    _iteratorError3 = _context13.t1;

                  case 61:
                    _context13.prev = 61;
                    _context13.prev = 62;

                    if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
                      _iterator3["return"]();
                    }

                  case 64:
                    _context13.prev = 64;

                    if (!_didIteratorError3) {
                      _context13.next = 67;
                      break;
                    }

                    throw _iteratorError3;

                  case 67:
                    return _context13.finish(64);

                  case 68:
                    return _context13.finish(61);

                  case 69:
                  case "end":
                    return _context13.stop();
                }
              }
            }, null, null, [[12, 26, 30, 38], [31,, 33, 37], [43, 57, 61, 69], [62,, 64, 68]]);
          };

          _iterator = products[Symbol.iterator]();

        case 23:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context14.next = 29;
            break;
          }

          _context14.next = 26;
          return regeneratorRuntime.awrap(_loop());

        case 26:
          _iteratorNormalCompletion = true;
          _context14.next = 23;
          break;

        case 29:
          _context14.next = 35;
          break;

        case 31:
          _context14.prev = 31;
          _context14.t0 = _context14["catch"](20);
          _didIteratorError = true;
          _iteratorError = _context14.t0;

        case 35:
          _context14.prev = 35;
          _context14.prev = 36;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 38:
          _context14.prev = 38;

          if (!_didIteratorError) {
            _context14.next = 41;
            break;
          }

          throw _iteratorError;

        case 41:
          return _context14.finish(38);

        case 42:
          return _context14.finish(35);

        case 43:
          hoadon.mahoadon = 'HD' + hoadon._id.toString().slice(-4);
          hoadon.soluong = hoadon.sanpham.length;
          hoadon.datcoc = datcoc;
          hoadon.tienkhachtra = tienkhachtra;
          hoadon.tientralaikhach = hoadon.tienkhachtra - hoadon.tongtien;
          khachhang.donhang.push(hoadon._id);
          _context14.next = 51;
          return regeneratorRuntime.awrap(hoadon.save());

        case 51:
          _context14.next = 53;
          return regeneratorRuntime.awrap(khachhang.save());

        case 53:
          _context14.next = 55;
          return regeneratorRuntime.awrap(Promise.all(hoadon.sanpham.map(function _callee9(sp) {
            var sp1, dungluong;
            return regeneratorRuntime.async(function _callee9$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    _context9.next = 2;
                    return regeneratorRuntime.awrap(SanPham.findById(sp.sp._id));

                  case 2:
                    sp1 = _context9.sent;
                    _context9.next = 5;
                    return regeneratorRuntime.awrap(DungLuongSku.findById(sp1.dungluongsku));

                  case 5:
                    dungluong = _context9.sent;
                    return _context9.abrupt("return", {
                      tensanpham: sp1.name,
                      madungluong: dungluong.madungluong,
                      dongia: sp.dongia
                    });

                  case 7:
                  case "end":
                    return _context9.stop();
                }
              }
            });
          })));

        case 55:
          sanpham = _context14.sent;
          groupedSanpham = sanpham.reduce(function (acc, item) {
            var key = item.tensanpham;

            if (!acc[key]) {
              acc[key] = {
                tensanpham: item.tensanpham,
                soluong: 0,
                dongia: item.dongia,
                thanhtien: 0
              };
            }

            acc[key].soluong += 1;
            acc[key].thanhtien = acc[key].dongia * acc[key].soluong;
            return acc;
          }, {});
          result = Object.values(groupedSanpham);

          if (!(ghino === true)) {
            _context14.next = 74;
            break;
          }

          hoadon.ghino = true;
          congno = new CongNo({
            khachhang: khachhang._id,
            tongtien: hoadon.tongtien,
            date: momenttimezone().toDate(),
            depot: depot._id
          });
          nhomkhachhang.congno.push(congno);
          khachhang.congno.push(congno._id);
          depot.congno.push(congno._id);
          _context14.next = 66;
          return regeneratorRuntime.awrap(congno.save());

        case 66:
          _context14.next = 68;
          return regeneratorRuntime.awrap(hoadon.save());

        case 68:
          _context14.next = 70;
          return regeneratorRuntime.awrap(depot.save());

        case 70:
          _context14.next = 72;
          return regeneratorRuntime.awrap(khachhang.save());

        case 72:
          _context14.next = 74;
          return regeneratorRuntime.awrap(nhomkhachhang.save());

        case 74:
          hoadonjson = {
            mahoadon: hoadon.mahoadon,
            makh: makh,
            tenkhach: khachhang.name,
            phone: khachhang.phone,
            address: khachhang.address,
            date: moment(hoadon.date).format('DD/MM/YYYY HH:mm:ss'),
            method: hoadon.method,
            tongtien: hoadon.tongtien,
            datcoc: hoadon.datcoc,
            tienkhachtra: hoadon.tienkhachtra,
            tientralaikhach: hoadon.tientralaikhach,
            sanpham: result
          };
          res.json(hoadonjson);
          _context14.next = 82;
          break;

        case 78:
          _context14.prev = 78;
          _context14.t1 = _context14["catch"](0);
          console.error(_context14.t1);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 82:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[0, 78], [20, 31, 35, 43], [36,, 38, 42]]);
});
router.get('/getsanphamchon/:idkho/:idsku', function _callee13(req, res) {
  var idkho, idsku, kho, sanphamjson, filteredSanpham;
  return regeneratorRuntime.async(function _callee13$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          _context16.prev = 0;
          idkho = req.params.idkho;
          idsku = req.params.idsku;
          _context16.next = 5;
          return regeneratorRuntime.awrap(Depot.findById(idkho));

        case 5:
          kho = _context16.sent;
          _context16.next = 8;
          return regeneratorRuntime.awrap(Promise.all(kho.sanpham.map(function _callee12(sp) {
            var sp1;
            return regeneratorRuntime.async(function _callee12$(_context15) {
              while (1) {
                switch (_context15.prev = _context15.next) {
                  case 0:
                    _context15.next = 2;
                    return regeneratorRuntime.awrap(SanPham.findById(sp._id));

                  case 2:
                    sp1 = _context15.sent;

                    if (!(sp1.dungluongsku.toString() === idsku.toString() && sp1.xuat === false)) {
                      _context15.next = 5;
                      break;
                    }

                    return _context15.abrupt("return", {
                      _id: sp1._id,
                      imel: sp1.imel
                    });

                  case 5:
                    return _context15.abrupt("return", null);

                  case 6:
                  case "end":
                    return _context15.stop();
                }
              }
            });
          })));

        case 8:
          sanphamjson = _context16.sent;
          filteredSanpham = sanphamjson.filter(Boolean);
          res.json(filteredSanpham);
          _context16.next = 17;
          break;

        case 13:
          _context16.prev = 13;
          _context16.t0 = _context16["catch"](0);
          console.error(_context16.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 17:
        case "end":
          return _context16.stop();
      }
    }
  }, null, null, [[0, 13]]);
});
router.post('/postyeucaudc/:idkho', function _callee14(req, res) {
  var idkho, _req$body2, idsku, soluong, tenkhochuyen, lido, khonhan, khochuyen, dungluongsku, sku, tensanpham, lenhdc, malenhdc;

  return regeneratorRuntime.async(function _callee14$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          _context17.prev = 0;
          idkho = req.params.idkho;
          _req$body2 = req.body, idsku = _req$body2.idsku, soluong = _req$body2.soluong, tenkhochuyen = _req$body2.tenkhochuyen, lido = _req$body2.lido;
          _context17.next = 5;
          return regeneratorRuntime.awrap(Depot.findById(idkho));

        case 5:
          khonhan = _context17.sent;
          _context17.next = 8;
          return regeneratorRuntime.awrap(Depot.findOne({
            name: tenkhochuyen
          }));

        case 8:
          khochuyen = _context17.sent;
          _context17.next = 11;
          return regeneratorRuntime.awrap(DungLuongSku.findById(idsku));

        case 11:
          dungluongsku = _context17.sent;
          _context17.next = 14;
          return regeneratorRuntime.awrap(Sku.findById(dungluongsku.sku));

        case 14:
          sku = _context17.sent;
          tensanpham = dungluongsku.name === '' ? sku.name : "".concat(sku.name, " (").concat(dungluongsku.name, ")");
          lenhdc = new LenhDieuChuyen({
            khonhan: khonhan._id,
            khochuyen: khochuyen._id,
            soluong: soluong,
            lido: lido,
            sku: dungluongsku._id,
            tensanpham: tensanpham,
            date: momenttimezone().toDate()
          });
          malenhdc = 'LDC' + lenhdc._id.toString().slice(-4);
          lenhdc.malenhdc = malenhdc;
          khochuyen.lenhdieuchuyen.push(lenhdc._id);
          _context17.next = 22;
          return regeneratorRuntime.awrap(lenhdc.save());

        case 22:
          _context17.next = 24;
          return regeneratorRuntime.awrap(khochuyen.save());

        case 24:
          res.json(lenhdc);
          _context17.next = 31;
          break;

        case 27:
          _context17.prev = 27;
          _context17.t0 = _context17["catch"](0);
          console.error(_context17.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 31:
        case "end":
          return _context17.stop();
      }
    }
  }, null, null, [[0, 27]]);
});
router.get('/getlenhdieuchuyen/:idkho', function _callee16(req, res) {
  var idkho, kho, lenhdieuchuyen, filteredLenhdieuchuyen;
  return regeneratorRuntime.async(function _callee16$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          _context19.prev = 0;
          idkho = req.params.idkho;
          _context19.next = 4;
          return regeneratorRuntime.awrap(Depot.findById(idkho));

        case 4:
          kho = _context19.sent;
          _context19.next = 7;
          return regeneratorRuntime.awrap(Promise.all(kho.lenhdieuchuyen.map(function _callee15(lenhdc) {
            var lenhdc1, khochuyen, khonhan, dungluongsku;
            return regeneratorRuntime.async(function _callee15$(_context18) {
              while (1) {
                switch (_context18.prev = _context18.next) {
                  case 0:
                    _context18.next = 2;
                    return regeneratorRuntime.awrap(LenhDieuChuyen.findById(lenhdc._id));

                  case 2:
                    lenhdc1 = _context18.sent;
                    _context18.next = 5;
                    return regeneratorRuntime.awrap(Depot.findById(lenhdc1.khochuyen));

                  case 5:
                    khochuyen = _context18.sent;
                    _context18.next = 8;
                    return regeneratorRuntime.awrap(Depot.findById(lenhdc1.khonhan));

                  case 8:
                    khonhan = _context18.sent;
                    _context18.next = 11;
                    return regeneratorRuntime.awrap(DungLuongSku.findById(lenhdc1.sku));

                  case 11:
                    dungluongsku = _context18.sent;

                    if (!(lenhdc1.duyet === false)) {
                      _context18.next = 14;
                      break;
                    }

                    return _context18.abrupt("return", {
                      _id: lenhdc1._id,
                      malenhdc: lenhdc1.malenhdc,
                      tensanpham: lenhdc1.tensanpham,
                      khochuyen: khochuyen.name,
                      khonhan: khonhan.name,
                      lido: lenhdc1.lido,
                      sku: dungluongsku.madungluong,
                      soluong: lenhdc1.soluong,
                      date: moment(lenhdc1.date).format('DD/MM/YYYY HH:mm:ss'),
                      duyet: lenhdc1.duyet
                    });

                  case 14:
                    return _context18.abrupt("return", null);

                  case 15:
                  case "end":
                    return _context18.stop();
                }
              }
            });
          })));

        case 7:
          lenhdieuchuyen = _context19.sent;
          filteredLenhdieuchuyen = lenhdieuchuyen.filter(function (item) {
            return item !== null;
          });
          res.json(filteredLenhdieuchuyen);
          _context19.next = 16;
          break;

        case 12:
          _context19.prev = 12;
          _context19.t0 = _context19["catch"](0);
          console.error(_context19.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 16:
        case "end":
          return _context19.stop();
      }
    }
  }, null, null, [[0, 12]]);
}); // router.post('/huylenhdieuchuyen/:idlenhdieuchuyen',async(req,res)=>{
//   try {
//     const idlenhdieuchuyen = req.params.idlenhdieuchuyen
//     const lenhdc = await LenhDieuChuyen.findById(idlenhdieuchuyen)
//     lenhdc.
//   } catch (error) {
//   }
// })

router.post('/duyetdieuchuyen/:idlenh', function _callee17(req, res) {
  var idlenh, lenhdc;
  return regeneratorRuntime.async(function _callee17$(_context20) {
    while (1) {
      switch (_context20.prev = _context20.next) {
        case 0:
          _context20.prev = 0;
          idlenh = req.params.idlenh;
          _context20.next = 4;
          return regeneratorRuntime.awrap(LenhDieuChuyen.findById(idlenh));

        case 4:
          lenhdc = _context20.sent;
          lenhdc.duyet = true;
          _context20.next = 8;
          return regeneratorRuntime.awrap(lenhdc.save());

        case 8:
          res.json(lenhdc);
          _context20.next = 15;
          break;

        case 11:
          _context20.prev = 11;
          _context20.t0 = _context20["catch"](0);
          console.error(_context20.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 15:
        case "end":
          return _context20.stop();
      }
    }
  }, null, null, [[0, 11]]);
});
router.post('/huydieuchuyen/:idlenh', function _callee18(req, res) {
  var idlenh;
  return regeneratorRuntime.async(function _callee18$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          _context21.prev = 0;
          idlenh = req.params.idlenh;
          _context21.next = 4;
          return regeneratorRuntime.awrap(LenhDieuChuyen.findByIdAndDelete(idlenh));

        case 4:
          res.json({
            message: 'Hủy thành công'
          });
          _context21.next = 11;
          break;

        case 7:
          _context21.prev = 7;
          _context21.t0 = _context21["catch"](0);
          console.error(_context21.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 11:
        case "end":
          return _context21.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
router.get('/getlenhdctheongay/:idkho', function _callee20(req, res) {
  var idkho, begintime, endtime, onlyDate, begintimeOnly, endtimeOnly, kho, lenhdieuchuyenjson, filteredLenhdieuchuyen;
  return regeneratorRuntime.async(function _callee20$(_context23) {
    while (1) {
      switch (_context23.prev = _context23.next) {
        case 0:
          _context23.prev = 0;
          idkho = req.params.idkho;
          begintime = new Date(req.query.begintime);
          endtime = new Date(req.query.endtime);

          if (!(!idkho || isNaN(begintime) || isNaN(endtime))) {
            _context23.next = 6;
            break;
          }

          return _context23.abrupt("return", res.status(400).json({
            error: 'Thiếu thông tin idkho hoặc khoảng thời gian không hợp lệ.'
          }));

        case 6:
          onlyDate = function onlyDate(date) {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
          };

          begintimeOnly = onlyDate(begintime);
          endtimeOnly = onlyDate(endtime); // Tìm kho theo idkho

          _context23.next = 11;
          return regeneratorRuntime.awrap(Depot.findById(idkho));

        case 11:
          kho = _context23.sent;

          if (kho) {
            _context23.next = 14;
            break;
          }

          return _context23.abrupt("return", res.status(404).json({
            error: 'Không tìm thấy kho.'
          }));

        case 14:
          _context23.next = 16;
          return regeneratorRuntime.awrap(Promise.all(kho.lenhdieuchuyen.map(function _callee19(lenhdc) {
            var lenh, khochuyen, khonhan, dungluongsku, lenhDateOnly;
            return regeneratorRuntime.async(function _callee19$(_context22) {
              while (1) {
                switch (_context22.prev = _context22.next) {
                  case 0:
                    _context22.next = 2;
                    return regeneratorRuntime.awrap(LenhDieuChuyen.findById(lenhdc._id));

                  case 2:
                    lenh = _context22.sent;
                    _context22.next = 5;
                    return regeneratorRuntime.awrap(Depot.findById(lenh.khochuyen));

                  case 5:
                    khochuyen = _context22.sent;
                    _context22.next = 8;
                    return regeneratorRuntime.awrap(Depot.findById(lenh.khonhan));

                  case 8:
                    khonhan = _context22.sent;
                    _context22.next = 11;
                    return regeneratorRuntime.awrap(DungLuongSku.findById(lenh.sku));

                  case 11:
                    dungluongsku = _context22.sent;
                    lenhDateOnly = onlyDate(new Date(lenh.date));

                    if (!(lenhDateOnly >= begintimeOnly && lenhDateOnly <= endtimeOnly)) {
                      _context22.next = 15;
                      break;
                    }

                    return _context22.abrupt("return", {
                      _id: lenh._id,
                      malenhdc: lenh.malenhdc,
                      tensanpham: lenh.tensanpham,
                      khochuyen: khochuyen.name,
                      khonhan: khonhan.name,
                      lido: lenh.lido,
                      sku: dungluongsku.madungluong,
                      soluong: lenh.soluong,
                      date: moment(lenh.date).format('DD/MM/YYYY HH:mm:ss'),
                      duyet: lenh.duyet
                    });

                  case 15:
                    return _context22.abrupt("return", null);

                  case 16:
                  case "end":
                    return _context22.stop();
                }
              }
            });
          })));

        case 16:
          lenhdieuchuyenjson = _context23.sent;
          filteredLenhdieuchuyen = lenhdieuchuyenjson.filter(function (item) {
            return item !== null;
          });
          return _context23.abrupt("return", res.status(200).json(filteredLenhdieuchuyen));

        case 21:
          _context23.prev = 21;
          _context23.t0 = _context23["catch"](0);
          console.error('Lỗi khi lấy lệnh điều chuyển:', _context23.t0);
          return _context23.abrupt("return", res.status(500).json({
            error: 'Có lỗi xảy ra, vui lòng thử lại sau.'
          }));

        case 25:
        case "end":
          return _context23.stop();
      }
    }
  }, null, null, [[0, 21]]);
});
router.get('/soluonglenhchuaduyet/:idkho', function _callee22(req, res) {
  var idkho, kho, lenhdieuchuyen, filteredLenhdieuchuyen, soluonglenh;
  return regeneratorRuntime.async(function _callee22$(_context25) {
    while (1) {
      switch (_context25.prev = _context25.next) {
        case 0:
          _context25.prev = 0;
          idkho = req.params.idkho;
          _context25.next = 4;
          return regeneratorRuntime.awrap(Depot.findById(idkho));

        case 4:
          kho = _context25.sent;
          _context25.next = 7;
          return regeneratorRuntime.awrap(Promise.all(kho.lenhdieuchuyen.map(function _callee21(lenhdc) {
            var lenhdc1;
            return regeneratorRuntime.async(function _callee21$(_context24) {
              while (1) {
                switch (_context24.prev = _context24.next) {
                  case 0:
                    _context24.next = 2;
                    return regeneratorRuntime.awrap(LenhDieuChuyen.findById(lenhdc._id));

                  case 2:
                    lenhdc1 = _context24.sent;

                    if (!(lenhdc1.duyet === false)) {
                      _context24.next = 5;
                      break;
                    }

                    return _context24.abrupt("return", lenhdc1);

                  case 5:
                    return _context24.abrupt("return", null);

                  case 6:
                  case "end":
                    return _context24.stop();
                }
              }
            });
          })));

        case 7:
          lenhdieuchuyen = _context25.sent;
          filteredLenhdieuchuyen = lenhdieuchuyen.filter(function (item) {
            return item !== null;
          });
          soluonglenh = filteredLenhdieuchuyen.length;
          res.json({
            soluonglenh: soluonglenh
          });
          _context25.next = 17;
          break;

        case 13:
          _context25.prev = 13;
          _context25.t0 = _context25["catch"](0);
          console.error('Lỗi khi lấy lệnh điều chuyển:', _context25.t0);
          return _context25.abrupt("return", res.status(500).json({
            error: 'Có lỗi xảy ra, vui lòng thử lại sau.'
          }));

        case 17:
        case "end":
          return _context25.stop();
      }
    }
  }, null, null, [[0, 13]]);
});
module.exports = router;
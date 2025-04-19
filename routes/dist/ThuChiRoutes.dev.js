"use strict";

var router = require('express').Router();

var Depot = require('../models/DepotModel');

var ThuChi = require('../models/ThuChiModel');

var MucThuChi = require('../models/MucThuChiModel');

var LoaiChungTu = require('../models/LoaiChungTuModel');

var NhaCungCap = require('../models/NhanCungCapModel');

var KhachHang = require('../models/KhachHangModel');

var moment = require('moment');

router.get('/getthuchitienmat/:depotid', function _callee2(req, res) {
  var depotid, depot, thuchi, filteredThuChi;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          depotid = req.params.depotid;
          _context2.next = 4;
          return regeneratorRuntime.awrap(Depot.findById(depotid));

        case 4:
          depot = _context2.sent;
          _context2.next = 7;
          return regeneratorRuntime.awrap(Promise.all(depot.thuchi.map(function _callee(tc) {
            var thuchitien, doituong, loaichungtu;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return regeneratorRuntime.awrap(ThuChi.findById(tc._id));

                  case 2:
                    thuchitien = _context.sent;
                    _context.next = 5;
                    return regeneratorRuntime.awrap(NhaCungCap.findById(thuchitien.doituong));

                  case 5:
                    doituong = _context.sent;

                    if (doituong) {
                      _context.next = 10;
                      break;
                    }

                    _context.next = 9;
                    return regeneratorRuntime.awrap(KhachHang.findById(thuchitien.doituong));

                  case 9:
                    doituong = _context.sent;

                  case 10:
                    _context.next = 12;
                    return regeneratorRuntime.awrap(LoaiChungTu.findById(thuchitien.loaichungtu));

                  case 12:
                    loaichungtu = _context.sent;

                    if (!(thuchitien.method === 'Tiền mặt')) {
                      _context.next = 15;
                      break;
                    }

                    return _context.abrupt("return", {
                      _id: thuchitien._id,
                      mathuchi: thuchitien.mathuchi,
                      date: moment(thuchitien.date).format('DD/MM/YYYY'),
                      loaichungtu: "".concat(loaichungtu.name, " - ").concat(loaichungtu.method),
                      tongtien: thuchitien.tongtien,
                      doituong: doituong.name || '',
                      lydo: thuchitien.lydo,
                      method: thuchitien.method,
                      loaitien: thuchitien.loaitien
                    });

                  case 15:
                    return _context.abrupt("return", null);

                  case 16:
                  case "end":
                    return _context.stop();
                }
              }
            });
          })));

        case 7:
          thuchi = _context2.sent;
          filteredThuChi = thuchi.filter(function (item) {
            return item !== null;
          });
          res.json(filteredThuChi);
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
router.get('/getthuchichuyenkhoan/:depotid', function _callee4(req, res) {
  var depotid, depot, thuchi, filteredThuChi;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          depotid = req.params.depotid;
          _context4.next = 4;
          return regeneratorRuntime.awrap(Depot.findById(depotid));

        case 4:
          depot = _context4.sent;
          _context4.next = 7;
          return regeneratorRuntime.awrap(Promise.all(depot.thuchi.map(function _callee3(tc) {
            var thuchitien, doituong, loaichungtu;
            return regeneratorRuntime.async(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return regeneratorRuntime.awrap(ThuChi.findById(tc._id));

                  case 2:
                    thuchitien = _context3.sent;
                    _context3.next = 5;
                    return regeneratorRuntime.awrap(NhaCungCap.findById(thuchitien.doituong));

                  case 5:
                    doituong = _context3.sent;

                    if (doituong) {
                      _context3.next = 10;
                      break;
                    }

                    _context3.next = 9;
                    return regeneratorRuntime.awrap(KhachHang.findById(thuchitien.doituong));

                  case 9:
                    doituong = _context3.sent;

                  case 10:
                    _context3.next = 12;
                    return regeneratorRuntime.awrap(LoaiChungTu.findById(thuchitien.loaichungtu));

                  case 12:
                    loaichungtu = _context3.sent;

                    if (!(thuchitien.method === 'Tiền gửi')) {
                      _context3.next = 15;
                      break;
                    }

                    return _context3.abrupt("return", {
                      _id: thuchitien._id,
                      mathuchi: thuchitien.mathuchi,
                      date: moment(thuchitien.date).format('DD/MM/YYYY'),
                      loaichungtu: "".concat(loaichungtu.name, " - ").concat(loaichungtu.method),
                      tongtien: thuchitien.tongtien,
                      doituong: doituong.name || '',
                      lydo: thuchitien.lydo,
                      method: thuchitien.method,
                      loaitien: thuchitien.loaitien
                    });

                  case 15:
                    return _context3.abrupt("return", null);

                  case 16:
                  case "end":
                    return _context3.stop();
                }
              }
            });
          })));

        case 7:
          thuchi = _context4.sent;
          filteredThuChi = thuchi.filter(function (item) {
            return item !== null;
          });
          res.json(filteredThuChi);
          _context4.next = 16;
          break;

        case 12:
          _context4.prev = 12;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 12]]);
});
router.post('/postthuchi/:depotid', function _callee6(req, res) {
  var depotid, _req$body, date, maloaict, tongtien, madoituong, lydo, method, loaitien, products, depot, loaichungtu, doituong, thuchi, productPromises;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          depotid = req.params.depotid;
          _req$body = req.body, date = _req$body.date, maloaict = _req$body.maloaict, tongtien = _req$body.tongtien, madoituong = _req$body.madoituong, lydo = _req$body.lydo, method = _req$body.method, loaitien = _req$body.loaitien, products = _req$body.products; // Kiểm tra giá trị đầu vào

          if (!(!date || !maloaict || !tongtien || !madoituong || !method || !loaitien || !products)) {
            _context6.next = 5;
            break;
          }

          return _context6.abrupt("return", res.status(400).json({
            message: 'Dữ liệu đầu vào không hợp lệ.'
          }));

        case 5:
          _context6.next = 7;
          return regeneratorRuntime.awrap(Depot.findById(depotid));

        case 7:
          depot = _context6.sent;

          if (depot) {
            _context6.next = 10;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            message: 'Không tìm thấy kho hàng.'
          }));

        case 10:
          _context6.next = 12;
          return regeneratorRuntime.awrap(LoaiChungTu.findOne({
            maloaict: maloaict
          }));

        case 12:
          loaichungtu = _context6.sent;
          _context6.next = 15;
          return regeneratorRuntime.awrap(NhaCungCap.findOne({
            mancc: madoituong
          }));

        case 15:
          doituong = _context6.sent;

          if (doituong) {
            _context6.next = 20;
            break;
          }

          _context6.next = 19;
          return regeneratorRuntime.awrap(KhachHang.findOne({
            makh: madoituong
          }));

        case 19:
          doituong = _context6.sent;

        case 20:
          thuchi = new ThuChi({
            date: date,
            loaichungtu: loaichungtu._id,
            tongtien: tongtien,
            doituong: doituong,
            lydo: lydo,
            method: method,
            loaitien: loaitien,
            depot: depot._id
          });
          thuchi.mathuchi = loaitien === 'Tiền thu' ? 'PT' + thuchi._id.toString().slice(-5) : 'PC' + thuchi._id.toString().slice(-5); // Xử lý products đồng thời

          productPromises = products.map(function _callee5(product) {
            var diengiai, sotien, mamucthu, mucthuchi;
            return regeneratorRuntime.async(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    diengiai = product.diengiai, sotien = product.sotien, mamucthu = product.mamucthu;
                    _context5.next = 3;
                    return regeneratorRuntime.awrap(MucThuChi.findOne({
                      mamuc: mamucthu
                    }));

                  case 3:
                    mucthuchi = _context5.sent;

                    if (mucthuchi) {
                      _context5.next = 6;
                      break;
                    }

                    return _context5.abrupt("return", res.json({
                      message: "Kh\xF4ng t\xECm th\u1EA5y m\u1EE5c thu chi v\u1EDBi m\xE3: ".concat(mamucthu)
                    }));

                  case 6:
                    thuchi.chitiet.push({
                      diengiai: diengiai,
                      sotien: sotien,
                      mucthuchi: mucthuchi._id
                    });
                    mucthuchi.thuchi.push(thuchi._id);
                    _context5.next = 10;
                    return regeneratorRuntime.awrap(mucthuchi.save());

                  case 10:
                  case "end":
                    return _context5.stop();
                }
              }
            });
          });
          _context6.next = 25;
          return regeneratorRuntime.awrap(Promise.all(productPromises));

        case 25:
          depot.thuchi.push(thuchi._id);
          loaichungtu.thuchi.push(thuchi._id);
          _context6.next = 29;
          return regeneratorRuntime.awrap(thuchi.save());

        case 29:
          _context6.next = 31;
          return regeneratorRuntime.awrap(depot.save());

        case 31:
          _context6.next = 33;
          return regeneratorRuntime.awrap(loaichungtu.save());

        case 33:
          res.json(thuchi);
          _context6.next = 40;
          break;

        case 36:
          _context6.prev = 36;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.',
            error: _context6.t0.message
          });

        case 40:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 36]]);
});
router.get('/getchitietthuchi/:idthuchi', function _callee8(req, res) {
  var idthuchi, thuchi, chitiet;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          idthuchi = req.params.idthuchi;
          _context8.next = 4;
          return regeneratorRuntime.awrap(ThuChi.findById(idthuchi));

        case 4:
          thuchi = _context8.sent;
          _context8.next = 7;
          return regeneratorRuntime.awrap(Promise.all(thuchi.chitiet.map(function _callee7(ct) {
            var mucthuchi;
            return regeneratorRuntime.async(function _callee7$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    _context7.next = 2;
                    return regeneratorRuntime.awrap(MucThuChi.findById(ct.mucthuchi));

                  case 2:
                    mucthuchi = _context7.sent;
                    return _context7.abrupt("return", {
                      diengiai: ct.diengiai,
                      sotien: ct.sotien,
                      mucthuchi: mucthuchi.name
                    });

                  case 4:
                  case "end":
                    return _context7.stop();
                }
              }
            });
          })));

        case 7:
          chitiet = _context8.sent;
          res.json(chitiet);
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
router.get('/doituongthuchi/:idkho', function _callee11(req, res) {
  var idkho, depot, nhacungcap, khachhang, doituongjson;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          idkho = req.params.idkho;
          _context11.next = 4;
          return regeneratorRuntime.awrap(Depot.findById(idkho));

        case 4:
          depot = _context11.sent;
          _context11.next = 7;
          return regeneratorRuntime.awrap(Promise.all(depot.nhacungcap.map(function _callee9(ncc) {
            var ncc1;
            return regeneratorRuntime.async(function _callee9$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    _context9.next = 2;
                    return regeneratorRuntime.awrap(NhaCungCap.findById(ncc._id));

                  case 2:
                    ncc1 = _context9.sent;
                    return _context9.abrupt("return", ncc1);

                  case 4:
                  case "end":
                    return _context9.stop();
                }
              }
            });
          })));

        case 7:
          nhacungcap = _context11.sent;
          _context11.next = 10;
          return regeneratorRuntime.awrap(Promise.all(depot.khachang.map(function _callee10(kh) {
            var kh1;
            return regeneratorRuntime.async(function _callee10$(_context10) {
              while (1) {
                switch (_context10.prev = _context10.next) {
                  case 0:
                    _context10.next = 2;
                    return regeneratorRuntime.awrap(KhachHang.findById(kh._id));

                  case 2:
                    kh1 = _context10.sent;
                    return _context10.abrupt("return", kh1);

                  case 4:
                  case "end":
                    return _context10.stop();
                }
              }
            });
          })));

        case 10:
          khachhang = _context11.sent;
          doituongjson = {
            nhacungcap: nhacungcap,
            khachhang: khachhang
          };
          res.json(doituongjson);
          _context11.next = 19;
          break;

        case 15:
          _context11.prev = 15;
          _context11.t0 = _context11["catch"](0);
          console.error(_context11.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 19:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 15]]);
});
router.post('/deletethuchi', function _callee12(req, res) {
  var ids, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, _ret;

  return regeneratorRuntime.async(function _callee12$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          ids = req.body.ids;
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context13.prev = 5;

          _loop = function _loop() {
            var id, thuchi, mucthuchi;
            return regeneratorRuntime.async(function _loop$(_context12) {
              while (1) {
                switch (_context12.prev = _context12.next) {
                  case 0:
                    id = _step.value;
                    _context12.next = 3;
                    return regeneratorRuntime.awrap(ThuChi.findById(id));

                  case 3:
                    thuchi = _context12.sent;

                    if (!(!thuchi || !thuchi.chitiet || thuchi.chitiet.length === 0)) {
                      _context12.next = 6;
                      break;
                    }

                    return _context12.abrupt("return", "continue");

                  case 6:
                    _context12.next = 8;
                    return regeneratorRuntime.awrap(MucThuChi.findById(thuchi.chitiet[0].mucthuchi._id));

                  case 8:
                    mucthuchi = _context12.sent;

                    if (mucthuchi) {
                      _context12.next = 12;
                      break;
                    }

                    console.warn("M\u1EE5c thu chi kh\xF4ng t\u1ED3n t\u1EA1i v\u1EDBi id: ".concat(id));
                    return _context12.abrupt("return", "continue");

                  case 12:
                    mucthuchi.thuchi = mucthuchi.thuchi.filter(function (tc) {
                      return tc._id.toString() !== thuchi._id.toString();
                    });
                    _context12.next = 15;
                    return regeneratorRuntime.awrap(mucthuchi.save());

                  case 15:
                    _context12.next = 17;
                    return regeneratorRuntime.awrap(ThuChi.findByIdAndDelete(id));

                  case 17:
                  case "end":
                    return _context12.stop();
                }
              }
            });
          };

          _iterator = ids[Symbol.iterator]();

        case 8:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context13.next = 17;
            break;
          }

          _context13.next = 11;
          return regeneratorRuntime.awrap(_loop());

        case 11:
          _ret = _context13.sent;

          if (!(_ret === "continue")) {
            _context13.next = 14;
            break;
          }

          return _context13.abrupt("continue", 14);

        case 14:
          _iteratorNormalCompletion = true;
          _context13.next = 8;
          break;

        case 17:
          _context13.next = 23;
          break;

        case 19:
          _context13.prev = 19;
          _context13.t0 = _context13["catch"](5);
          _didIteratorError = true;
          _iteratorError = _context13.t0;

        case 23:
          _context13.prev = 23;
          _context13.prev = 24;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 26:
          _context13.prev = 26;

          if (!_didIteratorError) {
            _context13.next = 29;
            break;
          }

          throw _iteratorError;

        case 29:
          return _context13.finish(26);

        case 30:
          return _context13.finish(23);

        case 31:
          res.json({
            message: 'xóa thành công'
          });
          _context13.next = 38;
          break;

        case 34:
          _context13.prev = 34;
          _context13.t1 = _context13["catch"](0);
          console.error(_context13.t1);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 38:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[0, 34], [5, 19, 23, 31], [24,, 26, 30]]);
});
module.exports = router;
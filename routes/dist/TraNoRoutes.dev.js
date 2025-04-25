"use strict";

var router = require('express').Router();

var TraNo = require('../models/TraNoModel');

var LoaiSanPham = require('../models/LoaiSanPhamModel');

var HoaDon = require('../models/HoaDonModel');

var Depot = require('../models/DepotModel');

var KhachHang = require('../models/KhachHangModel');

var MucThuChi = require('../models/MucThuChiModel');

var User = require('../models/UserModel');

var ThuChi = require('../models/ThuChiModel');

var LoaiChungTu = require('../models/LoaiChungTuModel');

router.post('/posttranno/:idtrano', function _callee(req, res) {
  var _req$body, tiendatra, ngaytra, iddonno, idtrano, trano, index;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, tiendatra = _req$body.tiendatra, ngaytra = _req$body.ngaytra, iddonno = _req$body.iddonno;
          idtrano = req.params.idtrano;
          _context.next = 5;
          return regeneratorRuntime.awrap(TraNo.findById(idtrano));

        case 5:
          trano = _context.sent;

          if (trano) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            message: 'Không tìm thấy tài liệu.'
          }));

        case 8:
          if (!(!Array.isArray(tiendatra) || tiendatra.length !== trano.donno.length)) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: 'Mảng tiendatra không hợp lệ.'
          }));

        case 10:
          index = trano.donno.findIndex(function (item) {
            return item._id.toString() === iddonno;
          });

          if (!(index !== -1)) {
            _context.next = 15;
            break;
          }

          trano.donno[index].tiendatra = tiendatra;
          _context.next = 16;
          break;

        case 15:
          return _context.abrupt("return", res.status(404).json({
            message: 'Không tìm thấy id trong danh sách đơn nợ'
          }));

        case 16:
          trano.tongtra = trano.donno.reduce(function (sum, item) {
            return sum + item.tiendatra;
          }, 0);
          trano.ngaytra = ngaytra;
          _context.next = 20;
          return regeneratorRuntime.awrap(trano.save());

        case 20:
          res.json(trano);
          _context.next = 27;
          break;

        case 23:
          _context.prev = 23;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 27:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 23]]);
});
router.get('/gettrano/:idkho', function _callee3(req, res) {
  var idkho, depot, tranojson, filteredTranojson, groupedData, result;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          idkho = req.params.idkho;
          _context3.next = 4;
          return regeneratorRuntime.awrap(Depot.findById(idkho));

        case 4:
          depot = _context3.sent;
          _context3.next = 7;
          return regeneratorRuntime.awrap(Promise.all(depot.hoadon.map(function _callee2(trano) {
            var tn, khachhang;
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return regeneratorRuntime.awrap(HoaDon.findById(trano._id));

                  case 2:
                    tn = _context2.sent;

                    if (tn) {
                      _context2.next = 5;
                      break;
                    }

                    return _context2.abrupt("return", null);

                  case 5:
                    _context2.next = 7;
                    return regeneratorRuntime.awrap(KhachHang.findById(tn.khachhang));

                  case 7:
                    khachhang = _context2.sent;

                    if (khachhang) {
                      _context2.next = 10;
                      break;
                    }

                    return _context2.abrupt("return", null);

                  case 10:
                    if (!(tn.ghino === true)) {
                      _context2.next = 12;
                      break;
                    }

                    return _context2.abrupt("return", {
                      _id: tn._id,
                      mahoadon: tn.mahoadon,
                      khachhangid: khachhang._id,
                      makhachhang: khachhang.makh,
                      namekhachhang: khachhang.name,
                      phone: khachhang.phone,
                      address: khachhang.address || '',
                      tongtien: tn.tongtien - tn.datcoc
                    });

                  case 12:
                    return _context2.abrupt("return", null);

                  case 13:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          })));

        case 7:
          tranojson = _context3.sent;
          filteredTranojson = tranojson.filter(function (item) {
            return item !== null;
          });
          groupedData = {};
          filteredTranojson.forEach(function (item) {
            if (!groupedData[item.makhachhang]) {
              groupedData[item.makhachhang] = {
                makhachhang: item.makhachhang,
                namekhachhang: item.namekhachhang,
                khachhangid: item.khachhangid,
                address: item.address,
                phone: item.phone,
                tongtien: 0,
                ids: []
              };
            }

            groupedData[item.makhachhang].tongtien += item.tongtien;
            groupedData[item.makhachhang].ids.push({
              _id: item._id,
              mahoadon: item.mahoadon,
              tongtien: item.tongtien
            });
          });
          result = Object.values(groupedData);
          res.json(result);
          _context3.next = 19;
          break;

        case 15:
          _context3.prev = 15;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 19:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 15]]);
});
router.post('/thuno/:userID/:khoId', function _callee4(req, res) {
  var _req$body2, ids, loaichungtu, khachhangid, method, userID, khoId, user, mucthuchi, lct, depot, thuchi, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, id, trano;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _req$body2 = req.body, ids = _req$body2.ids, loaichungtu = _req$body2.loaichungtu, khachhangid = _req$body2.khachhangid, method = _req$body2.method;
          userID = req.params.userID;
          khoId = req.params.khoId;
          _context4.next = 6;
          return regeneratorRuntime.awrap(User.findById(userID));

        case 6:
          user = _context4.sent;
          _context4.next = 9;
          return regeneratorRuntime.awrap(MucThuChi.findOne({
            name: 'công nợ',
            user: user._id
          }));

        case 9:
          mucthuchi = _context4.sent;
          _context4.next = 12;
          return regeneratorRuntime.awrap(LoaiChungTu.findById(loaichungtu));

        case 12:
          lct = _context4.sent;
          _context4.next = 15;
          return regeneratorRuntime.awrap(Depot.findById(khoId));

        case 15:
          depot = _context4.sent;

          if (mucthuchi) {
            _context4.next = 21;
            break;
          }

          mucthuchi = new MucThuChi({
            name: 'công nợ',
            loaimuc: 'Tiền thu',
            user: user._id
          });
          mucthuchi.mamuc = 'MTC' + mucthuchi._id.toString().slice(-5);
          _context4.next = 21;
          return regeneratorRuntime.awrap(mucthuchi.save());

        case 21:
          thuchi = new ThuChi({
            loaichungtu: loaichungtu,
            doituong: khachhangid,
            method: method,
            lydo: 'Trả nợ',
            loaitien: 'Tiền thu',
            depot: khoId,
            date: new Date()
          });
          thuchi.mathuchi = 'PT' + thuchi._id.toString().slice(-5);
          lct.thuchi.push(thuchi._id);
          depot.thuchi.push(thuchi._id);
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context4.prev = 28;
          _iterator = ids[Symbol.iterator]();

        case 30:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context4.next = 45;
            break;
          }

          id = _step.value;
          _context4.next = 34;
          return regeneratorRuntime.awrap(HoaDon.findById(id));

        case 34:
          trano = _context4.sent;

          if (trano) {
            _context4.next = 37;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: 'Không tìm thấy tài liệu.'
          }));

        case 37:
          thuchi.chitiet.push({
            diengiai: "Tr\u1EA3 n\u1EE3 h\xF3a \u0111\u01A1n ".concat(trano.mahoadon),
            sotien: trano.tongtien - trano.datcoc,
            mucthuchi: mucthuchi._id
          });
          mucthuchi.thuchi.push(thuchi._id);
          trano.ghino = false;
          _context4.next = 42;
          return regeneratorRuntime.awrap(trano.save());

        case 42:
          _iteratorNormalCompletion = true;
          _context4.next = 30;
          break;

        case 45:
          _context4.next = 51;
          break;

        case 47:
          _context4.prev = 47;
          _context4.t0 = _context4["catch"](28);
          _didIteratorError = true;
          _iteratorError = _context4.t0;

        case 51:
          _context4.prev = 51;
          _context4.prev = 52;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 54:
          _context4.prev = 54;

          if (!_didIteratorError) {
            _context4.next = 57;
            break;
          }

          throw _iteratorError;

        case 57:
          return _context4.finish(54);

        case 58:
          return _context4.finish(51);

        case 59:
          thuchi.tongtien = thuchi.chitiet.reduce(function (sum, item) {
            return sum + item.sotien;
          }, 0);
          _context4.next = 62;
          return regeneratorRuntime.awrap(thuchi.save());

        case 62:
          _context4.next = 64;
          return regeneratorRuntime.awrap(mucthuchi.save());

        case 64:
          _context4.next = 66;
          return regeneratorRuntime.awrap(depot.save());

        case 66:
          _context4.next = 68;
          return regeneratorRuntime.awrap(lct.save());

        case 68:
          res.json({
            message: 'Thu nợ thành công.'
          });
          _context4.next = 75;
          break;

        case 71:
          _context4.prev = 71;
          _context4.t1 = _context4["catch"](0);
          console.error(_context4.t1);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 75:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 71], [28, 47, 51, 59], [52,, 54, 58]]);
});
router.post('/capngayhangloat', function _callee5(req, res) {
  var codes, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, code, thuchi;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          codes = req.body.codes;
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context5.prev = 5;
          _iterator2 = codes[Symbol.iterator]();

        case 7:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context5.next = 18;
            break;
          }

          code = _step2.value;
          _context5.next = 11;
          return regeneratorRuntime.awrap(ThuChi.findOne({
            mathuchi: code
          }));

        case 11:
          thuchi = _context5.sent;
          thuchi.date = new Date();
          _context5.next = 15;
          return regeneratorRuntime.awrap(thuchi.save());

        case 15:
          _iteratorNormalCompletion2 = true;
          _context5.next = 7;
          break;

        case 18:
          _context5.next = 24;
          break;

        case 20:
          _context5.prev = 20;
          _context5.t0 = _context5["catch"](5);
          _didIteratorError2 = true;
          _iteratorError2 = _context5.t0;

        case 24:
          _context5.prev = 24;
          _context5.prev = 25;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 27:
          _context5.prev = 27;

          if (!_didIteratorError2) {
            _context5.next = 30;
            break;
          }

          throw _iteratorError2;

        case 30:
          return _context5.finish(27);

        case 31:
          return _context5.finish(24);

        case 32:
          res.json({
            message: 'thành công'
          });
          _context5.next = 39;
          break;

        case 35:
          _context5.prev = 35;
          _context5.t1 = _context5["catch"](0);
          console.error(_context5.t1);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 39:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 35], [5, 20, 24, 32], [25,, 27, 31]]);
});
module.exports = router;
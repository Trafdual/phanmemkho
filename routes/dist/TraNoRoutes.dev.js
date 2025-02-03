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
                      makhachhang: khachhang.makh,
                      namekhachhang: khachhang.name,
                      phone: khachhang.phone,
                      address: khachhang.address || '',
                      tongtien: tn.tongtien
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
                address: item.address,
                phone: item.phone,
                tongtien: 0,
                ids: []
              };
            }

            groupedData[item.makhachhang].tongtien += item.tongtien;
            groupedData[item.makhachhang].ids.push(item._id);
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
  var _req$body2, ids, loaichungtu, khachhangid, method, userID, khoId, user, mucthuchi, thuchi, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, id, trano;

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

          if (mucthuchi) {
            _context4.next = 15;
            break;
          }

          mucthuchi = new MucThuChi({
            name: 'công nợ',
            loaimuc: 'Tiền thu',
            user: user._id
          });
          mucthuchi.mamuc = 'MTC' + mucthuchi._id.toString().slice(-5);
          _context4.next = 15;
          return regeneratorRuntime.awrap(mucthuchi.save());

        case 15:
          // Tạo phiếu thu chi
          thuchi = new ThuChi({
            loaichungtu: loaichungtu,
            doituong: khachhangid,
            method: method,
            lydo: 'Trả nợ',
            loaitien: 'Tiền thu',
            depot: khoId
          });
          thuchi.mathuchi = 'PT' + thuchi._id.toString().slice(-5); // Lặp qua danh sách hóa đơn và cập nhật thông tin

          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context4.prev = 20;
          _iterator = ids[Symbol.iterator]();

        case 22:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context4.next = 37;
            break;
          }

          id = _step.value;
          _context4.next = 26;
          return regeneratorRuntime.awrap(HoaDon.findById(id));

        case 26:
          trano = _context4.sent;

          if (trano) {
            _context4.next = 29;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: 'Không tìm thấy tài liệu.'
          }));

        case 29:
          thuchi.chitiet.push({
            diengiai: "Tr\u1EA3 n\u1EE3 h\xF3a \u0111\u01A1n ".concat(trano.mahoadon),
            sotien: trano.tongtien,
            mucthuchi: mucthuchi._id
          });
          mucthuchi.thuchi.push(thuchi._id);
          trano.ghino = true;
          _context4.next = 34;
          return regeneratorRuntime.awrap(trano.save());

        case 34:
          _iteratorNormalCompletion = true;
          _context4.next = 22;
          break;

        case 37:
          _context4.next = 43;
          break;

        case 39:
          _context4.prev = 39;
          _context4.t0 = _context4["catch"](20);
          _didIteratorError = true;
          _iteratorError = _context4.t0;

        case 43:
          _context4.prev = 43;
          _context4.prev = 44;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 46:
          _context4.prev = 46;

          if (!_didIteratorError) {
            _context4.next = 49;
            break;
          }

          throw _iteratorError;

        case 49:
          return _context4.finish(46);

        case 50:
          return _context4.finish(43);

        case 51:
          // Tính tổng tiền
          thuchi.tongtien = thuchi.chitiet.reduce(function (sum, item) {
            return sum + item.sotien;
          }, 0); // Lưu thông tin

          _context4.next = 54;
          return regeneratorRuntime.awrap(thuchi.save());

        case 54:
          _context4.next = 56;
          return regeneratorRuntime.awrap(mucthuchi.save());

        case 56:
          res.json({
            message: 'Thu nợ thành công.'
          });
          _context4.next = 63;
          break;

        case 59:
          _context4.prev = 59;
          _context4.t1 = _context4["catch"](0);
          console.error(_context4.t1);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 63:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 59], [20, 39, 43, 51], [44,, 46, 50]]);
});
module.exports = router;
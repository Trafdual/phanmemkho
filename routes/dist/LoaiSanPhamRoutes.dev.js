"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var router = require('express').Router();

var LoaiSanPham = require('../models/LoaiSanPhamModel');

var Depot = require('../models/DepotModel');

var NhanCungCap = require('../models/NhanCungCapModel');

var TraNo = require('../models/TraNoModel');

var NganHang = require('../models/NganHangKhoModel');

var SanPham = require('../models/SanPhamModel');

var DungLuongSku = require('../models/DungluongSkuModel');

var _require = require('./sendEvent'),
    sendEvent = _require.sendEvent;

var moment = require('moment');

router.get('/getloaisanphamweb', function _callee2(req, res) {
  var depotId, depot, loaisanpham;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          depotId = req.session.depotId;
          _context2.next = 4;
          return regeneratorRuntime.awrap(Depot.findById(depotId));

        case 4:
          depot = _context2.sent;
          _context2.next = 7;
          return regeneratorRuntime.awrap(Promise.all(depot.loaisanpham.map(function _callee(loai) {
            var loaisp;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return regeneratorRuntime.awrap(LoaiSanPham.findById(loai._id));

                  case 2:
                    loaisp = _context.sent;
                    return _context.abrupt("return", {
                      _id: loaisp._id,
                      name: loaisp.name,
                      soluong: loaisp.soluong,
                      tongtien: loaisp.tongtien,
                      date: moment(loaisp.date).format('DD/MM/YYYY'),
                      average: loaisp.average,
                      conlai: loaisp.conlai
                    });

                  case 4:
                  case "end":
                    return _context.stop();
                }
              }
            });
          })));

        case 7:
          loaisanpham = _context2.sent;
          res.json(loaisanpham);
          _context2.next = 15;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 11]]);
});
router.get('/getloaisanpham/:nccId', function _callee4(req, res) {
  var nccId, nhacungcap, loaisanpham;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          nccId = req.params.nccId;
          _context4.next = 4;
          return regeneratorRuntime.awrap(NhanCungCap.findById(nccId));

        case 4:
          nhacungcap = _context4.sent;
          _context4.next = 7;
          return regeneratorRuntime.awrap(Promise.all(nhacungcap.loaisanpham.map(function _callee3(loai) {
            var loaisp, tongtien;
            return regeneratorRuntime.async(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return regeneratorRuntime.awrap(LoaiSanPham.findById(loai._id));

                  case 2:
                    loaisp = _context3.sent;
                    tongtien = loaisp.sanpham.reduce(function (sum, product) {
                      return sum + (product.price || 0);
                    }, 0);
                    return _context3.abrupt("return", {
                      _id: loaisp._id,
                      malsp: loaisp.malsp,
                      name: loaisp.name,
                      tongtien: tongtien,
                      date: moment(loaisp.date).format('DD/MM/YYYY'),
                      conlai: loaisp.sanpham.length || 0
                    });

                  case 5:
                  case "end":
                    return _context3.stop();
                }
              }
            });
          })));

        case 7:
          loaisanpham = _context4.sent;
          res.json(loaisanpham);
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
router.post('/postloaisanpham/:nccId', function _callee5(req, res) {
  var nccId, _req$body, name, tongtien, soluong, date, nhacungcap, depot, formattedDate, loaisanpham, malsp, ncc;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          nccId = req.params.nccId;
          _req$body = req.body, name = _req$body.name, tongtien = _req$body.tongtien, soluong = _req$body.soluong, date = _req$body.date;
          _context5.next = 5;
          return regeneratorRuntime.awrap(NhanCungCap.findById(nccId));

        case 5:
          nhacungcap = _context5.sent;
          _context5.next = 8;
          return regeneratorRuntime.awrap(Depot.findById(nhacungcap.depotId));

        case 8:
          depot = _context5.sent;
          formattedDate = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');
          loaisanpham = new LoaiSanPham({
            name: name,
            depot: depot._id,
            tongtien: tongtien,
            soluong: soluong,
            date: formattedDate,
            nhacungcap: nhacungcap._id
          });
          loaisanpham.average = parseFloat((tongtien / soluong).toFixed(1));
          malsp = 'LH' + loaisanpham._id.toString().slice(-5);
          loaisanpham.malsp = malsp;
          _context5.next = 16;
          return regeneratorRuntime.awrap(loaisanpham.save());

        case 16:
          depot.loaisanpham.push(loaisanpham._id);
          nhacungcap.loaisanpham.push(loaisanpham._id);
          _context5.next = 20;
          return regeneratorRuntime.awrap(nhacungcap.save());

        case 20:
          _context5.next = 22;
          return regeneratorRuntime.awrap(depot.save());

        case 22:
          ncc = {
            _id: loaisanpham._id,
            malsp: loaisanpham.malsp,
            name: loaisanpham.name,
            soluong: loaisanpham.soluong,
            tongtien: loaisanpham.tongtien,
            date: moment(loaisanpham.date).format('DD/MM/YYYY'),
            average: loaisanpham.average
          };
          res.json(ncc);
          _context5.next = 30;
          break;

        case 26:
          _context5.prev = 26;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 30:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 26]]);
});
router.get('/getloaisanpham2/:depotID', function _callee7(req, res) {
  var depotID, depot, loaisanpham;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          depotID = req.params.depotID;
          _context7.next = 4;
          return regeneratorRuntime.awrap(Depot.findById(depotID));

        case 4:
          depot = _context7.sent;
          _context7.next = 7;
          return regeneratorRuntime.awrap(Promise.all(depot.loaisanpham.map(function _callee6(loaisanpham) {
            var loaisp;
            return regeneratorRuntime.async(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    _context6.next = 2;
                    return regeneratorRuntime.awrap(LoaiSanPham.findById(loaisanpham._id).populate('sanpham'));

                  case 2:
                    loaisp = _context6.sent;
                    return _context6.abrupt("return", {
                      _id: loaisp._id,
                      malsp: loaisp.malsp,
                      name: loaisp.name,
                      tongtien: loaisp.tongtien,
                      date: moment(loaisp.date).format('DD/MM/YYYY'),
                      conlai: loaisp.sanpham.length
                    });

                  case 4:
                  case "end":
                    return _context6.stop();
                }
              }
            });
          })));

        case 7:
          loaisanpham = _context7.sent;
          res.json(loaisanpham);
          _context7.next = 15;
          break;

        case 11:
          _context7.prev = 11;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 15:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 11]]);
});
router.post('/postloaisanpham2', function _callee8(req, res) {
  var _req$body2, name, tongtien, date, mancc, ghino, hour, method, manganhangkho, loaihanghoa, nhacungcap, depot, formattedDate, formattedHour, nganhangkho, loaisanpham, trano, tienno, malsp, ncc;

  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _req$body2 = req.body, name = _req$body2.name, tongtien = _req$body2.tongtien, date = _req$body2.date, mancc = _req$body2.mancc, ghino = _req$body2.ghino, hour = _req$body2.hour, method = _req$body2.method, manganhangkho = _req$body2.manganhangkho, loaihanghoa = _req$body2.loaihanghoa;
          _context8.next = 4;
          return regeneratorRuntime.awrap(NhanCungCap.findOne({
            mancc: mancc
          }));

        case 4:
          nhacungcap = _context8.sent;
          _context8.next = 7;
          return regeneratorRuntime.awrap(Depot.findById(nhacungcap.depotId));

        case 7:
          depot = _context8.sent;
          formattedDate = moment(date).isValid() ? moment(date).toDate() : null;

          if (formattedDate) {
            _context8.next = 11;
            break;
          }

          return _context8.abrupt("return", res.json({
            message: 'Ngày không hợp lệ.'
          }));

        case 11:
          formattedHour = moment(hour).isValid() ? moment(hour).toDate() : null;

          if (formattedHour) {
            _context8.next = 14;
            break;
          }

          return _context8.abrupt("return", res.json({
            message: 'Giờ không hợp lệ.'
          }));

        case 14:
          _context8.next = 16;
          return regeneratorRuntime.awrap(NganHang.findOne({
            manganhangkho: manganhangkho
          }));

        case 16:
          nganhangkho = _context8.sent;
          loaisanpham = new LoaiSanPham({
            name: name,
            depot: depot._id,
            tongtien: tongtien,
            date: formattedDate,
            hour: formattedHour,
            nhacungcap: nhacungcap._id,
            loaihanghoa: loaihanghoa
          });

          if (!(ghino === 'ghino')) {
            _context8.next = 35;
            break;
          }

          loaisanpham.ghino = true;
          trano = new TraNo({
            nhacungcap: nhacungcap._id
          });
          tienno = 0;
          tienno += loaisanpham.tongtien;
          trano.donno.push({
            loaisanpham: loaisanpham._id,
            tienno: tienno,
            tienphaitra: tienno,
            tiendatra: 0
          });
          trano.tongno = trano.donno.reduce(function (sum, item) {
            return sum + item.tienno;
          }, 0);
          trano.tongtra = trano.donno.reduce(function (sum, item) {
            return sum + item.tiendatra;
          }, 0);
          nhacungcap.trano.push(trano._id);
          _context8.next = 29;
          return regeneratorRuntime.awrap(nhacungcap.save());

        case 29:
          _context8.next = 31;
          return regeneratorRuntime.awrap(trano.save());

        case 31:
          _context8.next = 33;
          return regeneratorRuntime.awrap(loaisanpham.save());

        case 33:
          _context8.next = 40;
          break;

        case 35:
          loaisanpham.ghino = false;

          if (method === 'Tiền mặt') {
            loaisanpham.method = 'tienmat';
          }

          if (method === 'Chuyển khoản') {
            loaisanpham.method = 'chuyenkhoan';
            loaisanpham.nganhang = nganhangkho._id;
          }

          _context8.next = 40;
          return regeneratorRuntime.awrap(loaisanpham.save());

        case 40:
          malsp = 'LH' + loaisanpham._id.toString().slice(-5);
          loaisanpham.malsp = malsp;
          _context8.next = 44;
          return regeneratorRuntime.awrap(loaisanpham.save());

        case 44:
          depot.loaisanpham.push(loaisanpham._id);
          nhacungcap.loaisanpham.push(loaisanpham._id);
          _context8.next = 48;
          return regeneratorRuntime.awrap(nhacungcap.save());

        case 48:
          _context8.next = 50;
          return regeneratorRuntime.awrap(depot.save());

        case 50:
          ncc = {
            _id: loaisanpham._id,
            malsp: loaisanpham.malsp,
            name: loaisanpham.name,
            tongtien: loaisanpham.tongtien,
            date: moment(loaisanpham.date).format('DD/MM/YYYY')
          };
          res.json(ncc);
          _context8.next = 58;
          break;

        case 54:
          _context8.prev = 54;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 58:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 54]]);
});
router.post('/putloaisanpham/:idloai', function _callee9(req, res) {
  var idloai, _req$body3, name, tongtien, soluong, date, mancc, ghino, method, manganhangkho, average, loaisanpham, nganhang, nhacungcap, nhacungcap1, tranoList, trano, tienno, _trano, _tienno, _tranoList;

  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          idloai = req.params.idloai;
          _req$body3 = req.body, name = _req$body3.name, tongtien = _req$body3.tongtien, soluong = _req$body3.soluong, date = _req$body3.date, mancc = _req$body3.mancc, ghino = _req$body3.ghino, method = _req$body3.method, manganhangkho = _req$body3.manganhangkho;
          average = parseFloat((tongtien / soluong).toFixed(1));
          _context9.next = 6;
          return regeneratorRuntime.awrap(LoaiSanPham.findById(idloai));

        case 6:
          loaisanpham = _context9.sent;
          _context9.next = 9;
          return regeneratorRuntime.awrap(NganHang.findOne({
            manganhangkho: manganhangkho
          }));

        case 9:
          nganhang = _context9.sent;
          _context9.next = 12;
          return regeneratorRuntime.awrap(NhanCungCap.findOne({
            mancc: mancc
          }));

        case 12:
          nhacungcap = _context9.sent;
          _context9.next = 15;
          return regeneratorRuntime.awrap(NhanCungCap.findById(loaisanpham.nhacungcap));

        case 15:
          nhacungcap1 = _context9.sent;
          loaisanpham.name = name;
          loaisanpham.tongtien = tongtien;
          loaisanpham.soluong = soluong;
          loaisanpham.date = date;
          loaisanpham.average = average;

          if (!(loaisanpham.nhacungcap.toString() !== nhacungcap._id.toString())) {
            _context9.next = 51;
            break;
          }

          loaisanpham.nhacungcap = nhacungcap._id;
          nhacungcap1.loaisanpham = nhacungcap1.loaisanpham.filter(function (id) {
            return id.toString() !== loaisanpham._id.toString();
          });
          nhacungcap.loaisanpham.push(loaisanpham._id);

          if (!(ghino === 'ghino' && loaisanpham.ghino)) {
            _context9.next = 38;
            break;
          }

          _context9.next = 28;
          return regeneratorRuntime.awrap(TraNo.findOne({
            'donno.loaisanpham': loaisanpham._id
          }));

        case 28:
          tranoList = _context9.sent;
          nhacungcap1.trano = nhacungcap1.trano.filter(function (id) {
            return id.toString() !== tranoList._id.toString();
          });
          nhacungcap.trano.push(tranoList._id);
          tranoList.nhacungcap = nhacungcap._id;
          _context9.next = 34;
          return regeneratorRuntime.awrap(TraNo.findByIdAndUpdate(tranoList._id, tranoList));

        case 34:
          _context9.next = 36;
          return regeneratorRuntime.awrap(NhanCungCap.findByIdAndUpdate(nhacungcap1._id, nhacungcap1));

        case 36:
          _context9.next = 38;
          return regeneratorRuntime.awrap(NhanCungCap.findByIdAndUpdate(nhacungcap._id, nhacungcap));

        case 38:
          if (!(ghino === 'ghino' && !loaisanpham.ghino)) {
            _context9.next = 49;
            break;
          }

          trano = new TraNo({
            nhacungcap: nhacungcap._id
          });
          tienno = loaisanpham.tongtien;
          trano.donno.push({
            loaisanpham: loaisanpham._id,
            tienno: tienno,
            tienphaitra: tienno,
            tiendatra: 0
          });
          trano.tongno = tienno;
          trano.tongtra = 0;
          nhacungcap.trano.push(trano._id);
          _context9.next = 47;
          return regeneratorRuntime.awrap(TraNo.create(trano));

        case 47:
          _context9.next = 49;
          return regeneratorRuntime.awrap(NhanCungCap.findByIdAndUpdate(nhacungcap._id, nhacungcap));

        case 49:
          _context9.next = 79;
          break;

        case 51:
          if (!(ghino === 'ghino')) {
            _context9.next = 67;
            break;
          }

          loaisanpham.ghino = true;
          loaisanpham.method = '';
          loaisanpham.nganhang = null;
          _trano = new TraNo({
            nhacungcap: nhacungcap1._id
          });
          _tienno = loaisanpham.tongtien;

          _trano.donno.push({
            loaisanpham: loaisanpham._id,
            tienno: _tienno,
            tienphaitra: _tienno,
            tiendatra: 0
          });

          _trano.tongno = _tienno;
          _trano.tongtra = 0;
          nhacungcap1.trano.push(_trano._id); // Cập nhật trano và nhacungcap1

          _context9.next = 63;
          return regeneratorRuntime.awrap(TraNo.create(_trano));

        case 63:
          _context9.next = 65;
          return regeneratorRuntime.awrap(NhanCungCap.findByIdAndUpdate(nhacungcap1._id, nhacungcap1));

        case 65:
          _context9.next = 79;
          break;

        case 67:
          loaisanpham.ghino = false;

          if (method === 'Tiền mặt') {
            loaisanpham.method = 'tienmat';
          }

          if (method === 'Chuyển khoản') {
            loaisanpham.method = 'chuyenkhoan';
            loaisanpham.nganhang = nganhang._id;
          }

          _context9.next = 72;
          return regeneratorRuntime.awrap(TraNo.findOne({
            'donno.loaisanpham': loaisanpham._id
          }));

        case 72:
          _tranoList = _context9.sent;

          if (!_tranoList) {
            _context9.next = 79;
            break;
          }

          _context9.next = 76;
          return regeneratorRuntime.awrap(TraNo.deleteOne({
            _id: _tranoList._id
          }));

        case 76:
          nhacungcap1.trano = nhacungcap1.trano.filter(function (id) {
            return id.toString() !== _tranoList._id.toString();
          });
          _context9.next = 79;
          return regeneratorRuntime.awrap(NhanCungCap.findByIdAndUpdate(nhacungcap1._id, nhacungcap1));

        case 79:
          _context9.next = 81;
          return regeneratorRuntime.awrap(LoaiSanPham.findByIdAndUpdate(idloai, loaisanpham));

        case 81:
          _context9.next = 83;
          return regeneratorRuntime.awrap(NhanCungCap.findByIdAndUpdate(nhacungcap1._id, nhacungcap1));

        case 83:
          _context9.next = 85;
          return regeneratorRuntime.awrap(NhanCungCap.findByIdAndUpdate(nhacungcap._id, nhacungcap));

        case 85:
          res.json(loaisanpham);
          _context9.next = 92;
          break;

        case 88:
          _context9.prev = 88;
          _context9.t0 = _context9["catch"](0);
          console.error(_context9.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 92:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 88]]);
});
router.post('deletesanpham/:idloai', function _callee10(req, res) {
  var idloai, loaisanpham, depot, index;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          idloai = req.params.idloai;
          _context10.next = 4;
          return regeneratorRuntime.awrap(LoaiSanPham.findById(idloai));

        case 4:
          loaisanpham = _context10.sent;
          _context10.next = 7;
          return regeneratorRuntime.awrap(Depot.findById(loaisanpham.depot));

        case 7:
          depot = _context10.sent;
          index = depot.loaisanpham.indexOf(idloai);
          depot.loaisanpham.splice(index, 1);
          _context10.next = 12;
          return regeneratorRuntime.awrap(depot.save());

        case 12:
          _context10.next = 14;
          return regeneratorRuntime.awrap(LoaiSanPham.deleteOne({
            _id: idloai
          }));

        case 14:
          res.json({
            message: 'xóa thành công'
          });
          _context10.next = 21;
          break;

        case 17:
          _context10.prev = 17;
          _context10.t0 = _context10["catch"](0);
          console.error(_context10.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 21:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 17]]);
});
router.get('/getchitietloaisanpham/:idloai', function _callee11(req, res) {
  var idloai, loaisanpham, nhacungcap, manganhang, nganhangkho, loaisanphamjson;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          idloai = req.params.idloai;
          _context11.next = 4;
          return regeneratorRuntime.awrap(LoaiSanPham.findById(idloai));

        case 4:
          loaisanpham = _context11.sent;

          if (loaisanpham) {
            _context11.next = 7;
            break;
          }

          return _context11.abrupt("return", res.status(404).json({
            message: 'Loại sản phẩm không tìm thấy.'
          }));

        case 7:
          _context11.next = 9;
          return regeneratorRuntime.awrap(NhanCungCap.findById(loaisanpham.nhacungcap));

        case 9:
          nhacungcap = _context11.sent;
          // Kiểm tra xem loaisanpham có thuộc tính nganhang hay không
          manganhang = '';

          if (!loaisanpham.nganhang) {
            _context11.next = 16;
            break;
          }

          _context11.next = 14;
          return regeneratorRuntime.awrap(NganHang.findById(loaisanpham.nganhang));

        case 14:
          nganhangkho = _context11.sent;

          if (nganhangkho) {
            manganhang = nganhangkho.manganhangkho; // Lấy mã ngân hàng nếu tìm thấy
          }

        case 16:
          // Tạo đối tượng JSON cho phản hồi
          loaisanphamjson = {
            _id: loaisanpham._id,
            name: loaisanpham.name,
            soluong: loaisanpham.soluong,
            tongtien: loaisanpham.tongtien,
            date: loaisanpham.date,
            average: loaisanpham.average,
            method: loaisanpham.method,
            manganhang: manganhang,
            // Mặc định rỗng nếu không có nganhang
            malsp: loaisanpham.malsp,
            manhacungcap: nhacungcap ? nhacungcap.mancc : '',
            // Đảm bảo nếu nhà cung cấp không tồn tại
            ghino: loaisanpham.ghino,
            loaihanghoa: loaisanpham.loaihanghoa
          }; // Trả về dữ liệu JSON

          res.json(loaisanphamjson);
          _context11.next = 24;
          break;

        case 20:
          _context11.prev = 20;
          _context11.t0 = _context11["catch"](0);
          console.error(_context11.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 24:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 20]]);
});
router.post('/postloaisanpham3', function _callee12(req, res) {
  var _req$body4, name, date, mancc, ghino, hour, method, manganhangkho, loaihanghoa, products, nhacungcap, depot, formattedDate, formattedHour, nganhangkho, loaisanpham, addedProducts, tongtien, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, product, madungluongsku, imelList, _name, price, dungluongsku, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, imel, sp, sanpham, trano, ncc;

  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          _req$body4 = req.body, name = _req$body4.name, date = _req$body4.date, mancc = _req$body4.mancc, ghino = _req$body4.ghino, hour = _req$body4.hour, method = _req$body4.method, manganhangkho = _req$body4.manganhangkho, loaihanghoa = _req$body4.loaihanghoa, products = _req$body4.products;
          _context12.next = 4;
          return regeneratorRuntime.awrap(NhanCungCap.findOne({
            mancc: mancc
          }));

        case 4:
          nhacungcap = _context12.sent;
          _context12.next = 7;
          return regeneratorRuntime.awrap(Depot.findById(nhacungcap.depotId));

        case 7:
          depot = _context12.sent;
          formattedDate = moment(date).isValid() ? moment(date).toDate() : null;

          if (formattedDate) {
            _context12.next = 11;
            break;
          }

          return _context12.abrupt("return", res.json({
            message: 'Ngày không hợp lệ.'
          }));

        case 11:
          formattedHour = moment(hour).isValid() ? moment(hour).toDate() : null;

          if (formattedHour) {
            _context12.next = 14;
            break;
          }

          return _context12.abrupt("return", res.json({
            message: 'Giờ không hợp lệ.'
          }));

        case 14:
          _context12.next = 16;
          return regeneratorRuntime.awrap(NganHang.findOne({
            manganhangkho: manganhangkho
          }));

        case 16:
          nganhangkho = _context12.sent;
          loaisanpham = new LoaiSanPham({
            name: name,
            depot: depot._id,
            date: formattedDate,
            hour: formattedHour,
            nhacungcap: nhacungcap._id,
            loaihanghoa: loaihanghoa
          });
          loaisanpham.malsp = 'LH' + loaisanpham._id.toString().slice(-5);
          addedProducts = [];
          tongtien = 0;
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context12.prev = 24;
          _iterator = products[Symbol.iterator]();

        case 26:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context12.next = 78;
            break;
          }

          product = _step.value;
          madungluongsku = product.madungluongsku, imelList = product.imelList, _name = product.name, price = product.price;
          _context12.next = 31;
          return regeneratorRuntime.awrap(DungLuongSku.findOne({
            madungluong: madungluongsku
          }));

        case 31:
          dungluongsku = _context12.sent;
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context12.prev = 35;
          _iterator2 = imelList[Symbol.iterator]();

        case 37:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context12.next = 61;
            break;
          }

          imel = _step2.value;
          _context12.next = 41;
          return regeneratorRuntime.awrap(SanPham.findOne({
            imel: imel
          }));

        case 41:
          sp = _context12.sent;

          if (!sp) {
            _context12.next = 44;
            break;
          }

          return _context12.abrupt("continue", 58);

        case 44:
          sanpham = new SanPham({
            name: _name,
            imel: imel,
            datenhap: loaisanpham.date,
            price: price,
            loaihanghoa: loaihanghoa
          });
          sanpham.masp = 'SP' + sanpham._id.toString().slice(-5);
          sanpham.kho = depot._id;
          sanpham.loaisanpham = loaisanpham._id;
          sanpham.dungluongsku = dungluongsku._id;
          tongtien += Number(price);
          _context12.next = 52;
          return regeneratorRuntime.awrap(sanpham.save());

        case 52:
          loaisanpham.sanpham.push(sanpham._id);
          depot.sanpham.push(sanpham._id);
          dungluongsku.sanpham.push(sanpham._id);
          _context12.next = 57;
          return regeneratorRuntime.awrap(dungluongsku.save());

        case 57:
          addedProducts.push(sanpham);

        case 58:
          _iteratorNormalCompletion2 = true;
          _context12.next = 37;
          break;

        case 61:
          _context12.next = 67;
          break;

        case 63:
          _context12.prev = 63;
          _context12.t0 = _context12["catch"](35);
          _didIteratorError2 = true;
          _iteratorError2 = _context12.t0;

        case 67:
          _context12.prev = 67;
          _context12.prev = 68;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 70:
          _context12.prev = 70;

          if (!_didIteratorError2) {
            _context12.next = 73;
            break;
          }

          throw _iteratorError2;

        case 73:
          return _context12.finish(70);

        case 74:
          return _context12.finish(67);

        case 75:
          _iteratorNormalCompletion = true;
          _context12.next = 26;
          break;

        case 78:
          _context12.next = 84;
          break;

        case 80:
          _context12.prev = 80;
          _context12.t1 = _context12["catch"](24);
          _didIteratorError = true;
          _iteratorError = _context12.t1;

        case 84:
          _context12.prev = 84;
          _context12.prev = 85;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 87:
          _context12.prev = 87;

          if (!_didIteratorError) {
            _context12.next = 90;
            break;
          }

          throw _iteratorError;

        case 90:
          return _context12.finish(87);

        case 91:
          return _context12.finish(84);

        case 92:
          loaisanpham.tongtien = tongtien;

          if (!(ghino === 'ghino')) {
            _context12.next = 104;
            break;
          }

          loaisanpham.ghino = true;
          trano = new TraNo({
            nhacungcap: nhacungcap._id
          });
          trano.donno.push({
            loaisanpham: loaisanpham._id,
            tienno: loaisanpham.tongtien,
            tienphaitra: loaisanpham.tongtien,
            tiendatra: 0
          });
          trano.tongno = trano.donno.reduce(function (sum, item) {
            return sum + item.tienno;
          }, 0);
          trano.tongtra = trano.donno.reduce(function (sum, item) {
            return sum + item.tiendatra;
          }, 0);
          nhacungcap.trano.push(trano._id);
          _context12.next = 102;
          return regeneratorRuntime.awrap(trano.save());

        case 102:
          _context12.next = 107;
          break;

        case 104:
          loaisanpham.ghino = false;
          if (method === 'Tiền mặt') loaisanpham.method = 'tienmat';

          if (method === 'Chuyển khoản') {
            loaisanpham.method = 'chuyenkhoan';
            loaisanpham.nganhang = nganhangkho._id;
          }

        case 107:
          _context12.next = 109;
          return regeneratorRuntime.awrap(loaisanpham.save());

        case 109:
          depot.loaisanpham.push(loaisanpham._id);
          nhacungcap.loaisanpham.push(loaisanpham._id);
          _context12.next = 113;
          return regeneratorRuntime.awrap(nhacungcap.save());

        case 113:
          _context12.next = 115;
          return regeneratorRuntime.awrap(depot.save());

        case 115:
          ncc = {
            _id: loaisanpham._id,
            malsp: loaisanpham.malsp,
            name: loaisanpham.name,
            tongtien: loaisanpham.tongtien,
            date: moment(loaisanpham.date).format('DD/MM/YYYY')
          };
          res.json(ncc);
          _context12.next = 123;
          break;

        case 119:
          _context12.prev = 119;
          _context12.t2 = _context12["catch"](0);
          console.error(_context12.t2);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 123:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 119], [24, 80, 84, 92], [35, 63, 67, 75], [68,, 70, 74], [85,, 87, 91]]);
});
router.post('/postloaisanpham4', function _callee13(req, res) {
  var _req$body5, name, date, mancc, ghino, hour, method, manganhangkho, loaihanghoa, products, nhacungcap, depot, formattedDate, formattedHour, nganhangkho, loaisanpham, addedProducts, tongtien, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, product, madungluongsku, imelList, _name2, price, soluong, dungluongsku, i, sanpham, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, imel, sp, _sanpham, trano, ncc;

  return regeneratorRuntime.async(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          _req$body5 = req.body, name = _req$body5.name, date = _req$body5.date, mancc = _req$body5.mancc, ghino = _req$body5.ghino, hour = _req$body5.hour, method = _req$body5.method, manganhangkho = _req$body5.manganhangkho, loaihanghoa = _req$body5.loaihanghoa, products = _req$body5.products;
          _context13.next = 4;
          return regeneratorRuntime.awrap(NhanCungCap.findOne({
            mancc: mancc
          }));

        case 4:
          nhacungcap = _context13.sent;
          _context13.next = 7;
          return regeneratorRuntime.awrap(Depot.findById(nhacungcap.depotId));

        case 7:
          depot = _context13.sent;
          formattedDate = moment(date).isValid() ? moment(date).toDate() : null;

          if (formattedDate) {
            _context13.next = 11;
            break;
          }

          return _context13.abrupt("return", res.json({
            message: 'Ngày không hợp lệ.'
          }));

        case 11:
          formattedHour = moment(hour).isValid() ? moment(hour).toDate() : null;

          if (formattedHour) {
            _context13.next = 14;
            break;
          }

          return _context13.abrupt("return", res.json({
            message: 'Giờ không hợp lệ.'
          }));

        case 14:
          _context13.next = 16;
          return regeneratorRuntime.awrap(NganHang.findOne({
            manganhangkho: manganhangkho
          }));

        case 16:
          nganhangkho = _context13.sent;
          loaisanpham = new LoaiSanPham({
            name: name,
            depot: depot._id,
            date: formattedDate,
            hour: formattedHour,
            nhacungcap: nhacungcap._id,
            loaihanghoa: loaihanghoa
          });
          loaisanpham.malsp = 'LH' + loaisanpham._id.toString().slice(-5);
          addedProducts = [];
          tongtien = 0;
          _iteratorNormalCompletion3 = true;
          _didIteratorError3 = false;
          _iteratorError3 = undefined;
          _context13.prev = 24;
          _iterator3 = products[Symbol.iterator]();

        case 26:
          if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
            _context13.next = 100;
            break;
          }

          product = _step3.value;
          madungluongsku = product.madungluongsku, imelList = product.imelList, _name2 = product.name, price = product.price, soluong = product.soluong;
          _context13.next = 31;
          return regeneratorRuntime.awrap(DungLuongSku.findOne({
            madungluong: madungluongsku
          }));

        case 31:
          dungluongsku = _context13.sent;

          if (!(!imelList || imelList.length === 0)) {
            _context13.next = 54;
            break;
          }

          i = 0;

        case 34:
          if (!(i < soluong)) {
            _context13.next = 53;
            break;
          }

          sanpham = new SanPham({
            name: _name2,
            datenhap: loaisanpham.date,
            price: price,
            loaihanghoa: loaihanghoa
          });
          sanpham.masp = 'SP' + sanpham._id.toString().slice(-5);
          sanpham.kho = depot._id;
          sanpham.loaisanpham = loaisanpham._id;
          sanpham.dungluongsku = dungluongsku ? dungluongsku._id : null;
          tongtien += Number(price);
          _context13.next = 43;
          return regeneratorRuntime.awrap(sanpham.save());

        case 43:
          loaisanpham.sanpham.push(sanpham._id);
          depot.sanpham.push(sanpham._id);
          if (dungluongsku) dungluongsku.sanpham.push(sanpham._id);

          if (!dungluongsku) {
            _context13.next = 49;
            break;
          }

          _context13.next = 49;
          return regeneratorRuntime.awrap(dungluongsku.save());

        case 49:
          addedProducts.push(sanpham);

        case 50:
          i++;
          _context13.next = 34;
          break;

        case 53:
          return _context13.abrupt("continue", 97);

        case 54:
          _iteratorNormalCompletion4 = true;
          _didIteratorError4 = false;
          _iteratorError4 = undefined;
          _context13.prev = 57;
          _iterator4 = imelList[Symbol.iterator]();

        case 59:
          if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
            _context13.next = 83;
            break;
          }

          imel = _step4.value;
          _context13.next = 63;
          return regeneratorRuntime.awrap(SanPham.findOne({
            imel: imel
          }));

        case 63:
          sp = _context13.sent;

          if (!sp) {
            _context13.next = 66;
            break;
          }

          return _context13.abrupt("continue", 80);

        case 66:
          _sanpham = new SanPham({
            name: _name2,
            imel: imel,
            datenhap: loaisanpham.date,
            price: price,
            loaihanghoa: loaihanghoa
          });
          _sanpham.masp = 'SP' + _sanpham._id.toString().slice(-5);
          _sanpham.kho = depot._id;
          _sanpham.loaisanpham = loaisanpham._id;
          _sanpham.dungluongsku = dungluongsku._id;
          tongtien += Number(price);
          _context13.next = 74;
          return regeneratorRuntime.awrap(_sanpham.save());

        case 74:
          loaisanpham.sanpham.push(_sanpham._id);
          depot.sanpham.push(_sanpham._id);
          dungluongsku.sanpham.push(_sanpham._id);
          _context13.next = 79;
          return regeneratorRuntime.awrap(dungluongsku.save());

        case 79:
          addedProducts.push(_sanpham);

        case 80:
          _iteratorNormalCompletion4 = true;
          _context13.next = 59;
          break;

        case 83:
          _context13.next = 89;
          break;

        case 85:
          _context13.prev = 85;
          _context13.t0 = _context13["catch"](57);
          _didIteratorError4 = true;
          _iteratorError4 = _context13.t0;

        case 89:
          _context13.prev = 89;
          _context13.prev = 90;

          if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
            _iterator4["return"]();
          }

        case 92:
          _context13.prev = 92;

          if (!_didIteratorError4) {
            _context13.next = 95;
            break;
          }

          throw _iteratorError4;

        case 95:
          return _context13.finish(92);

        case 96:
          return _context13.finish(89);

        case 97:
          _iteratorNormalCompletion3 = true;
          _context13.next = 26;
          break;

        case 100:
          _context13.next = 106;
          break;

        case 102:
          _context13.prev = 102;
          _context13.t1 = _context13["catch"](24);
          _didIteratorError3 = true;
          _iteratorError3 = _context13.t1;

        case 106:
          _context13.prev = 106;
          _context13.prev = 107;

          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }

        case 109:
          _context13.prev = 109;

          if (!_didIteratorError3) {
            _context13.next = 112;
            break;
          }

          throw _iteratorError3;

        case 112:
          return _context13.finish(109);

        case 113:
          return _context13.finish(106);

        case 114:
          loaisanpham.tongtien = tongtien;

          if (!(ghino === 'ghino')) {
            _context13.next = 126;
            break;
          }

          loaisanpham.ghino = true;
          trano = new TraNo({
            nhacungcap: nhacungcap._id
          });
          trano.donno.push({
            loaisanpham: loaisanpham._id,
            tienno: loaisanpham.tongtien,
            tienphaitra: loaisanpham.tongtien,
            tiendatra: 0
          });
          trano.tongno = trano.donno.reduce(function (sum, item) {
            return sum + item.tienno;
          }, 0);
          trano.tongtra = trano.donno.reduce(function (sum, item) {
            return sum + item.tiendatra;
          }, 0);
          nhacungcap.trano.push(trano._id);
          _context13.next = 124;
          return regeneratorRuntime.awrap(trano.save());

        case 124:
          _context13.next = 129;
          break;

        case 126:
          loaisanpham.ghino = false;
          if (method === 'Tiền mặt') loaisanpham.method = 'tienmat';

          if (method === 'Chuyển khoản') {
            loaisanpham.method = 'chuyenkhoan';
            loaisanpham.nganhang = nganhangkho._id;
          }

        case 129:
          _context13.next = 131;
          return regeneratorRuntime.awrap(loaisanpham.save());

        case 131:
          depot.loaisanpham.push(loaisanpham._id);
          nhacungcap.loaisanpham.push(loaisanpham._id);
          _context13.next = 135;
          return regeneratorRuntime.awrap(nhacungcap.save());

        case 135:
          _context13.next = 137;
          return regeneratorRuntime.awrap(depot.save());

        case 137:
          ncc = {
            _id: loaisanpham._id,
            malsp: loaisanpham.malsp,
            name: loaisanpham.name,
            tongtien: loaisanpham.tongtien,
            date: moment(loaisanpham.date).format('DD/MM/YYYY')
          };
          sendEvent({
            message: "S\u1EA3n ph\u1EA9m m\u1EDBi \u0111\xE3 \u0111\u01B0\u1EE3c th\xEAm: ".concat(ncc)
          });
          res.json(ncc);
          _context13.next = 146;
          break;

        case 142:
          _context13.prev = 142;
          _context13.t2 = _context13["catch"](0);
          console.error(_context13.t2);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 146:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[0, 142], [24, 102, 106, 114], [57, 85, 89, 97], [90,, 92, 96], [107,, 109, 113]]);
});
router.post('/postloaisanpham5/:depotid', function _callee14(req, res) {
  var depotid, depot, loaisanpham;
  return regeneratorRuntime.async(function _callee14$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          depotid = req.params.depotid;
          _context14.next = 4;
          return regeneratorRuntime.awrap(Depot.findById(depotid));

        case 4:
          depot = _context14.sent;
          loaisanpham = new LoaiSanPham({
            name: '',
            depot: depotid,
            loaihanghoa: ''
          });
          depot.loaisanpham.push(loaisanpham._id);
          loaisanpham.malsp = 'LH' + loaisanpham._id.toString().slice(-5);
          _context14.next = 10;
          return regeneratorRuntime.awrap(depot.save());

        case 10:
          _context14.next = 12;
          return regeneratorRuntime.awrap(loaisanpham.save());

        case 12:
          sendEvent({
            message: "l\xF4 h\xE0ng m\u1EDBi \u0111\xE3 \u0111\u01B0\u1EE3c th\xEAm"
          });
          res.json(loaisanpham);
          _context14.next = 20;
          break;

        case 16:
          _context14.prev = 16;
          _context14.t0 = _context14["catch"](0);
          console.error(_context14.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 20:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[0, 16]]);
});
router.post('/updateloaisanpham4', function _callee15(req, res) {
  var _req$body6, malo, name, date, mancc, ghino, hour, method, manganhangkho, loaihanghoa, products, loaisanpham, nhacungcap, depot, formattedDate, formattedHour, nganhangkho, updatedProducts, tongtien, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, product, madungluongsku, imelList, _name3, price, soluong, dungluongsku, i, sanpham, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, imel, sp, trano, donno, updatedData;

  return regeneratorRuntime.async(function _callee15$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          _req$body6 = req.body, malo = _req$body6.malo, name = _req$body6.name, date = _req$body6.date, mancc = _req$body6.mancc, ghino = _req$body6.ghino, hour = _req$body6.hour, method = _req$body6.method, manganhangkho = _req$body6.manganhangkho, loaihanghoa = _req$body6.loaihanghoa, products = _req$body6.products;
          _context15.next = 4;
          return regeneratorRuntime.awrap(LoaiSanPham.findOne({
            malsp: malo
          }));

        case 4:
          loaisanpham = _context15.sent;

          if (loaisanpham) {
            _context15.next = 7;
            break;
          }

          return _context15.abrupt("return", res.status(404).json({
            message: 'Loại sản phẩm không tồn tại.'
          }));

        case 7:
          _context15.next = 9;
          return regeneratorRuntime.awrap(NhanCungCap.findOne({
            mancc: mancc
          }));

        case 9:
          nhacungcap = _context15.sent;
          _context15.next = 12;
          return regeneratorRuntime.awrap(Depot.findById(nhacungcap.depotId));

        case 12:
          depot = _context15.sent;
          formattedDate = moment(date).isValid() ? moment(date).toDate() : null;

          if (formattedDate) {
            _context15.next = 16;
            break;
          }

          return _context15.abrupt("return", res.json({
            message: 'Ngày không hợp lệ.'
          }));

        case 16:
          formattedHour = moment(hour).isValid() ? moment(hour).toDate() : null;

          if (formattedHour) {
            _context15.next = 19;
            break;
          }

          return _context15.abrupt("return", res.json({
            message: 'Giờ không hợp lệ.'
          }));

        case 19:
          _context15.next = 21;
          return regeneratorRuntime.awrap(NganHang.findOne({
            manganhangkho: manganhangkho
          }));

        case 21:
          nganhangkho = _context15.sent;
          loaisanpham.name = name;
          loaisanpham.date = formattedDate;
          loaisanpham.hour = formattedHour;
          loaisanpham.nhacungcap = nhacungcap._id;
          loaisanpham.loaihanghoa = loaihanghoa;
          updatedProducts = [];
          tongtien = 0;
          _iteratorNormalCompletion5 = true;
          _didIteratorError5 = false;
          _iteratorError5 = undefined;
          _context15.prev = 32;
          _iterator5 = products[Symbol.iterator]();

        case 34:
          if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
            _context15.next = 120;
            break;
          }

          product = _step5.value;
          madungluongsku = product.madungluongsku, imelList = product.imelList, _name3 = product.name, price = product.price, soluong = product.soluong;
          _context15.next = 39;
          return regeneratorRuntime.awrap(DungLuongSku.findOne({
            madungluong: madungluongsku
          }));

        case 39:
          dungluongsku = _context15.sent;

          if (!(!imelList || imelList.length === 0)) {
            _context15.next = 62;
            break;
          }

          i = 0;

        case 42:
          if (!(i < soluong)) {
            _context15.next = 61;
            break;
          }

          sanpham = new SanPham({
            name: _name3,
            datenhap: loaisanpham.date,
            price: price,
            loaihanghoa: loaihanghoa
          });
          sanpham.masp = 'SP' + sanpham._id.toString().slice(-5);
          sanpham.kho = depot._id;
          sanpham.loaisanpham = loaisanpham._id;
          sanpham.dungluongsku = dungluongsku ? dungluongsku._id : null;
          tongtien += Number(price);
          _context15.next = 51;
          return regeneratorRuntime.awrap(sanpham.save());

        case 51:
          loaisanpham.sanpham.push(sanpham._id);
          depot.sanpham.push(sanpham._id);
          if (dungluongsku) dungluongsku.sanpham.push(sanpham._id);

          if (!dungluongsku) {
            _context15.next = 57;
            break;
          }

          _context15.next = 57;
          return regeneratorRuntime.awrap(dungluongsku.save());

        case 57:
          updatedProducts.push(sanpham);

        case 58:
          i++;
          _context15.next = 42;
          break;

        case 61:
          return _context15.abrupt("continue", 117);

        case 62:
          _iteratorNormalCompletion6 = true;
          _didIteratorError6 = false;
          _iteratorError6 = undefined;
          _context15.prev = 65;
          _iterator6 = imelList[Symbol.iterator]();

        case 67:
          if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
            _context15.next = 103;
            break;
          }

          imel = _step6.value;
          _context15.next = 71;
          return regeneratorRuntime.awrap(SanPham.findOne({
            imel: imel
          }));

        case 71:
          sp = _context15.sent;

          if (!sp) {
            _context15.next = 85;
            break;
          }

          sp.name = _name3;
          sp.datenhap = loaisanpham.date;
          sp.price = price;
          sp.loaihanghoa = loaihanghoa;
          sp.kho = depot._id;
          sp.loaisanpham = loaisanpham._id;
          sp.dungluongsku = dungluongsku ? dungluongsku._id : null;
          tongtien += Number(price);
          _context15.next = 83;
          return regeneratorRuntime.awrap(sp.save());

        case 83:
          _context15.next = 99;
          break;

        case 85:
          sp = new SanPham({
            name: _name3,
            imel: imel,
            datenhap: loaisanpham.date,
            price: price,
            loaihanghoa: loaihanghoa
          });
          sp.masp = 'SP' + sp._id.toString().slice(-5);
          sp.kho = depot._id;
          sp.loaisanpham = loaisanpham._id;
          sp.dungluongsku = dungluongsku ? dungluongsku._id : null;
          tongtien += Number(price);
          _context15.next = 93;
          return regeneratorRuntime.awrap(sp.save());

        case 93:
          loaisanpham.sanpham.push(sp._id);
          depot.sanpham.push(sp._id);

          if (!dungluongsku) {
            _context15.next = 99;
            break;
          }

          dungluongsku.sanpham.push(sp._id);
          _context15.next = 99;
          return regeneratorRuntime.awrap(dungluongsku.save());

        case 99:
          updatedProducts.push(sp);

        case 100:
          _iteratorNormalCompletion6 = true;
          _context15.next = 67;
          break;

        case 103:
          _context15.next = 109;
          break;

        case 105:
          _context15.prev = 105;
          _context15.t0 = _context15["catch"](65);
          _didIteratorError6 = true;
          _iteratorError6 = _context15.t0;

        case 109:
          _context15.prev = 109;
          _context15.prev = 110;

          if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
            _iterator6["return"]();
          }

        case 112:
          _context15.prev = 112;

          if (!_didIteratorError6) {
            _context15.next = 115;
            break;
          }

          throw _iteratorError6;

        case 115:
          return _context15.finish(112);

        case 116:
          return _context15.finish(109);

        case 117:
          _iteratorNormalCompletion5 = true;
          _context15.next = 34;
          break;

        case 120:
          _context15.next = 126;
          break;

        case 122:
          _context15.prev = 122;
          _context15.t1 = _context15["catch"](32);
          _didIteratorError5 = true;
          _iteratorError5 = _context15.t1;

        case 126:
          _context15.prev = 126;
          _context15.prev = 127;

          if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
            _iterator5["return"]();
          }

        case 129:
          _context15.prev = 129;

          if (!_didIteratorError5) {
            _context15.next = 132;
            break;
          }

          throw _iteratorError5;

        case 132:
          return _context15.finish(129);

        case 133:
          return _context15.finish(126);

        case 134:
          loaisanpham.tongtien = tongtien;

          if (!(ghino === 'ghino')) {
            _context15.next = 149;
            break;
          }

          loaisanpham.ghino = true;
          _context15.next = 139;
          return regeneratorRuntime.awrap(TraNo.findOne({
            nhacungcap: nhacungcap._id
          }));

        case 139:
          trano = _context15.sent;

          if (!trano) {
            _context15.next = 147;
            break;
          }

          donno = trano.donno.find(function (dn) {
            return dn.loaisanpham.toString() === loaisanpham._id.toString();
          });

          if (donno) {
            donno.tienno = loaisanpham.tongtien;
            donno.tienphaitra = loaisanpham.tongtien;
          } else {
            trano.donno.push({
              loaisanpham: loaisanpham._id,
              tienno: loaisanpham.tongtien,
              tienphaitra: loaisanpham.tongtien,
              tiendatra: 0
            });
          }

          trano.tongno = trano.donno.reduce(function (sum, item) {
            return sum + item.tienno;
          }, 0);
          trano.tongtra = trano.donno.reduce(function (sum, item) {
            return sum + item.tiendatra;
          }, 0);
          _context15.next = 147;
          return regeneratorRuntime.awrap(trano.save());

        case 147:
          _context15.next = 152;
          break;

        case 149:
          loaisanpham.ghino = false;
          if (method === 'Tiền mặt') loaisanpham.method = 'tienmat';

          if (method === 'Chuyển khoản') {
            loaisanpham.method = 'chuyenkhoan';
            loaisanpham.nganhang = nganhangkho._id;
          }

        case 152:
          _context15.next = 154;
          return regeneratorRuntime.awrap(loaisanpham.save());

        case 154:
          nhacungcap.loaisanpham.push(loaisanpham._id);
          _context15.next = 157;
          return regeneratorRuntime.awrap(nhacungcap.save());

        case 157:
          _context15.next = 159;
          return regeneratorRuntime.awrap(depot.save());

        case 159:
          updatedData = {
            _id: loaisanpham._id,
            malsp: loaisanpham.malsp,
            name: loaisanpham.name,
            tongtien: loaisanpham.tongtien,
            date: moment(loaisanpham.date).format('DD/MM/YYYY')
          };
          sendEvent({
            message: "S\u1EA3n ph\u1EA9m \u0111\xE3 \u0111\u01B0\u1EE3c c\u1EADp nh\u1EADt: ".concat(updatedData)
          });
          res.json(updatedData);
          _context15.next = 168;
          break;

        case 164:
          _context15.prev = 164;
          _context15.t2 = _context15["catch"](0);
          console.error(_context15.t2);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 168:
        case "end":
          return _context15.stop();
      }
    }
  }, null, null, [[0, 164], [32, 122, 126, 134], [65, 105, 109, 117], [110,, 112, 116], [127,, 129, 133]]);
});
router.get('/getfullchitietlo/:malohang', function _callee17(req, res) {
  var malohang, loaisanpham, sanpham, groupedProducts, result;
  return regeneratorRuntime.async(function _callee17$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          _context17.prev = 0;
          malohang = req.params.malohang;
          _context17.next = 4;
          return regeneratorRuntime.awrap(LoaiSanPham.findOne({
            malsp: malohang
          }));

        case 4:
          loaisanpham = _context17.sent;
          _context17.next = 7;
          return regeneratorRuntime.awrap(Promise.all(loaisanpham.sanpham.map(function _callee16(sp) {
            var sp1, sku;
            return regeneratorRuntime.async(function _callee16$(_context16) {
              while (1) {
                switch (_context16.prev = _context16.next) {
                  case 0:
                    _context16.next = 2;
                    return regeneratorRuntime.awrap(SanPham.findById(sp._id));

                  case 2:
                    sp1 = _context16.sent;
                    _context16.next = 5;
                    return regeneratorRuntime.awrap(DungLuongSku.findById(sp1.dungluongsku));

                  case 5:
                    sku = _context16.sent;
                    return _context16.abrupt("return", {
                      masp: sp1.masp,
                      masku: sku.madungluong,
                      _id: sp1._id,
                      imel: sp1.imel,
                      name: sp1.name,
                      price: sp1.price,
                      quantity: 1,
                      xuat: sp1.xuat
                    });

                  case 7:
                  case "end":
                    return _context16.stop();
                }
              }
            });
          })));

        case 7:
          sanpham = _context17.sent;
          groupedProducts = sanpham.reduce(function (acc, product) {
            var masku = product.masku,
                imel = product.imel,
                price = product.price,
                name = product.name;

            if (!acc[masku]) {
              acc[masku] = _objectSpread({}, product, {
                imel: new Set([imel]),
                quantity: 0,
                total: 0
              });
            }

            acc[masku].imel.add(imel);
            acc[masku].quantity += product.quantity;
            acc[masku].total += price * product.quantity;
            return acc;
          }, {});
          result = Object.values(groupedProducts).map(function (product) {
            return {
              masku: product.masku,
              name: product.name,
              imel: Array.from(product.imel),
              soluong: product.quantity,
              price: parseFloat(product.total / product.quantity),
              tongtien: product.total
            };
          });
          res.json(result);
          _context17.next = 17;
          break;

        case 13:
          _context17.prev = 13;
          _context17.t0 = _context17["catch"](0);
          console.error(_context17.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 17:
        case "end":
          return _context17.stop();
      }
    }
  }, null, null, [[0, 13]]);
});
router.post('/deletelohang', function _callee18(req, res) {
  var malohang, lohang, depot, _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, sp, sanpham, dungluong, index;

  return regeneratorRuntime.async(function _callee18$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          _context18.prev = 0;
          malohang = req.body.malohang;
          _context18.next = 4;
          return regeneratorRuntime.awrap(LoaiSanPham.findOne({
            malsp: malohang
          }));

        case 4:
          lohang = _context18.sent;

          if (lohang) {
            _context18.next = 7;
            break;
          }

          return _context18.abrupt("return", res.status(404).json({
            message: 'Không tìm thấy lô hàng.'
          }));

        case 7:
          _context18.next = 9;
          return regeneratorRuntime.awrap(Depot.findById(lohang.depot));

        case 9:
          depot = _context18.sent;

          if (depot) {
            _context18.next = 12;
            break;
          }

          return _context18.abrupt("return", res.status(404).json({
            message: 'Không tìm thấy depot.'
          }));

        case 12:
          // Xóa sản phẩm trong lô hàng
          _iteratorNormalCompletion7 = true;
          _didIteratorError7 = false;
          _iteratorError7 = undefined;
          _context18.prev = 15;
          _iterator7 = lohang.sanpham[Symbol.iterator]();

        case 17:
          if (_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done) {
            _context18.next = 36;
            break;
          }

          sp = _step7.value;
          _context18.next = 21;
          return regeneratorRuntime.awrap(SanPham.findById(sp._id));

        case 21:
          sanpham = _context18.sent;

          if (sanpham) {
            _context18.next = 24;
            break;
          }

          return _context18.abrupt("continue", 33);

        case 24:
          _context18.next = 26;
          return regeneratorRuntime.awrap(DungLuongSku.findById(sanpham.dungluongsku));

        case 26:
          dungluong = _context18.sent;

          if (!dungluong) {
            _context18.next = 31;
            break;
          }

          dungluong.sanpham.splice(dungluong.sanpham.indexOf(sp._id), 1);
          _context18.next = 31;
          return regeneratorRuntime.awrap(dungluong.save());

        case 31:
          _context18.next = 33;
          return regeneratorRuntime.awrap(SanPham.findByIdAndDelete(sp._id));

        case 33:
          _iteratorNormalCompletion7 = true;
          _context18.next = 17;
          break;

        case 36:
          _context18.next = 42;
          break;

        case 38:
          _context18.prev = 38;
          _context18.t0 = _context18["catch"](15);
          _didIteratorError7 = true;
          _iteratorError7 = _context18.t0;

        case 42:
          _context18.prev = 42;
          _context18.prev = 43;

          if (!_iteratorNormalCompletion7 && _iterator7["return"] != null) {
            _iterator7["return"]();
          }

        case 45:
          _context18.prev = 45;

          if (!_didIteratorError7) {
            _context18.next = 48;
            break;
          }

          throw _iteratorError7;

        case 48:
          return _context18.finish(45);

        case 49:
          return _context18.finish(42);

        case 50:
          // Xóa lô hàng khỏi depot
          index = depot.loaisanpham.indexOf(lohang._id);

          if (!(index !== -1)) {
            _context18.next = 55;
            break;
          }

          depot.loaisanpham.splice(index, 1);
          _context18.next = 55;
          return regeneratorRuntime.awrap(depot.save());

        case 55:
          _context18.next = 57;
          return regeneratorRuntime.awrap(LoaiSanPham.findByIdAndDelete(lohang._id));

        case 57:
          res.json({
            success: 'Xóa lô hàng thành công.'
          });
          _context18.next = 64;
          break;

        case 60:
          _context18.prev = 60;
          _context18.t1 = _context18["catch"](0);
          res.status(500).json({
            message: "L\u1ED7i: ".concat(_context18.t1.message)
          });
          console.error(_context18.t1);

        case 64:
        case "end":
          return _context18.stop();
      }
    }
  }, null, null, [[0, 60], [15, 38, 42, 50], [43,, 45, 49]]);
});
router.post('/postimel', function _callee19(req, res) {
  var _req$body7, malohang, products, loaisanpham, depot, addedProducts, tongtien, _iteratorNormalCompletion8, _didIteratorError8, _iteratorError8, _iterator8, _step8, product, madungluongsku, imelList, name, price, soluong, dungluongsku, i, sanpham, _iteratorNormalCompletion9, _didIteratorError9, _iteratorError9, _iterator9, _step9, imel, sp, _sanpham2;

  return regeneratorRuntime.async(function _callee19$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          _context19.prev = 0;
          _req$body7 = req.body, malohang = _req$body7.malohang, products = _req$body7.products;
          _context19.next = 4;
          return regeneratorRuntime.awrap(LoaiSanPham.findOne({
            malsp: malohang
          }));

        case 4:
          loaisanpham = _context19.sent;

          if (loaisanpham) {
            _context19.next = 7;
            break;
          }

          return _context19.abrupt("return", res.status(400).json({
            message: 'Không tìm thấy lô hàng.'
          }));

        case 7:
          _context19.next = 9;
          return regeneratorRuntime.awrap(Depot.findById(loaisanpham.depot));

        case 9:
          depot = _context19.sent;
          addedProducts = [];
          tongtien = 0;
          _iteratorNormalCompletion8 = true;
          _didIteratorError8 = false;
          _iteratorError8 = undefined;
          _context19.prev = 15;
          _iterator8 = products[Symbol.iterator]();

        case 17:
          if (_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done) {
            _context19.next = 91;
            break;
          }

          product = _step8.value;
          madungluongsku = product.madungluongsku, imelList = product.imelList, name = product.name, price = product.price, soluong = product.soluong;
          _context19.next = 22;
          return regeneratorRuntime.awrap(DungLuongSku.findOne({
            madungluong: madungluongsku
          }));

        case 22:
          dungluongsku = _context19.sent;

          if (!(!imelList || imelList.length === 0)) {
            _context19.next = 45;
            break;
          }

          i = 0;

        case 25:
          if (!(i < soluong)) {
            _context19.next = 44;
            break;
          }

          sanpham = new SanPham({
            name: name,
            datenhap: loaisanpham.date,
            price: 0
          });
          sanpham.masp = 'SP' + sanpham._id.toString().slice(-5);
          sanpham.kho = depot._id;
          sanpham.loaisanpham = loaisanpham._id;
          sanpham.dungluongsku = dungluongsku ? dungluongsku._id : null;
          tongtien += Number(price);
          _context19.next = 34;
          return regeneratorRuntime.awrap(sanpham.save());

        case 34:
          loaisanpham.sanpham.push(sanpham._id);
          depot.sanpham.push(sanpham._id);
          if (dungluongsku) dungluongsku.sanpham.push(sanpham._id);

          if (!dungluongsku) {
            _context19.next = 40;
            break;
          }

          _context19.next = 40;
          return regeneratorRuntime.awrap(dungluongsku.save());

        case 40:
          addedProducts.push(sanpham);

        case 41:
          i++;
          _context19.next = 25;
          break;

        case 44:
          return _context19.abrupt("continue", 88);

        case 45:
          _iteratorNormalCompletion9 = true;
          _didIteratorError9 = false;
          _iteratorError9 = undefined;
          _context19.prev = 48;
          _iterator9 = imelList[Symbol.iterator]();

        case 50:
          if (_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done) {
            _context19.next = 74;
            break;
          }

          imel = _step9.value;
          _context19.next = 54;
          return regeneratorRuntime.awrap(SanPham.findOne({
            imel: imel
          }));

        case 54:
          sp = _context19.sent;

          if (!sp) {
            _context19.next = 57;
            break;
          }

          return _context19.abrupt("continue", 71);

        case 57:
          _sanpham2 = new SanPham({
            name: name,
            imel: imel,
            datenhap: loaisanpham.date,
            price: 0
          });
          _sanpham2.masp = 'SP' + _sanpham2._id.toString().slice(-5);
          _sanpham2.kho = depot._id;
          _sanpham2.loaisanpham = loaisanpham._id;
          _sanpham2.dungluongsku = dungluongsku._id;
          tongtien += Number(price);
          _context19.next = 65;
          return regeneratorRuntime.awrap(_sanpham2.save());

        case 65:
          loaisanpham.sanpham.push(_sanpham2._id);
          depot.sanpham.push(_sanpham2._id);
          dungluongsku.sanpham.push(_sanpham2._id);
          _context19.next = 70;
          return regeneratorRuntime.awrap(dungluongsku.save());

        case 70:
          addedProducts.push(_sanpham2);

        case 71:
          _iteratorNormalCompletion9 = true;
          _context19.next = 50;
          break;

        case 74:
          _context19.next = 80;
          break;

        case 76:
          _context19.prev = 76;
          _context19.t0 = _context19["catch"](48);
          _didIteratorError9 = true;
          _iteratorError9 = _context19.t0;

        case 80:
          _context19.prev = 80;
          _context19.prev = 81;

          if (!_iteratorNormalCompletion9 && _iterator9["return"] != null) {
            _iterator9["return"]();
          }

        case 83:
          _context19.prev = 83;

          if (!_didIteratorError9) {
            _context19.next = 86;
            break;
          }

          throw _iteratorError9;

        case 86:
          return _context19.finish(83);

        case 87:
          return _context19.finish(80);

        case 88:
          _iteratorNormalCompletion8 = true;
          _context19.next = 17;
          break;

        case 91:
          _context19.next = 97;
          break;

        case 93:
          _context19.prev = 93;
          _context19.t1 = _context19["catch"](15);
          _didIteratorError8 = true;
          _iteratorError8 = _context19.t1;

        case 97:
          _context19.prev = 97;
          _context19.prev = 98;

          if (!_iteratorNormalCompletion8 && _iterator8["return"] != null) {
            _iterator8["return"]();
          }

        case 100:
          _context19.prev = 100;

          if (!_didIteratorError8) {
            _context19.next = 103;
            break;
          }

          throw _iteratorError8;

        case 103:
          return _context19.finish(100);

        case 104:
          return _context19.finish(97);

        case 105:
          _context19.next = 107;
          return regeneratorRuntime.awrap(loaisanpham.save());

        case 107:
          _context19.next = 109;
          return regeneratorRuntime.awrap(depot.save());

        case 109:
          sendEvent({
            message: "Th\xEAm imel th\xE0nh c\xF4ng"
          });
          res.json({
            success: 'thêm imel thành công'
          });
          _context19.next = 117;
          break;

        case 113:
          _context19.prev = 113;
          _context19.t2 = _context19["catch"](0);
          res.status(500).json({
            message: "L\u1ED7i: ".concat(_context19.t2.message)
          });
          console.error(_context19.t2);

        case 117:
        case "end":
          return _context19.stop();
      }
    }
  }, null, null, [[0, 113], [15, 93, 97, 105], [48, 76, 80, 88], [81,, 83, 87], [98,, 100, 104]]);
});
module.exports = router;
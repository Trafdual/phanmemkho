"use strict";

var router = require('express').Router();

var ThuChi = require('../models/ThuChiModel');

var CongNo = require('../models/CongNoModel');

var HoaDon = require('../models/HoaDonModel');

var LoaiSanPham = require('../models/LoaiSanPhamModel');

var Depot = require('../models/DepotModel');

var DieuChuyen = require('../models/DieuChuyenModel');

router.post('/getdoanhthu/:depotid', function _callee(req, res) {
  var depotId, _req$query, fromDate, endDate, fromDatetruoc, endDatetruoc, from, end, fromtruoc, endtruoc, depot, congno, tongCongNo, congnotruoc, tongCongNoTruoc, hoadon, hoadontruoc, loaisanpham, thuchi, dieuchuyen, _thuchi$reduce, tongThu, tongChi, tongThuChi, loaisanphamtruoc, thuchitruoc, dieuchuyentruoc, _thuchitruoc$reduce, tongThutruoc, tongChitruoc, tongThuChitruoc, dieu, dieutruoc, doanhthu, doanhthutruoc, loaisanphamdoanhthu, loaisanphamdoanhthutruoc, doanhthutong, doanhthutongtruoc, doanhthujson;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          depotId = req.params.depotid;
          _req$query = req.query, fromDate = _req$query.fromDate, endDate = _req$query.endDate, fromDatetruoc = _req$query.fromDatetruoc, endDatetruoc = _req$query.endDatetruoc;
          from = new Date(fromDate);
          end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          fromtruoc = new Date(fromDatetruoc);
          endtruoc = new Date(endDatetruoc);
          endtruoc.setHours(23, 59, 59, 999);
          _context.next = 11;
          return regeneratorRuntime.awrap(Depot.findById(depotId).populate('hoadon'));

        case 11:
          depot = _context.sent;

          if (depot) {
            _context.next = 14;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            message: 'Depot không tồn tại.'
          }));

        case 14:
          _context.next = 16;
          return regeneratorRuntime.awrap(CongNo.find({
            depot: depot._id,
            date: {
              $gte: from,
              $lte: end
            }
          }));

        case 16:
          congno = _context.sent;
          console.log(congno);
          tongCongNo = congno.reduce(function (sum, item) {
            return sum + item.tongtien;
          }, 0);
          _context.next = 21;
          return regeneratorRuntime.awrap(CongNo.find({
            depot: depot._id,
            date: {
              $gte: fromtruoc,
              $lte: endtruoc
            }
          }));

        case 21:
          congnotruoc = _context.sent;
          tongCongNoTruoc = congnotruoc.reduce(function (sum, item) {
            return sum + item.tongtien;
          }, 0);
          hoadon = depot.hoadon.filter(function (hd) {
            return new Date(hd.date) >= from && new Date(hd.date) <= end;
          });
          hoadontruoc = depot.hoadon.filter(function (hd) {
            return new Date(hd.date) >= fromtruoc && new Date(hd.date) <= endtruoc;
          });
          _context.next = 27;
          return regeneratorRuntime.awrap(LoaiSanPham.find({
            depot: depotId,
            date: {
              $gte: from,
              $lte: end
            }
          }));

        case 27:
          loaisanpham = _context.sent;
          _context.next = 30;
          return regeneratorRuntime.awrap(ThuChi.find({
            depot: depotId,
            date: {
              $gte: from,
              $lte: end
            }
          }));

        case 30:
          thuchi = _context.sent;
          _context.next = 33;
          return regeneratorRuntime.awrap(DieuChuyen.find({
            depot: depotId,
            date: {
              $gte: from,
              $lte: end
            }
          }));

        case 33:
          dieuchuyen = _context.sent;
          _thuchi$reduce = thuchi.reduce(function (acc, tc) {
            if (tc.loaitien === 'Tiền thu') {
              acc.tongThu += tc.tongtien;
            } else if (tc.loaitien === 'Tiền chi') {
              acc.tongChi += tc.tongtien;
            }

            return acc;
          }, {
            tongThu: 0,
            tongChi: 0
          }), tongThu = _thuchi$reduce.tongThu, tongChi = _thuchi$reduce.tongChi;
          tongThuChi = tongThu - tongChi;
          _context.next = 38;
          return regeneratorRuntime.awrap(LoaiSanPham.find({
            depot: depotId,
            date: {
              $gte: fromtruoc,
              $lte: endtruoc
            }
          }));

        case 38:
          loaisanphamtruoc = _context.sent;
          _context.next = 41;
          return regeneratorRuntime.awrap(ThuChi.find({
            depot: depotId,
            date: {
              $gte: fromtruoc,
              $lte: endtruoc
            }
          }));

        case 41:
          thuchitruoc = _context.sent;
          _context.next = 44;
          return regeneratorRuntime.awrap(DieuChuyen.find({
            depot: depotId,
            date: {
              $gte: fromtruoc,
              $lte: endtruoc
            }
          }));

        case 44:
          dieuchuyentruoc = _context.sent;
          _thuchitruoc$reduce = thuchitruoc.reduce(function (acc, tc) {
            if (tc.loaitien === 'Tiền thu') {
              acc.tongThu += tc.tongtien || 0;
            } else if (tc.loaitien === 'Tiền chi') {
              acc.tongChi += tc.tongtien || 0;
            }

            return acc;
          }, {
            tongThu: 0,
            tongChi: 0
          }), tongThutruoc = _thuchitruoc$reduce.tongThu, tongChitruoc = _thuchitruoc$reduce.tongChi;
          tongThuChitruoc = tongThutruoc - tongChitruoc;
          dieu = dieuchuyen.reduce(function (total, hd) {
            return total + (typeof hd.tongtien === 'number' ? hd.tongtien : 0);
          }, 0);
          dieutruoc = dieuchuyentruoc.reduce(function (total, hd) {
            return total + (typeof hd.tongtien === 'number' ? hd.tongtien : 0);
          }, 0);
          doanhthu = hoadon.reduce(function (total, hd) {
            return total + hd.tongtien;
          }, 0) + dieu;
          doanhthutruoc = hoadontruoc.reduce(function (total, hd) {
            return total + hd.tongtien;
          }, 0) + dieutruoc;
          loaisanphamdoanhthu = loaisanpham.reduce(function (total, lsp) {
            return total + lsp.tongtien;
          }, 0);
          loaisanphamdoanhthutruoc = loaisanphamtruoc.reduce(function (total, lsp) {
            return total + lsp.tongtien;
          }, 0);
          doanhthutong = doanhthu - loaisanphamdoanhthu + tongThuChi - tongCongNo;
          doanhthutongtruoc = doanhthutruoc - loaisanphamdoanhthutruoc + tongThuChitruoc - tongCongNoTruoc;
          doanhthujson = {
            doanhthu: doanhthu,
            doanhthutruoc: doanhthutruoc,
            loaisanphamdoanhthu: loaisanphamdoanhthu,
            loaisanphamdoanhthutruoc: loaisanphamdoanhthutruoc,
            tongThuChi: tongThuChi,
            tongThuChitruoc: tongThuChitruoc,
            tongCongNo: tongCongNo,
            tongCongNoTruoc: tongCongNoTruoc,
            doanhthutong: doanhthutong,
            doanhthutongtruoc: doanhthutongtruoc
          };
          res.json(doanhthujson);
          _context.next = 63;
          break;

        case 59:
          _context.prev = 59;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 63:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 59]]);
});
router.get('/getdoanhthu/:depotid', function _callee2(req, res) {
  var depotId, _req$query2, fromDate, endDate, fromDatetruoc, endDatetruoc, from, end, fromtruoc, endtruoc, hoadon, loaisanpham, thuchi, hoadontruoc, loaisanphamtruoc, thuchitruoc, doanhthu, doanhthutruoc, loaisanphamdoanhthu, loaisanphamdoanhthutruoc, thuchidoanhthu, thuchidoanhthutruoc, doanhthutong, doanhthutongtruoc, doanhthujson;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          depotId = req.params.depotid;
          _req$query2 = req.query, fromDate = _req$query2.fromDate, endDate = _req$query2.endDate, fromDatetruoc = _req$query2.fromDatetruoc, endDatetruoc = _req$query2.endDatetruoc;
          from = new Date(fromDate);
          end = new Date(endDate);
          fromtruoc = new Date(fromDatetruoc);
          endtruoc = new Date(endDatetruoc);
          _context2.next = 9;
          return regeneratorRuntime.awrap(HoaDon.find({
            depot: depotId,
            date: {
              $gte: from,
              $lte: end
            }
          }));

        case 9:
          hoadon = _context2.sent;
          _context2.next = 12;
          return regeneratorRuntime.awrap(LoaiSanPham.find({
            depot: depotId,
            date: {
              $gte: from,
              $lte: end
            }
          }));

        case 12:
          loaisanpham = _context2.sent;
          _context2.next = 15;
          return regeneratorRuntime.awrap(ThuChi.find({
            depot: depotId,
            date: {
              $gte: from,
              $lte: end
            }
          }));

        case 15:
          thuchi = _context2.sent;
          _context2.next = 18;
          return regeneratorRuntime.awrap(HoaDon.find({
            depot: depotId,
            date: {
              $gte: fromtruoc,
              $lte: endtruoc
            }
          }));

        case 18:
          hoadontruoc = _context2.sent;
          _context2.next = 21;
          return regeneratorRuntime.awrap(LoaiSanPham.find({
            depot: depotId,
            date: {
              $gte: fromtruoc,
              $lte: endtruoc
            }
          }));

        case 21:
          loaisanphamtruoc = _context2.sent;
          _context2.next = 24;
          return regeneratorRuntime.awrap(ThuChi.find({
            depot: depotId,
            date: {
              $gte: fromtruoc,
              $lte: endtruoc
            }
          }));

        case 24:
          thuchitruoc = _context2.sent;
          doanhthu = hoadon.reduce(function (total, hd) {
            return total + hd.tongtien;
          }, 0);
          doanhthutruoc = hoadontruoc.reduce(function (total, hd) {
            return total + hd.tongtien;
          }, 0);
          loaisanphamdoanhthu = loaisanpham.reduce(function (total, lsp) {
            return total + lsp.tongtien;
          }, 0);
          loaisanphamdoanhthutruoc = loaisanphamtruoc.reduce(function (total, lsp) {
            return total + lsp.tongtien;
          }, 0);
          thuchidoanhthu = thuchi.reduce(function (total, tc) {
            return total + tc.tongtien;
          }, 0);
          thuchidoanhthutruoc = thuchitruoc.reduce(function (total, tc) {
            return total + tc.tongtien;
          }, 0);
          doanhthutong = doanhthu - loaisanphamdoanhthu - thuchidoanhthu;
          doanhthutongtruoc = doanhthutruoc - loaisanphamdoanhthutruoc - thuchidoanhthutruoc;
          doanhthujson = {
            doanhthu: doanhthu,
            doanhthutruoc: doanhthutruoc,
            loaisanphamdoanhthu: loaisanphamdoanhthu,
            loaisanphamdoanhthutruoc: loaisanphamdoanhthutruoc,
            thuchidoanhthu: thuchidoanhthu,
            thuchidoanhthutruoc: thuchidoanhthutruoc,
            doanhthutong: doanhthutong,
            doanhthutongtruoc: doanhthutongtruoc
          };
          res.json(doanhthujson);
          _context2.next = 41;
          break;

        case 37:
          _context2.prev = 37;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 41:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 37]]);
});
router.get('/getbaocaobanhang/:depotid', function _callee3(req, res) {
  var depotid, _req$query3, fromDate, endDate, depot, from, end, hoadon, tongTienTienMat, tongTienChuyenKhoan, loaisanpham, loaisanphamdoanhthu, baocaojson;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          depotid = req.params.depotid;
          _req$query3 = req.query, fromDate = _req$query3.fromDate, endDate = _req$query3.endDate;
          _context3.next = 5;
          return regeneratorRuntime.awrap(Depot.findById(depotid).populate('hoadon'));

        case 5:
          depot = _context3.sent;
          from = new Date(fromDate);
          end = new Date(endDate);
          hoadon = depot.hoadon.filter(function (hd) {
            return new Date(hd.date) >= from && new Date(hd.date) <= end;
          });
          tongTienTienMat = hoadon.filter(function (hd) {
            return hd.method === 'Tiền mặt';
          }).reduce(function (total, hd) {
            return total + hd.tongtien;
          }, 0);
          tongTienChuyenKhoan = hoadon.filter(function (hd) {
            return hd.method === 'Chuyển khoản';
          }).reduce(function (total, hd) {
            return total + hd.tongtien;
          }, 0);
          _context3.next = 13;
          return regeneratorRuntime.awrap(LoaiSanPham.find({
            depot: depotid,
            date: {
              $gte: from,
              $lte: end
            }
          }));

        case 13:
          loaisanpham = _context3.sent;
          loaisanphamdoanhthu = loaisanpham.reduce(function (total, lsp) {
            return total + lsp.tongtien;
          }, 0);
          baocaojson = {
            tongTienTienMat: tongTienTienMat,
            tongTienChuyenKhoan: tongTienChuyenKhoan,
            loaisanphamdoanhthu: loaisanphamdoanhthu
          };
          res.json(baocaojson);
          _context3.next = 23;
          break;

        case 19:
          _context3.prev = 19;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 23:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 19]]);
});
module.exports = router;
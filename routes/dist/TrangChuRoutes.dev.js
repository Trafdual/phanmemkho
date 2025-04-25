"use strict";

var router = require('express').Router();

var KhachHang = require('../models/KhachHangModel');

var Depot = require('../models/DepotModel');

var HoaDon = require('../models/HoaDonModel');

var SanPham = require('../models/SanPhamModel');

var Sku = require('../models/SkuModel');

var DungLuong = require('../models/DungluongSkuModel');

var LoaiSanPham = require('../models/LoaiSanPhamModel');

var DieuChuyen = require('../models/DieuChuyenModel');

router.get('/topkhachhang/:idkho', function _callee3(req, res) {
  var idkho, depot, topkhachhang, sortedKhachHang, top4KhachHang;
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
          return regeneratorRuntime.awrap(Promise.all(depot.khachang.map(function _callee2(khach) {
            var khachhang, danhSachHoaDon, tongTien;
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return regeneratorRuntime.awrap(KhachHang.findById(khach._id));

                  case 2:
                    khachhang = _context2.sent;
                    _context2.next = 5;
                    return regeneratorRuntime.awrap(Promise.all(khachhang.donhang.map(function _callee(don) {
                      var hoadon;
                      return regeneratorRuntime.async(function _callee$(_context) {
                        while (1) {
                          switch (_context.prev = _context.next) {
                            case 0:
                              _context.next = 2;
                              return regeneratorRuntime.awrap(HoaDon.findById(don._id));

                            case 2:
                              hoadon = _context.sent;
                              return _context.abrupt("return", hoadon ? hoadon.tongtien : 0);

                            case 4:
                            case "end":
                              return _context.stop();
                          }
                        }
                      });
                    })));

                  case 5:
                    danhSachHoaDon = _context2.sent;
                    tongTien = danhSachHoaDon.reduce(function (sum, tien) {
                      return sum + tien;
                    }, 0);
                    return _context2.abrupt("return", {
                      _id: khachhang._id,
                      name: khachhang.name,
                      phone: khachhang.phone,
                      address: khachhang.address,
                      tongtien: tongTien
                    });

                  case 8:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          })));

        case 7:
          topkhachhang = _context3.sent;
          sortedKhachHang = topkhachhang.sort(function (a, b) {
            return b.tongtien - a.tongtien;
          });
          top4KhachHang = sortedKhachHang.slice(0, 8);
          res.json(top4KhachHang);
          _context3.next = 17;
          break;

        case 13:
          _context3.prev = 13;
          _context3.t0 = _context3["catch"](0);
          console.error('Lỗi khi lấy top khách hàng:', _context3.t0);
          res.status(500).json({
            message: 'Lỗi khi lấy top khách hàng',
            error: _context3.t0
          });

        case 17:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 13]]);
});
router.get('/sanphamban/:idkho', function _callee5(req, res) {
  var khoid, kho, sanPhamCount, labels, data, backgroundColor, polarData;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          khoid = req.params.idkho;
          _context5.next = 4;
          return regeneratorRuntime.awrap(Depot.findById(khoid));

        case 4:
          kho = _context5.sent;
          sanPhamCount = {};
          _context5.next = 8;
          return regeneratorRuntime.awrap(Promise.all(kho.xuatkho.map(function _callee4(sp) {
            var sp1, dungluong, masku, masku1;
            return regeneratorRuntime.async(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.next = 2;
                    return regeneratorRuntime.awrap(SanPham.findById(sp));

                  case 2:
                    sp1 = _context4.sent;
                    _context4.next = 5;
                    return regeneratorRuntime.awrap(DungLuong.findById(sp1.dungluongsku));

                  case 5:
                    dungluong = _context4.sent;
                    _context4.next = 8;
                    return regeneratorRuntime.awrap(Sku.findById(dungluong.sku));

                  case 8:
                    masku = _context4.sent;
                    masku1 = masku.name;

                    if (sanPhamCount[masku1]) {
                      sanPhamCount[masku1] += 1;
                    } else {
                      sanPhamCount[masku1] = 1;
                    }

                  case 11:
                  case "end":
                    return _context4.stop();
                }
              }
            });
          })));

        case 8:
          // Chuyển đổi sang định dạng polarData
          labels = Object.keys(sanPhamCount);
          data = Object.values(sanPhamCount);
          backgroundColor = ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)' //   'rgba(75, 192, 192, 1)',
          //   'rgba(153, 102, 255, 1)',
          //   'rgba(255, 159, 64, 1)'
          ]; // Thêm màu nếu có nhiều sản phẩm hơn

          polarData = {
            labels: labels,
            datasets: [{
              label: 'Số lượng máy',
              data: data,
              backgroundColor: backgroundColor.slice(0, labels.length)
            }]
          };
          res.json(polarData);
          _context5.next = 19;
          break;

        case 15:
          _context5.prev = 15;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 19:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 15]]);
});
router.get('/doanhthutheothang/:idkho', function _callee9(req, res) {
  var khoid, kho, year, tongTienHoaDon, tongTienLoaiSP, doanhThuTheoThang, tongtiendieuchuyen, i, barData;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          khoid = req.params.idkho;
          _context9.next = 4;
          return regeneratorRuntime.awrap(Depot.findById(khoid));

        case 4:
          kho = _context9.sent;

          if (kho) {
            _context9.next = 7;
            break;
          }

          return _context9.abrupt("return", res.status(404).json({
            message: 'Không tìm thấy kho.'
          }));

        case 7:
          year = new Date().getFullYear();
          tongTienHoaDon = Array(12).fill(0);
          tongTienLoaiSP = Array(12).fill(0);
          doanhThuTheoThang = Array(12).fill(0);
          tongtiendieuchuyen = Array(12).fill(0); // Tính tổng tiền hóa đơn theo tháng

          _context9.next = 14;
          return regeneratorRuntime.awrap(Promise.all(kho.hoadon.map(function _callee6(hd) {
            var hoaDon, ngayLap, month;
            return regeneratorRuntime.async(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    _context6.next = 2;
                    return regeneratorRuntime.awrap(HoaDon.findById(hd._id));

                  case 2:
                    hoaDon = _context6.sent;

                    if (hoaDon && hoaDon.date) {
                      ngayLap = new Date(hoaDon.date); // Nếu hóa đơn thuộc năm hiện tại, thêm tổng tiền vào tháng tương ứng

                      if (ngayLap.getFullYear() === year) {
                        month = ngayLap.getMonth(); // Lấy tháng (0-11)

                        tongTienHoaDon[month] += hoaDon.tongtien;
                      }
                    }

                  case 4:
                  case "end":
                    return _context6.stop();
                }
              }
            });
          })));

        case 14:
          _context9.next = 16;
          return regeneratorRuntime.awrap(Promise.all(kho.loaisanpham.map(function _callee7(loaiSP) {
            var loaiSanPham, ngayLap, month;
            return regeneratorRuntime.async(function _callee7$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    _context7.next = 2;
                    return regeneratorRuntime.awrap(LoaiSanPham.findById(loaiSP._id));

                  case 2:
                    loaiSanPham = _context7.sent;

                    if (loaiSanPham && loaiSanPham.date) {
                      ngayLap = new Date(loaiSanPham.date);

                      if (ngayLap.getFullYear() === year) {
                        month = ngayLap.getMonth();
                        tongTienLoaiSP[month] += loaiSanPham.tongtien;
                      }
                    }

                  case 4:
                  case "end":
                    return _context7.stop();
                }
              }
            });
          })));

        case 16:
          _context9.next = 18;
          return regeneratorRuntime.awrap(Promise.all(kho.dieuchuyen.map(function _callee8(dieuchuyen) {
            var dieuchuyen1, ngayLap, month, tongtien;
            return regeneratorRuntime.async(function _callee8$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    _context8.next = 2;
                    return regeneratorRuntime.awrap(DieuChuyen.findById(dieuchuyen._id));

                  case 2:
                    dieuchuyen1 = _context8.sent;

                    if (dieuchuyen1 && dieuchuyen1.date) {
                      ngayLap = new Date(dieuchuyen1.date);

                      if (ngayLap.getFullYear() === year) {
                        month = ngayLap.getMonth();
                        tongtien = typeof dieuchuyen1.tongtien === 'number' ? dieuchuyen1.tongtien : 0;
                        tongtiendieuchuyen[month] = (tongtiendieuchuyen[month] || 0) + tongtien;
                      }
                    }

                  case 4:
                  case "end":
                    return _context8.stop();
                }
              }
            });
          })));

        case 18:
          // Tính doanh thu từng tháng
          for (i = 0; i < 12; i++) {
            doanhThuTheoThang[i] = tongTienHoaDon[i] - tongTienLoaiSP[i] + tongtiendieuchuyen[i];
          } // Tạo dữ liệu theo cấu trúc barData


          barData = {
            labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
            datasets: [{
              label: 'Doanh Thu',
              data: doanhThuTheoThang,
              backgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)']
            }]
          }; // Trả về dữ liệu

          res.json(barData);
          _context9.next = 27;
          break;

        case 23:
          _context9.prev = 23;
          _context9.t0 = _context9["catch"](0);
          console.error(_context9.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 27:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 23]]);
});
module.exports = router;
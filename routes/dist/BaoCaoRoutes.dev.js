"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var router = require('express').Router();

var SanPham = require('../models/SanPhamModel');

var LoaiSanPham = require('../models/LoaiSanPhamModel');

var mongoose = require('mongoose');

var DePot = require('../models/DepotModel');

var DungLuongSku = require('../models/DungluongSkuModel');

var Sku = require('../models/SkuModel');

var CongNo = require('../models/CongNoModel');

var KhachHang = require('../models/KhachHangModel');

var NhomKhacHang = require('../models/NhomKhacHangModel');

var MucThuChi = require('../models/MucThuChiModel');

var ThuChi = require('../models/ThuChiModel');

var HoaDon = require('../models/HoaDonModel');

var DieuChuyen = require('../models/DieuChuyenModel');

var moment = require('moment');

router.get('/getsptest/:khoID', function _callee2(req, res) {
  var khoId, _req$query, fromDate, endDate, from, end, prevDay, dieuchuyen, depot, sanPhamDieuChuyen, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, dc, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, spId, allSanPhamIds, uniqueSanPhamIds, sanphamtest, gopSanPham;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          khoId = req.params.khoID;
          _req$query = req.query, fromDate = _req$query.fromDate, endDate = _req$query.endDate;
          from = new Date(fromDate);
          end = new Date(endDate);
          prevDay = new Date(fromDate);
          prevDay.setDate(prevDay.getDate() - 1);
          _context2.next = 9;
          return regeneratorRuntime.awrap(DieuChuyen.find({
            depot: khoId,
            date: {
              $gte: from,
              $lte: end
            }
          }));

        case 9:
          dieuchuyen = _context2.sent;
          console.log(dieuchuyen);
          _context2.next = 13;
          return regeneratorRuntime.awrap(DePot.findById(khoId));

        case 13:
          depot = _context2.sent;
          sanPhamDieuChuyen = [];
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context2.prev = 18;
          _iterator = dieuchuyen[Symbol.iterator]();

        case 20:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context2.next = 44;
            break;
          }

          dc = _step.value;
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context2.prev = 25;

          for (_iterator2 = dc.sanpham[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            spId = _step2.value;
            sanPhamDieuChuyen.push(spId);
          }

          _context2.next = 33;
          break;

        case 29:
          _context2.prev = 29;
          _context2.t0 = _context2["catch"](25);
          _didIteratorError2 = true;
          _iteratorError2 = _context2.t0;

        case 33:
          _context2.prev = 33;
          _context2.prev = 34;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 36:
          _context2.prev = 36;

          if (!_didIteratorError2) {
            _context2.next = 39;
            break;
          }

          throw _iteratorError2;

        case 39:
          return _context2.finish(36);

        case 40:
          return _context2.finish(33);

        case 41:
          _iteratorNormalCompletion = true;
          _context2.next = 20;
          break;

        case 44:
          _context2.next = 50;
          break;

        case 46:
          _context2.prev = 46;
          _context2.t1 = _context2["catch"](18);
          _didIteratorError = true;
          _iteratorError = _context2.t1;

        case 50:
          _context2.prev = 50;
          _context2.prev = 51;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 53:
          _context2.prev = 53;

          if (!_didIteratorError) {
            _context2.next = 56;
            break;
          }

          throw _iteratorError;

        case 56:
          return _context2.finish(53);

        case 57:
          return _context2.finish(50);

        case 58:
          allSanPhamIds = [].concat(_toConsumableArray(depot.sanpham.map(function (sp) {
            return sp._id.toString();
          })), _toConsumableArray(sanPhamDieuChuyen.map(function (id) {
            return id.toString();
          })));
          uniqueSanPhamIds = _toConsumableArray(new Set(allSanPhamIds));
          _context2.next = 62;
          return regeneratorRuntime.awrap(Promise.all(uniqueSanPhamIds.map(function _callee(spId) {
            var sanpham1, dungluongsku, sku, sanphamjson;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return regeneratorRuntime.awrap(SanPham.findById(spId));

                  case 2:
                    sanpham1 = _context.sent;
                    _context.next = 5;
                    return regeneratorRuntime.awrap(DungLuongSku.findById(sanpham1.dungluongsku));

                  case 5:
                    dungluongsku = _context.sent;
                    _context.next = 8;
                    return regeneratorRuntime.awrap(Sku.findById(dungluongsku.sku));

                  case 8:
                    sku = _context.sent;
                    sanphamjson = {
                      _id: sanpham1._id,
                      masp: sanpham1.masp,
                      madungluongsku: dungluongsku.madungluong,
                      name: sanpham1.name,
                      datenhap: sanpham1.datenhap,
                      price: sanpham1.price,
                      datexuat: sanpham1.datexuat,
                      xuat: sanpham1.xuat
                    };
                    return _context.abrupt("return", {
                      masku: sku.masku,
                      namesku: sku.name,
                      sanpham: sanphamjson
                    });

                  case 11:
                  case "end":
                    return _context.stop();
                }
              }
            });
          })));

        case 62:
          sanphamtest = _context2.sent;
          gopSanPham = sanphamtest.reduce(function (acc, item) {
            var existingSku = acc.find(function (x) {
              return x.masku === item.masku;
            });

            if (existingSku) {
              existingSku.sanpham.push(item.sanpham);
            } else {
              acc.push({
                masku: item.masku,
                namesku: item.namesku,
                sanpham: [item.sanpham]
              });
            }

            return acc;
          }, []);
          gopSanPham.forEach(function (skuItem) {
            var gopDungLuong = skuItem.sanpham.reduce(function (acc, product) {
              var existingDungLuong = acc.find(function (p) {
                return p.madungluongsku === product.madungluongsku;
              });
              var datenhapArray = Array.isArray(product.datenhap) ? product.datenhap : [product.datenhap];

              if (existingDungLuong) {
                var _existingDungLuong$da;

                (_existingDungLuong$da = existingDungLuong.datenhap).push.apply(_existingDungLuong$da, _toConsumableArray(datenhapArray));
              } else {
                acc.push({
                  madungluongsku: product.madungluongsku,
                  name: product.name,
                  datenhap: _toConsumableArray(datenhapArray),
                  soluongsp: 0,
                  price: 0,
                  tondauky: {
                    soluong: 0,
                    price: 0
                  },
                  nhaptrongky: {
                    soluong: 0,
                    price: 0
                  },
                  xuattrongky: {
                    soluong: 0,
                    price: 0
                  },
                  toncuoiky: {
                    soluong: 0,
                    price: 0
                  }
                });
                existingDungLuong = acc[acc.length - 1];
              }

              datenhapArray.forEach(function (date) {
                var dateObj = new Date(date);

                if (dateObj >= from && dateObj <= end) {
                  existingDungLuong.price += product.price;
                }
              });
              return acc;
            }, []);
            gopDungLuong.forEach(function (dungluong) {
              dungluong.datenhap = dungluong.datenhap.filter(function (date) {
                var dateObj = new Date(date);
                return dateObj;
              });

              if (dungluong.datenhap.length > 0) {
                dungluong.soluongsp = dungluong.datenhap.length; // dungluong.nhaptrongky.soluong = dungluong.datenhap.filter(date => {
                //   return (
                //     new Date(date).setHours(0, 0, 0, 0) >=
                //       from.setHours(0, 0, 0, 0) &&
                //     new Date(date).setHours(0, 0, 0, 0) <= end.setHours(0, 0, 0, 0)
                //   )
                // }).length

                var productsOnPrevDay = [];
                skuItem.sanpham.forEach(function (product) {
                  if (product.madungluongsku === dungluong.madungluongsku) {
                    var productDate = new Date(product.datenhap).setHours(0, 0, 0, 0);
                    var productdatexuat = new Date(product.datexuat).setHours(0, 0, 0, 0);
                    var fromdate = new Date(from).setHours(0, 0, 0, 0);
                    var enddate = new Date(end).setHours(0, 0, 0, 0);
                    var prevDayDate = new Date(prevDay).setHours(0, 0, 0, 0);

                    if (productDate >= fromdate && productDate <= enddate) {
                      dungluong.nhaptrongky.soluong++;
                      dungluong.nhaptrongky.price += product.price;
                    }

                    if (productDate === prevDayDate) {
                      if (product.xuat === false) {
                        dungluong.tondauky.price += product.price;
                        productsOnPrevDay.push(product);
                      }
                    }

                    if (productdatexuat >= fromdate && productdatexuat <= enddate) {
                      var isDieuChuyen = dieuchuyen.some(function (dc) {
                        return dc.sanpham.some(function (spId) {
                          return spId.toString() === product._id.toString();
                        });
                      });

                      if (product.xuat === true || isDieuChuyen) {
                        console.log(product);
                        dungluong.xuattrongky.soluong++;
                        dungluong.xuattrongky.price += product.price;
                      }
                    }
                  }
                });
                dungluong.tondauky.soluong = productsOnPrevDay.length;
                dungluong.toncuoiky.soluong = dungluong.tondauky.soluong + dungluong.nhaptrongky.soluong - dungluong.xuattrongky.soluong;
                dungluong.toncuoiky.price = dungluong.tondauky.price + dungluong.nhaptrongky.price - dungluong.xuattrongky.price;
              }
            });
            skuItem.tongtondau = skuItem.tongtondau || {
              soluong: 0,
              price: 0
            };
            skuItem.tongnhaptrong = skuItem.tongnhaptrong || {
              soluong: 0,
              price: 0
            };
            skuItem.tongxuattrong = skuItem.tongxuattrong || {
              soluong: 0,
              price: 0
            };
            skuItem.tongtoncuoiky = skuItem.tongtoncuoiky || {
              soluong: 0,
              price: 0
            };
            skuItem.soluongsanpham = gopDungLuong.reduce(function (total, product) {
              return total + product.soluongsp;
            }, 0);
            skuItem.tongtondau.price = gopDungLuong.reduce(function (total, product) {
              return total + product.tondauky.price;
            }, 0);
            skuItem.tongnhaptrong.price = gopDungLuong.reduce(function (total, product) {
              return total + product.nhaptrongky.price;
            }, 0);
            skuItem.tongxuattrong.price = gopDungLuong.reduce(function (total, product) {
              return total + product.xuattrongky.price;
            }, 0);
            skuItem.tongtoncuoiky.price = gopDungLuong.reduce(function (total, product) {
              return total + product.toncuoiky.price;
            }, 0);
            skuItem.tongtondau.soluong = gopDungLuong.reduce(function (total, product) {
              return total + product.tondauky.soluong;
            }, 0);
            skuItem.tongnhaptrong.soluong = gopDungLuong.reduce(function (total, product) {
              return total + product.nhaptrongky.soluong;
            }, 0);
            skuItem.tongxuattrong.soluong = gopDungLuong.reduce(function (total, product) {
              return total + product.xuattrongky.soluong;
            }, 0);
            skuItem.tongtoncuoiky.soluong = gopDungLuong.reduce(function (total, product) {
              return total + product.toncuoiky.soluong;
            }, 0);
            skuItem.sanpham = gopDungLuong;
          });
          res.json(gopSanPham);
          _context2.next = 72;
          break;

        case 68:
          _context2.prev = 68;
          _context2.t2 = _context2["catch"](0);
          console.error(_context2.t2);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 72:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 68], [18, 46, 50, 58], [25, 29, 33, 41], [34,, 36, 40], [51,, 53, 57]]);
});
router.post('/getcongno/:idkho', function _callee4(req, res) {
  var idkho, depot, _req$query2, fromdate, enddate, from, end, prevMonthEnd, prevMonthStart, congnoLastMonth, lastMonthData, congno, congno1;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          idkho = req.params.idkho;
          _context4.next = 4;
          return regeneratorRuntime.awrap(DePot.findById(idkho));

        case 4:
          depot = _context4.sent;
          _req$query2 = req.query, fromdate = _req$query2.fromdate, enddate = _req$query2.enddate;
          from = new Date(fromdate);
          end = new Date(enddate);
          end.setUTCHours(23, 59, 59, 999);
          prevMonthEnd = new Date(from);
          prevMonthEnd.setDate(0);
          prevMonthEnd.setUTCHours(23, 59, 59, 999);
          prevMonthStart = new Date(prevMonthEnd.getFullYear(), prevMonthEnd.getMonth(), 1);
          _context4.next = 15;
          return regeneratorRuntime.awrap(CongNo.find({
            depot: depot._id,
            date: {
              $gte: prevMonthStart,
              $lte: prevMonthEnd
            }
          }));

        case 15:
          congnoLastMonth = _context4.sent;
          console.log(prevMonthEnd);
          lastMonthData = {};
          congnoLastMonth.forEach(function (cn) {
            lastMonthData[cn.khachhang] = cn.tongtien;
          });
          _context4.next = 21;
          return regeneratorRuntime.awrap(CongNo.find({
            depot: depot._id,
            date: {
              $gte: from,
              $lte: end
            }
          }));

        case 21:
          congno = _context4.sent;
          _context4.next = 24;
          return regeneratorRuntime.awrap(Promise.all(congno.map(function _callee3(cn) {
            var khachhang, nhomkhachhang, tangTrongKy, nodauky;
            return regeneratorRuntime.async(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return regeneratorRuntime.awrap(KhachHang.findById(cn.khachhang));

                  case 2:
                    khachhang = _context3.sent;
                    _context3.next = 5;
                    return regeneratorRuntime.awrap(NhomKhacHang.findById(khachhang.nhomkhachhang));

                  case 5:
                    nhomkhachhang = _context3.sent;
                    tangTrongKy = congno.filter(function (transaction) {
                      return transaction.khachhang.toString() === cn.khachhang.toString();
                    }).reduce(function (sum, transaction) {
                      return sum + transaction.tongtien;
                    }, 0);
                    nodauky = lastMonthData[cn.khachhang] || 0;
                    return _context3.abrupt("return", {
                      makh: khachhang.makh,
                      namekhach: khachhang.name,
                      nhomkhachhang: nhomkhachhang.name,
                      phone: khachhang.phone,
                      nodauky: nodauky,
                      tangtrongky: tangTrongKy,
                      giamtrongky: 0
                    });

                  case 9:
                  case "end":
                    return _context3.stop();
                }
              }
            });
          })));

        case 24:
          congno1 = _context4.sent;
          res.json(congno1);
          _context4.next = 32;
          break;

        case 28:
          _context4.prev = 28;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 32:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 28]]);
});
router.get('/getcongno3/:idkho', function _callee6(req, res) {
  var idkho, depot, _req$query3, fromdate, enddate, from, end, previousFrom, previousEnd, mucThuChiCongNo, giamTrongKyThuChi, giamTrongKyTruoc, congnoAllPreviousMonths, congnoCurrentMonth, khachhang;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          idkho = req.params.idkho;
          _context6.next = 4;
          return regeneratorRuntime.awrap(DePot.findById(idkho));

        case 4:
          depot = _context6.sent;
          _req$query3 = req.query, fromdate = _req$query3.fromdate, enddate = _req$query3.enddate;
          from = new Date(fromdate);
          end = new Date(enddate);
          end.setUTCHours(23, 59, 59, 999);
          previousFrom = new Date(from);
          previousFrom.setDate(previousFrom.getDate() - (end.getDate() - from.getDate()));
          previousEnd = new Date(from);
          previousEnd.setDate(previousEnd.getDate() - 1);
          console.log(previousFrom);
          _context6.next = 16;
          return regeneratorRuntime.awrap(MucThuChi.find({
            name: 'công nợ'
          }));

        case 16:
          mucThuChiCongNo = _context6.sent;
          _context6.next = 19;
          return regeneratorRuntime.awrap(ThuChi.find({
            depot: depot._id,
            date: {
              $gte: from,
              $lte: end
            },
            'chitiet.mucthuchi': {
              $in: mucThuChiCongNo.map(function (muc) {
                return muc._id;
              })
            },
            loaitien: 'Tiền thu'
          }));

        case 19:
          giamTrongKyThuChi = _context6.sent;
          _context6.next = 22;
          return regeneratorRuntime.awrap(ThuChi.find({
            depot: depot._id,
            date: {
              $gte: previousFrom,
              $lte: previousEnd
            },
            'chitiet.mucthuchi': {
              $in: mucThuChiCongNo.map(function (muc) {
                return muc._id;
              })
            },
            loaitien: 'Tiền thu'
          }));

        case 22:
          giamTrongKyTruoc = _context6.sent;
          _context6.next = 25;
          return regeneratorRuntime.awrap(CongNo.find({
            depot: depot._id,
            date: {
              $lt: from
            }
          }));

        case 25:
          congnoAllPreviousMonths = _context6.sent;
          _context6.next = 28;
          return regeneratorRuntime.awrap(CongNo.find({
            depot: depot._id,
            date: {
              $gte: from,
              $lte: end
            }
          }));

        case 28:
          congnoCurrentMonth = _context6.sent;
          _context6.next = 31;
          return regeneratorRuntime.awrap(Promise.all(depot.khachang.map(function _callee5(kh) {
            var khachhang, nhomkhachhang, totalTanggtrongky, customerTotalNodauky, totalGiamtrongky, customerCongnoPreviousMonths, customerCongnoCurrentMonth, customerThuChi, customerThuChiTruoc, totalGiamtrongkyTruocDo;
            return regeneratorRuntime.async(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    _context5.next = 2;
                    return regeneratorRuntime.awrap(KhachHang.findById(kh._id));

                  case 2:
                    khachhang = _context5.sent;
                    _context5.next = 5;
                    return regeneratorRuntime.awrap(NhomKhacHang.findById(khachhang.nhomkhachhang));

                  case 5:
                    nhomkhachhang = _context5.sent;
                    totalTanggtrongky = 0;
                    customerTotalNodauky = 0;
                    totalGiamtrongky = 0;
                    customerCongnoPreviousMonths = congnoAllPreviousMonths.filter(function (cn) {
                      return cn.khachhang.toString() === khachhang._id.toString();
                    });
                    customerTotalNodauky = customerCongnoPreviousMonths.reduce(function (sum, cn) {
                      return sum + cn.tongtien;
                    }, 0);
                    customerCongnoCurrentMonth = congnoCurrentMonth.filter(function (cn) {
                      return cn.khachhang.toString() === khachhang._id.toString();
                    });
                    totalTanggtrongky = customerCongnoCurrentMonth.reduce(function (sum, cn) {
                      return sum + cn.tongtien;
                    }, 0);
                    customerThuChi = giamTrongKyThuChi.filter(function (tc) {
                      return tc.doituong.toString() === khachhang._id.toString();
                    });
                    totalGiamtrongky = customerThuChi.reduce(function (sum, tc) {
                      return sum + tc.chitiet.reduce(function (detailSum, detail) {
                        return mucThuChiCongNo.some(function (muc) {
                          return muc._id.toString() === detail.mucthuchi.toString();
                        }) ? detailSum + detail.sotien : detailSum;
                      }, 0);
                    }, 0);
                    customerThuChiTruoc = giamTrongKyTruoc.filter(function (tc) {
                      return tc.doituong.toString() === khachhang._id.toString();
                    });
                    totalGiamtrongkyTruocDo = customerThuChiTruoc.reduce(function (sum, tc) {
                      return sum + tc.chitiet.reduce(function (detailSum, detail) {
                        return mucThuChiCongNo.some(function (muc) {
                          return muc._id.toString() === detail.mucthuchi.toString();
                        }) ? detailSum + detail.sotien : detailSum;
                      }, 0);
                    }, 0);
                    customerTotalNodauky = customerTotalNodauky - totalGiamtrongkyTruocDo;
                    return _context5.abrupt("return", {
                      makh: khachhang.makh,
                      namekhach: khachhang.name,
                      nhomkhachhang: nhomkhachhang.name,
                      phone: khachhang.phone,
                      nodauky: customerTotalNodauky,
                      tangtrongky: totalTanggtrongky,
                      giamtrongky: totalGiamtrongky
                    });

                  case 19:
                  case "end":
                    return _context5.stop();
                }
              }
            });
          })));

        case 31:
          khachhang = _context6.sent;
          res.json(khachhang);
          _context6.next = 39;
          break;

        case 35:
          _context6.prev = 35;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 39:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 35]]);
});
router.get('/baocaobanhang/:idkho', function _callee7(req, res) {
  var _req$query4, fromdate, enddate, idkho, kho, from, end, hoaDons, hoaDonReport, sanPhams, nhapHangReport, congNoHoaDons, tienmatHoaDons, chuyenkhoanHoaDons, congNoReport, tienmatReport, chuyenkhoanReport, combinedReport, allDates;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _req$query4 = req.query, fromdate = _req$query4.fromdate, enddate = _req$query4.enddate;
          idkho = req.params.idkho;
          _context7.next = 5;
          return regeneratorRuntime.awrap(DePot.findById(idkho).populate(['hoadon', 'sanpham']));

        case 5:
          kho = _context7.sent;
          from = new Date(fromdate);
          end = new Date(enddate);
          end.setUTCHours(23, 59, 59, 999);
          _context7.next = 11;
          return regeneratorRuntime.awrap(HoaDon.find({
            _id: {
              $in: kho.hoadon
            },
            date: {
              $gte: from,
              $lte: end
            }
          }));

        case 11:
          hoaDons = _context7.sent;
          hoaDonReport = hoaDons.reduce(function (acc, hoaDon) {
            var dateKey = hoaDon.date.toISOString().split('T')[0];

            if (!acc[dateKey]) {
              acc[dateKey] = 0;
            }

            acc[dateKey] += hoaDon.tongtien || 0;
            return acc;
          }, {});
          _context7.next = 15;
          return regeneratorRuntime.awrap(SanPham.find({
            _id: {
              $in: kho.sanpham
            },
            datexuat: {
              $gte: from,
              $lte: end
            },
            xuat: true
          }));

        case 15:
          sanPhams = _context7.sent;
          nhapHangReport = sanPhams.reduce(function (acc, sanPham) {
            var dateKey = sanPham.datexuat.toISOString().split('T')[0];

            if (!acc[dateKey]) {
              acc[dateKey] = 0;
            }

            acc[dateKey] += sanPham.price || 0;
            return acc;
          }, {});
          _context7.next = 19;
          return regeneratorRuntime.awrap(HoaDon.find({
            _id: {
              $in: kho.hoadon
            },
            date: {
              $gte: from,
              $lte: end
            },
            ghino: true
          }).populate('khachhang', 'ten'));

        case 19:
          congNoHoaDons = _context7.sent;
          _context7.next = 22;
          return regeneratorRuntime.awrap(HoaDon.find({
            _id: {
              $in: kho.hoadon
            },
            date: {
              $gte: from,
              $lte: end
            },
            method: 'Tiền mặt'
          }).populate('khachhang', 'ten'));

        case 22:
          tienmatHoaDons = _context7.sent;
          _context7.next = 25;
          return regeneratorRuntime.awrap(HoaDon.find({
            _id: {
              $in: kho.hoadon
            },
            date: {
              $gte: from,
              $lte: end
            },
            method: 'chuyển khoản'
          }).populate('khachhang', 'ten'));

        case 25:
          chuyenkhoanHoaDons = _context7.sent;
          congNoReport = congNoHoaDons.reduce(function (acc, hoaDon) {
            var dateKey = hoaDon.date.toISOString().split('T')[0];

            if (!acc[dateKey]) {
              acc[dateKey] = 0;
            }

            acc[dateKey] += hoaDon.tongtien || 0;
            return acc;
          }, {});
          tienmatReport = tienmatHoaDons.reduce(function (acc, hoaDon) {
            var dateKey = hoaDon.date.toISOString().split('T')[0];

            if (!acc[dateKey]) {
              acc[dateKey] = 0;
            }

            acc[dateKey] += hoaDon.tongtien || 0;
            return acc;
          }, {});
          chuyenkhoanReport = chuyenkhoanHoaDons.reduce(function (acc, hoaDon) {
            var dateKey = hoaDon.date.toISOString().split('T')[0];

            if (!acc[dateKey]) {
              acc[dateKey] = 0;
            }

            acc[dateKey] += hoaDon.tongtien || 0;
            return acc;
          }, {});
          combinedReport = [];
          allDates = _toConsumableArray(new Set([].concat(_toConsumableArray(Object.keys(hoaDonReport)), _toConsumableArray(Object.keys(nhapHangReport)), _toConsumableArray(Object.keys(congNoReport)), _toConsumableArray(Object.keys(tienmatReport)), _toConsumableArray(Object.keys(chuyenkhoanReport)))));
          allDates.forEach(function (date) {
            combinedReport.push({
              date: moment(date).format('DD/MM/YYYY'),
              hoaDon: hoaDonReport[date] || 0,
              nhapHang: nhapHangReport[date] || 0,
              congNo: congNoReport[date] || 0,
              tienmat: tienmatReport[date] || 0,
              chuyenkhoan: chuyenkhoanReport[date] || 0
            });
          });
          res.status(200).json(combinedReport);
          _context7.next = 39;
          break;

        case 35:
          _context7.prev = 35;
          _context7.t0 = _context7["catch"](0);
          console.error('Lỗi khi tạo báo cáo:', _context7.t0);
          res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ. Không thể tạo báo cáo.'
          });

        case 39:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 35]]);
});
module.exports = router;
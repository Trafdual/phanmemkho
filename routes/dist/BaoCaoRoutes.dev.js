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

var moment = require('moment'); // router.get('/getsptest/:khoID', async (req, res) => {
//   try {
//     const khoId = req.params.khoID
//     const { fromDate, endDate } = req.query
//     const from = new Date(fromDate)
//     const end = new Date(endDate)
//     const prevDay = new Date(fromDate)
//     prevDay.setDate(prevDay.getDate() - 1)
//     const dieuchuyen = await DieuChuyen.find({
//       depot: khoId,
//       date: { $gte: from, $lte: end }
//     })
//     console.log(dieuchuyen)
//     const depot = await DePot.findById(khoId)
//     const sanPhamDieuChuyen = []
//     for (const dc of dieuchuyen) {
//       for (const spId of dc.sanpham) {
//         sanPhamDieuChuyen.push(spId)
//       }
//     }
//     const allSanPhamIds = [
//       ...depot.sanpham.map(sp => sp._id.toString()),
//       ...sanPhamDieuChuyen.map(id => id.toString())
//     ]
//     const uniqueSanPhamIds = [...new Set(allSanPhamIds)]
//     const sanphamtest = await Promise.all(
//       uniqueSanPhamIds.map(async spId => {
//         const sanpham1 = await SanPham.findById(spId)
//         const dungluongsku = await DungLuongSku.findById(sanpham1.dungluongsku)
//         const sku = await Sku.findById(dungluongsku.sku)
//         const sanphamjson = {
//           _id: sanpham1._id,
//           masp: sanpham1.masp,
//           madungluongsku: dungluongsku.madungluong,
//           name: sanpham1.name,
//           datenhap: sanpham1.datenhap,
//           price: sanpham1.price,
//           datexuat: sanpham1.datexuat,
//           xuat: sanpham1.xuat
//         }
//         return {
//           masku: sku.masku,
//           namesku: sku.name,
//           sanpham: sanphamjson
//         }
//       })
//     )
//     const gopSanPham = sanphamtest.reduce((acc, item) => {
//       let existingSku = acc.find(x => x.masku === item.masku)
//       if (existingSku) {
//         existingSku.sanpham.push(item.sanpham)
//       } else {
//         acc.push({
//           masku: item.masku,
//           namesku: item.namesku,
//           sanpham: [item.sanpham]
//         })
//       }
//       return acc
//     }, [])
//     gopSanPham.forEach(skuItem => {
//       const gopDungLuong = skuItem.sanpham.reduce((acc, product) => {
//         let existingDungLuong = acc.find(
//           p => p.madungluongsku === product.madungluongsku
//         )
//         const datenhapArray = Array.isArray(product.datenhap)
//           ? product.datenhap
//           : [product.datenhap]
//         if (existingDungLuong) {
//           existingDungLuong.datenhap.push(...datenhapArray)
//         } else {
//           acc.push({
//             madungluongsku: product.madungluongsku,
//             name: product.name,
//             datenhap: [...datenhapArray],
//             soluongsp: 0,
//             price: 0,
//             tondauky: {
//               soluong: 0,
//               price: 0
//             },
//             nhaptrongky: {
//               soluong: 0,
//               price: 0
//             },
//             xuattrongky: {
//               soluong: 0,
//               price: 0
//             },
//             toncuoiky: {
//               soluong: 0,
//               price: 0
//             }
//           })
//           existingDungLuong = acc[acc.length - 1]
//         }
//         datenhapArray.forEach(date => {
//           const dateObj = new Date(date)
//           if (dateObj >= from && dateObj <= end) {
//             existingDungLuong.price += product.price
//           }
//         })
//         return acc
//       }, [])
//       gopDungLuong.forEach(dungluong => {
//         dungluong.datenhap = dungluong.datenhap.filter(date => {
//           const dateObj = new Date(date)
//           return dateObj
//         })
//         if (dungluong.datenhap.length > 0) {
//           dungluong.soluongsp = dungluong.datenhap.length
//           // dungluong.nhaptrongky.soluong = dungluong.datenhap.filter(date => {
//           //   return (
//           //     new Date(date).setHours(0, 0, 0, 0) >=
//           //       from.setHours(0, 0, 0, 0) &&
//           //     new Date(date).setHours(0, 0, 0, 0) <= end.setHours(0, 0, 0, 0)
//           //   )
//           // }).length
//           let productsOnPrevDay = []
//           skuItem.sanpham.forEach(product => {
//             if (product.madungluongsku === dungluong.madungluongsku) {
//               const productDate = new Date(product.datenhap).setHours(
//                 0,
//                 0,
//                 0,
//                 0
//               )
//               const productdatexuat = new Date(product.datexuat).setHours(
//                 0,
//                 0,
//                 0,
//                 0
//               )
//               const fromdate = new Date(from).setHours(0, 0, 0, 0)
//               const enddate = new Date(end).setHours(0, 0, 0, 0)
//               const prevDayDate = new Date(prevDay).setHours(0, 0, 0, 0)
//               if (productDate >= fromdate && productDate <= enddate) {
//                 dungluong.nhaptrongky.soluong++
//                 dungluong.nhaptrongky.price += product.price
//               }
//               if (productDate === prevDayDate) {
//                 if (product.xuat === false) {
//                   dungluong.tondauky.price += product.price
//                   productsOnPrevDay.push(product)
//                 }
//               }
//               if (productdatexuat >= fromdate && productdatexuat <= enddate) {
//                 const isDieuChuyen = dieuchuyen.some(dc =>
//                   dc.sanpham.some(
//                     spId => spId.toString() === product._id.toString()
//                   )
//                 )
//                 if (product.xuat === true || isDieuChuyen) {
//                   console.log(product)
//                   dungluong.xuattrongky.soluong++
//                   dungluong.xuattrongky.price += product.price
//                 }
//               }
//             }
//           })
//           dungluong.tondauky.soluong = productsOnPrevDay.length
//           dungluong.toncuoiky.soluong =
//             dungluong.tondauky.soluong +
//             dungluong.nhaptrongky.soluong -
//             dungluong.xuattrongky.soluong
//           dungluong.toncuoiky.price =
//             dungluong.tondauky.price +
//             dungluong.nhaptrongky.price -
//             dungluong.xuattrongky.price
//         }
//       })
//       skuItem.tongtondau = skuItem.tongtondau || { soluong: 0, price: 0 }
//       skuItem.tongnhaptrong = skuItem.tongnhaptrong || { soluong: 0, price: 0 }
//       skuItem.tongxuattrong = skuItem.tongxuattrong || { soluong: 0, price: 0 }
//       skuItem.tongtoncuoiky = skuItem.tongtoncuoiky || { soluong: 0, price: 0 }
//       skuItem.soluongsanpham = gopDungLuong.reduce(
//         (total, product) => total + product.soluongsp,
//         0
//       )
//       skuItem.tongtondau.price = gopDungLuong.reduce(
//         (total, product) => total + product.tondauky.price,
//         0
//       )
//       skuItem.tongnhaptrong.price = gopDungLuong.reduce(
//         (total, product) => total + product.nhaptrongky.price,
//         0
//       )
//       skuItem.tongxuattrong.price = gopDungLuong.reduce(
//         (total, product) => total + product.xuattrongky.price,
//         0
//       )
//       skuItem.tongtoncuoiky.price = gopDungLuong.reduce(
//         (total, product) => total + product.toncuoiky.price,
//         0
//       )
//       skuItem.tongtondau.soluong = gopDungLuong.reduce(
//         (total, product) => total + product.tondauky.soluong,
//         0
//       )
//       skuItem.tongnhaptrong.soluong = gopDungLuong.reduce(
//         (total, product) => total + product.nhaptrongky.soluong,
//         0
//       )
//       skuItem.tongxuattrong.soluong = gopDungLuong.reduce(
//         (total, product) => total + product.xuattrongky.soluong,
//         0
//       )
//       skuItem.tongtoncuoiky.soluong = gopDungLuong.reduce(
//         (total, product) => total + product.toncuoiky.soluong,
//         0
//       )
//       skuItem.sanpham = gopDungLuong
//     })
//     res.json(gopSanPham)
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({ message: 'Đã xảy ra lỗi.' })
//   }
// })


router.get('/getsptest2/:khoID', function _callee(req, res) {
  var khoId, _req$query, fromDate, endDate, from, end, prevDay, dieuchuyen, depot, sanPhamDieuChuyenMap, allSanPhamIds, sanphamList, dungluongskuIds, dungluongskuList, skuIds, skuList, dungluongskuMap, skuMap, sanphamtest, gopSanPham, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, skuItem, dungluongMap, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _dungluong$datenhap, product, dungluong, datenhapArray, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _dungluong, productsOnPrevDay, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _product, productDate, productdatexuat, fromdate, enddate, prevDayDate, isDieuChuyen, gopDungLuong;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          khoId = req.params.khoID;
          _req$query = req.query, fromDate = _req$query.fromDate, endDate = _req$query.endDate;
          from = new Date(fromDate);
          end = new Date(endDate);
          prevDay = new Date(fromDate);
          prevDay.setDate(prevDay.getDate() - 1);
          _context.next = 9;
          return regeneratorRuntime.awrap(DieuChuyen.find({
            depot: khoId,
            date: {
              $gte: from,
              $lte: end
            }
          }).populate('sanpham', 'datenhap'));

        case 9:
          dieuchuyen = _context.sent;
          _context.next = 12;
          return regeneratorRuntime.awrap(DePot.findById(khoId).populate('sanpham'));

        case 12:
          depot = _context.sent;
          sanPhamDieuChuyenMap = new Map();
          dieuchuyen.forEach(function (dc) {
            dc.sanpham.forEach(function (sp) {
              sanPhamDieuChuyenMap.set(sp._id.toString(), sp.datenhap);
            });
          });
          allSanPhamIds = new Set([].concat(_toConsumableArray(depot.sanpham.map(function (sp) {
            return sp._id.toString();
          })), _toConsumableArray(sanPhamDieuChuyenMap.keys())));
          _context.next = 18;
          return regeneratorRuntime.awrap(SanPham.find({
            _id: {
              $in: _toConsumableArray(allSanPhamIds)
            }
          }).lean());

        case 18:
          sanphamList = _context.sent;
          dungluongskuIds = sanphamList.map(function (sp) {
            return sp.dungluongsku;
          });
          _context.next = 22;
          return regeneratorRuntime.awrap(DungLuongSku.find({
            _id: {
              $in: dungluongskuIds
            }
          }).lean());

        case 22:
          dungluongskuList = _context.sent;
          skuIds = dungluongskuList.map(function (dls) {
            return dls.sku;
          });
          _context.next = 26;
          return regeneratorRuntime.awrap(Sku.find({
            _id: {
              $in: skuIds
            }
          }).lean());

        case 26:
          skuList = _context.sent;
          dungluongskuMap = new Map(dungluongskuList.map(function (dls) {
            return [dls._id.toString(), dls];
          }));
          skuMap = new Map(skuList.map(function (sku) {
            return [sku._id.toString(), sku];
          }));
          sanphamtest = sanphamList.map(function (sp) {
            var dls = dungluongskuMap.get(sp.dungluongsku.toString());
            var sku = skuMap.get(dls.sku.toString());
            return {
              masku: sku.masku,
              namesku: sku.name,
              sanpham: {
                _id: sp._id,
                masp: sp.masp,
                madungluongsku: dls.madungluong,
                name: sp.name,
                datenhap: sp.datenhap,
                price: sp.price,
                datexuat: sp.datexuat,
                xuat: sp.xuat
              }
            };
          });
          gopSanPham = sanphamtest.reduce(function (acc, item) {
            var skuGroup = acc.get(item.masku);

            if (!skuGroup) {
              skuGroup = {
                masku: item.masku,
                namesku: item.namesku,
                sanpham: []
              };
              acc.set(item.masku, skuGroup);
            }

            skuGroup.sanpham.push(item.sanpham);
            return acc;
          }, new Map());
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 34;
          _iterator = gopSanPham.values()[Symbol.iterator]();

        case 36:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 118;
            break;
          }

          skuItem = _step.value;
          dungluongMap = new Map();
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context.prev = 42;

          for (_iterator2 = skuItem.sanpham[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            product = _step2.value;
            dungluong = dungluongMap.get(product.madungluongsku);

            if (!dungluong) {
              dungluong = {
                madungluongsku: product.madungluongsku,
                name: product.name,
                datenhap: [],
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
              };
              dungluongMap.set(product.madungluongsku, dungluong);
            }

            datenhapArray = Array.isArray(product.datenhap) ? product.datenhap : [product.datenhap];

            (_dungluong$datenhap = dungluong.datenhap).push.apply(_dungluong$datenhap, _toConsumableArray(datenhapArray));
          }

          _context.next = 50;
          break;

        case 46:
          _context.prev = 46;
          _context.t0 = _context["catch"](42);
          _didIteratorError2 = true;
          _iteratorError2 = _context.t0;

        case 50:
          _context.prev = 50;
          _context.prev = 51;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 53:
          _context.prev = 53;

          if (!_didIteratorError2) {
            _context.next = 56;
            break;
          }

          throw _iteratorError2;

        case 56:
          return _context.finish(53);

        case 57:
          return _context.finish(50);

        case 58:
          _iteratorNormalCompletion3 = true;
          _didIteratorError3 = false;
          _iteratorError3 = undefined;
          _context.prev = 61;
          _iterator3 = dungluongMap.values()[Symbol.iterator]();

        case 63:
          if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
            _context.next = 94;
            break;
          }

          _dungluong = _step3.value;
          _dungluong.datenhap = _dungluong.datenhap.filter(function (date) {
            return new Date(date);
          });

          if (!(_dungluong.datenhap.length > 0)) {
            _context.next = 91;
            break;
          }

          _dungluong.soluongsp = _dungluong.datenhap.length;
          productsOnPrevDay = [];
          _iteratorNormalCompletion4 = true;
          _didIteratorError4 = false;
          _iteratorError4 = undefined;
          _context.prev = 72;

          for (_iterator4 = skuItem.sanpham[Symbol.iterator](); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            _product = _step4.value;

            if (_product.madungluongsku === _dungluong.madungluongsku) {
              productDate = new Date(_product.datenhap).setHours(0, 0, 0, 0);
              productdatexuat = _product.datexuat ? new Date(_product.datexuat).setHours(0, 0, 0, 0) : null;
              fromdate = from.setHours(0, 0, 0, 0);
              enddate = end.setHours(0, 0, 0, 0);
              prevDayDate = prevDay.setHours(0, 0, 0, 0);

              if (productDate >= fromdate && productDate <= enddate) {
                _dungluong.nhaptrongky.soluong++;
                _dungluong.nhaptrongky.price += _product.price;
              }

              if (productDate === prevDayDate && !_product.xuat) {
                _dungluong.tondauky.price += _product.price;
                productsOnPrevDay.push(_product);
              }

              if (productdatexuat && productdatexuat >= fromdate && productdatexuat <= enddate) {
                isDieuChuyen = sanPhamDieuChuyenMap.has(_product._id.toString());

                if (_product.xuat || isDieuChuyen) {
                  _dungluong.xuattrongky.soluong++;
                  _dungluong.xuattrongky.price += _product.price;
                }
              }
            }
          }

          _context.next = 80;
          break;

        case 76:
          _context.prev = 76;
          _context.t1 = _context["catch"](72);
          _didIteratorError4 = true;
          _iteratorError4 = _context.t1;

        case 80:
          _context.prev = 80;
          _context.prev = 81;

          if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
            _iterator4["return"]();
          }

        case 83:
          _context.prev = 83;

          if (!_didIteratorError4) {
            _context.next = 86;
            break;
          }

          throw _iteratorError4;

        case 86:
          return _context.finish(83);

        case 87:
          return _context.finish(80);

        case 88:
          _dungluong.tondauky.soluong = productsOnPrevDay.length;
          _dungluong.toncuoiky.soluong = _dungluong.tondauky.soluong + _dungluong.nhaptrongky.soluong - _dungluong.xuattrongky.soluong;
          _dungluong.toncuoiky.price = _dungluong.tondauky.price + _dungluong.nhaptrongky.price - _dungluong.xuattrongky.price;

        case 91:
          _iteratorNormalCompletion3 = true;
          _context.next = 63;
          break;

        case 94:
          _context.next = 100;
          break;

        case 96:
          _context.prev = 96;
          _context.t2 = _context["catch"](61);
          _didIteratorError3 = true;
          _iteratorError3 = _context.t2;

        case 100:
          _context.prev = 100;
          _context.prev = 101;

          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }

        case 103:
          _context.prev = 103;

          if (!_didIteratorError3) {
            _context.next = 106;
            break;
          }

          throw _iteratorError3;

        case 106:
          return _context.finish(103);

        case 107:
          return _context.finish(100);

        case 108:
          gopDungLuong = _toConsumableArray(dungluongMap.values());
          skuItem.sanpham = gopDungLuong;
          skuItem.tongtondau = {
            soluong: gopDungLuong.reduce(function (sum, p) {
              return sum + p.tondauky.soluong;
            }, 0),
            price: gopDungLuong.reduce(function (sum, p) {
              return sum + p.tondauky.price;
            }, 0)
          };
          skuItem.tongnhaptrong = {
            soluong: gopDungLuong.reduce(function (sum, p) {
              return sum + p.nhaptrongky.soluong;
            }, 0),
            price: gopDungLuong.reduce(function (sum, p) {
              return sum + p.nhaptrongky.price;
            }, 0)
          };
          skuItem.tongxuattrong = {
            soluong: gopDungLuong.reduce(function (sum, p) {
              return sum + p.xuattrongky.soluong;
            }, 0),
            price: gopDungLuong.reduce(function (sum, p) {
              return sum + p.xuattrongky.price;
            }, 0)
          };
          skuItem.tongtoncuoiky = {
            soluong: gopDungLuong.reduce(function (sum, p) {
              return sum + p.toncuoiky.soluong;
            }, 0),
            price: gopDungLuong.reduce(function (sum, p) {
              return sum + p.toncuoiky.price;
            }, 0)
          };
          skuItem.soluongsanpham = gopDungLuong.reduce(function (sum, p) {
            return sum + p.soluongsp;
          }, 0);

        case 115:
          _iteratorNormalCompletion = true;
          _context.next = 36;
          break;

        case 118:
          _context.next = 124;
          break;

        case 120:
          _context.prev = 120;
          _context.t3 = _context["catch"](34);
          _didIteratorError = true;
          _iteratorError = _context.t3;

        case 124:
          _context.prev = 124;
          _context.prev = 125;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 127:
          _context.prev = 127;

          if (!_didIteratorError) {
            _context.next = 130;
            break;
          }

          throw _iteratorError;

        case 130:
          return _context.finish(127);

        case 131:
          return _context.finish(124);

        case 132:
          res.json(_toConsumableArray(gopSanPham.values()));
          _context.next = 139;
          break;

        case 135:
          _context.prev = 135;
          _context.t4 = _context["catch"](0);
          console.error(_context.t4);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 139:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 135], [34, 120, 124, 132], [42, 46, 50, 58], [51,, 53, 57], [61, 96, 100, 108], [72, 76, 80, 88], [81,, 83, 87], [101,, 103, 107], [125,, 127, 131]]);
});
router.get('/getcongno3/:idkho', function _callee3(req, res) {
  var idkho, depot, _req$query2, fromdate, enddate, from, end, previousFrom, previousEnd, mucThuChiCongNo, giamTrongKyThuChi, giamTrongKyTruoc, congnoAllPreviousMonths, congnoCurrentMonth, khachhang;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          idkho = req.params.idkho;
          _context3.next = 4;
          return regeneratorRuntime.awrap(DePot.findById(idkho));

        case 4:
          depot = _context3.sent;
          _req$query2 = req.query, fromdate = _req$query2.fromdate, enddate = _req$query2.enddate;
          from = new Date(fromdate);
          end = new Date(enddate);
          end.setUTCHours(23, 59, 59, 999);
          previousFrom = new Date(from);
          previousFrom.setDate(previousFrom.getDate() - (end.getDate() - from.getDate()));
          previousEnd = new Date(from);
          previousEnd.setDate(previousEnd.getDate() - 1);
          console.log(previousFrom);
          _context3.next = 16;
          return regeneratorRuntime.awrap(MucThuChi.find({
            name: 'công nợ'
          }));

        case 16:
          mucThuChiCongNo = _context3.sent;
          _context3.next = 19;
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
          giamTrongKyThuChi = _context3.sent;
          _context3.next = 22;
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
          giamTrongKyTruoc = _context3.sent;
          _context3.next = 25;
          return regeneratorRuntime.awrap(CongNo.find({
            depot: depot._id,
            date: {
              $lt: from
            }
          }));

        case 25:
          congnoAllPreviousMonths = _context3.sent;
          _context3.next = 28;
          return regeneratorRuntime.awrap(CongNo.find({
            depot: depot._id,
            date: {
              $gte: from,
              $lte: end
            }
          }));

        case 28:
          congnoCurrentMonth = _context3.sent;
          _context3.next = 31;
          return regeneratorRuntime.awrap(Promise.all(depot.khachang.map(function _callee2(kh) {
            var khachhang, nhomkhachhang, totalTanggtrongky, customerTotalNodauky, totalGiamtrongky, customerCongnoPreviousMonths, customerCongnoCurrentMonth, customerThuChi, customerThuChiTruoc, totalGiamtrongkyTruocDo;
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return regeneratorRuntime.awrap(KhachHang.findById(kh._id));

                  case 2:
                    khachhang = _context2.sent;
                    _context2.next = 5;
                    return regeneratorRuntime.awrap(NhomKhacHang.findById(khachhang.nhomkhachhang));

                  case 5:
                    nhomkhachhang = _context2.sent;
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
                    return _context2.abrupt("return", {
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
                    return _context2.stop();
                }
              }
            });
          })));

        case 31:
          khachhang = _context3.sent;
          res.json(khachhang);
          _context3.next = 39;
          break;

        case 35:
          _context3.prev = 35;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 39:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 35]]);
});
router.get('/baocaobanhang/:idkho', function _callee4(req, res) {
  var _req$query3, fromdate, enddate, idkho, kho, from, end, hoaDons, hoaDonReport, sanPhams, nhapHangReport, congNoHoaDons, tienmatHoaDons, chuyenkhoanHoaDons, congNoReport, tienmatReport, chuyenkhoanReport, combinedReport, allDates;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _req$query3 = req.query, fromdate = _req$query3.fromdate, enddate = _req$query3.enddate;
          idkho = req.params.idkho;
          _context4.next = 5;
          return regeneratorRuntime.awrap(DePot.findById(idkho).populate(['hoadon', 'sanpham']));

        case 5:
          kho = _context4.sent;
          from = new Date(fromdate);
          end = new Date(enddate);
          end.setUTCHours(23, 59, 59, 999);
          _context4.next = 11;
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
          hoaDons = _context4.sent;
          hoaDonReport = hoaDons.reduce(function (acc, hoaDon) {
            var dateKey = hoaDon.date.toISOString().split('T')[0];

            if (!acc[dateKey]) {
              acc[dateKey] = 0;
            }

            acc[dateKey] += hoaDon.tongtien || 0;
            return acc;
          }, {});
          _context4.next = 15;
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
          sanPhams = _context4.sent;
          nhapHangReport = sanPhams.reduce(function (acc, sanPham) {
            var dateKey = sanPham.datexuat.toISOString().split('T')[0];

            if (!acc[dateKey]) {
              acc[dateKey] = 0;
            }

            acc[dateKey] += sanPham.price || 0;
            return acc;
          }, {});
          _context4.next = 19;
          return regeneratorRuntime.awrap(CongNo.find({
            depot: idkho,
            date: {
              $gte: from,
              $lte: end
            }
          }).populate('khachhang', 'ten'));

        case 19:
          congNoHoaDons = _context4.sent;
          _context4.next = 22;
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
          tienmatHoaDons = _context4.sent;
          _context4.next = 25;
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
          chuyenkhoanHoaDons = _context4.sent;
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
          _context4.next = 39;
          break;

        case 35:
          _context4.prev = 35;
          _context4.t0 = _context4["catch"](0);
          console.error('Lỗi khi tạo báo cáo:', _context4.t0);
          res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ. Không thể tạo báo cáo.'
          });

        case 39:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 35]]);
});
module.exports = router;
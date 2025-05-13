"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var router = require('express').Router();

var SanPham = require('../models/SanPhamModel');

var LoaiSanPham = require('../models/LoaiSanPhamModel');

var Depot = require('../models/DepotModel');

var momenttimezone = require('moment-timezone');

var moment = require('moment');

var DieuChuyen = require('../models/DieuChuyenModel');

var DungLuongSku = require('../models/DungluongSkuModel');

router.get('/getsanpham/:idloaisanpham', function _callee2(req, res) {
  var idloai, loaisanpham, sanpham, groupedProducts, result;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          idloai = req.params.idloaisanpham;
          _context2.next = 4;
          return regeneratorRuntime.awrap(LoaiSanPham.findById(idloai));

        case 4:
          loaisanpham = _context2.sent;
          _context2.next = 7;
          return regeneratorRuntime.awrap(Promise.all(loaisanpham.sanpham.map(function _callee(sp) {
            var sp1, sku;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return regeneratorRuntime.awrap(SanPham.findById(sp._id));

                  case 2:
                    sp1 = _context.sent;
                    console.log(sp1);
                    _context.next = 6;
                    return regeneratorRuntime.awrap(DungLuongSku.findById(sp1.dungluongsku));

                  case 6:
                    sku = _context.sent;
                    console.log(sku);
                    return _context.abrupt("return", {
                      masp: sp1.masp,
                      masku: sku.madungluong,
                      _id: sp1._id,
                      imel: sp1.imel,
                      name: sp1.name,
                      price: sp1.price,
                      quantity: 1,
                      xuat: sp1.xuat
                    });

                  case 9:
                  case "end":
                    return _context.stop();
                }
              }
            });
          })));

        case 7:
          sanpham = _context2.sent;
          groupedProducts = sanpham.reduce(function (acc, product) {
            var masku = product.masku,
                imel = product.imel,
                price = product.price,
                name = product.name;

            if (!acc[masku]) {
              acc[masku] = _objectSpread({}, product, {
                imel: new Set([imel]),
                // Bắt đầu với Set để lưu các imel duy nhất
                quantity: 0,
                // Tổng số lượng
                total: 0 // Tổng thành tiền

              });
            }

            acc[masku].imel.add(imel); // Thêm imel vào Set

            acc[masku].quantity += product.quantity; // Cộng dồn số lượng

            acc[masku].total += price * product.quantity; // Tính thành tiền

            return acc;
          }, {}); // Chuyển đổi đối tượng gộp về mảng

          result = Object.values(groupedProducts).map(function (product) {
            return {
              masku: product.masku,
              name: product.name,
              imel: Array.from(product.imel).join(','),
              // Chuyển Set thành mảng và kết hợp imel thành chuỗi
              quantity: product.quantity,
              price: parseFloat(product.total / product.quantity),
              total: product.total
            };
          });
          res.json(result);
          _context2.next = 17;
          break;

        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 13]]);
});
router.get('/getsanphambySKU/:sku/:idloaisanpham', function _callee4(req, res) {
  var skuCode, idloaisanpham, loaisanpham, matchingProducts, result;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          skuCode = req.params.sku;
          idloaisanpham = req.params.idloaisanpham; // Lấy loại sản phẩm và kiểm tra tồn tại

          _context4.next = 5;
          return regeneratorRuntime.awrap(LoaiSanPham.findById(idloaisanpham).populate('sanpham'));

        case 5:
          loaisanpham = _context4.sent;

          if (loaisanpham) {
            _context4.next = 8;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: 'Không tìm thấy loại sản phẩm.'
          }));

        case 8:
          _context4.next = 10;
          return regeneratorRuntime.awrap(Promise.all(loaisanpham.sanpham.map(function _callee3(sp) {
            var spDetails;
            return regeneratorRuntime.async(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return regeneratorRuntime.awrap(SanPham.findById(sp._id).populate('dungluongsku'));

                  case 2:
                    spDetails = _context3.sent;

                    if (!(spDetails.dungluongsku.madungluong === skuCode)) {
                      _context3.next = 5;
                      break;
                    }

                    return _context3.abrupt("return", {
                      _id: spDetails._id,
                      masp: spDetails.masp,
                      imel: spDetails.imel,
                      name: spDetails.name,
                      price: spDetails.price,
                      xuat: spDetails.xuat
                    });

                  case 5:
                  case "end":
                    return _context3.stop();
                }
              }
            });
          })));

        case 10:
          matchingProducts = _context4.sent;
          // Loại bỏ các giá trị không hợp lệ
          result = matchingProducts.filter(function (product) {
            return product !== undefined;
          });

          if (!(result.length === 0)) {
            _context4.next = 14;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: 'Không có sản phẩm nào với SKU này trong loại sản phẩm.'
          }));

        case 14:
          res.json(result);
          _context4.next = 21;
          break;

        case 17:
          _context4.prev = 17;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi khi lấy sản phẩm theo SKU.'
          });

        case 21:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 17]]);
});
router.post('/postsp/:idloaisanpham', function _callee5(req, res) {
  var idloai, _req$body, imelList, name, price, madungluongsku, loaisanpham, kho, dungluongsku, addedProducts, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, imel, sp, sanpham, masp;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          idloai = req.params.idloaisanpham;
          _req$body = req.body, imelList = _req$body.imelList, name = _req$body.name, price = _req$body.price, madungluongsku = _req$body.madungluongsku; // imelList là danh sách imel

          _context5.next = 5;
          return regeneratorRuntime.awrap(LoaiSanPham.findById(idloai));

        case 5:
          loaisanpham = _context5.sent;
          _context5.next = 8;
          return regeneratorRuntime.awrap(Depot.findById(loaisanpham.depot));

        case 8:
          kho = _context5.sent;
          _context5.next = 11;
          return regeneratorRuntime.awrap(DungLuongSku.findOne({
            madungluong: madungluongsku
          }));

        case 11:
          dungluongsku = _context5.sent;
          addedProducts = [];
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context5.prev = 16;
          _iterator = imelList[Symbol.iterator]();

        case 18:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context5.next = 48;
            break;
          }

          imel = _step.value;
          _context5.next = 22;
          return regeneratorRuntime.awrap(SanPham.findOne({
            imel: imel
          }));

        case 22:
          sp = _context5.sent;

          if (!sp) {
            _context5.next = 25;
            break;
          }

          return _context5.abrupt("continue", 45);

        case 25:
          sanpham = new SanPham({
            name: name,
            imel: imel,
            datenhap: loaisanpham.date,
            price: price
          });
          masp = 'SP' + sanpham._id.toString().slice(-5);
          kho.sanpham.push(sanpham._id);
          sanpham.kho = kho._id;
          sanpham.masp = masp;
          sanpham.datexuat = '';
          sanpham.xuat = false;
          sanpham.loaisanpham = loaisanpham._id;
          dungluongsku.sanpham.push(sanpham._id);
          sanpham.dungluongsku = dungluongsku._id;
          _context5.next = 37;
          return regeneratorRuntime.awrap(sanpham.save());

        case 37:
          loaisanpham.sanpham.push(sanpham._id);
          _context5.next = 40;
          return regeneratorRuntime.awrap(loaisanpham.save());

        case 40:
          _context5.next = 42;
          return regeneratorRuntime.awrap(kho.save());

        case 42:
          _context5.next = 44;
          return regeneratorRuntime.awrap(dungluongsku.save());

        case 44:
          addedProducts.push(sanpham);

        case 45:
          _iteratorNormalCompletion = true;
          _context5.next = 18;
          break;

        case 48:
          _context5.next = 54;
          break;

        case 50:
          _context5.prev = 50;
          _context5.t0 = _context5["catch"](16);
          _didIteratorError = true;
          _iteratorError = _context5.t0;

        case 54:
          _context5.prev = 54;
          _context5.prev = 55;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 57:
          _context5.prev = 57;

          if (!_didIteratorError) {
            _context5.next = 60;
            break;
          }

          throw _iteratorError;

        case 60:
          return _context5.finish(57);

        case 61:
          return _context5.finish(54);

        case 62:
          res.json(addedProducts);
          _context5.next = 69;
          break;

        case 65:
          _context5.prev = 65;
          _context5.t1 = _context5["catch"](0);
          console.error(_context5.t1);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 69:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 65], [16, 50, 54, 62], [55,, 57, 61]]);
});
router.post('/postsp1/:idloaisanpham', function _callee6(req, res) {
  var idloai, products, loaisanpham, kho, addedProducts, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, product, madungluongsku, imelList, name, price, dungluongsku, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, imel, sp, sanpham, masp;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          idloai = req.params.idloaisanpham;
          products = req.body.products;
          _context6.next = 5;
          return regeneratorRuntime.awrap(LoaiSanPham.findById(idloai));

        case 5:
          loaisanpham = _context6.sent;
          _context6.next = 8;
          return regeneratorRuntime.awrap(Depot.findById(loaisanpham.depot));

        case 8:
          kho = _context6.sent;
          addedProducts = [];
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context6.prev = 13;
          _iterator2 = products[Symbol.iterator]();

        case 15:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context6.next = 73;
            break;
          }

          product = _step2.value;
          madungluongsku = product.madungluongsku, imelList = product.imelList, name = product.name, price = product.price;
          _context6.next = 20;
          return regeneratorRuntime.awrap(DungLuongSku.findOne({
            madungluong: madungluongsku
          }));

        case 20:
          dungluongsku = _context6.sent;
          _iteratorNormalCompletion3 = true;
          _didIteratorError3 = false;
          _iteratorError3 = undefined;
          _context6.prev = 24;
          _iterator3 = imelList[Symbol.iterator]();

        case 26:
          if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
            _context6.next = 56;
            break;
          }

          imel = _step3.value;
          _context6.next = 30;
          return regeneratorRuntime.awrap(SanPham.findOne({
            imel: imel
          }));

        case 30:
          sp = _context6.sent;

          if (!sp) {
            _context6.next = 33;
            break;
          }

          return _context6.abrupt("continue", 53);

        case 33:
          sanpham = new SanPham({
            name: name,
            imel: imel,
            datenhap: loaisanpham.date,
            price: price
          });
          masp = 'SP' + sanpham._id.toString().slice(-5);
          kho.sanpham.push(sanpham._id);
          sanpham.kho = kho._id;
          sanpham.masp = masp;
          sanpham.datexuat = '';
          sanpham.xuat = false;
          sanpham.loaisanpham = loaisanpham._id;
          dungluongsku.sanpham.push(sanpham._id);
          sanpham.dungluongsku = dungluongsku._id;
          _context6.next = 45;
          return regeneratorRuntime.awrap(sanpham.save());

        case 45:
          loaisanpham.sanpham.push(sanpham._id);
          _context6.next = 48;
          return regeneratorRuntime.awrap(loaisanpham.save());

        case 48:
          _context6.next = 50;
          return regeneratorRuntime.awrap(kho.save());

        case 50:
          _context6.next = 52;
          return regeneratorRuntime.awrap(dungluongsku.save());

        case 52:
          addedProducts.push(sanpham);

        case 53:
          _iteratorNormalCompletion3 = true;
          _context6.next = 26;
          break;

        case 56:
          _context6.next = 62;
          break;

        case 58:
          _context6.prev = 58;
          _context6.t0 = _context6["catch"](24);
          _didIteratorError3 = true;
          _iteratorError3 = _context6.t0;

        case 62:
          _context6.prev = 62;
          _context6.prev = 63;

          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }

        case 65:
          _context6.prev = 65;

          if (!_didIteratorError3) {
            _context6.next = 68;
            break;
          }

          throw _iteratorError3;

        case 68:
          return _context6.finish(65);

        case 69:
          return _context6.finish(62);

        case 70:
          _iteratorNormalCompletion2 = true;
          _context6.next = 15;
          break;

        case 73:
          _context6.next = 79;
          break;

        case 75:
          _context6.prev = 75;
          _context6.t1 = _context6["catch"](13);
          _didIteratorError2 = true;
          _iteratorError2 = _context6.t1;

        case 79:
          _context6.prev = 79;
          _context6.prev = 80;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 82:
          _context6.prev = 82;

          if (!_didIteratorError2) {
            _context6.next = 85;
            break;
          }

          throw _iteratorError2;

        case 85:
          return _context6.finish(82);

        case 86:
          return _context6.finish(79);

        case 87:
          res.json(addedProducts);
          _context6.next = 94;
          break;

        case 90:
          _context6.prev = 90;
          _context6.t2 = _context6["catch"](0);
          console.error(_context6.t2);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 94:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 90], [13, 75, 79, 87], [24, 58, 62, 70], [63,, 65, 69], [80,, 82, 86]]);
});
router.post('/postsp', function _callee7(req, res) {
  var _req$body2, imel, name, capacity, color, tenloai, vietnamTime, loaisanpham, sanpham;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _req$body2 = req.body, imel = _req$body2.imel, name = _req$body2.name, capacity = _req$body2.capacity, color = _req$body2.color, tenloai = _req$body2.tenloai;
          vietnamTime = momenttimezone().toDate();
          _context7.next = 5;
          return regeneratorRuntime.awrap(LoaiSanPham.findOne({
            name: tenloai
          }));

        case 5:
          loaisanpham = _context7.sent;
          sanpham = new SanPham({
            name: name,
            capacity: capacity,
            color: color,
            imel: imel,
            datenhap: vietnamTime
          });
          sanpham.datexuat = '';
          sanpham.loaisanpham = loaisanpham._id;
          _context7.next = 11;
          return regeneratorRuntime.awrap(sanpham.save());

        case 11:
          loaisanpham.sanpham.push(sanpham._id);
          _context7.next = 14;
          return regeneratorRuntime.awrap(loaisanpham.save());

        case 14:
          res.json(sanpham);
          _context7.next = 21;
          break;

        case 17:
          _context7.prev = 17;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 21:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 17]]);
});
router.get('/getloaisanpham', function _callee9(req, res) {
  var depotId, depot, loaisanpham;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          depotId = req.session.depotId;
          _context9.next = 4;
          return regeneratorRuntime.awrap(Depot.findById(depotId));

        case 4:
          depot = _context9.sent;
          _context9.next = 7;
          return regeneratorRuntime.awrap(Promise.all(depot.loaisanpham.map(function _callee8(loai) {
            var loaisp;
            return regeneratorRuntime.async(function _callee8$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    _context8.next = 2;
                    return regeneratorRuntime.awrap(LoaiSanPham.findById(loai._id));

                  case 2:
                    loaisp = _context8.sent;
                    return _context8.abrupt("return", {
                      _id: loaisp._id,
                      name: loaisp.name
                    });

                  case 4:
                  case "end":
                    return _context8.stop();
                }
              }
            });
          })));

        case 7:
          loaisanpham = _context9.sent;
          res.render('nhapkho', {
            loaisanpham: loaisanpham
          });
          _context9.next = 15;
          break;

        case 11:
          _context9.prev = 11;
          _context9.t0 = _context9["catch"](0);
          console.error(_context9.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 15:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 11]]);
});
router.post('/putsp/:idsanpham', function _callee10(req, res) {
  var idsanpham, _req$body3, imel, name, capacity, color, sanpham;

  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          idsanpham = req.params.idsanpham;
          _req$body3 = req.body, imel = _req$body3.imel, name = _req$body3.name, capacity = _req$body3.capacity, color = _req$body3.color;
          _context10.next = 5;
          return regeneratorRuntime.awrap(SanPham.findByIdAndUpdate(idsanpham, {
            imel: imel,
            name: name,
            capacity: capacity,
            color: color
          }));

        case 5:
          sanpham = _context10.sent;
          _context10.next = 8;
          return regeneratorRuntime.awrap(sanpham.save());

        case 8:
          res.json(sanpham);
          _context10.next = 15;
          break;

        case 11:
          _context10.prev = 11;
          _context10.t0 = _context10["catch"](0);
          console.error(_context10.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 15:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 11]]);
});
router.get('/getchitietsp/:idsanpham', function _callee11(req, res) {
  var idsanpham, sanpham, sanphamjson;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          idsanpham = req.params.idsanpham;
          _context11.next = 4;
          return regeneratorRuntime.awrap(SanPham.findById(idsanpham));

        case 4:
          sanpham = _context11.sent;
          sanphamjson = {
            _id: sanpham._id,
            imel: sanpham.imel,
            name: sanpham.name,
            capacity: sanpham.capacity,
            color: sanpham.color,
            xuat: sanpham.xuat
          };
          res.json(sanphamjson);
          _context11.next = 13;
          break;

        case 9:
          _context11.prev = 9;
          _context11.t0 = _context11["catch"](0);
          console.error(_context11.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 13:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 9]]);
});
router.post('/deletesp/:idsanpham', function _callee12(req, res) {
  var idsanpham, sanpham, loaisanpham;
  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          idsanpham = req.params.idsanpham;
          _context12.next = 4;
          return regeneratorRuntime.awrap(SanPham.findById(idsanpham));

        case 4:
          sanpham = _context12.sent;
          _context12.next = 7;
          return regeneratorRuntime.awrap(LoaiSanPham.findById(sanpham.loaisanpham));

        case 7:
          loaisanpham = _context12.sent;
          loaisanpham.sanpham = loaisanpham.sanpham.filter(function (sp) {
            return sp._id != idsanpham;
          });
          _context12.next = 11;
          return regeneratorRuntime.awrap(loaisanpham.save());

        case 11:
          _context12.next = 13;
          return regeneratorRuntime.awrap(SanPham.deleteOne({
            _id: idsanpham
          }));

        case 13:
          res.json(sanpham);
          _context12.next = 20;
          break;

        case 16:
          _context12.prev = 16;
          _context12.t0 = _context12["catch"](0);
          console.error(_context12.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 20:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 16]]);
});
router.post('/postest', function _callee13(req, res) {
  var imel, sanpham;
  return regeneratorRuntime.async(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          imel = req.body.imel;
          sanpham = new SanPham({
            imel: imel
          });
          _context13.next = 5;
          return regeneratorRuntime.awrap(sanpham.save());

        case 5:
          res.json(sanpham);
          _context13.next = 12;
          break;

        case 8:
          _context13.prev = 8;
          _context13.t0 = _context13["catch"](0);
          console.error(_context13.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 12:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[0, 8]]);
});
router.post('/xuatkho/:idsanpham/:idloaisp/:khoid', function _callee15(req, res) {
  var idsanpham, idloaisp, khoid, sanpham1, loaisanpham, kho, sanpham, vietnamTime;
  return regeneratorRuntime.async(function _callee15$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          idsanpham = req.params.idsanpham;
          idloaisp = req.params.idloaisp;
          khoid = req.params.khoid;
          _context15.next = 6;
          return regeneratorRuntime.awrap(SanPham.findById(idsanpham));

        case 6:
          sanpham1 = _context15.sent;
          _context15.next = 9;
          return regeneratorRuntime.awrap(LoaiSanPham.findById(idloaisp));

        case 9:
          loaisanpham = _context15.sent;
          _context15.next = 12;
          return regeneratorRuntime.awrap(Depot.findById(khoid));

        case 12:
          kho = _context15.sent;
          _context15.next = 15;
          return regeneratorRuntime.awrap(Promise.all(loaisanpham.sanpham.map(function _callee14(sp) {
            var sp1;
            return regeneratorRuntime.async(function _callee14$(_context14) {
              while (1) {
                switch (_context14.prev = _context14.next) {
                  case 0:
                    _context14.next = 2;
                    return regeneratorRuntime.awrap(SanPham.findById(sp._id));

                  case 2:
                    sp1 = _context14.sent;
                    return _context14.abrupt("return", {
                      masp: sp1.masp,
                      _id: sp1._id,
                      imel: sp1.imel,
                      name: sp1.name,
                      capacity: sp1.capacity,
                      color: sp1.color,
                      xuatStatus: sp1.xuat ? 'Đã xuất' : 'tồn kho'
                    });

                  case 4:
                  case "end":
                    return _context14.stop();
                }
              }
            });
          })));

        case 15:
          sanpham = _context15.sent;
          loaisanpham.sanpham = loaisanpham.sanpham.filter(function (sp) {
            return sp._id != idsanpham;
          });
          vietnamTime = moment().tz('Asia/Ho_Chi_Minh').toDate();
          sanpham1.xuat = true;
          sanpham1.datexuat = moment(vietnamTime).format('YYYY-MM-DD HH:mm:ss');
          kho.xuatkho.push(sanpham1._id);
          _context15.next = 23;
          return regeneratorRuntime.awrap(sanpham1.save());

        case 23:
          _context15.next = 25;
          return regeneratorRuntime.awrap(loaisanpham.save());

        case 25:
          _context15.next = 27;
          return regeneratorRuntime.awrap(kho.save());

        case 27:
          res.json(sanpham);
          _context15.next = 34;
          break;

        case 30:
          _context15.prev = 30;
          _context15.t0 = _context15["catch"](0);
          console.error(_context15.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 34:
        case "end":
          return _context15.stop();
      }
    }
  }, null, null, [[0, 30]]);
});
router.post('/xuatkho1/:khoid', function _callee17(req, res) {
  var idsanpham1, idloaisp, khoid, sanphamList, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _loop, _iterator4, _step4;

  return regeneratorRuntime.async(function _callee17$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          _context18.prev = 0;
          idsanpham1 = req.body.idsanpham1;
          idloaisp = req.params.idloaisp;
          khoid = req.params.khoid;
          sanphamList = [];
          _iteratorNormalCompletion4 = true;
          _didIteratorError4 = false;
          _iteratorError4 = undefined;
          _context18.prev = 8;

          _loop = function _loop() {
            var idsanpham, sanpham1, loaisanpham, kho, sanpham, vietnamTime;
            return regeneratorRuntime.async(function _loop$(_context17) {
              while (1) {
                switch (_context17.prev = _context17.next) {
                  case 0:
                    idsanpham = _step4.value;
                    _context17.next = 3;
                    return regeneratorRuntime.awrap(SanPham.findById(idsanpham));

                  case 3:
                    sanpham1 = _context17.sent;
                    _context17.next = 6;
                    return regeneratorRuntime.awrap(LoaiSanPham.findById(sanpham1.loaisanpham));

                  case 6:
                    loaisanpham = _context17.sent;
                    _context17.next = 9;
                    return regeneratorRuntime.awrap(Depot.findById(khoid));

                  case 9:
                    kho = _context17.sent;
                    _context17.next = 12;
                    return regeneratorRuntime.awrap(Promise.all(loaisanpham.sanpham.map(function _callee16(sp) {
                      var sp1;
                      return regeneratorRuntime.async(function _callee16$(_context16) {
                        while (1) {
                          switch (_context16.prev = _context16.next) {
                            case 0:
                              _context16.next = 2;
                              return regeneratorRuntime.awrap(SanPham.findById(sp._id));

                            case 2:
                              sp1 = _context16.sent;
                              return _context16.abrupt("return", {
                                masp: sp1.masp,
                                _id: sp1._id,
                                imel: sp1.imel,
                                name: sp1.name,
                                capacity: sp1.capacity,
                                color: sp1.color,
                                xuatStatus: sp1.xuat ? 'Đã xuất' : 'tồn kho'
                              });

                            case 4:
                            case "end":
                              return _context16.stop();
                          }
                        }
                      });
                    })));

                  case 12:
                    sanpham = _context17.sent;
                    loaisanpham.sanpham = loaisanpham.sanpham.filter(function (sp) {
                      return sp._id != idsanpham;
                    });
                    vietnamTime = moment().tz('Asia/Ho_Chi_Minh').toDate();
                    sanpham1.xuat = true;
                    sanpham1.datexuat = moment(vietnamTime).format('YYYY-MM-DD HH:mm:ss');
                    kho.xuatkho.push(sanpham1._id);
                    _context17.next = 20;
                    return regeneratorRuntime.awrap(sanpham1.save());

                  case 20:
                    _context17.next = 22;
                    return regeneratorRuntime.awrap(kho.save());

                  case 22:
                    _context17.next = 24;
                    return regeneratorRuntime.awrap(loaisanpham.save());

                  case 24:
                    sanphamList.push.apply(sanphamList, _toConsumableArray(sanpham));

                  case 25:
                  case "end":
                    return _context17.stop();
                }
              }
            });
          };

          _iterator4 = idsanpham1[Symbol.iterator]();

        case 11:
          if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
            _context18.next = 17;
            break;
          }

          _context18.next = 14;
          return regeneratorRuntime.awrap(_loop());

        case 14:
          _iteratorNormalCompletion4 = true;
          _context18.next = 11;
          break;

        case 17:
          _context18.next = 23;
          break;

        case 19:
          _context18.prev = 19;
          _context18.t0 = _context18["catch"](8);
          _didIteratorError4 = true;
          _iteratorError4 = _context18.t0;

        case 23:
          _context18.prev = 23;
          _context18.prev = 24;

          if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
            _iterator4["return"]();
          }

        case 26:
          _context18.prev = 26;

          if (!_didIteratorError4) {
            _context18.next = 29;
            break;
          }

          throw _iteratorError4;

        case 29:
          return _context18.finish(26);

        case 30:
          return _context18.finish(23);

        case 31:
          res.json(sanphamList);
          _context18.next = 38;
          break;

        case 34:
          _context18.prev = 34;
          _context18.t1 = _context18["catch"](0);
          console.error(_context18.t1);
          res.json({
            message: 'Đã xảy ra lỗi.'
          });

        case 38:
        case "end":
          return _context18.stop();
      }
    }
  }, null, null, [[0, 34], [8, 19, 23, 31], [24,, 26, 30]]);
});
router.post('/chuyenkho/:idsanpham', function _callee18(req, res) {
  var idsanpham, tenkho, kho, sanpham, loaisp, kho1, isLoaiSPInKho, vietnamTime, dieuchuyen, lsp, loaiSPInKho;
  return regeneratorRuntime.async(function _callee18$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          _context19.prev = 0;
          idsanpham = req.params.idsanpham;
          tenkho = req.body.tenkho;
          _context19.next = 5;
          return regeneratorRuntime.awrap(Depot.findOne({
            name: tenkho
          }).populate('loaisanpham'));

        case 5:
          kho = _context19.sent;
          _context19.next = 8;
          return regeneratorRuntime.awrap(SanPham.findById(idsanpham));

        case 8:
          sanpham = _context19.sent;
          _context19.next = 11;
          return regeneratorRuntime.awrap(LoaiSanPham.findById(sanpham.loaisanpham));

        case 11:
          loaisp = _context19.sent;
          _context19.next = 14;
          return regeneratorRuntime.awrap(Depot.findById(loaisp.depot));

        case 14:
          kho1 = _context19.sent;
          loaisp.sanpham = loaisp.sanpham.filter(function (sp) {
            return sp._id != idsanpham;
          });
          isLoaiSPInKho = kho.loaisanpham.find(function (item) {
            return item.malsp === loaisp.malsp;
          });
          vietnamTime = moment().tz('Asia/Ho_Chi_Minh').toDate();
          dieuchuyen = new DieuChuyen({
            sanpham: sanpham._id,
            loaisanpham: loaisp._id,
            nhacungcap: loaisp.nhacungcap,
            depot: kho1._id,
            trangthai: "\u0110i\u1EC1u chuy\u1EC3n t\u1EEB kho ".concat(kho1.name, " sang kho ").concat(kho.name),
            date: moment(vietnamTime).format('YYYY-MM-DD HH:mm:ss')
          });
          kho1.dieuchuyen.push(dieuchuyen._id);

          if (isLoaiSPInKho) {
            _context19.next = 33;
            break;
          }

          lsp = new LoaiSanPham({
            name: loaisp.name,
            depot: kho._id,
            date: moment(loaisp.date).format('YYYY-MM-DD'),
            malsp: loaisp.malsp,
            nhacungcap: loaisp.nhacungcap
          });
          lsp.sanpham.push(sanpham._id);
          lsp.soluong = lsp.sanpham.length;
          lsp.tongtien = parseFloat((loaisp.tongtien / loaisp.soluong).toFixed(1));
          lsp.average = parseFloat((loaisp.tongtien / loaisp.soluong).toFixed(1));
          kho.loaisanpham.push(lsp._id);
          _context19.next = 29;
          return regeneratorRuntime.awrap(lsp.save());

        case 29:
          _context19.next = 31;
          return regeneratorRuntime.awrap(kho.save());

        case 31:
          _context19.next = 43;
          break;

        case 33:
          _context19.next = 35;
          return regeneratorRuntime.awrap(LoaiSanPham.findById(isLoaiSPInKho._id));

        case 35:
          loaiSPInKho = _context19.sent;
          console.log(isLoaiSPInKho._id);
          loaiSPInKho.sanpham.push(sanpham._id);
          loaiSPInKho.soluong = loaiSPInKho.sanpham.length;
          loaiSPInKho.tongtien = parseFloat((loaiSPInKho.tongtien + loaisp.tongtien / loaisp.soluong).toFixed(2));
          loaiSPInKho.average = parseFloat((loaiSPInKho.tongtien / loaiSPInKho.soluong).toFixed(1));
          _context19.next = 43;
          return regeneratorRuntime.awrap(loaiSPInKho.save());

        case 43:
          _context19.next = 45;
          return regeneratorRuntime.awrap(loaisp.save());

        case 45:
          _context19.next = 47;
          return regeneratorRuntime.awrap(dieuchuyen.save());

        case 47:
          _context19.next = 49;
          return regeneratorRuntime.awrap(kho1.save());

        case 49:
          res.json({
            message: 'Chuyển kho thành công!'
          });
          _context19.next = 56;
          break;

        case 52:
          _context19.prev = 52;
          _context19.t0 = _context19["catch"](0);
          console.error(_context19.t0);
          res.status(500).json({
            error: 'Có lỗi xảy ra.'
          });

        case 56:
        case "end":
          return _context19.stop();
      }
    }
  }, null, null, [[0, 52]]);
});
router.post('/chuyenkho1', function _callee19(req, res) {
  var _req$body4, idsanpham1, tenkho, kho, vietnamTime, createdLoaiSP, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _loop2, _iterator5, _step5;

  return regeneratorRuntime.async(function _callee19$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          _context21.prev = 0;
          _req$body4 = req.body, idsanpham1 = _req$body4.idsanpham1, tenkho = _req$body4.tenkho;
          _context21.next = 4;
          return regeneratorRuntime.awrap(Depot.findOne({
            name: tenkho
          }).populate('loaisanpham'));

        case 4:
          kho = _context21.sent;
          vietnamTime = moment().tz('Asia/Ho_Chi_Minh').toDate();
          createdLoaiSP = {};
          _iteratorNormalCompletion5 = true;
          _didIteratorError5 = false;
          _iteratorError5 = undefined;
          _context21.prev = 10;

          _loop2 = function _loop2() {
            var idsanpham, sanpham, loaisp, kho1, dieuchuyen, loaiSPInKho, newLoaiSP, existingLoaiSP;
            return regeneratorRuntime.async(function _loop2$(_context20) {
              while (1) {
                switch (_context20.prev = _context20.next) {
                  case 0:
                    idsanpham = _step5.value;
                    _context20.next = 3;
                    return regeneratorRuntime.awrap(SanPham.findById(idsanpham));

                  case 3:
                    sanpham = _context20.sent;
                    _context20.next = 6;
                    return regeneratorRuntime.awrap(LoaiSanPham.findById(sanpham.loaisanpham));

                  case 6:
                    loaisp = _context20.sent;
                    _context20.next = 9;
                    return regeneratorRuntime.awrap(Depot.findById(loaisp.depot));

                  case 9:
                    kho1 = _context20.sent;
                    dieuchuyen = new DieuChuyen({
                      sanpham: sanpham._id,
                      loaisanpham: loaisp._id,
                      nhacungcap: loaisp.nhacungcap,
                      depot: kho1._id,
                      trangthai: "\u0110i\u1EC1u chuy\u1EC3n t\u1EEB kho ".concat(kho1.name, " sang kho ").concat(kho.name),
                      date: moment(vietnamTime).format('YYYY-MM-DD HH:mm:ss')
                    });
                    kho1.dieuchuyen.push(dieuchuyen._id);
                    loaisp.sanpham = loaisp.sanpham.filter(function (sp) {
                      return sp._id != idsanpham;
                    });
                    loaisp.conlai = loaisp.sanpham.length;
                    loaiSPInKho = kho.loaisanpham.find(function (item) {
                      return item.malsp === loaisp.malsp;
                    });

                    if (loaiSPInKho) {
                      _context20.next = 50;
                      break;
                    }

                    if (createdLoaiSP[loaisp.malsp]) {
                      _context20.next = 36;
                      break;
                    }

                    newLoaiSP = new LoaiSanPham({
                      name: loaisp.name,
                      depot: kho._id,
                      date: moment(loaisp.date).format('YYYY-MM-DD'),
                      malsp: loaisp.malsp,
                      nhacungcap: loaisp.nhacungcap
                    });
                    newLoaiSP.sanpham.push(sanpham._id);
                    newLoaiSP.soluong = loaisp.soluong;
                    newLoaiSP.conlai = newLoaiSP.sanpham.length;
                    newLoaiSP.tongtien = loaisp.tongtien;
                    newLoaiSP.average = loaisp.average;
                    kho.loaisanpham.push(newLoaiSP._id);
                    kho.sanpham.push(sanpham._id);
                    sanpham.kho = kho._id;
                    sanpham.loaisanpham = newLoaiSP._id;
                    _context20.next = 29;
                    return regeneratorRuntime.awrap(sanpham.save());

                  case 29:
                    _context20.next = 31;
                    return regeneratorRuntime.awrap(newLoaiSP.save());

                  case 31:
                    _context20.next = 33;
                    return regeneratorRuntime.awrap(kho.save());

                  case 33:
                    createdLoaiSP[loaisp.malsp] = newLoaiSP;
                    _context20.next = 48;
                    break;

                  case 36:
                    existingLoaiSP = createdLoaiSP[loaisp.malsp];
                    existingLoaiSP.sanpham.push(sanpham._id);
                    kho.sanpham.push(sanpham._id);
                    sanpham.kho = kho._id;
                    sanpham.loaisanpham = existingLoaiSP._id;
                    existingLoaiSP.conlai = existingLoaiSP.sanpham.length;
                    _context20.next = 44;
                    return regeneratorRuntime.awrap(sanpham.save());

                  case 44:
                    _context20.next = 46;
                    return regeneratorRuntime.awrap(kho.save());

                  case 46:
                    _context20.next = 48;
                    return regeneratorRuntime.awrap(existingLoaiSP.save());

                  case 48:
                    _context20.next = 64;
                    break;

                  case 50:
                    _context20.next = 52;
                    return regeneratorRuntime.awrap(LoaiSanPham.findById(loaiSPInKho._id));

                  case 52:
                    loaiSPInKho = _context20.sent;
                    loaiSPInKho.sanpham.push(sanpham._id);
                    kho.sanpham.push(sanpham._id);
                    sanpham.kho = kho._id;
                    sanpham.loaisanpham = loaiSPInKho._id;
                    loaiSPInKho.conlai = loaiSPInKho.sanpham.length;
                    _context20.next = 60;
                    return regeneratorRuntime.awrap(sanpham.save());

                  case 60:
                    _context20.next = 62;
                    return regeneratorRuntime.awrap(kho.save());

                  case 62:
                    _context20.next = 64;
                    return regeneratorRuntime.awrap(loaiSPInKho.save());

                  case 64:
                    _context20.next = 66;
                    return regeneratorRuntime.awrap(loaisp.save());

                  case 66:
                    _context20.next = 68;
                    return regeneratorRuntime.awrap(dieuchuyen.save());

                  case 68:
                    _context20.next = 70;
                    return regeneratorRuntime.awrap(kho1.save());

                  case 70:
                  case "end":
                    return _context20.stop();
                }
              }
            });
          };

          _iterator5 = idsanpham1[Symbol.iterator]();

        case 13:
          if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
            _context21.next = 19;
            break;
          }

          _context21.next = 16;
          return regeneratorRuntime.awrap(_loop2());

        case 16:
          _iteratorNormalCompletion5 = true;
          _context21.next = 13;
          break;

        case 19:
          _context21.next = 25;
          break;

        case 21:
          _context21.prev = 21;
          _context21.t0 = _context21["catch"](10);
          _didIteratorError5 = true;
          _iteratorError5 = _context21.t0;

        case 25:
          _context21.prev = 25;
          _context21.prev = 26;

          if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
            _iterator5["return"]();
          }

        case 28:
          _context21.prev = 28;

          if (!_didIteratorError5) {
            _context21.next = 31;
            break;
          }

          throw _iteratorError5;

        case 31:
          return _context21.finish(28);

        case 32:
          return _context21.finish(25);

        case 33:
          res.json({
            message: 'Chuyển kho hàng loạt thành công!'
          });
          _context21.next = 40;
          break;

        case 36:
          _context21.prev = 36;
          _context21.t1 = _context21["catch"](0);
          console.error(_context21.t1);
          res.status(500).json({
            error: 'Có lỗi xảy ra.'
          });

        case 40:
        case "end":
          return _context21.stop();
      }
    }
  }, null, null, [[0, 36], [10, 21, 25, 33], [26,, 28, 32]]);
});
router.post('/chuyenkho2/:khoId', function _callee20(req, res) {
  var _req$body5, idsanpham1, tenkho, khoId, kho1, _kho, _vietnamTime, loaisp1, malsp, dieuchuyen, tongtien, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _loop3, _iterator6, _step6;

  return regeneratorRuntime.async(function _callee20$(_context23) {
    while (1) {
      switch (_context23.prev = _context23.next) {
        case 0:
          _context23.prev = 0;
          _req$body5 = req.body, idsanpham1 = _req$body5.idsanpham1, tenkho = _req$body5.tenkho;
          khoId = req.params.khoId;
          _context23.next = 5;
          return regeneratorRuntime.awrap(Depot.findById(khoId));

        case 5:
          kho1 = _context23.sent;
          _context23.next = 8;
          return regeneratorRuntime.awrap(Depot.findOne({
            name: tenkho
          }).populate('loaisanpham'));

        case 8:
          _kho = _context23.sent;
          _vietnamTime = moment().tz('Asia/Ho_Chi_Minh').toDate();
          loaisp1 = new LoaiSanPham({
            name: "\u0110i\u1EC1u chuy\u1EC3n t\u1EEB kho ".concat(kho1.name, " sang kho ").concat(_kho.name),
            date: moment(_vietnamTime).format('YYYY-MM-DD HH:mm:ss'),
            hour: moment(_vietnamTime).format('YYYY-MM-DD HH:mm:ss'),
            depot: _kho._id,
            makhodiechuyen: kho1._id
          });
          malsp = 'LH' + loaisp1._id.toString().slice(-5);
          loaisp1.malsp = malsp;
          dieuchuyen = new DieuChuyen({
            depot: kho1._id,
            trangthai: "\u0110i\u1EC1u chuy\u1EC3n t\u1EEB kho ".concat(kho1.name, " sang kho ").concat(_kho.name),
            date: moment(_vietnamTime).format('YYYY-MM-DD HH:mm:ss')
          });
          kho1.dieuchuyen.push(dieuchuyen._id);

          _kho.loaisanpham.push(loaisp1._id);

          tongtien = 0;
          _iteratorNormalCompletion6 = true;
          _didIteratorError6 = false;
          _iteratorError6 = undefined;
          _context23.prev = 20;

          _loop3 = function _loop3() {
            var idsanpham, sanpham, loaisp;
            return regeneratorRuntime.async(function _loop3$(_context22) {
              while (1) {
                switch (_context22.prev = _context22.next) {
                  case 0:
                    idsanpham = _step6.value;
                    _context22.next = 3;
                    return regeneratorRuntime.awrap(SanPham.findById(idsanpham));

                  case 3:
                    sanpham = _context22.sent;
                    _context22.next = 6;
                    return regeneratorRuntime.awrap(LoaiSanPham.findById(sanpham.loaisanpham));

                  case 6:
                    loaisp = _context22.sent;
                    tongtien += sanpham.price;
                    kho1.sanpham = kho1.sanpham.filter(function (sp) {
                      return sp._id != idsanpham;
                    });

                    _kho.sanpham.push(sanpham._id);

                    sanpham.kho = _kho._id;
                    dieuchuyen.sanpham.push(sanpham._id);
                    loaisp.sanpham = loaisp.sanpham.filter(function (sp) {
                      return sp._id != idsanpham;
                    });
                    loaisp.conlai = loaisp.sanpham.length;
                    loaisp1.sanpham.push(sanpham._id);
                    sanpham.loaisanpham = loaisp1._id;
                    _context22.next = 18;
                    return regeneratorRuntime.awrap(sanpham.save());

                  case 18:
                    _context22.next = 20;
                    return regeneratorRuntime.awrap(loaisp.save());

                  case 20:
                    _context22.next = 22;
                    return regeneratorRuntime.awrap(kho1.save());

                  case 22:
                    _context22.next = 24;
                    return regeneratorRuntime.awrap(_kho.save());

                  case 24:
                    _context22.next = 26;
                    return regeneratorRuntime.awrap(dieuchuyen.save());

                  case 26:
                    _context22.next = 28;
                    return regeneratorRuntime.awrap(loaisp1.save());

                  case 28:
                  case "end":
                    return _context22.stop();
                }
              }
            });
          };

          _iterator6 = idsanpham1[Symbol.iterator]();

        case 23:
          if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
            _context23.next = 29;
            break;
          }

          _context23.next = 26;
          return regeneratorRuntime.awrap(_loop3());

        case 26:
          _iteratorNormalCompletion6 = true;
          _context23.next = 23;
          break;

        case 29:
          _context23.next = 35;
          break;

        case 31:
          _context23.prev = 31;
          _context23.t0 = _context23["catch"](20);
          _didIteratorError6 = true;
          _iteratorError6 = _context23.t0;

        case 35:
          _context23.prev = 35;
          _context23.prev = 36;

          if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
            _iterator6["return"]();
          }

        case 38:
          _context23.prev = 38;

          if (!_didIteratorError6) {
            _context23.next = 41;
            break;
          }

          throw _iteratorError6;

        case 41:
          return _context23.finish(38);

        case 42:
          return _context23.finish(35);

        case 43:
          dieuchuyen.tongtien = tongtien;
          loaisp1.tongtien = tongtien;
          _context23.next = 47;
          return regeneratorRuntime.awrap(dieuchuyen.save());

        case 47:
          _context23.next = 49;
          return regeneratorRuntime.awrap(_kho.save());

        case 49:
          _context23.next = 51;
          return regeneratorRuntime.awrap(kho1.save());

        case 51:
          _context23.next = 53;
          return regeneratorRuntime.awrap(loaisp1.save());

        case 53:
          res.json({
            message: 'Chuyển kho hàng loạt thành công!'
          });
          _context23.next = 60;
          break;

        case 56:
          _context23.prev = 56;
          _context23.t1 = _context23["catch"](0);
          console.error(_context23.t1);
          res.status(500).json({
            error: 'Có lỗi xảy ra.'
          });

        case 60:
        case "end":
          return _context23.stop();
      }
    }
  }, null, null, [[0, 56], [20, 31, 35, 43], [36,, 38, 42]]);
});
router.get('/getxuatkho/:khoid', function _callee22(req, res) {
  var _khoid, _kho2, sp1;

  return regeneratorRuntime.async(function _callee22$(_context25) {
    while (1) {
      switch (_context25.prev = _context25.next) {
        case 0:
          _context25.prev = 0;
          _khoid = req.params.khoid;
          _context25.next = 4;
          return regeneratorRuntime.awrap(Depot.findById(_khoid));

        case 4:
          _kho2 = _context25.sent;
          _context25.next = 7;
          return regeneratorRuntime.awrap(Promise.all(_kho2.xuatkho.map(function _callee21(sp) {
            var sp1, loaisp;
            return regeneratorRuntime.async(function _callee21$(_context24) {
              while (1) {
                switch (_context24.prev = _context24.next) {
                  case 0:
                    _context24.next = 2;
                    return regeneratorRuntime.awrap(SanPham.findById(sp));

                  case 2:
                    sp1 = _context24.sent;
                    _context24.next = 5;
                    return regeneratorRuntime.awrap(LoaiSanPham.findById(sp1.loaisanpham));

                  case 5:
                    loaisp = _context24.sent;
                    return _context24.abrupt("return", {
                      _id: sp1._id,
                      malohang: loaisp.malsp,
                      masp: sp1.masp,
                      imel: sp1.imel,
                      tenmay: sp1.name,
                      ngaynhap: moment(loaisp.date).format('DD/MM/YYYY'),
                      ngayxuat: moment(sp1.datexuat).format('DD/MM/YYYY')
                    });

                  case 7:
                  case "end":
                    return _context24.stop();
                }
              }
            });
          })));

        case 7:
          sp1 = _context25.sent;
          res.json(sp1);
          _context25.next = 15;
          break;

        case 11:
          _context25.prev = 11;
          _context25.t0 = _context25["catch"](0);
          console.error(_context25.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 15:
        case "end":
          return _context25.stop();
      }
    }
  }, null, null, [[0, 11]]);
});
router.post('/deletexuatkho/:idkho', function _callee23(req, res) {
  var idsp, idkho, _kho3, _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _loop4, _iterator7, _step7;

  return regeneratorRuntime.async(function _callee23$(_context27) {
    while (1) {
      switch (_context27.prev = _context27.next) {
        case 0:
          _context27.prev = 0;
          idsp = req.body.idsp;
          idkho = req.params.idkho;
          _context27.next = 5;
          return regeneratorRuntime.awrap(Depot.findById(idkho));

        case 5:
          _kho3 = _context27.sent;
          _iteratorNormalCompletion7 = true;
          _didIteratorError7 = false;
          _iteratorError7 = undefined;
          _context27.prev = 9;

          _loop4 = function _loop4() {
            var idsp1, sanpham;
            return regeneratorRuntime.async(function _loop4$(_context26) {
              while (1) {
                switch (_context26.prev = _context26.next) {
                  case 0:
                    idsp1 = _step7.value;
                    _context26.next = 3;
                    return regeneratorRuntime.awrap(SanPham.findById(idsp1));

                  case 3:
                    sanpham = _context26.sent;
                    _kho3.xuatkho = _kho3.xuatkho.filter(function (sp) {
                      return sp._id.toString() !== sanpham._id.toString();
                    });
                    _context26.next = 7;
                    return regeneratorRuntime.awrap(SanPham.findByIdAndDelete(sanpham._id));

                  case 7:
                    _context26.next = 9;
                    return regeneratorRuntime.awrap(_kho3.save());

                  case 9:
                  case "end":
                    return _context26.stop();
                }
              }
            });
          };

          _iterator7 = idsp[Symbol.iterator]();

        case 12:
          if (_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done) {
            _context27.next = 18;
            break;
          }

          _context27.next = 15;
          return regeneratorRuntime.awrap(_loop4());

        case 15:
          _iteratorNormalCompletion7 = true;
          _context27.next = 12;
          break;

        case 18:
          _context27.next = 24;
          break;

        case 20:
          _context27.prev = 20;
          _context27.t0 = _context27["catch"](9);
          _didIteratorError7 = true;
          _iteratorError7 = _context27.t0;

        case 24:
          _context27.prev = 24;
          _context27.prev = 25;

          if (!_iteratorNormalCompletion7 && _iterator7["return"] != null) {
            _iterator7["return"]();
          }

        case 27:
          _context27.prev = 27;

          if (!_didIteratorError7) {
            _context27.next = 30;
            break;
          }

          throw _iteratorError7;

        case 30:
          return _context27.finish(27);

        case 31:
          return _context27.finish(24);

        case 32:
          res.json({
            message: 'xóa thành công'
          });
          _context27.next = 39;
          break;

        case 35:
          _context27.prev = 35;
          _context27.t1 = _context27["catch"](0);
          console.error(_context27.t1);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 39:
        case "end":
          return _context27.stop();
      }
    }
  }, null, null, [[0, 35], [9, 20, 24, 32], [25,, 27, 31]]);
});
router.post('/searchsanpham/:khoid', function _callee25(req, res) {
  var _req$body6, keyword, searchType, _khoid2, _kho4, query, products, product;

  return regeneratorRuntime.async(function _callee25$(_context29) {
    while (1) {
      switch (_context29.prev = _context29.next) {
        case 0:
          _context29.prev = 0;
          _req$body6 = req.body, keyword = _req$body6.keyword, searchType = _req$body6.searchType;
          _khoid2 = req.params.khoid;
          _context29.next = 5;
          return regeneratorRuntime.awrap(Depot.findById(_khoid2));

        case 5:
          _kho4 = _context29.sent;

          if (_kho4) {
            _context29.next = 8;
            break;
          }

          return _context29.abrupt("return", res.json({
            message: 'Kho không tồn tại.'
          }));

        case 8:
          query = {};

          if (searchType === '3 số đầu imel') {
            query = {
              imel: {
                $regex: "^".concat(keyword),
                $options: 'i'
              }
            };
          } else if (searchType === '3 số cuối imel') {
            query = {
              imel: {
                $regex: "".concat(keyword, "$"),
                $options: 'i'
              }
            };
          } else {
            query = {
              $or: [{
                name: {
                  $regex: keyword,
                  $options: 'i'
                }
              }]
            };
          }

          query.kho = _khoid2;
          query.xuat = false;
          _context29.next = 14;
          return regeneratorRuntime.awrap(SanPham.find(query));

        case 14:
          products = _context29.sent;
          _context29.next = 17;
          return regeneratorRuntime.awrap(Promise.all(products.map(function _callee24(product) {
            var loaisp;
            return regeneratorRuntime.async(function _callee24$(_context28) {
              while (1) {
                switch (_context28.prev = _context28.next) {
                  case 0:
                    _context28.next = 2;
                    return regeneratorRuntime.awrap(LoaiSanPham.findById(product.loaisanpham));

                  case 2:
                    loaisp = _context28.sent;
                    return _context28.abrupt("return", {
                      _id: product._id,
                      malohang: loaisp.malsp,
                      masp: product.masp,
                      name: product.name,
                      imel: product.imel,
                      capacity: product.capacity,
                      color: product.color,
                      xuat: product.xuat,
                      tralai: product.tralai
                    });

                  case 4:
                  case "end":
                    return _context28.stop();
                }
              }
            });
          })));

        case 17:
          product = _context29.sent;
          res.json(product);
          _context29.next = 25;
          break;

        case 21:
          _context29.prev = 21;
          _context29.t0 = _context29["catch"](0);
          console.error(_context29.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 25:
        case "end":
          return _context29.stop();
      }
    }
  }, null, null, [[0, 21]]);
});
router.post('/putsomeproduct', function _callee27(req, res) {
  var products, updatePromises, updatedProducts;
  return regeneratorRuntime.async(function _callee27$(_context31) {
    while (1) {
      switch (_context31.prev = _context31.next) {
        case 0:
          _context31.prev = 0;
          products = req.body.products;
          updatePromises = products.map(function _callee26(product) {
            return regeneratorRuntime.async(function _callee26$(_context30) {
              while (1) {
                switch (_context30.prev = _context30.next) {
                  case 0:
                    _context30.next = 2;
                    return regeneratorRuntime.awrap(SanPham.findByIdAndUpdate(product._id, {
                      imel: product.imel,
                      price: product.price
                    }, {
                      "new": true
                    }));

                  case 2:
                    return _context30.abrupt("return", _context30.sent);

                  case 3:
                  case "end":
                    return _context30.stop();
                }
              }
            });
          });
          _context31.next = 5;
          return regeneratorRuntime.awrap(Promise.all(updatePromises));

        case 5:
          updatedProducts = _context31.sent;
          res.status(200).json({
            message: 'Cập nhật sản phẩm thành công',
            data: updatedProducts
          });
          _context31.next = 13;
          break;

        case 9:
          _context31.prev = 9;
          _context31.t0 = _context31["catch"](0);
          console.error('Lỗi khi cập nhật sản phẩm:', _context31.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi khi cập nhật sản phẩm.'
          });

        case 13:
        case "end":
          return _context31.stop();
      }
    }
  }, null, null, [[0, 9]]);
});
router.get('/getsanpham', function _callee28(req, res) {
  var sanpham;
  return regeneratorRuntime.async(function _callee28$(_context32) {
    while (1) {
      switch (_context32.prev = _context32.next) {
        case 0:
          _context32.next = 2;
          return regeneratorRuntime.awrap(SanPham.find().lean());

        case 2:
          sanpham = _context32.sent;
          res.json(sanpham);

        case 4:
        case "end":
          return _context32.stop();
      }
    }
  });
});
module.exports = router;
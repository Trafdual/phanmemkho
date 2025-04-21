"use strict";

var router = require('express').Router();

var Sku = require('../models/SkuModel');

var DungLuongSku = require('../models/DungluongSkuModel');

var User = require('../models/UserModel');

var NhanVien = require('../models/NhanVienModel');

router.get('/getdungluongsku/:userID', function _callee3(req, res) {
  var userID, user, skujson;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          userID = req.params.userID;
          _context3.next = 4;
          return regeneratorRuntime.awrap(User.findById(userID));

        case 4:
          user = _context3.sent;
          _context3.next = 7;
          return regeneratorRuntime.awrap(Promise.all(user.sku.map(function _callee2(sk) {
            var sku, dungluong;
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return regeneratorRuntime.awrap(Sku.findOne({
                      _id: sk._id,
                      $or: [{
                        status: 1
                      }, {
                        status: {
                          $exists: false
                        }
                      }]
                    }));

                  case 2:
                    sku = _context2.sent;

                    if (sku) {
                      _context2.next = 5;
                      break;
                    }

                    return _context2.abrupt("return", null);

                  case 5:
                    _context2.next = 7;
                    return regeneratorRuntime.awrap(Promise.all(sku.dungluong.map(function _callee(dl) {
                      var dlsku;
                      return regeneratorRuntime.async(function _callee$(_context) {
                        while (1) {
                          switch (_context.prev = _context.next) {
                            case 0:
                              _context.next = 2;
                              return regeneratorRuntime.awrap(DungLuongSku.findOne({
                                _id: dl._id,
                                $or: [{
                                  status: 1
                                }, {
                                  status: {
                                    $exists: false
                                  }
                                }]
                              }));

                            case 2:
                              dlsku = _context.sent;

                              if (dlsku) {
                                _context.next = 5;
                                break;
                              }

                              return _context.abrupt("return", null);

                            case 5:
                              return _context.abrupt("return", {
                                _id: dlsku._id,
                                name: dlsku.name === '' ? sku.name : "".concat(sku.name, " (").concat(dlsku.name, ")"),
                                madungluong: dlsku.madungluong
                              });

                            case 6:
                            case "end":
                              return _context.stop();
                          }
                        }
                      });
                    })));

                  case 7:
                    dungluong = _context2.sent;
                    return _context2.abrupt("return", dungluong.filter(function (item) {
                      return item !== null;
                    }));

                  case 9:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          })));

        case 7:
          skujson = _context3.sent;
          res.json(skujson.flat().filter(function (item) {
            return item !== null;
          })); // Lọc lần cuối

          _context3.next = 15;
          break;

        case 11:
          _context3.prev = 11;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 15:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 11]]);
});
router.get('/getsku/:userID', function _callee5(req, res) {
  var userID, page, limit, startIndex, endIndex, user, skujson, filtered, total, paginated;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          userID = req.params.userID;
          page = parseInt(req.query.page) || 1;
          limit = parseInt(req.query.limit) || 10;
          startIndex = (page - 1) * limit;
          endIndex = page * limit;
          _context5.next = 8;
          return regeneratorRuntime.awrap(User.findById(userID));

        case 8:
          user = _context5.sent;
          _context5.next = 11;
          return regeneratorRuntime.awrap(Promise.all(user.sku.map(function _callee4(sk) {
            var sku;
            return regeneratorRuntime.async(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.next = 2;
                    return regeneratorRuntime.awrap(Sku.findOne({
                      _id: sk._id,
                      $or: [{
                        status: 1
                      }, {
                        status: {
                          $exists: false
                        }
                      }]
                    }));

                  case 2:
                    sku = _context4.sent;

                    if (sku) {
                      _context4.next = 5;
                      break;
                    }

                    return _context4.abrupt("return", null);

                  case 5:
                    return _context4.abrupt("return", {
                      _id: sku._id,
                      masku: sku.masku,
                      name: sku.name
                    });

                  case 6:
                  case "end":
                    return _context4.stop();
                }
              }
            });
          })));

        case 11:
          skujson = _context5.sent;
          filtered = skujson.filter(function (item) {
            return item !== null;
          });
          total = filtered.length;
          paginated = filtered.slice(startIndex, endIndex);
          res.json({
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            data: paginated
          });
          _context5.next = 22;
          break;

        case 18:
          _context5.prev = 18;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 22:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 18]]);
});
router.get('/getdungluongsku2/:idsku', function _callee7(req, res) {
  var idsku, page, limit, startIndex, endIndex, sku, skujson, filtered, total, paginated;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          idsku = req.params.idsku;
          page = parseInt(req.query.page) || 1;
          limit = parseInt(req.query.limit) || 10;
          startIndex = (page - 1) * limit;
          endIndex = page * limit;
          _context7.next = 8;
          return regeneratorRuntime.awrap(Sku.findById(idsku));

        case 8:
          sku = _context7.sent;

          if (sku) {
            _context7.next = 11;
            break;
          }

          return _context7.abrupt("return", res.json({
            error: 'không tìm thấy mã sku'
          }));

        case 11:
          _context7.next = 13;
          return regeneratorRuntime.awrap(Promise.all(sku.dungluong.map(function _callee6(dl) {
            var dlsku;
            return regeneratorRuntime.async(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    _context6.next = 2;
                    return regeneratorRuntime.awrap(DungLuongSku.findOne({
                      _id: dl._id,
                      $or: [{
                        status: 1
                      }, {
                        status: {
                          $exists: false
                        }
                      }]
                    }));

                  case 2:
                    dlsku = _context6.sent;

                    if (dlsku) {
                      _context6.next = 5;
                      break;
                    }

                    return _context6.abrupt("return", null);

                  case 5:
                    return _context6.abrupt("return", {
                      _id: dlsku._id,
                      name: dlsku.name,
                      madungluong: dlsku.madungluong
                    });

                  case 6:
                  case "end":
                    return _context6.stop();
                }
              }
            });
          })));

        case 13:
          skujson = _context7.sent;
          filtered = skujson.filter(function (item) {
            return item !== null;
          });
          total = filtered.length;
          paginated = filtered.slice(startIndex, endIndex);
          res.json({
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            data: paginated
          });
          _context7.next = 24;
          break;

        case 20:
          _context7.prev = 20;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 24:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 20]]);
});
router.post('/postsku/:iduser', function _callee8(req, res) {
  var iduser, _req$body, name, namedungluong, user, lastSku, newSkuCode, lastCode, newCodeNumber, sku, dl, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, dlName, _dl, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, nhanvien, nv, usernv;

  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          iduser = req.params.iduser;
          _req$body = req.body, name = _req$body.name, namedungluong = _req$body.namedungluong;
          _context8.next = 5;
          return regeneratorRuntime.awrap(User.findById(iduser).populate('sku'));

        case 5:
          user = _context8.sent;

          if (user) {
            _context8.next = 8;
            break;
          }

          return _context8.abrupt("return", res.status(404).json({
            message: 'Người dùng không tồn tại.'
          }));

        case 8:
          lastSku = null;

          if (!(user.sku.length > 0)) {
            _context8.next = 13;
            break;
          }

          _context8.next = 12;
          return regeneratorRuntime.awrap(Sku.findById(user.sku[user.sku.length - 1]));

        case 12:
          lastSku = _context8.sent;

        case 13:
          newSkuCode = 'SKU001';

          if (lastSku) {
            lastCode = lastSku.masku.replace('SKU', '');
            newCodeNumber = parseInt(lastCode) + 1;
            newSkuCode = "SKU".concat(newCodeNumber.toString().padStart(3, '0'));
          }

          sku = new Sku({
            name: name,
            masku: newSkuCode,
            dungluong: []
          });
          _context8.next = 18;
          return regeneratorRuntime.awrap(sku.save());

        case 18:
          if (!(!namedungluong || namedungluong.length === 0)) {
            _context8.next = 25;
            break;
          }

          dl = new DungLuongSku({
            name: '',
            madungluong: newSkuCode,
            sku: sku._id
          });
          _context8.next = 22;
          return regeneratorRuntime.awrap(dl.save());

        case 22:
          sku.dungluong.push(dl._id);
          _context8.next = 53;
          break;

        case 25:
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context8.prev = 28;
          _iterator = namedungluong[Symbol.iterator]();

        case 30:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context8.next = 39;
            break;
          }

          dlName = _step.value;
          _dl = new DungLuongSku({
            name: dlName,
            madungluong: "".concat(newSkuCode, "-").concat(dlName),
            sku: sku._id
          });
          _context8.next = 35;
          return regeneratorRuntime.awrap(_dl.save());

        case 35:
          sku.dungluong.push(_dl._id);

        case 36:
          _iteratorNormalCompletion = true;
          _context8.next = 30;
          break;

        case 39:
          _context8.next = 45;
          break;

        case 41:
          _context8.prev = 41;
          _context8.t0 = _context8["catch"](28);
          _didIteratorError = true;
          _iteratorError = _context8.t0;

        case 45:
          _context8.prev = 45;
          _context8.prev = 46;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 48:
          _context8.prev = 48;

          if (!_didIteratorError) {
            _context8.next = 51;
            break;
          }

          throw _iteratorError;

        case 51:
          return _context8.finish(48);

        case 52:
          return _context8.finish(45);

        case 53:
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context8.prev = 56;
          _iterator2 = user.nhanvien[Symbol.iterator]();

        case 58:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context8.next = 76;
            break;
          }

          nhanvien = _step2.value;
          _context8.next = 62;
          return regeneratorRuntime.awrap(NhanVien.findById(nhanvien._id));

        case 62:
          nv = _context8.sent;

          if (nv) {
            _context8.next = 65;
            break;
          }

          return _context8.abrupt("continue", 73);

        case 65:
          _context8.next = 67;
          return regeneratorRuntime.awrap(User.findById(nv.user));

        case 67:
          usernv = _context8.sent;

          if (usernv) {
            _context8.next = 70;
            break;
          }

          return _context8.abrupt("continue", 73);

        case 70:
          usernv.sku.push(sku._id);
          _context8.next = 73;
          return regeneratorRuntime.awrap(usernv.save());

        case 73:
          _iteratorNormalCompletion2 = true;
          _context8.next = 58;
          break;

        case 76:
          _context8.next = 82;
          break;

        case 78:
          _context8.prev = 78;
          _context8.t1 = _context8["catch"](56);
          _didIteratorError2 = true;
          _iteratorError2 = _context8.t1;

        case 82:
          _context8.prev = 82;
          _context8.prev = 83;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 85:
          _context8.prev = 85;

          if (!_didIteratorError2) {
            _context8.next = 88;
            break;
          }

          throw _iteratorError2;

        case 88:
          return _context8.finish(85);

        case 89:
          return _context8.finish(82);

        case 90:
          user.sku.push(sku._id);
          sku.userId = user._id;
          _context8.next = 94;
          return regeneratorRuntime.awrap(Promise.all([user.save(), sku.save()]));

        case 94:
          res.json(sku);
          _context8.next = 101;
          break;

        case 97:
          _context8.prev = 97;
          _context8.t2 = _context8["catch"](0);
          console.error(_context8.t2);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 101:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 97], [28, 41, 45, 53], [46,, 48, 52], [56, 78, 82, 90], [83,, 85, 89]]);
});
router.post('/postsku2/:idsku', function _callee9(req, res) {
  var iduser, _req$body2, name, namedungluong, user, lastSku, newSkuCode, lastCode, newCodeNumber, sku, dl, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, dlName, _dl2, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, nhanvien, nv, usernv;

  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          iduser = req.params.iduser;
          _req$body2 = req.body, name = _req$body2.name, namedungluong = _req$body2.namedungluong;
          _context9.next = 5;
          return regeneratorRuntime.awrap(User.findById(iduser).populate('sku'));

        case 5:
          user = _context9.sent;

          if (user) {
            _context9.next = 8;
            break;
          }

          return _context9.abrupt("return", res.status(404).json({
            message: 'Người dùng không tồn tại.'
          }));

        case 8:
          lastSku = null;

          if (!(user.sku.length > 0)) {
            _context9.next = 13;
            break;
          }

          _context9.next = 12;
          return regeneratorRuntime.awrap(Sku.findById(user.sku[user.sku.length - 1]));

        case 12:
          lastSku = _context9.sent;

        case 13:
          newSkuCode = 'SKU001';

          if (lastSku) {
            lastCode = lastSku.masku.replace('SKU', '');
            newCodeNumber = parseInt(lastCode) + 1;
            newSkuCode = "SKU".concat(newCodeNumber.toString().padStart(3, '0'));
          }

          sku = new Sku({
            name: name,
            masku: newSkuCode,
            dungluong: []
          });
          _context9.next = 18;
          return regeneratorRuntime.awrap(sku.save());

        case 18:
          if (!(!namedungluong || namedungluong.length === 0)) {
            _context9.next = 25;
            break;
          }

          dl = new DungLuongSku({
            name: '',
            madungluong: newSkuCode,
            sku: sku._id
          });
          _context9.next = 22;
          return regeneratorRuntime.awrap(dl.save());

        case 22:
          sku.dungluong.push(dl._id);
          _context9.next = 53;
          break;

        case 25:
          _iteratorNormalCompletion3 = true;
          _didIteratorError3 = false;
          _iteratorError3 = undefined;
          _context9.prev = 28;
          _iterator3 = namedungluong[Symbol.iterator]();

        case 30:
          if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
            _context9.next = 39;
            break;
          }

          dlName = _step3.value;
          _dl2 = new DungLuongSku({
            name: dlName,
            madungluong: "".concat(newSkuCode, "-").concat(dlName),
            sku: sku._id
          });
          _context9.next = 35;
          return regeneratorRuntime.awrap(_dl2.save());

        case 35:
          sku.dungluong.push(_dl2._id);

        case 36:
          _iteratorNormalCompletion3 = true;
          _context9.next = 30;
          break;

        case 39:
          _context9.next = 45;
          break;

        case 41:
          _context9.prev = 41;
          _context9.t0 = _context9["catch"](28);
          _didIteratorError3 = true;
          _iteratorError3 = _context9.t0;

        case 45:
          _context9.prev = 45;
          _context9.prev = 46;

          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }

        case 48:
          _context9.prev = 48;

          if (!_didIteratorError3) {
            _context9.next = 51;
            break;
          }

          throw _iteratorError3;

        case 51:
          return _context9.finish(48);

        case 52:
          return _context9.finish(45);

        case 53:
          _iteratorNormalCompletion4 = true;
          _didIteratorError4 = false;
          _iteratorError4 = undefined;
          _context9.prev = 56;
          _iterator4 = user.nhanvien[Symbol.iterator]();

        case 58:
          if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
            _context9.next = 76;
            break;
          }

          nhanvien = _step4.value;
          _context9.next = 62;
          return regeneratorRuntime.awrap(NhanVien.findById(nhanvien._id));

        case 62:
          nv = _context9.sent;

          if (nv) {
            _context9.next = 65;
            break;
          }

          return _context9.abrupt("continue", 73);

        case 65:
          _context9.next = 67;
          return regeneratorRuntime.awrap(User.findById(nv.user));

        case 67:
          usernv = _context9.sent;

          if (usernv) {
            _context9.next = 70;
            break;
          }

          return _context9.abrupt("continue", 73);

        case 70:
          usernv.sku.push(sku._id);
          _context9.next = 73;
          return regeneratorRuntime.awrap(usernv.save());

        case 73:
          _iteratorNormalCompletion4 = true;
          _context9.next = 58;
          break;

        case 76:
          _context9.next = 82;
          break;

        case 78:
          _context9.prev = 78;
          _context9.t1 = _context9["catch"](56);
          _didIteratorError4 = true;
          _iteratorError4 = _context9.t1;

        case 82:
          _context9.prev = 82;
          _context9.prev = 83;

          if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
            _iterator4["return"]();
          }

        case 85:
          _context9.prev = 85;

          if (!_didIteratorError4) {
            _context9.next = 88;
            break;
          }

          throw _iteratorError4;

        case 88:
          return _context9.finish(85);

        case 89:
          return _context9.finish(82);

        case 90:
          user.sku.push(sku._id);
          sku.userId = user._id;
          _context9.next = 94;
          return regeneratorRuntime.awrap(Promise.all([user.save(), sku.save()]));

        case 94:
          res.json(sku);
          _context9.next = 101;
          break;

        case 97:
          _context9.prev = 97;
          _context9.t2 = _context9["catch"](0);
          console.error(_context9.t2);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 101:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 97], [28, 41, 45, 53], [46,, 48, 52], [56, 78, 82, 90], [83,, 85, 89]]);
});
router.post('/updatesku/:idsku', function _callee10(req, res) {
  var idsku, name, sku;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          idsku = req.params.idsku;
          name = req.body.name;
          _context10.next = 5;
          return regeneratorRuntime.awrap(Sku.findById(idsku));

        case 5:
          sku = _context10.sent;

          if (sku) {
            _context10.next = 8;
            break;
          }

          return _context10.abrupt("return", res.json({
            error: 'sku không tồn tại'
          }));

        case 8:
          sku.name = name;
          _context10.next = 11;
          return regeneratorRuntime.awrap(sku.save());

        case 11:
          res.json({
            message: 'cập nhật thành công'
          });
          _context10.next = 18;
          break;

        case 14:
          _context10.prev = 14;
          _context10.t0 = _context10["catch"](0);
          console.error(_context10.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 18:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 14]]);
});
router.get('/getchitietsku/:idsku', function _callee11(req, res) {
  var idsku, sku;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          idsku = req.params.idsku;
          _context11.next = 4;
          return regeneratorRuntime.awrap(Sku.findById(idsku));

        case 4:
          sku = _context11.sent;

          if (sku) {
            _context11.next = 7;
            break;
          }

          return _context11.abrupt("return", res.json({
            error: 'sku không tồn tại'
          }));

        case 7:
          res.json(sku);
          _context11.next = 14;
          break;

        case 10:
          _context11.prev = 10;
          _context11.t0 = _context11["catch"](0);
          console.error(_context11.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 14:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
router.post('/deletesku', function _callee12(req, res) {
  var ids, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, id, sku;

  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          ids = req.body.ids;
          _iteratorNormalCompletion5 = true;
          _didIteratorError5 = false;
          _iteratorError5 = undefined;
          _context12.prev = 5;
          _iterator5 = ids[Symbol.iterator]();

        case 7:
          if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
            _context12.next = 18;
            break;
          }

          id = _step5.value;
          _context12.next = 11;
          return regeneratorRuntime.awrap(Sku.findById(id));

        case 11:
          sku = _context12.sent;
          sku.status = -1;
          _context12.next = 15;
          return regeneratorRuntime.awrap(sku.save());

        case 15:
          _iteratorNormalCompletion5 = true;
          _context12.next = 7;
          break;

        case 18:
          _context12.next = 24;
          break;

        case 20:
          _context12.prev = 20;
          _context12.t0 = _context12["catch"](5);
          _didIteratorError5 = true;
          _iteratorError5 = _context12.t0;

        case 24:
          _context12.prev = 24;
          _context12.prev = 25;

          if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
            _iterator5["return"]();
          }

        case 27:
          _context12.prev = 27;

          if (!_didIteratorError5) {
            _context12.next = 30;
            break;
          }

          throw _iteratorError5;

        case 30:
          return _context12.finish(27);

        case 31:
          return _context12.finish(24);

        case 32:
          res.json({
            message: 'xóa thành công'
          });
          _context12.next = 39;
          break;

        case 35:
          _context12.prev = 35;
          _context12.t1 = _context12["catch"](0);
          console.error(_context12.t1);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 39:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 35], [5, 20, 24, 32], [25,, 27, 31]]);
});
router.post('/deletedungluongsku', function _callee13(req, res) {
  var ids, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, id, dungluongsku;

  return regeneratorRuntime.async(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          ids = req.body.ids;
          _iteratorNormalCompletion6 = true;
          _didIteratorError6 = false;
          _iteratorError6 = undefined;
          _context13.prev = 5;
          _iterator6 = ids[Symbol.iterator]();

        case 7:
          if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
            _context13.next = 18;
            break;
          }

          id = _step6.value;
          _context13.next = 11;
          return regeneratorRuntime.awrap(DungLuongSku.findById(id));

        case 11:
          dungluongsku = _context13.sent;
          dungluongsku.status = -1;
          _context13.next = 15;
          return regeneratorRuntime.awrap(dungluongsku.save());

        case 15:
          _iteratorNormalCompletion6 = true;
          _context13.next = 7;
          break;

        case 18:
          _context13.next = 24;
          break;

        case 20:
          _context13.prev = 20;
          _context13.t0 = _context13["catch"](5);
          _didIteratorError6 = true;
          _iteratorError6 = _context13.t0;

        case 24:
          _context13.prev = 24;
          _context13.prev = 25;

          if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
            _iterator6["return"]();
          }

        case 27:
          _context13.prev = 27;

          if (!_didIteratorError6) {
            _context13.next = 30;
            break;
          }

          throw _iteratorError6;

        case 30:
          return _context13.finish(27);

        case 31:
          return _context13.finish(24);

        case 32:
          res.json({
            message: 'xóa thành công'
          });
          _context13.next = 39;
          break;

        case 35:
          _context13.prev = 35;
          _context13.t1 = _context13["catch"](0);
          console.error(_context13.t1);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 39:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[0, 35], [5, 20, 24, 32], [25,, 27, 31]]);
});
router.post('/postdungluongsku/:idsku', function _callee14(req, res) {
  var idsku, namedungluong, sku, dl, _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, dlName, _dl3;

  return regeneratorRuntime.async(function _callee14$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          idsku = req.params.idsku;
          namedungluong = req.body.namedungluong;
          _context14.next = 5;
          return regeneratorRuntime.awrap(Sku.findById(idsku));

        case 5:
          sku = _context14.sent;

          if (sku) {
            _context14.next = 8;
            break;
          }

          return _context14.abrupt("return", res.status(404).json({
            message: 'sku không tồn tại.'
          }));

        case 8:
          if (!(!namedungluong || namedungluong.length === 0)) {
            _context14.next = 15;
            break;
          }

          dl = new DungLuongSku({
            name: '',
            madungluong: sku.masku,
            sku: sku._id
          });
          _context14.next = 12;
          return regeneratorRuntime.awrap(dl.save());

        case 12:
          sku.dungluong.push(dl._id);
          _context14.next = 43;
          break;

        case 15:
          _iteratorNormalCompletion7 = true;
          _didIteratorError7 = false;
          _iteratorError7 = undefined;
          _context14.prev = 18;
          _iterator7 = namedungluong[Symbol.iterator]();

        case 20:
          if (_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done) {
            _context14.next = 29;
            break;
          }

          dlName = _step7.value;
          _dl3 = new DungLuongSku({
            name: dlName,
            madungluong: "".concat(sku.masku, "-").concat(dlName),
            sku: sku._id
          });
          _context14.next = 25;
          return regeneratorRuntime.awrap(_dl3.save());

        case 25:
          sku.dungluong.push(_dl3._id);

        case 26:
          _iteratorNormalCompletion7 = true;
          _context14.next = 20;
          break;

        case 29:
          _context14.next = 35;
          break;

        case 31:
          _context14.prev = 31;
          _context14.t0 = _context14["catch"](18);
          _didIteratorError7 = true;
          _iteratorError7 = _context14.t0;

        case 35:
          _context14.prev = 35;
          _context14.prev = 36;

          if (!_iteratorNormalCompletion7 && _iterator7["return"] != null) {
            _iterator7["return"]();
          }

        case 38:
          _context14.prev = 38;

          if (!_didIteratorError7) {
            _context14.next = 41;
            break;
          }

          throw _iteratorError7;

        case 41:
          return _context14.finish(38);

        case 42:
          return _context14.finish(35);

        case 43:
          _context14.next = 45;
          return regeneratorRuntime.awrap(sku.save());

        case 45:
          res.json(sku);
          _context14.next = 52;
          break;

        case 48:
          _context14.prev = 48;
          _context14.t1 = _context14["catch"](0);
          console.error(_context14.t1);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 52:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[0, 48], [18, 31, 35, 43], [36,, 38, 42]]);
});
router.post('/editdungluongsku/:iddungluongsku', function _callee15(req, res) {
  var iddungluongsku, namedungluong, dungluongsku, sku;
  return regeneratorRuntime.async(function _callee15$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          iddungluongsku = req.params.iddungluongsku;
          namedungluong = req.body.namedungluong;
          _context15.next = 5;
          return regeneratorRuntime.awrap(DungLuongSku.findById(iddungluongsku));

        case 5:
          dungluongsku = _context15.sent;

          if (dungluongsku) {
            _context15.next = 8;
            break;
          }

          return _context15.abrupt("return", res.status(404).json({
            message: 'dung lượng sku không tồn tại.'
          }));

        case 8:
          _context15.next = 10;
          return regeneratorRuntime.awrap(Sku.findById(dungluongsku.sku));

        case 10:
          sku = _context15.sent;

          if (sku) {
            _context15.next = 13;
            break;
          }

          return _context15.abrupt("return", res.status(404).json({
            message: 'sku không tồn tại.'
          }));

        case 13:
          dungluongsku.name = namedungluong;
          dungluongsku.madungluong = "".concat(sku.masku, "-").concat(namedungluong);
          _context15.next = 17;
          return regeneratorRuntime.awrap(dungluongsku.save());

        case 17:
          res.json(dungluongsku);
          _context15.next = 24;
          break;

        case 20:
          _context15.prev = 20;
          _context15.t0 = _context15["catch"](0);
          console.error(_context15.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 24:
        case "end":
          return _context15.stop();
      }
    }
  }, null, null, [[0, 20]]);
});
router.get('/getchitietdl/:iddlsku', function _callee16(req, res) {
  var iddlsku, dungluongsku;
  return regeneratorRuntime.async(function _callee16$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          _context16.prev = 0;
          iddlsku = req.params.iddlsku;
          _context16.next = 4;
          return regeneratorRuntime.awrap(DungLuongSku.findById(iddlsku));

        case 4:
          dungluongsku = _context16.sent;
          res.json(dungluongsku);
          _context16.next = 12;
          break;

        case 8:
          _context16.prev = 8;
          _context16.t0 = _context16["catch"](0);
          console.error(_context16.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 12:
        case "end":
          return _context16.stop();
      }
    }
  }, null, null, [[0, 8]]);
});
module.exports = router;
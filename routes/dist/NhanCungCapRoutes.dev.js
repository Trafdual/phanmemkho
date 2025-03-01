"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var router = require('express').Router();

var mongoose = require('mongoose');

var Depot = require('../models/DepotModel');

var NhanCungCap = require('../models/NhanCungCapModel');

router.post('/postnhacungcap/:depotId', function _callee(req, res) {
  var depotId, _req$body, name, email, phone, address, nhaCungCap, mancc, depot;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          depotId = req.params.depotId;
          _req$body = req.body, name = _req$body.name, email = _req$body.email, phone = _req$body.phone, address = _req$body.address;
          nhaCungCap = new NhanCungCap({
            name: name,
            phone: phone
          });

          if (email) {
            nhaCungCap.email = email;
          }

          if (address) {
            nhaCungCap.address = address;
          }

          mancc = 'NCC' + nhaCungCap._id.toString().slice(-4);
          nhaCungCap.mancc = mancc;
          nhaCungCap.depotId = depotId;
          _context.next = 11;
          return regeneratorRuntime.awrap(Depot.findById(depotId));

        case 11:
          depot = _context.sent;
          depot.nhacungcap.push(nhaCungCap._id);
          _context.next = 15;
          return regeneratorRuntime.awrap(depot.save());

        case 15:
          _context.next = 17;
          return regeneratorRuntime.awrap(nhaCungCap.save());

        case 17:
          res.json(nhaCungCap);
          _context.next = 24;
          break;

        case 20:
          _context.prev = 20;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi'
          });

        case 24:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 20]]);
});
router.get('/getnhacungcap/:depotId', function _callee3(req, res) {
  var depotId, depot, nhacungcap;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          depotId = req.params.depotId;
          _context3.next = 4;
          return regeneratorRuntime.awrap(Depot.findById(depotId));

        case 4:
          depot = _context3.sent;
          _context3.next = 7;
          return regeneratorRuntime.awrap(Promise.all(depot.nhacungcap.map(function _callee2(nhacungcap) {
            var nhaCungCap;
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return regeneratorRuntime.awrap(NhanCungCap.findById(nhacungcap._id));

                  case 2:
                    nhaCungCap = _context2.sent;
                    return _context2.abrupt("return", {
                      _id: nhaCungCap._id,
                      mancc: nhaCungCap.mancc || '',
                      name: nhaCungCap.name,
                      email: nhaCungCap.email,
                      phone: nhaCungCap.phone,
                      address: nhaCungCap.address
                    });

                  case 4:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          })));

        case 7:
          nhacungcap = _context3.sent;
          res.json(nhacungcap);
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
router.get('/getncc/:depotId', function _callee5(req, res) {
  var depotId, depot, nhacungcap;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          depotId = req.params.depotId;
          _context5.next = 4;
          return regeneratorRuntime.awrap(Depot.findById(depotId));

        case 4:
          depot = _context5.sent;
          _context5.next = 7;
          return regeneratorRuntime.awrap(Promise.all(depot.nhacungcap.map(function _callee4(nhacungcap) {
            var nhaCungCap;
            return regeneratorRuntime.async(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.next = 2;
                    return regeneratorRuntime.awrap(NhanCungCap.findById(nhacungcap._id));

                  case 2:
                    nhaCungCap = _context4.sent;
                    return _context4.abrupt("return", {
                      mancc: nhaCungCap.mancc || ''
                    });

                  case 4:
                  case "end":
                    return _context4.stop();
                }
              }
            });
          })));

        case 7:
          nhacungcap = _context5.sent;
          res.json(nhacungcap);
          _context5.next = 15;
          break;

        case 11:
          _context5.prev = 11;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 15:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 11]]);
});
router.post('/editnhacungcap/:idncc', function _callee6(req, res) {
  var idncc, _req$body2, name, email, phone, address, nhaCungCap;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          idncc = req.params.idncc;
          _req$body2 = req.body, name = _req$body2.name, email = _req$body2.email, phone = _req$body2.phone, address = _req$body2.address;
          _context6.next = 5;
          return regeneratorRuntime.awrap(NhanCungCap.findById(idncc));

        case 5:
          nhaCungCap = _context6.sent;
          nhaCungCap.name = name;
          nhaCungCap.email = email;
          nhaCungCap.phone = phone;
          nhaCungCap.address = address;
          _context6.next = 12;
          return regeneratorRuntime.awrap(nhaCungCap.save());

        case 12:
          res.json(nhaCungCap);
          _context6.next = 19;
          break;

        case 15:
          _context6.prev = 15;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 19:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 15]]);
});
router.post('/deletencc', function _callee7(req, res) {
  var ids, nhacungcaps, depotMap, updateDepotPromises, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;

  return regeneratorRuntime.async(function _callee7$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          ids = req.body.ids;

          if (!(!Array.isArray(ids) || ids.length === 0)) {
            _context8.next = 4;
            break;
          }

          return _context8.abrupt("return", res.status(400).json({
            message: 'Danh sách id không hợp lệ.'
          }));

        case 4:
          _context8.next = 6;
          return regeneratorRuntime.awrap(NhanCungCap.find({
            _id: {
              $in: ids
            }
          }));

        case 6:
          nhacungcaps = _context8.sent;

          if (!(nhacungcaps.length === 0)) {
            _context8.next = 9;
            break;
          }

          return _context8.abrupt("return", res.status(404).json({
            message: 'Không tìm thấy nhà cung cấp nào.'
          }));

        case 9:
          depotMap = new Map();
          nhacungcaps.forEach(function (ncc) {
            if (ncc.depotId) {
              if (!depotMap.has(ncc.depotId)) {
                depotMap.set(ncc.depotId, []);
              }

              depotMap.get(ncc.depotId).push(ncc._id.toString());
            }
          });
          _context8.next = 13;
          return regeneratorRuntime.awrap(NhanCungCap.deleteMany({
            _id: {
              $in: ids
            }
          }));

        case 13:
          updateDepotPromises = [];
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context8.prev = 17;

          _loop = function _loop() {
            var _step$value, depotId, nccIds, depot;

            return regeneratorRuntime.async(function _loop$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    _step$value = _slicedToArray(_step.value, 2), depotId = _step$value[0], nccIds = _step$value[1];
                    _context7.next = 3;
                    return regeneratorRuntime.awrap(Depot.findById(depotId));

                  case 3:
                    depot = _context7.sent;

                    if (depot) {
                      depot.nhacungcap = depot.nhacungcap.filter(function (item) {
                        return !nccIds.includes(item._id.toString());
                      });
                      updateDepotPromises.push(depot.save());
                    }

                  case 5:
                  case "end":
                    return _context7.stop();
                }
              }
            });
          };

          _iterator = depotMap.entries()[Symbol.iterator]();

        case 20:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context8.next = 26;
            break;
          }

          _context8.next = 23;
          return regeneratorRuntime.awrap(_loop());

        case 23:
          _iteratorNormalCompletion = true;
          _context8.next = 20;
          break;

        case 26:
          _context8.next = 32;
          break;

        case 28:
          _context8.prev = 28;
          _context8.t0 = _context8["catch"](17);
          _didIteratorError = true;
          _iteratorError = _context8.t0;

        case 32:
          _context8.prev = 32;
          _context8.prev = 33;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 35:
          _context8.prev = 35;

          if (!_didIteratorError) {
            _context8.next = 38;
            break;
          }

          throw _iteratorError;

        case 38:
          return _context8.finish(35);

        case 39:
          return _context8.finish(32);

        case 40:
          _context8.next = 42;
          return regeneratorRuntime.awrap(Promise.all(updateDepotPromises));

        case 42:
          res.json({
            message: 'Xóa nhà cung cấp thành công'
          });
          _context8.next = 49;
          break;

        case 45:
          _context8.prev = 45;
          _context8.t1 = _context8["catch"](0);
          console.error('Lỗi khi xóa nhà cung cấp:', _context8.t1);
          res.status(500).json({
            message: 'Đã xảy ra lỗi khi xóa nhà cung cấp.'
          });

        case 49:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 45], [17, 28, 32, 40], [33,, 35, 39]]);
});
router.get('/getchitietncc/:idncc', function _callee8(req, res) {
  var idncc, nhacungcap;
  return regeneratorRuntime.async(function _callee8$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          idncc = req.params.idncc;
          _context9.next = 4;
          return regeneratorRuntime.awrap(NhanCungCap.findById(idncc));

        case 4:
          nhacungcap = _context9.sent;
          res.json(nhacungcap);
          _context9.next = 12;
          break;

        case 8:
          _context9.prev = 8;
          _context9.t0 = _context9["catch"](0);
          console.error(_context9.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 12:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 8]]);
});
router.post('/dropDatabase', function _callee9(req, res) {
  return regeneratorRuntime.async(function _callee9$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          _context10.next = 3;
          return regeneratorRuntime.awrap(mongoose.connection.dropDatabase());

        case 3:
          res.json({
            message: 'Đã xóa toàn bộ cơ sở dữ liệu thành công!'
          });
          _context10.next = 10;
          break;

        case 6:
          _context10.prev = 6;
          _context10.t0 = _context10["catch"](0);
          console.error('Lỗi khi xóa database:', _context10.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi khi xóa database.'
          });

        case 10:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 6]]);
});
module.exports = router;
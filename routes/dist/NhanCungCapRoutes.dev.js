"use strict";

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
  var depotId, depot, nhacungcap, filtered;
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
                    return regeneratorRuntime.awrap(NhanCungCap.findOne({
                      _id: nhacungcap._id,
                      $or: [{
                        status: 1
                      }, {
                        status: {
                          $exists: false
                        }
                      }]
                    }));

                  case 2:
                    nhaCungCap = _context2.sent;

                    if (nhaCungCap) {
                      _context2.next = 5;
                      break;
                    }

                    return _context2.abrupt("return", null);

                  case 5:
                    return _context2.abrupt("return", {
                      _id: nhaCungCap._id,
                      mancc: nhaCungCap.mancc || '',
                      name: nhaCungCap.name,
                      email: nhaCungCap.email,
                      phone: nhaCungCap.phone,
                      address: nhaCungCap.address
                    });

                  case 6:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          })));

        case 7:
          nhacungcap = _context3.sent;
          filtered = nhacungcap.filter(function (item) {
            return item !== null;
          });
          res.json(filtered);
          _context3.next = 16;
          break;

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 12]]);
});
router.post('/editnhacungcap/:idncc', function _callee4(req, res) {
  var idncc, _req$body2, name, email, phone, address, nhaCungCap;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          idncc = req.params.idncc;
          _req$body2 = req.body, name = _req$body2.name, email = _req$body2.email, phone = _req$body2.phone, address = _req$body2.address;
          _context4.next = 5;
          return regeneratorRuntime.awrap(NhanCungCap.findById(idncc));

        case 5:
          nhaCungCap = _context4.sent;
          nhaCungCap.name = name;
          nhaCungCap.email = email;
          nhaCungCap.phone = phone;
          nhaCungCap.address = address;
          _context4.next = 12;
          return regeneratorRuntime.awrap(nhaCungCap.save());

        case 12:
          res.json(nhaCungCap);
          _context4.next = 19;
          break;

        case 15:
          _context4.prev = 15;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 19:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 15]]);
});
router.post('/deleteanncc', function _callee5(req, res) {
  var ids, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, id, nhacungcap;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          ids = req.body.ids;
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context5.prev = 5;
          _iterator = ids[Symbol.iterator]();

        case 7:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context5.next = 18;
            break;
          }

          id = _step.value;
          _context5.next = 11;
          return regeneratorRuntime.awrap(NhanCungCap.findById(id));

        case 11:
          nhacungcap = _context5.sent;
          nhacungcap.status = -1;
          _context5.next = 15;
          return regeneratorRuntime.awrap(nhacungcap.save());

        case 15:
          _iteratorNormalCompletion = true;
          _context5.next = 7;
          break;

        case 18:
          _context5.next = 24;
          break;

        case 20:
          _context5.prev = 20;
          _context5.t0 = _context5["catch"](5);
          _didIteratorError = true;
          _iteratorError = _context5.t0;

        case 24:
          _context5.prev = 24;
          _context5.prev = 25;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 27:
          _context5.prev = 27;

          if (!_didIteratorError) {
            _context5.next = 30;
            break;
          }

          throw _iteratorError;

        case 30:
          return _context5.finish(27);

        case 31:
          return _context5.finish(24);

        case 32:
          res.json({
            message: 'xóa thành công'
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
router.get('/getchitietncc/:idncc', function _callee6(req, res) {
  var idncc, nhacungcap;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          idncc = req.params.idncc;
          _context6.next = 4;
          return regeneratorRuntime.awrap(NhanCungCap.findById(idncc));

        case 4:
          nhacungcap = _context6.sent;
          res.json(nhacungcap);
          _context6.next = 12;
          break;

        case 8:
          _context6.prev = 8;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 12:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 8]]);
});
router.post('/dropDatabase', function _callee7(req, res) {
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(mongoose.connection.dropDatabase());

        case 3:
          res.json({
            message: 'Đã xóa toàn bộ cơ sở dữ liệu thành công!'
          });
          _context7.next = 10;
          break;

        case 6:
          _context7.prev = 6;
          _context7.t0 = _context7["catch"](0);
          console.error('Lỗi khi xóa database:', _context7.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi khi xóa database.'
          });

        case 10:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 6]]);
});
module.exports = router;
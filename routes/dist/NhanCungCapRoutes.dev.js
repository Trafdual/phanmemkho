"use strict";

var router = require('express').Router();

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
router.get('/getchitietncc/:idncc', function _callee7(req, res) {
  var idncc, nhacungcap;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          idncc = req.params.idncc;
          _context7.next = 4;
          return regeneratorRuntime.awrap(NhanCungCap.findById(idncc));

        case 4:
          nhacungcap = _context7.sent;
          res.json(nhacungcap);
          _context7.next = 12;
          break;

        case 8:
          _context7.prev = 8;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 12:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 8]]);
});
module.exports = router;
"use strict";

var router = require('express').Router();

var User = require('../models/UserModel');

var Depot = require('../models/DepotModel');

var NhanVien = require('../models/NhanVienModel');

var multer = require('multer');

var storage = multer.memoryStorage();
var upload = multer({
  storage: storage
});
router.post('/postdepot/:iduser', function _callee(req, res) {
  var iduser, _req$body, name, address, user, depot, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, nhanvien, nv, usernv;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          iduser = req.params.iduser;
          _req$body = req.body, name = _req$body.name, address = _req$body.address;
          _context.next = 5;
          return regeneratorRuntime.awrap(User.findById(iduser));

        case 5:
          user = _context.sent;
          depot = new Depot({
            name: name,
            address: address
          });
          _context.next = 9;
          return regeneratorRuntime.awrap(depot.save());

        case 9:
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 12;
          _iterator = user.nhanvien[Symbol.iterator]();

        case 14:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 32;
            break;
          }

          nhanvien = _step.value;
          _context.next = 18;
          return regeneratorRuntime.awrap(NhanVien.findById(nhanvien._id));

        case 18:
          nv = _context.sent;

          if (nv) {
            _context.next = 21;
            break;
          }

          return _context.abrupt("continue", 29);

        case 21:
          _context.next = 23;
          return regeneratorRuntime.awrap(User.findById(nv.user));

        case 23:
          usernv = _context.sent;

          if (usernv) {
            _context.next = 26;
            break;
          }

          return _context.abrupt("continue", 29);

        case 26:
          usernv.depot.push(depot._id);
          _context.next = 29;
          return regeneratorRuntime.awrap(usernv.save());

        case 29:
          _iteratorNormalCompletion = true;
          _context.next = 14;
          break;

        case 32:
          _context.next = 38;
          break;

        case 34:
          _context.prev = 34;
          _context.t0 = _context["catch"](12);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 38:
          _context.prev = 38;
          _context.prev = 39;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 41:
          _context.prev = 41;

          if (!_didIteratorError) {
            _context.next = 44;
            break;
          }

          throw _iteratorError;

        case 44:
          return _context.finish(41);

        case 45:
          return _context.finish(38);

        case 46:
          user.depot.push(depot._id);
          depot.user.push(user._id);
          _context.next = 50;
          return regeneratorRuntime.awrap(Promise.all([user.save(), depot.save()]));

        case 50:
          res.json(depot);
          _context.next = 57;
          break;

        case 53:
          _context.prev = 53;
          _context.t1 = _context["catch"](0);
          console.error(_context.t1);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 57:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 53], [12, 34, 38, 46], [39,, 41, 45]]);
});
router.get('/getdepot/:iduser', function _callee3(req, res) {
  var iduser, user, depot;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          iduser = req.params.iduser;
          _context3.next = 4;
          return regeneratorRuntime.awrap(User.findById(iduser));

        case 4:
          user = _context3.sent;
          _context3.next = 7;
          return regeneratorRuntime.awrap(Promise.all(user.depot.map(function _callee2(depot) {
            var dep;
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return regeneratorRuntime.awrap(Depot.findById(depot));

                  case 2:
                    dep = _context2.sent;
                    return _context2.abrupt("return", {
                      _id: dep._id,
                      name: dep.name,
                      address: dep.address
                    });

                  case 4:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          })));

        case 7:
          depot = _context3.sent;
          res.json(depot);
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
router.get('/admin', function _callee4(req, res) {
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          try {
            res.render('admin');
          } catch (error) {
            console.error(error);
            res.status(500).json({
              message: 'Đã xảy ra lỗi.'
            });
          }

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  });
});
module.exports = router;
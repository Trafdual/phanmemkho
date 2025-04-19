"use strict";

var router = require('express').Router();

var User = require('../models/UserModel');

var MucThuChi = require('../models/MucThuChiModel');

var NhanVien = require('../models/NhanVienModel');

router.post('/postmucthuchi/:userid', function _callee(req, res) {
  var userid, _req$body, name, loaimuc, user, mucthuchi, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, nhanvien, nv, usernv;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          userid = req.params.userid;
          _req$body = req.body, name = _req$body.name, loaimuc = _req$body.loaimuc;
          _context.next = 5;
          return regeneratorRuntime.awrap(User.findById(userid));

        case 5:
          user = _context.sent;
          mucthuchi = new MucThuChi({
            name: name,
            loaimuc: loaimuc
          });
          mucthuchi.mamuc = 'MTC' + mucthuchi._id.toString().slice(-5);
          mucthuchi.user = user._id;
          _context.next = 11;
          return regeneratorRuntime.awrap(mucthuchi.save());

        case 11:
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 14;
          _iterator = user.nhanvien[Symbol.iterator]();

        case 16:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 34;
            break;
          }

          nhanvien = _step.value;
          _context.next = 20;
          return regeneratorRuntime.awrap(NhanVien.findById(nhanvien._id));

        case 20:
          nv = _context.sent;

          if (nv) {
            _context.next = 23;
            break;
          }

          return _context.abrupt("continue", 31);

        case 23:
          _context.next = 25;
          return regeneratorRuntime.awrap(User.findById(nv.user));

        case 25:
          usernv = _context.sent;

          if (usernv) {
            _context.next = 28;
            break;
          }

          return _context.abrupt("continue", 31);

        case 28:
          usernv.mucthuchi.push(mucthuchi._id);
          _context.next = 31;
          return regeneratorRuntime.awrap(usernv.save());

        case 31:
          _iteratorNormalCompletion = true;
          _context.next = 16;
          break;

        case 34:
          _context.next = 40;
          break;

        case 36:
          _context.prev = 36;
          _context.t0 = _context["catch"](14);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 40:
          _context.prev = 40;
          _context.prev = 41;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 43:
          _context.prev = 43;

          if (!_didIteratorError) {
            _context.next = 46;
            break;
          }

          throw _iteratorError;

        case 46:
          return _context.finish(43);

        case 47:
          return _context.finish(40);

        case 48:
          user.mucthuchi.push(mucthuchi._id);
          _context.next = 51;
          return regeneratorRuntime.awrap(user.save());

        case 51:
          res.json(mucthuchi);
          _context.next = 58;
          break;

        case 54:
          _context.prev = 54;
          _context.t1 = _context["catch"](0);
          console.error(_context.t1);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 58:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 54], [14, 36, 40, 48], [41,, 43, 47]]);
});
router.get('/getmucthuchi/:userId', function _callee3(req, res) {
  var userid, user, mucthuchi, filtered;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          userid = req.params.userId;
          _context3.next = 4;
          return regeneratorRuntime.awrap(User.findById(userid));

        case 4:
          user = _context3.sent;
          _context3.next = 7;
          return regeneratorRuntime.awrap(Promise.all(user.mucthuchi.map(function _callee2(muc) {
            var mtc;
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return regeneratorRuntime.awrap(MucThuChi.findOne({
                      _id: muc._id,
                      $or: [{
                        status: 1
                      }, {
                        status: {
                          $exists: false
                        }
                      }]
                    }));

                  case 2:
                    mtc = _context2.sent;

                    if (mtc) {
                      _context2.next = 5;
                      break;
                    }

                    return _context2.abrupt("return", null);

                  case 5:
                    return _context2.abrupt("return", {
                      _id: mtc._id,
                      mamuc: mtc.mamuc,
                      name: mtc.name,
                      loaimuc: mtc.loaimuc
                    });

                  case 6:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          })));

        case 7:
          mucthuchi = _context3.sent;
          filtered = mucthuchi.filter(function (item) {
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
router.post('/deletemucthuchi', function _callee4(req, res) {
  var ids, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, id, mucthuchi;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          ids = req.body.ids;
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context4.prev = 5;
          _iterator2 = ids[Symbol.iterator]();

        case 7:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context4.next = 18;
            break;
          }

          id = _step2.value;
          _context4.next = 11;
          return regeneratorRuntime.awrap(MucThuChi.findById(id));

        case 11:
          mucthuchi = _context4.sent;
          mucthuchi.status = -1;
          _context4.next = 15;
          return regeneratorRuntime.awrap(mucthuchi.save());

        case 15:
          _iteratorNormalCompletion2 = true;
          _context4.next = 7;
          break;

        case 18:
          _context4.next = 24;
          break;

        case 20:
          _context4.prev = 20;
          _context4.t0 = _context4["catch"](5);
          _didIteratorError2 = true;
          _iteratorError2 = _context4.t0;

        case 24:
          _context4.prev = 24;
          _context4.prev = 25;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 27:
          _context4.prev = 27;

          if (!_didIteratorError2) {
            _context4.next = 30;
            break;
          }

          throw _iteratorError2;

        case 30:
          return _context4.finish(27);

        case 31:
          return _context4.finish(24);

        case 32:
          res.json({
            message: 'xóa thành công'
          });
          _context4.next = 39;
          break;

        case 35:
          _context4.prev = 35;
          _context4.t1 = _context4["catch"](0);
          console.error(_context4.t1);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 39:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 35], [5, 20, 24, 32], [25,, 27, 31]]);
});
module.exports = router;
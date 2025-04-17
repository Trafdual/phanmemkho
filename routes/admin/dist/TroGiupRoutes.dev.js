"use strict";

var router = require('express').Router();

var TroGiup = require('../../models/TroGiupModel');

var uploads = require('../uploads');

router.post('/upload', uploads.single('image'), function (req, res) {
  if (!req.file) {
    return res.status(400).json({
      error: 'No file uploaded'
    });
  }

  var fileUrl = "".concat(req.file.filename);
  res.json({
    url: fileUrl
  });
});
router.get('/getalltrogiup', function _callee2(req, res) {
  var trogiup, trogiupjson;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(TroGiup.find().lean());

        case 3:
          trogiup = _context2.sent;
          _context2.next = 6;
          return regeneratorRuntime.awrap(Promise.all(trogiup.map(function _callee(tg) {
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    return _context.abrupt("return", {
                      _id: tg._id,
                      tieude: tg.tieude,
                      image: tg.image || ''
                    });

                  case 1:
                  case "end":
                    return _context.stop();
                }
              }
            });
          })));

        case 6:
          trogiupjson = _context2.sent;
          res.json(trogiupjson);
          _context2.next = 14;
          break;

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
router.post('/posttrogiup', uploads.fields([{
  name: 'image',
  maxCount: 1
}]), function _callee3(req, res) {
  var _req$body, tieude, noidung, image, trogiup;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$body = req.body, tieude = _req$body.tieude, noidung = _req$body.noidung;
          image = req.files['image'] ? "".concat(req.files['image'][0].filename) : null;
          trogiup = new TroGiup({
            tieude: tieude,
            noidung: noidung,
            image: image
          });
          _context3.next = 6;
          return regeneratorRuntime.awrap(trogiup.save());

        case 6:
          res.render('trogiup');
          _context3.next = 13;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
});
router.get('/gettrogiup/:id', function _callee4(req, res) {
  var id, trogiup;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          id = req.params.id;
          _context4.next = 4;
          return regeneratorRuntime.awrap(TroGiup.findById(id));

        case 4:
          trogiup = _context4.sent;
          res.json(trogiup);
          _context4.next = 12;
          break;

        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 8]]);
});
router.post('/deletetrogiup', function _callee5(req, res) {
  var ids;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          ids = req.body.ids;
          _context5.next = 4;
          return regeneratorRuntime.awrap(TroGiup.deleteMany({
            _id: {
              $in: ids
            }
          }));

        case 4:
          res.json({
            message: 'Xóa thành công'
          });
          _context5.next = 11;
          break;

        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 11:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
module.exports = router;
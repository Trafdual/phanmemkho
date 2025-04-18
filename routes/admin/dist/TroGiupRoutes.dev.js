"use strict";

var router = require('express').Router();

var TroGiup = require('../../models/TroGiupModel');

var TheLoaiTroGiup = require('../../models/TheLoaiTroGiupModel');

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
router.post('/posttrogiup/:idtheloaitrogiup', uploads.fields([{
  name: 'image',
  maxCount: 1
}]), function _callee3(req, res) {
  var idtheloaitrogiup, theloaitrogiup, _req$body, tieude, noidung, image, trogiup;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          idtheloaitrogiup = req.params.idtheloaitrogiup;
          _context3.next = 4;
          return regeneratorRuntime.awrap(TheLoaiTroGiup.findById(idtheloaitrogiup));

        case 4:
          theloaitrogiup = _context3.sent;
          _req$body = req.body, tieude = _req$body.tieude, noidung = _req$body.noidung;
          image = req.files['image'] ? "".concat(req.files['image'][0].filename) : null;
          trogiup = new TroGiup({
            tieude: tieude,
            noidung: noidung,
            image: image,
            theloaitrogiup: theloaitrogiup._id
          });
          theloaitrogiup.trogiup.push(trogiup._id);
          _context3.next = 11;
          return regeneratorRuntime.awrap(trogiup.save());

        case 11:
          _context3.next = 13;
          return regeneratorRuntime.awrap(theloaitrogiup.save());

        case 13:
          res.json({
            message: 'thêm thành công'
          });
          _context3.next = 20;
          break;

        case 16:
          _context3.prev = 16;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 20:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 16]]);
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
router.post('/deletetrogiup/:idtheloai', function _callee5(req, res) {
  var ids, idtheloai, theloai;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          ids = req.body.ids;
          idtheloai = req.params.idtheloai;
          _context5.next = 5;
          return regeneratorRuntime.awrap(TheLoaiTroGiup.findById(idtheloai));

        case 5:
          theloai = _context5.sent;
          theloai.trogiup = theloai.trogiup.filter(function (tg) {
            return !ids.includes(tg._id.toString());
          });
          _context5.next = 9;
          return regeneratorRuntime.awrap(theloai.save());

        case 9:
          _context5.next = 11;
          return regeneratorRuntime.awrap(TroGiup.deleteMany({
            _id: {
              $in: ids
            }
          }));

        case 11:
          res.json({
            message: 'Xóa thành công'
          });
          _context5.next = 18;
          break;

        case 14:
          _context5.prev = 14;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 18:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 14]]);
});
router.post('/updatetrogiup/:idtrogiup', uploads.fields([{
  name: 'image',
  maxCount: 1
}]), function _callee6(req, res) {
  var idtrogiup, _req$body2, tieude, noidung, image, trogiup;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          idtrogiup = req.params.idtrogiup;
          _req$body2 = req.body, tieude = _req$body2.tieude, noidung = _req$body2.noidung;
          image = req.files['image'] ? "".concat(req.files['image'][0].filename) : null;
          _context6.next = 6;
          return regeneratorRuntime.awrap(TroGiup.findById(idtrogiup));

        case 6:
          trogiup = _context6.sent;

          if (image) {
            trogiup.image = image;
          }

          if (tieude) {
            trogiup.tieude = tieude;
          }

          if (noidung) {
            trogiup.noidung = noidung;
          }

          _context6.next = 12;
          return regeneratorRuntime.awrap(trogiup.save());

        case 12:
          res.json(trogiup);
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
router.post('/updatetl/:idtg', function _callee7(req, res) {
  var idtg, idtheloaitrogiup, trogiup, theloaitg, theloaitgsua;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          idtg = req.params.idtg;
          idtheloaitrogiup = req.body.idtheloaitrogiup;
          _context7.next = 5;
          return regeneratorRuntime.awrap(TroGiup.findById(idtg));

        case 5:
          trogiup = _context7.sent;
          _context7.next = 8;
          return regeneratorRuntime.awrap(TheLoaiTroGiup.findById(trogiup.theloaitrogiup));

        case 8:
          theloaitg = _context7.sent;

          if (theloaitg) {
            _context7.next = 11;
            break;
          }

          return _context7.abrupt("return", res.json({
            error: 'Thể loại không tồn tại'
          }));

        case 11:
          _context7.next = 13;
          return regeneratorRuntime.awrap(TheLoaiTroGiup.findById(idtheloaitrogiup));

        case 13:
          theloaitgsua = _context7.sent;

          if (theloaitgsua) {
            _context7.next = 16;
            break;
          }

          return _context7.abrupt("return", res.json({
            error: 'Thể loại sửa không tồn tại'
          }));

        case 16:
          theloaitg.trogiup = theloaitg.trogiup.filter(function (tg) {
            return tg._id.toString() !== trogiup._id.toString();
          });
          _context7.next = 19;
          return regeneratorRuntime.awrap(theloaitg.save());

        case 19:
          theloaitgsua.trogiup.push(trogiup._id);
          _context7.next = 22;
          return regeneratorRuntime.awrap(theloaitgsua.save());

        case 22:
          res.json({
            message: 'update thành công'
          });
          _context7.next = 29;
          break;

        case 25:
          _context7.prev = 25;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 29:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 25]]);
});
router.get('/gettrogiuptl/:idtheloaitrogiup', function _callee9(req, res) {
  var idtheloaitrogiup, page, limit, theloaitrogiup, totalItems, totalPages, startIndex, endIndex, trogiupIds, trogiupjson;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          idtheloaitrogiup = req.params.idtheloaitrogiup;
          page = parseInt(req.query.page) || 1;
          limit = parseInt(req.query.limit) || 10;
          _context9.next = 6;
          return regeneratorRuntime.awrap(TheLoaiTroGiup.findById(idtheloaitrogiup));

        case 6:
          theloaitrogiup = _context9.sent;

          if (theloaitrogiup) {
            _context9.next = 9;
            break;
          }

          return _context9.abrupt("return", res.status(404).json({
            message: 'Không tìm thấy thể loại trợ giúp'
          }));

        case 9:
          totalItems = theloaitrogiup.trogiup.length;
          totalPages = Math.ceil(totalItems / limit);
          startIndex = (page - 1) * limit;
          endIndex = startIndex + limit;
          trogiupIds = theloaitrogiup.trogiup.slice(startIndex, endIndex);
          _context9.next = 16;
          return regeneratorRuntime.awrap(Promise.all(trogiupIds.map(function _callee8(tg) {
            var trogiup;
            return regeneratorRuntime.async(function _callee8$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    _context8.next = 2;
                    return regeneratorRuntime.awrap(TroGiup.findById(tg._id));

                  case 2:
                    trogiup = _context8.sent;
                    return _context8.abrupt("return", {
                      _id: trogiup._id,
                      tieude: trogiup.tieude,
                      image: trogiup.image
                    });

                  case 4:
                  case "end":
                    return _context8.stop();
                }
              }
            });
          })));

        case 16:
          trogiupjson = _context9.sent;
          res.json({
            page: page,
            totalPages: totalPages,
            total: totalItems,
            data: trogiupjson
          });
          _context9.next = 24;
          break;

        case 20:
          _context9.prev = 20;
          _context9.t0 = _context9["catch"](0);
          console.error(_context9.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 24:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 20]]);
});
module.exports = router;
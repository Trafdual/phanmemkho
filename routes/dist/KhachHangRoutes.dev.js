"use strict";

var router = require('express').Router();

var KhachHang = require('../models/KhachHangModel');

var Depot = require('../models/DepotModel');

var NhomKhachHang = require('../models/NhomKhacHangModel');

var moment = require('moment');

router.get('/khachhang', function _callee(req, res) {
  var khachhang;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(KhachHang.find().lean());

        case 3:
          khachhang = _context.sent;
          res.render('khachhang', {
            khachhang: khachhang
          });
          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
router.get('/getkhachhang/:khoID', function _callee3(req, res) {
  var depotId, depot, khachhang;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          depotId = req.params.khoID;
          _context3.next = 4;
          return regeneratorRuntime.awrap(Depot.findById(depotId));

        case 4:
          depot = _context3.sent;
          khachhang = [];
          _context3.next = 8;
          return regeneratorRuntime.awrap(Promise.all(depot.khachang.map(function _callee2(kh) {
            var khach;
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return regeneratorRuntime.awrap(KhachHang.findById(kh._id));

                  case 2:
                    khach = _context2.sent;

                    if (khach.isActivity === true) {
                      khachhang.push({
                        _id: khach._id,
                        makh: khach.makh,
                        name: khach.name,
                        phone: khach.phone,
                        email: khach.email,
                        cancuoc: khach.cancuoc,
                        address: khach.address,
                        date: moment(khach.date).format('DD/MM/YYYY')
                      });
                    }

                  case 4:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          })));

        case 8:
          res.json(khachhang);
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
router.post('/postkhachhang', function _callee4(req, res) {
  var depotId, depot, formattedDate, _req$body, name, phone, email, cancuoc, address, date, nhomkhachhang, khachhang, makh;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          depotId = req.session.depotId;
          _context4.next = 4;
          return regeneratorRuntime.awrap(Depot.findById(depotId));

        case 4:
          depot = _context4.sent;
          formattedDate = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');
          _req$body = req.body, name = _req$body.name, phone = _req$body.phone, email = _req$body.email, cancuoc = _req$body.cancuoc, address = _req$body.address, date = _req$body.date, nhomkhachhang = _req$body.nhomkhachhang;
          khachhang = new KhachHang({
            name: name,
            phone: phone,
            email: email,
            cancuoc: cancuoc,
            address: address,
            date: formattedDate
          });

          if (nhomkhachhang) {
            khachhang.nhomkhachhang = nhomkhachhang;
          }

          makh = 'KH' + khachhang._id.toString().slice(-5);
          khachhang.makh = makh;
          depot.khachang.push(khachhang._id);
          khachhang.depotId = depot._id;
          _context4.next = 15;
          return regeneratorRuntime.awrap(khachhang.save());

        case 15:
          _context4.next = 17;
          return regeneratorRuntime.awrap(depot.save());

        case 17:
          res.json(khachhang);
          _context4.next = 24;
          break;

        case 20:
          _context4.prev = 20;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 24:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 20]]);
});
router.post('/postkhachhang/:depotId', function _callee5(req, res) {
  var depotId, depot, _req$body2, name, phone, email, cancuoc, address, date, nhomkhachhang, formattedDate, khachhang, makh;

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
          _req$body2 = req.body, name = _req$body2.name, phone = _req$body2.phone, email = _req$body2.email, cancuoc = _req$body2.cancuoc, address = _req$body2.address, date = _req$body2.date, nhomkhachhang = _req$body2.nhomkhachhang;
          formattedDate = moment(date).format('YYYY-MM-DD');
          console.log(formattedDate);
          khachhang = new KhachHang({
            name: name,
            phone: phone,
            email: email,
            cancuoc: cancuoc,
            address: address,
            date: formattedDate
          });

          if (nhomkhachhang) {
            khachhang.nhomkhachhang = nhomkhachhang;
          }

          makh = 'KH' + khachhang._id.toString().slice(-5);
          khachhang.makh = makh;
          depot.khachang.push(khachhang._id);
          khachhang.depotId = depot._id;
          _context5.next = 16;
          return regeneratorRuntime.awrap(khachhang.save());

        case 16:
          _context5.next = 18;
          return regeneratorRuntime.awrap(depot.save());

        case 18:
          res.json(khachhang);
          _context5.next = 25;
          break;

        case 21:
          _context5.prev = 21;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 25:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 21]]);
});
router.post('/putkhachhang/:idkhachhang', function _callee6(req, res) {
  var idkhachhang, _req$body3, name, phone, email, cancuoc, address, date, khachhang;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          idkhachhang = req.params.idkhachhang;
          _req$body3 = req.body, name = _req$body3.name, phone = _req$body3.phone, email = _req$body3.email, cancuoc = _req$body3.cancuoc, address = _req$body3.address, date = _req$body3.date;
          _context6.next = 5;
          return regeneratorRuntime.awrap(KhachHang.findById(idkhachhang));

        case 5:
          khachhang = _context6.sent;
          khachhang.name = name;
          khachhang.phone = phone;
          khachhang.email = email;
          khachhang.cancuoc = cancuoc;
          khachhang.address = address;
          khachhang.date = date;
          _context6.next = 14;
          return regeneratorRuntime.awrap(khachhang.save());

        case 14:
          res.json(khachhang);
          _context6.next = 21;
          break;

        case 17:
          _context6.prev = 17;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 21:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 17]]);
});
router.post('/ngunghdkhachhang/:idkhachhang', function _callee7(req, res) {
  var idkhachhang, khachhang;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          idkhachhang = req.params.idkhachhang;
          _context7.next = 4;
          return regeneratorRuntime.awrap(KhachHang.findById(idkhachhang));

        case 4:
          khachhang = _context7.sent;
          khachhang.isActivity = false;
          _context7.next = 8;
          return regeneratorRuntime.awrap(khachhang.save());

        case 8:
          res.json(khachhang);
          _context7.next = 15;
          break;

        case 11:
          _context7.prev = 11;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 15:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 11]]);
});
module.exports = router;
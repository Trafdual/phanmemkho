"use strict";

var User = require('../models/UserModel');

var checkKhoaDuLieu = function checkKhoaDuLieu(req, res, next) {
  var users, user;
  return regeneratorRuntime.async(function checkKhoaDuLieu$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          users = req.session;
          console.log(users);

          if (users) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", res.json([]));

        case 5:
          _context.next = 7;
          return regeneratorRuntime.awrap(User.findById(userId));

        case 7:
          user = _context.sent;

          if (user) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            message: 'User not found'
          }));

        case 10:
          if (!user.khoadulieu) {
            _context.next = 12;
            break;
          }

          return _context.abrupt("return", res.json([]));

        case 12:
          next();
          _context.next = 19;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          res.status(500).json({
            message: 'Server error'
          });

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

module.exports = {
  checkKhoaDuLieu: checkKhoaDuLieu
};
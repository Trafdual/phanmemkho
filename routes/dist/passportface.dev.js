"use strict";

var passport = require('passport');

var FacebookStrategy = require('passport-facebook').Strategy;

var bcrypt = require('bcryptjs');

var moment = require('moment-timezone');

var User = require('../models/UserModel'); // Model User của bạn


passport.use(new FacebookStrategy({
  clientID: '1227133001630218',
  clientSecret: '32804f589e55e3fed4fd48d9f5e633c0',
  callbackURL: 'https://ansuataohanoi.com/auth/facebook/callback',
  profileFields: ['id', 'emails', 'name']
}, function _callee(accessToken, refreshToken, profile, done) {
  var _profile$_json, email, first_name, last_name, user;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _profile$_json = profile._json, email = _profile$_json.email, first_name = _profile$_json.first_name, last_name = _profile$_json.last_name;
          _context.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 4:
          user = _context.sent;

          if (user) {
            _context.next = 9;
            break;
          }

          user = new User({
            name: "".concat(first_name, " ").concat(last_name),
            email: email,
            role: 'manager',
            // Vai trò mặc định là user
            phone: '',
            // Bạn có thể yêu cầu người dùng nhập số điện thoại sau
            date: moment().tz('Asia/Ho_Chi_Minh').toDate(),
            isVerified: true // Mặc định là true vì đã xác thực qua Facebook

          });
          _context.next = 9;
          return regeneratorRuntime.awrap(user.save());

        case 9:
          done(null, user);
          _context.next = 15;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          done(_context.t0, false);

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 12]]);
}));
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function _callee2(id, done) {
  var user;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(User.findById(id));

        case 3:
          user = _context2.sent;
          done(null, user);
          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          done(_context2.t0, null);

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
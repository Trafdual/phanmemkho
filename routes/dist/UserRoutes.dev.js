"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var router = require('express').Router();

var User = require('../models/UserModel');

var Depot = require('../models/DepotModel');

var bcrypt = require('bcryptjs');

var multer = require('multer');

var jwt = require('jsonwebtoken');

var crypto = require('crypto');

var momenttimezone = require('moment-timezone');

var moment = require('moment');

var firebase = require('firebase-admin');

var nodemailer = require('nodemailer');

var passport = require('passport');

var axios = require('axios');

var NhanVien = require('../models/NhanVienModel');

var mongoose = require('mongoose');

function isJSON(str) {
  if (typeof str !== 'string') return false;

  try {
    var parsed = JSON.parse(str);
    return _typeof(parsed) === 'object' && parsed !== null;
  } catch (e) {
    return false;
  }
}

firebase.initializeApp({
  credential: firebase.credential.cert(require('../appgiapha-firebase-adminsdk-z9uh9-aa3fef5e78.json'))
});

var AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: 'AKIATBPL3NPE3ATWZEWR',
  secretAccessKey: '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',
  region: 'ap-southeast-1'
});
var sns = new AWS.SNS();
var storage = multer.memoryStorage();
var upload = multer({
  storage: storage
});
var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

var checkAuth = function checkAuth(req, res, next) {
  if (!req.session.token) {
    return res.json({
      message: 'hết hạn'
    });
  }

  try {
    var decoded = jwt.verify(req.session.token, 'mysecretkey', {
      expiresIn: '1h'
    });
    req.userData = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      req.session.destroy();
      return res.json({
        message: 'lỗi'
      });
    } else {
      console.error(error);
      return res.status(500).json({
        message: 'Đã xảy ra lỗi.'
      });
    }
  }
};

function decrypt(encrypted) {
  var iv = Buffer.from(encrypted.iv, 'hex');
  var key = Buffer.from(encrypted.key, 'hex');
  var decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  var decrypted = decipher.update(encrypted.content, 'hex', 'utf8');
  decrypted += decipher["final"]('utf8');
  return decrypted;
}

router.get('/', function _callee(req, res) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          res.render('logintest');

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
});
router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));
router.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: '/'
}), function (req, res) {
  req.session.userId = req.user._id; // Lưu user ID vào session

  req.session.token = jwt.sign({
    userId: req.user._id,
    role: req.user.role
  }, 'mysecretkey', {
    expiresIn: '1h'
  });
  req.session.depotId = req.user.depot; // Lưu depot ID vào session (nếu có)

  if (req.user.phone) {
    res.redirect('/manager');
  } else {
    res.redirect('/taokho'); // Chuyển hướng đến trang yêu cầu nhập số điện thoại
  }
});
router.get('/auth/facebook', passport.authenticate('facebook', {
  scope: ['email']
}));
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
  failureRedirect: '/'
}), function (req, res) {
  req.session.userId = req.user._id; // Lưu user ID vào session

  req.session.token = jwt.sign({
    userId: req.user._id,
    role: req.user.role
  }, 'mysecretkey', {
    expiresIn: '1h'
  });
  req.session.depotId = req.user.depot; // Lưu depot ID vào session (nếu có)

  if (req.user.phone) {
    res.redirect('/manager');
  } else {
    res.redirect('/taokho'); // Chuyển hướng đến trang yêu cầu nhập số điện thoại
  }
});
router.post('/taokho', function _callee2(req, res) {
  var phone, _req$body, name, address, depot, token;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;

          if (!req.isAuthenticated()) {
            _context2.next = 21;
            break;
          }

          phone = req.body.phone;
          _req$body = req.body, name = _req$body.name, address = _req$body.address;

          if (/^\d{10}$/.test(phone)) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", res.status(400).send('Số điện thoại không hợp lệ'));

        case 6:
          depot = new Depot({
            name: name,
            address: address
          });
          req.user.phone = phone;
          req.user.depot = depot._id;
          depot.user.push(req.user._id);
          _context2.next = 12;
          return regeneratorRuntime.awrap(depot.save());

        case 12:
          _context2.next = 14;
          return regeneratorRuntime.awrap(req.user.save());

        case 14:
          token = jwt.sign({
            userId: req.user._id,
            role: req.user.role
          }, 'mysecretkey', {
            expiresIn: '1h'
          });
          req.session.userId = req.user._id;
          req.session.token = token;
          req.session.depotId = req.user.depot;
          res.redirect('/manager');
          _context2.next = 22;
          break;

        case 21:
          res.redirect('/test');

        case 22:
          _context2.next = 28;
          break;

        case 24:
          _context2.prev = 24;
          _context2.t0 = _context2["catch"](0);
          console.error('Error verifying OTP:', _context2.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 28:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 24]]);
});
router.post('/registeradmin', function _callee3(req, res) {
  var _req$body2, name, email, password, phone, role, vietnamTime, exitphone, existingemail, hashedPassword, user, responseData;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$body2 = req.body, name = _req$body2.name, email = _req$body2.email, password = _req$body2.password, phone = _req$body2.phone, role = _req$body2.role;
          vietnamTime = momenttimezone().toDate();

          if (!(!phone || !/^\d{10}$/.test(phone))) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", res.json({
            message: 'Số điện thoại không hợp lệ'
          }));

        case 5:
          if (emailRegex.test(email)) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.json({
            message: 'email không hợp lệ'
          }));

        case 7:
          _context3.next = 9;
          return regeneratorRuntime.awrap(User.findOne({
            phone: phone
          }));

        case 9:
          exitphone = _context3.sent;

          if (!exitphone) {
            _context3.next = 12;
            break;
          }

          return _context3.abrupt("return", res.json({
            message: 'số điện thoại này đã được đăng kí'
          }));

        case 12:
          _context3.next = 14;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 14:
          existingemail = _context3.sent;

          if (!existingemail) {
            _context3.next = 17;
            break;
          }

          return _context3.abrupt("return", res.json({
            message: 'email này đã được đăng kí'
          }));

        case 17:
          _context3.next = 19;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

        case 19:
          hashedPassword = _context3.sent;
          user = new User({
            name: name,
            email: email,
            password: hashedPassword,
            phone: phone,
            date: vietnamTime,
            isVerified: false,
            role: role
          });
          _context3.next = 23;
          return regeneratorRuntime.awrap(user.save());

        case 23:
          responseData = {
            success: user.success,
            data: {
              user: [{
                _id: user._id,
                name: user.name,
                email: user.email,
                password: user.password,
                role: user.role,
                phone: user.phone,
                date: moment(user.date).format('DD/MM/YYYY HH:mm:ss')
              }]
            },
            message: 'thành công'
          };
          res.json(responseData);
          _context3.next = 31;
          break;

        case 27:
          _context3.prev = 27;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 31:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 27]]);
});
router.post('/register', function _callee4(req, res) {
  var _req$body3, name, email, password, phone, birthday, vietnamTime, exitphone, existingemail, hashedPassword, user, responseData;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _req$body3 = req.body, name = _req$body3.name, email = _req$body3.email, password = _req$body3.password, phone = _req$body3.phone, birthday = _req$body3.birthday;
          vietnamTime = momenttimezone().toDate();

          if (/^\d{4}-\d{2}-\d{2}$/.test(birthday)) {
            _context4.next = 5;
            break;
          }

          return _context4.abrupt("return", res.json({
            message: 'Ngày sinh không hợp lệ'
          }));

        case 5:
          if (!(!phone || !/^\d{10}$/.test(phone))) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.json({
            message: 'Số điện thoại không hợp lệ'
          }));

        case 7:
          if (emailRegex.test(email)) {
            _context4.next = 9;
            break;
          }

          return _context4.abrupt("return", res.json({
            message: 'email không hợp lệ'
          }));

        case 9:
          _context4.next = 11;
          return regeneratorRuntime.awrap(User.findOne({
            phone: phone
          }));

        case 11:
          exitphone = _context4.sent;

          if (!exitphone) {
            _context4.next = 14;
            break;
          }

          return _context4.abrupt("return", res.json({
            message: 'số điện thoại này đã được đăng kí'
          }));

        case 14:
          _context4.next = 16;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 16:
          existingemail = _context4.sent;

          if (!existingemail) {
            _context4.next = 19;
            break;
          }

          return _context4.abrupt("return", res.json({
            message: 'email này đã được đăng kí'
          }));

        case 19:
          _context4.next = 21;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

        case 21:
          hashedPassword = _context4.sent;
          user = new User({
            name: name,
            email: email,
            password: hashedPassword,
            phone: phone,
            date: vietnamTime,
            isVerified: false,
            birthday: birthday,
            duyet: false
          });
          _context4.next = 25;
          return regeneratorRuntime.awrap(user.save());

        case 25:
          responseData = {
            success: user.success,
            data: {
              user: [{
                _id: user._id,
                name: user.name,
                email: user.email,
                password: user.password,
                role: user.role,
                phone: user.phone,
                date: moment(user.date).format('DD/MM/YYYY HH:mm:ss')
              }]
            },
            message: 'thành công'
          };
          _context4.next = 28;
          return regeneratorRuntime.awrap(axios.post("http://localhost:3015/sendemail/".concat(user._id)));

        case 28:
          res.json(responseData);
          _context4.next = 35;
          break;

        case 31:
          _context4.prev = 31;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 35:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 31]]);
});
router.post('/sendemail/:id', function _callee5(req, res) {
  var id, user, otpCreatedAt, otp, transporter, mailOptions;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          id = req.params.id;
          _context5.next = 4;
          return regeneratorRuntime.awrap(User.findById(id));

        case 4:
          user = _context5.sent;
          otpCreatedAt = new Date();
          otp = Math.floor(100000 + Math.random() * 900000).toString();

          if (user) {
            _context5.next = 9;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            message: 'Người dùng không tồn tại.'
          }));

        case 9:
          user.otp = otp;
          user.otpCreatedAt = otpCreatedAt;
          _context5.next = 13;
          return regeneratorRuntime.awrap(user.save());

        case 13:
          transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'trafdual0810@gmail.com',
              pass: 'pjrg xxdq cyfs zosf'
            }
          });
          mailOptions = {
            from: '"BaoTech" <trafdual0810@gmail.com>',
            to: user.email,
            subject: '🔐 Xác thực tài khoản – Mã OTP của bạn',
            html: "\n        <div style=\"background: #f5f8fa; padding: 40px 20px; font-family: 'Segoe UI', Roboto, sans-serif;\">\n          <div style=\"max-width: 600px; background: #fff; margin: auto; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;\">\n            <div style=\"background-color: #1a73e8; padding: 20px; text-align: center;\">\n              <img src=\"http://localhost:3015/LOGO.png\" alt=\"BaoTech Logo\" style=\"height: 50px;\" />\n              <h1 style=\"color: #ffffff; margin: 10px 0 0; font-size: 24px;\">M\xE3 x\xE1c th\u1EF1c OTP</h1>\n            </div>\n            <div style=\"padding: 30px;\">\n              <p style=\"font-size: 16px; color: #333;\">Xin ch\xE0o <strong>".concat(user.name, "</strong>,</p>\n              <p style=\"font-size: 16px; color: #333;\">C\u1EA3m \u01A1n b\u1EA1n \u0111\xE3 \u0111\u0103ng k\xFD t\xE0i kho\u1EA3n t\u1EA1i <strong>BaoTech</strong>.</p>\n              <p style=\"font-size: 16px; margin-bottom: 10px;\">D\u01B0\u1EDBi \u0111\xE2y l\xE0 m\xE3 OTP c\u1EE7a b\u1EA1n:</p>\n              <div style=\"font-size: 36px; font-weight: bold; color: #1a73e8; text-align: center; letter-spacing: 2px; margin: 20px 0;\">\n                ").concat(user.otp, "\n              </div>\n              <p style=\"font-size: 14px; color: #555;\">M\xE3 OTP c\xF3 hi\u1EC7u l\u1EF1c trong v\xF2ng <strong>5 ph\xFAt</strong>. Vui l\xF2ng kh\xF4ng chia s\u1EBB m\xE3 n\xE0y v\u1EDBi b\u1EA5t k\u1EF3 ai.</p>\n              <div style=\"text-align: center; margin: 30px 0;\">\n                <a href=\"#\" style=\"display: inline-block; background: #1a73e8; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 16px;\">X\xE1c minh ngay</a>\n              </div>\n              <p style=\"font-size: 12px; color: #aaa; text-align: center;\">N\u1EBFu b\u1EA1n kh\xF4ng th\u1EF1c hi\u1EC7n y\xEAu c\u1EA7u n\xE0y, vui l\xF2ng b\u1ECF qua email n\xE0y.</p>\n            </div>\n            <div style=\"background: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #888;\">\n              Email n\xE0y \u0111\u01B0\u1EE3c g\u1EEDi t\u1EEB h\u1EC7 th\u1ED1ng t\u1EF1 \u0111\u1ED9ng c\u1EE7a <strong>BaoTech</strong>. Vui l\xF2ng kh\xF4ng tr\u1EA3 l\u1EDDi.\n            </div>\n          </div>\n        </div>\n      ")
          };
          _context5.next = 17;
          return regeneratorRuntime.awrap(transporter.sendMail(mailOptions));

        case 17:
          res.json({
            message: 'gửi thành công'
          });
          _context5.next = 24;
          break;

        case 20:
          _context5.prev = 20;
          _context5.t0 = _context5["catch"](0);
          console.error('Error verifying OTP:', _context5.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi khi xác minh mã OTP.'
          });

        case 24:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 20]]);
});
router.post('/resendemail/:email', function _callee6(req, res) {
  var email, user, otpCreatedAt, otp, transporter, mailOptions;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          email = req.params.email;
          _context6.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 4:
          user = _context6.sent;
          otpCreatedAt = new Date();
          otp = Math.floor(100000 + Math.random() * 900000).toString();

          if (user) {
            _context6.next = 9;
            break;
          }

          return _context6.abrupt("return", res.status(400).json({
            message: 'Người dùng không tồn tại.'
          }));

        case 9:
          user.otp = otp;
          user.otpCreatedAt = otpCreatedAt;
          _context6.next = 13;
          return regeneratorRuntime.awrap(user.save());

        case 13:
          transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'trafdual0810@gmail.com',
              pass: 'pjrg xxdq cyfs zosf'
            }
          });
          mailOptions = {
            from: '"BaoTech" <trafdual0810@gmail.com>',
            to: user.email,
            subject: '🔐 Xác thực tài khoản – Mã OTP của bạn',
            html: "\n        <div style=\"background: #f5f8fa; padding: 40px 20px; font-family: 'Segoe UI', Roboto, sans-serif;\">\n          <div style=\"max-width: 600px; background: #fff; margin: auto; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;\">\n            <div style=\"background-color: #1a73e8; padding: 20px; text-align: center;\">\n              <img src=\"http://localhost:3015/LOGO.png\" alt=\"BaoTech Logo\" style=\"height: 50px;\" />\n              <h1 style=\"color: #ffffff; margin: 10px 0 0; font-size: 24px;\">M\xE3 x\xE1c th\u1EF1c OTP</h1>\n            </div>\n            <div style=\"padding: 30px;\">\n              <p style=\"font-size: 16px; color: #333;\">Xin ch\xE0o <strong>".concat(user.name, "</strong>,</p>\n              <p style=\"font-size: 16px; color: #333;\">C\u1EA3m \u01A1n b\u1EA1n \u0111\xE3 \u0111\u0103ng k\xFD t\xE0i kho\u1EA3n t\u1EA1i <strong>BaoTech</strong>.</p>\n              <p style=\"font-size: 16px; margin-bottom: 10px;\">D\u01B0\u1EDBi \u0111\xE2y l\xE0 m\xE3 OTP c\u1EE7a b\u1EA1n:</p>\n              <div style=\"font-size: 36px; font-weight: bold; color: #1a73e8; text-align: center; letter-spacing: 2px; margin: 20px 0;\">\n                ").concat(user.otp, "\n              </div>\n              <p style=\"font-size: 14px; color: #555;\">M\xE3 OTP c\xF3 hi\u1EC7u l\u1EF1c trong v\xF2ng <strong>5 ph\xFAt</strong>. Vui l\xF2ng kh\xF4ng chia s\u1EBB m\xE3 n\xE0y v\u1EDBi b\u1EA5t k\u1EF3 ai.</p>\n              <div style=\"text-align: center; margin: 30px 0;\">\n                <a href=\"#\" style=\"display: inline-block; background: #1a73e8; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 16px;\">X\xE1c minh ngay</a>\n              </div>\n              <p style=\"font-size: 12px; color: #aaa; text-align: center;\">N\u1EBFu b\u1EA1n kh\xF4ng th\u1EF1c hi\u1EC7n y\xEAu c\u1EA7u n\xE0y, vui l\xF2ng b\u1ECF qua email n\xE0y.</p>\n            </div>\n            <div style=\"background: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #888;\">\n              Email n\xE0y \u0111\u01B0\u1EE3c g\u1EEDi t\u1EEB h\u1EC7 th\u1ED1ng t\u1EF1 \u0111\u1ED9ng c\u1EE7a <strong>BaoTech</strong>. Vui l\xF2ng kh\xF4ng tr\u1EA3 l\u1EDDi.\n            </div>\n          </div>\n        </div>\n      ")
          };
          _context6.next = 17;
          return regeneratorRuntime.awrap(transporter.sendMail(mailOptions));

        case 17:
          res.json({
            message: 'gửi thành công'
          });
          _context6.next = 24;
          break;

        case 20:
          _context6.prev = 20;
          _context6.t0 = _context6["catch"](0);
          console.error('Error verifying OTP:', _context6.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi khi xác minh mã OTP.'
          });

        case 24:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 20]]);
});
router.post('/verify-otp', function _callee7(req, res) {
  var _req$body4, email, otp, user, now, otpExpiration;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _req$body4 = req.body, email = _req$body4.email, otp = _req$body4.otp;
          _context7.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 4:
          user = _context7.sent;

          if (user) {
            _context7.next = 7;
            break;
          }

          return _context7.abrupt("return", res.status(400).json({
            error: 'Người dùng không tồn tại.'
          }));

        case 7:
          if (!(user.otp !== otp)) {
            _context7.next = 9;
            break;
          }

          return _context7.abrupt("return", res.status(400).json({
            error: 'Mã OTP không chính xác.'
          }));

        case 9:
          now = new Date();
          otpExpiration = new Date(user.otpCreatedAt);
          otpExpiration.setMinutes(otpExpiration.getMinutes() + 5);

          if (!(now > otpExpiration)) {
            _context7.next = 14;
            break;
          }

          return _context7.abrupt("return", res.status(400).json({
            error: 'Mã OTP đã hết hạn.'
          }));

        case 14:
          user.isVerified = true;
          user.otp = null;
          user.otpCreatedAt = null;
          _context7.next = 19;
          return regeneratorRuntime.awrap(user.save());

        case 19:
          return _context7.abrupt("return", res.json({
            message: 'Xác minh OTP thành công.'
          }));

        case 22:
          _context7.prev = 22;
          _context7.t0 = _context7["catch"](0);
          console.error('Lỗi khi xác minh OTP:', _context7.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi khi xác minh OTP.'
          });

        case 26:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 22]]);
});
router.post('/login', function _callee8(req, res) {
  var _req$body5, emailOrPhone, password, user, isPasswordValid, accountCreationTime, currentTime, differenceInMonths, responseData, token;

  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _req$body5 = req.body, emailOrPhone = _req$body5.emailOrPhone, password = _req$body5.password;
          _context8.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            $or: [{
              email: emailOrPhone
            }, {
              phone: emailOrPhone
            }]
          }));

        case 4:
          user = _context8.sent;

          if (user) {
            _context8.next = 7;
            break;
          }

          return _context8.abrupt("return", res.json({
            message: 'Email hoặc số điện thoại chưa được đăng ký'
          }));

        case 7:
          _context8.next = 9;
          return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

        case 9:
          isPasswordValid = _context8.sent;

          if (isPasswordValid) {
            _context8.next = 12;
            break;
          }

          return _context8.abrupt("return", res.json({
            message: 'Mật khẩu đăng nhập không đúng'
          }));

        case 12:
          accountCreationTime = moment(user.date);
          currentTime = moment();
          differenceInMonths = currentTime.diff(accountCreationTime, 'months');

          if (!(differenceInMonths > 8)) {
            _context8.next = 17;
            break;
          }

          return _context8.abrupt("return", res.json({
            message: 'Tài khoản của bạn đã hết hạn.'
          }));

        case 17:
          responseData = {
            success: user.success,
            data: {
              user: [{
                _id: user._id,
                name: user.name,
                password: user.password,
                role: user.role,
                isVerified: user.isVerified,
                date: moment(user.date).format('DD/MM/YYYY HH:mm:ss')
              }]
            }
          };
          token = jwt.sign({
            userId: user._id,
            role: user.role
          }, 'mysecretkey');
          responseData.token = token;
          res.json(responseData);
          _context8.next = 27;
          break;

        case 23:
          _context8.prev = 23;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 27:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 23]]);
});
router.get('/user', function _callee9(req, res) {
  var user;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return regeneratorRuntime.awrap(User.find().lean());

        case 3:
          user = _context9.sent;
          res.json(user);
          _context9.next = 11;
          break;

        case 7:
          _context9.prev = 7;
          _context9.t0 = _context9["catch"](0);
          console.error(_context9.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 11:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
router.post('/deletePhone', function _callee10(req, res) {
  var phone, phoneNumber, userRecord;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          phone = req.body.phone;

          if (!(!phone || !/^\d{10}$/.test(phone))) {
            _context10.next = 4;
            break;
          }

          return _context10.abrupt("return", res.status(400).json({
            message: 'Số điện thoại không hợp lệ'
          }));

        case 4:
          phoneNumber = "+84".concat(phone.slice(1));
          _context10.next = 7;
          return regeneratorRuntime.awrap(firebase.auth().getUserByPhoneNumber(phoneNumber));

        case 7:
          userRecord = _context10.sent;
          _context10.next = 10;
          return regeneratorRuntime.awrap(firebase.auth().deleteUser(userRecord.uid));

        case 10:
          res.status(200).json({
            message: 'Đã xóa số điện thoại khỏi hệ thống Firebase.'
          });
          _context10.next = 19;
          break;

        case 13:
          _context10.prev = 13;
          _context10.t0 = _context10["catch"](0);
          console.error('Error deleting user:', _context10.t0);

          if (!(_context10.t0.code === 'auth/user-not-found')) {
            _context10.next = 18;
            break;
          }

          return _context10.abrupt("return", res.status(404).json({
            message: 'Không tìm thấy người dùng với số điện thoại này.'
          }));

        case 18:
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 19:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 13]]);
});
router.get('/test', function _callee11(req, res) {
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          res.render('testOTP');

        case 1:
        case "end":
          return _context11.stop();
      }
    }
  });
});
router.post('/loginadmin', function _callee12(req, res) {
  var _req$body6, emailOrPhone, password, user, isPasswordValid, decryptedPassword, encryptedPassword, responseData, token, accountCreationTime, expiryDate, currentTime, daysRemaining, nhanvien, depot, admin, _accountCreationTime, _currentTime, _expiryDate, _daysRemaining;

  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          _req$body6 = req.body, emailOrPhone = _req$body6.emailOrPhone, password = _req$body6.password;
          _context12.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            $or: [{
              email: emailOrPhone
            }, {
              phone: emailOrPhone
            }]
          }));

        case 4:
          user = _context12.sent;

          if (user) {
            _context12.next = 7;
            break;
          }

          return _context12.abrupt("return", res.json({
            message: 'Email hoặc số điện thoại chưa được đăng ký'
          }));

        case 7:
          _context12.next = 9;
          return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

        case 9:
          isPasswordValid = _context12.sent;

          if (isPasswordValid) {
            _context12.next = 15;
            break;
          }

          decryptedPassword = '';

          if (isJSON(user.password)) {
            encryptedPassword = JSON.parse(user.password);
            decryptedPassword = decrypt(encryptedPassword);
          }

          if (!(decryptedPassword !== password)) {
            _context12.next = 15;
            break;
          }

          return _context12.abrupt("return", res.json({
            message: 'Mật khẩu không chính xác'
          }));

        case 15:
          responseData = {
            success: user.success,
            data: {
              user: [{
                _id: user._id,
                name: user.name,
                role: user.role,
                isVerified: user.isVerified,
                date: moment(user.date).format('DD/MM/YYYY HH:mm:ss'),
                quyen: [],
                warning: ''
              }]
            }
          };
          token = jwt.sign({
            userId: user._id,
            role: user.role
          }, 'mysecretkey', {
            expiresIn: '2h'
          });
          responseData.token = token;

          if (!(user.role === 'admin')) {
            _context12.next = 24;
            break;
          }

          req.session.user = {
            _id: user._id,
            name: user.name,
            role: user.role
          };
          console.log('After login, session user:', req.session.user);
          return _context12.abrupt("return", res.json(responseData));

        case 24:
          if (!(user.role === 'manager')) {
            _context12.next = 42;
            break;
          }

          accountCreationTime = moment(user.date);
          expiryDate = accountCreationTime.add(1, 'years');
          currentTime = moment();
          daysRemaining = expiryDate.diff(currentTime, 'days');

          if (!(daysRemaining <= 15 && daysRemaining > 0)) {
            _context12.next = 33;
            break;
          }

          responseData.data.user[0].warning = "T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n s\u1EBD h\u1EBFt h\u1EA1n sau ".concat(daysRemaining, " ng\xE0y. Vui l\xF2ng gia h\u1EA1n s\u1EDBm.");
          _context12.next = 35;
          break;

        case 33:
          if (!(daysRemaining <= 0)) {
            _context12.next = 35;
            break;
          }

          return _context12.abrupt("return", res.json({
            message: 'Tài khoản của bạn đã hết hạn. Vui lòng liên hệ quản trị viên.'
          }));

        case 35:
          if (!(user.duyet === false)) {
            _context12.next = 37;
            break;
          }

          return _context12.abrupt("return", res.json({
            message: 'Tài khoản của bạn đang chờ xét duyệt'
          }));

        case 37:
          req.session.user = {
            _id: user._id,
            name: user.name,
            role: user.role
          };
          console.log('After login, session user:', req.session.user);
          return _context12.abrupt("return", res.json(responseData));

        case 42:
          _context12.next = 44;
          return regeneratorRuntime.awrap(NhanVien.findOne({
            user: user._id
          }));

        case 44:
          nhanvien = _context12.sent;
          _context12.next = 47;
          return regeneratorRuntime.awrap(Depot.findById(nhanvien.depot));

        case 47:
          depot = _context12.sent;
          _context12.next = 50;
          return regeneratorRuntime.awrap(User.findById(depot.user[0]._id));

        case 50:
          admin = _context12.sent;
          _accountCreationTime = moment(admin.date);
          _currentTime = moment();
          _expiryDate = _accountCreationTime.add(1, 'years');
          _daysRemaining = _expiryDate.diff(_currentTime, 'days');

          if (!(_daysRemaining <= 15 && _daysRemaining > 0)) {
            _context12.next = 59;
            break;
          }

          responseData.data.user[0].warning = "T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n s\u1EBD h\u1EBFt h\u1EA1n sau ".concat(_daysRemaining, " ng\xE0y. Vui l\xF2ng gia h\u1EA1n s\u1EDBm.");
          _context12.next = 61;
          break;

        case 59:
          if (!(_daysRemaining <= 0)) {
            _context12.next = 61;
            break;
          }

          return _context12.abrupt("return", res.json({
            message: 'Tài khoản của bạn đã hết hạn. Vui lòng liên hệ quản trị viên.'
          }));

        case 61:
          if (!(nhanvien.khoa === true)) {
            _context12.next = 63;
            break;
          }

          return _context12.abrupt("return", res.json({
            message: 'Tài khoản của bạn đã bị khóa'
          }));

        case 63:
          if (!(nhanvien.quyen.length === 0)) {
            _context12.next = 65;
            break;
          }

          return _context12.abrupt("return", res.json({
            message: 'Bạn không có quyền truy cập trang web'
          }));

        case 65:
          responseData.data.user[0].quyen = nhanvien.quyen;
          req.session.user = {
            _id: user._id,
            name: user.name,
            role: user.role
          };
          console.log('After login, session user:', req.session.user);
          return _context12.abrupt("return", res.json(responseData));

        case 69:
          _context12.next = 75;
          break;

        case 71:
          _context12.prev = 71;
          _context12.t0 = _context12["catch"](0);
          console.error(_context12.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 75:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 71]]);
});
router.post('/clearalldata', function _callee13(req, res) {
  var collections, key, collection;
  return regeneratorRuntime.async(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          collections = mongoose.connection.collections;
          _context13.t0 = regeneratorRuntime.keys(collections);

        case 3:
          if ((_context13.t1 = _context13.t0()).done) {
            _context13.next = 10;
            break;
          }

          key = _context13.t1.value;
          collection = collections[key];
          _context13.next = 8;
          return regeneratorRuntime.awrap(collection.deleteMany({}));

        case 8:
          _context13.next = 3;
          break;

        case 10:
          res.status(200).json({
            message: 'Tất cả dữ liệu trong các collection đã được xóa.'
          });
          _context13.next = 17;
          break;

        case 13:
          _context13.prev = 13;
          _context13.t2 = _context13["catch"](0);
          console.error('Lỗi khi xóa dữ liệu:', _context13.t2);
          res.status(500).json({
            error: 'Lỗi khi xóa dữ liệu'
          });

        case 17:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[0, 13]]);
});
router.post('/duyetuser', function _callee14(req, res) {
  var ids, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, id, user;

  return regeneratorRuntime.async(function _callee14$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          ids = req.body.ids;
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context14.prev = 5;
          _iterator = ids[Symbol.iterator]();

        case 7:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context14.next = 18;
            break;
          }

          id = _step.value;
          _context14.next = 11;
          return regeneratorRuntime.awrap(User.findById(id));

        case 11:
          user = _context14.sent;
          user.duyet = true;
          _context14.next = 15;
          return regeneratorRuntime.awrap(user.save());

        case 15:
          _iteratorNormalCompletion = true;
          _context14.next = 7;
          break;

        case 18:
          _context14.next = 24;
          break;

        case 20:
          _context14.prev = 20;
          _context14.t0 = _context14["catch"](5);
          _didIteratorError = true;
          _iteratorError = _context14.t0;

        case 24:
          _context14.prev = 24;
          _context14.prev = 25;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 27:
          _context14.prev = 27;

          if (!_didIteratorError) {
            _context14.next = 30;
            break;
          }

          throw _iteratorError;

        case 30:
          return _context14.finish(27);

        case 31:
          return _context14.finish(24);

        case 32:
          res.json({
            message: 'Duyệt thành công'
          });
          _context14.next = 39;
          break;

        case 35:
          _context14.prev = 35;
          _context14.t1 = _context14["catch"](0);
          console.error(_context14.t1);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 39:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[0, 35], [5, 20, 24, 32], [25,, 27, 31]]);
});
module.exports = router;
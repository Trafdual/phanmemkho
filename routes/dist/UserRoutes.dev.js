"use strict";

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

var NhanVien = require('../models/NhanVienModel');

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
            birthday: birthday
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
          res.json(responseData);
          _context4.next = 33;
          break;

        case 29:
          _context4.prev = 29;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 33:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 29]]);
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
            from: 'trafdual0810@gmail.com',
            to: user.email,
            subject: 'Mã OTP của bạn',
            text: "M\xE3 OTP c\u1EE7a b\u1EA1n l\xE0: ".concat(user.otp)
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
router.post('/login', function _callee6(req, res) {
  var _req$body4, emailOrPhone, password, user, isPasswordValid, accountCreationTime, currentTime, differenceInMonths, responseData, token;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _req$body4 = req.body, emailOrPhone = _req$body4.emailOrPhone, password = _req$body4.password;
          _context6.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            $or: [{
              email: emailOrPhone
            }, {
              phone: emailOrPhone
            }]
          }));

        case 4:
          user = _context6.sent;

          if (user) {
            _context6.next = 7;
            break;
          }

          return _context6.abrupt("return", res.json({
            message: 'Email hoặc số điện thoại chưa được đăng ký'
          }));

        case 7:
          _context6.next = 9;
          return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

        case 9:
          isPasswordValid = _context6.sent;

          if (isPasswordValid) {
            _context6.next = 12;
            break;
          }

          return _context6.abrupt("return", res.json({
            message: 'Mật khẩu đăng nhập không đúng'
          }));

        case 12:
          accountCreationTime = moment(user.date);
          currentTime = moment();
          differenceInMonths = currentTime.diff(accountCreationTime, 'months');

          if (!(differenceInMonths > 8)) {
            _context6.next = 17;
            break;
          }

          return _context6.abrupt("return", res.json({
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
          _context6.next = 27;
          break;

        case 23:
          _context6.prev = 23;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 27:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 23]]);
});
router.get('/user', function _callee7(req, res) {
  var user;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(User.find().lean());

        case 3:
          user = _context7.sent;
          res.json(user);
          _context7.next = 11;
          break;

        case 7:
          _context7.prev = 7;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 11:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
router.post('/deletePhone', function _callee8(req, res) {
  var phone, phoneNumber, userRecord;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          phone = req.body.phone;

          if (!(!phone || !/^\d{10}$/.test(phone))) {
            _context8.next = 4;
            break;
          }

          return _context8.abrupt("return", res.status(400).json({
            message: 'Số điện thoại không hợp lệ'
          }));

        case 4:
          phoneNumber = "+84".concat(phone.slice(1));
          _context8.next = 7;
          return regeneratorRuntime.awrap(firebase.auth().getUserByPhoneNumber(phoneNumber));

        case 7:
          userRecord = _context8.sent;
          _context8.next = 10;
          return regeneratorRuntime.awrap(firebase.auth().deleteUser(userRecord.uid));

        case 10:
          res.status(200).json({
            message: 'Đã xóa số điện thoại khỏi hệ thống Firebase.'
          });
          _context8.next = 19;
          break;

        case 13:
          _context8.prev = 13;
          _context8.t0 = _context8["catch"](0);
          console.error('Error deleting user:', _context8.t0);

          if (!(_context8.t0.code === 'auth/user-not-found')) {
            _context8.next = 18;
            break;
          }

          return _context8.abrupt("return", res.status(404).json({
            message: 'Không tìm thấy người dùng với số điện thoại này.'
          }));

        case 18:
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 19:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 13]]);
});
router.get('/test', function _callee9(req, res) {
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          res.render('testOTP');

        case 1:
        case "end":
          return _context9.stop();
      }
    }
  });
});
router.post('/loginadmin', function _callee10(req, res) {
  var _req$body5, emailOrPhone, password, user, isPasswordValid, encryptedPassword, isPasswordValidCrypto, responseData, accountCreationTime, expiryDate, currentTime, daysRemaining, nhanvien, depot, admin, _accountCreationTime, _currentTime, _expiryDate, _daysRemaining, token;

  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          _req$body5 = req.body, emailOrPhone = _req$body5.emailOrPhone, password = _req$body5.password;
          _context10.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            $or: [{
              email: emailOrPhone
            }, {
              phone: emailOrPhone
            }]
          }));

        case 4:
          user = _context10.sent;

          if (user) {
            _context10.next = 7;
            break;
          }

          return _context10.abrupt("return", res.json({
            message: 'Email hoặc số điện thoại chưa được đăng ký'
          }));

        case 7:
          _context10.next = 9;
          return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

        case 9:
          isPasswordValid = _context10.sent;

          if (isPasswordValid) {
            _context10.next = 15;
            break;
          }

          encryptedPassword = JSON.parse(user.password);
          isPasswordValidCrypto = decrypt(encryptedPassword) === password;

          if (isPasswordValidCrypto) {
            _context10.next = 15;
            break;
          }

          return _context10.abrupt("return", res.json({
            message: 'Mật khẩu không chính xác'
          }));

        case 15:
          responseData = {
            success: user.success,
            data: {
              user: [{
                _id: user._id,
                name: user.name,
                password: user.password,
                role: user.role,
                isVerified: user.isVerified,
                date: moment(user.date).format('DD/MM/YYYY HH:mm:ss'),
                quyen: [],
                warning: ''
              }]
            }
          };

          if (!(user.role === 'admin')) {
            _context10.next = 20;
            break;
          }

          return _context10.abrupt("return", res.json(responseData));

        case 20:
          if (!(user.role === 'manager')) {
            _context10.next = 34;
            break;
          }

          accountCreationTime = moment(user.date);
          expiryDate = accountCreationTime.add(1, 'years');
          currentTime = moment();
          daysRemaining = expiryDate.diff(currentTime, 'days');

          if (!(daysRemaining <= 15 && daysRemaining > 0)) {
            _context10.next = 29;
            break;
          }

          responseData.data.user[0].warning = "T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n s\u1EBD h\u1EBFt h\u1EA1n sau ".concat(daysRemaining, " ng\xE0y. Vui l\xF2ng gia h\u1EA1n s\u1EDBm.");
          _context10.next = 31;
          break;

        case 29:
          if (!(daysRemaining <= 0)) {
            _context10.next = 31;
            break;
          }

          return _context10.abrupt("return", res.json({
            message: 'Tài khoản của bạn đã hết hạn. Vui lòng liên hệ quản trị viên.'
          }));

        case 31:
          return _context10.abrupt("return", res.json(responseData));

        case 34:
          _context10.next = 36;
          return regeneratorRuntime.awrap(NhanVien.findOne({
            user: user._id
          }));

        case 36:
          nhanvien = _context10.sent;
          _context10.next = 39;
          return regeneratorRuntime.awrap(Depot.findById(nhanvien.depot));

        case 39:
          depot = _context10.sent;
          _context10.next = 42;
          return regeneratorRuntime.awrap(User.findById(depot.user[0]._id));

        case 42:
          admin = _context10.sent;
          _accountCreationTime = moment(admin.date);
          _currentTime = moment();
          _expiryDate = _accountCreationTime.add(1, 'years');
          _daysRemaining = _expiryDate.diff(_currentTime, 'days');

          if (!(_daysRemaining <= 15 && _daysRemaining > 0)) {
            _context10.next = 51;
            break;
          }

          responseData.data.user[0].warning = "T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n s\u1EBD h\u1EBFt h\u1EA1n sau ".concat(_daysRemaining, " ng\xE0y. Vui l\xF2ng gia h\u1EA1n s\u1EDBm.");
          _context10.next = 53;
          break;

        case 51:
          if (!(_daysRemaining <= 0)) {
            _context10.next = 53;
            break;
          }

          return _context10.abrupt("return", res.json({
            message: 'Tài khoản của bạn đã hết hạn. Vui lòng liên hệ quản trị viên.'
          }));

        case 53:
          if (!(nhanvien.khoa === true)) {
            _context10.next = 55;
            break;
          }

          return _context10.abrupt("return", res.json({
            message: 'Tài khoản của bạn đã bị khóa'
          }));

        case 55:
          if (!(nhanvien.quyen.length === 0)) {
            _context10.next = 57;
            break;
          }

          return _context10.abrupt("return", res.json({
            message: 'Bạn không có quyền truy cập trang web'
          }));

        case 57:
          responseData.data.user[0].quyen = nhanvien.quyen;
          token = jwt.sign({
            userId: user._id,
            role: user.role
          }, 'mysecretkey', {
            expiresIn: '2h'
          });
          responseData.token = token;
          return _context10.abrupt("return", res.json(responseData));

        case 61:
          _context10.next = 67;
          break;

        case 63:
          _context10.prev = 63;
          _context10.t0 = _context10["catch"](0);
          console.error(_context10.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 67:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 63]]);
});
module.exports = router;
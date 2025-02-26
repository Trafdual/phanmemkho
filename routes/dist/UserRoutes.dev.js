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
router.get('/taokho', function _callee2(req, res) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          res.render('khochua');

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
});
router.post('/taokho', function _callee3(req, res) {
  var phone, _req$body, name, address, depot, token;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;

          if (!req.isAuthenticated()) {
            _context3.next = 21;
            break;
          }

          phone = req.body.phone;
          _req$body = req.body, name = _req$body.name, address = _req$body.address;

          if (/^\d{10}$/.test(phone)) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", res.status(400).send('Số điện thoại không hợp lệ'));

        case 6:
          depot = new Depot({
            name: name,
            address: address
          });
          req.user.phone = phone;
          req.user.depot = depot._id;
          depot.user.push(req.user._id);
          _context3.next = 12;
          return regeneratorRuntime.awrap(depot.save());

        case 12:
          _context3.next = 14;
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
          _context3.next = 22;
          break;

        case 21:
          res.redirect('/test');

        case 22:
          _context3.next = 28;
          break;

        case 24:
          _context3.prev = 24;
          _context3.t0 = _context3["catch"](0);
          console.error('Error verifying OTP:', _context3.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 28:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 24]]);
});
router.post('/register', function _callee4(req, res) {
  var _req$body2, name, email, password, phone, vietnamTime, exitphone, existingemail, hashedPassword, user, responseData;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _req$body2 = req.body, name = _req$body2.name, email = _req$body2.email, password = _req$body2.password, phone = _req$body2.phone;
          vietnamTime = momenttimezone().toDate();

          if (!(!phone || !/^\d{10}$/.test(phone))) {
            _context4.next = 5;
            break;
          }

          return _context4.abrupt("return", res.json({
            message: 'Số điện thoại không hợp lệ'
          }));

        case 5:
          if (emailRegex.test(email)) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.json({
            message: 'email không hợp lệ'
          }));

        case 7:
          _context4.next = 9;
          return regeneratorRuntime.awrap(User.findOne({
            phone: phone
          }));

        case 9:
          exitphone = _context4.sent;

          if (!exitphone) {
            _context4.next = 12;
            break;
          }

          return _context4.abrupt("return", res.json({
            message: 'số điện thoại này đã được đăng kí'
          }));

        case 12:
          _context4.next = 14;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 14:
          existingemail = _context4.sent;

          if (!existingemail) {
            _context4.next = 17;
            break;
          }

          return _context4.abrupt("return", res.json({
            message: 'email này đã được đăng kí'
          }));

        case 17:
          _context4.next = 19;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

        case 19:
          hashedPassword = _context4.sent;
          user = new User({
            name: name,
            email: email,
            password: hashedPassword,
            phone: phone,
            date: vietnamTime,
            isVerified: false
          });
          _context4.next = 23;
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
          _context4.next = 31;
          break;

        case 27:
          _context4.prev = 27;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 31:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 27]]);
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
          otp = Math.floor(100000 + Math.random() * 900000).toString(); // Tạo mã OTP ngẫu nhiên

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
router.get('/getregister', function _callee6(req, res) {
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          res.render('register');

        case 1:
        case "end":
          return _context6.stop();
      }
    }
  });
});
router.post('/register/:id', function _callee7(req, res) {
  var id, otp, user, currentTime, otpCreationTime, timeDifference;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          id = req.params.id;
          otp = req.body.otp;
          _context7.next = 5;
          return regeneratorRuntime.awrap(User.findById(id));

        case 5:
          user = _context7.sent;

          if (user) {
            _context7.next = 8;
            break;
          }

          return _context7.abrupt("return", res.status(400).json({
            message: 'Người dùng không tồn tại.'
          }));

        case 8:
          currentTime = new Date();
          otpCreationTime = new Date(user.otpCreatedAt);
          timeDifference = currentTime - otpCreationTime;

          if (!(user.otp !== otp)) {
            _context7.next = 13;
            break;
          }

          return _context7.abrupt("return", res.json({
            message: 'Bạn đã nhập sai mã OTP.'
          }));

        case 13:
          if (!(timeDifference > 60 * 1000)) {
            _context7.next = 15;
            break;
          }

          return _context7.abrupt("return", res.json({
            message: 'Mã OTP đã hết hạn.'
          }));

        case 15:
          user.isVerified = true;
          user.otp = undefined;
          user.otpCreatedAt = undefined;
          _context7.next = 20;
          return regeneratorRuntime.awrap(user.save());

        case 20:
          res.json({
            message: 'thành công.'
          });
          _context7.next = 27;
          break;

        case 23:
          _context7.prev = 23;
          _context7.t0 = _context7["catch"](0);
          console.error('Error verifying OTP:', _context7.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi khi xác minh mã OTP.'
          });

        case 27:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 23]]);
});
router.post('/login', function _callee8(req, res) {
  var _req$body3, emailOrPhone, password, user, isPasswordValid, accountCreationTime, currentTime, differenceInMonths, responseData, token;

  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _req$body3 = req.body, emailOrPhone = _req$body3.emailOrPhone, password = _req$body3.password;
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
module.exports = router;
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
          phone = req.body.phone; // Kiểm tra số điện thoại hợp lệ

          if (!(!phone || !/^\d{10}$/.test(phone))) {
            _context10.next = 4;
            break;
          }

          return _context10.abrupt("return", res.status(400).json({
            message: 'Số điện thoại không hợp lệ'
          }));

        case 4:
          // Chuyển đổi số điện thoại sang định dạng quốc tế
          phoneNumber = "+84".concat(phone.slice(1)); // Tìm người dùng qua số điện thoại

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
  var _req$body4, email, password, user, isPasswordValid, encryptedPassword, isPasswordValidCrypto, token, _token, _token2;

  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          _req$body4 = req.body, email = _req$body4.email, password = _req$body4.password;
          _context12.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 4:
          user = _context12.sent;

          if (user) {
            _context12.next = 7;
            break;
          }

          return _context12.abrupt("return", res.render('login', {
            UserError: 'Email này không đúng'
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

          encryptedPassword = JSON.parse(user.password);
          isPasswordValidCrypto = decrypt(encryptedPassword) === password;

          if (isPasswordValidCrypto) {
            _context12.next = 15;
            break;
          }

          return _context12.abrupt("return", res.render('login', {
            PassError: 'Mật khẩu không đúng'
          }));

        case 15:
          if (!(user.role === 'admin')) {
            _context12.next = 23;
            break;
          }

          token = jwt.sign({
            userId: user._id,
            role: user.role
          }, 'mysecretkey', {
            expiresIn: '1h'
          });
          req.session.userId = user._id;
          req.session.token = token;
          req.session.depotId = user.depot;
          return _context12.abrupt("return", res.redirect('/admin'));

        case 23:
          if (!(user.role === 'manager')) {
            _context12.next = 31;
            break;
          }

          _token = jwt.sign({
            userId: user._id,
            role: user.role
          }, 'mysecretkey', {
            expiresIn: '1h'
          });
          req.session.userId = user._id;
          req.session.token = _token;
          req.session.depotId = user.depot;
          return _context12.abrupt("return", res.redirect('/manager'));

        case 31:
          if (!(user.role === 'staff')) {
            _context12.next = 39;
            break;
          }

          _token2 = jwt.sign({
            userId: user._id,
            role: user.role
          }, 'mysecretkey', {
            expiresIn: '1h'
          });
          req.session.userId = user._id;
          req.session.token = _token2;
          req.session.depotId = user.depot;
          return _context12.abrupt("return", res.redirect('/manager'));

        case 39:
          return _context12.abrupt("return", res.render('login', {
            RoleError: 'Bạn không có quyền truy cập trang web'
          }));

        case 40:
          _context12.next = 46;
          break;

        case 42:
          _context12.prev = 42;
          _context12.t0 = _context12["catch"](0);
          console.error(_context12.t0);
          res.status(500).json({
            message: 'Đã xảy ra lỗi.'
          });

        case 46:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 42]]);
});
router.get('/manager', checkAuth, function _callee13(req, res) {
  return regeneratorRuntime.async(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          res.render('manager');

        case 1:
        case "end":
          return _context13.stop();
      }
    }
  });
});
router.get('/loginemail', function _callee14(req, res) {
  return regeneratorRuntime.async(function _callee14$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          res.render('login');

        case 1:
        case "end":
          return _context14.stop();
      }
    }
  });
});
module.exports = router;
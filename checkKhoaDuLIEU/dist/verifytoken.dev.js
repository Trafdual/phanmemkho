"use strict";

var jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  var authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      message: 'Không có token, truy cập bị từ chối'
    });
  }

  var token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'Token không hợp lệ'
    });
  }

  jwt.verify(token, 'mysecretkey', function (err, decoded) {
    if (err) {
      return res.status(403).json({
        message: 'Token không hợp lệ hoặc đã hết hạn'
      });
    }

    req.user = decoded;
    next();
  });
}

module.exports = {
  verifyToken: verifyToken
};
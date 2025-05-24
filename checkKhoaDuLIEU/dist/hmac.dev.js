"use strict";

var crypto = require('crypto');

require('dotenv').config();

var SECRET_KEY = process.env.secretkey;

var verifyHMAC = function verifyHMAC(req, res, next) {
  var signature = req.headers['x-signature'];
  var timestamp = req.headers['x-timestamp'];

  if (!signature || !timestamp) {
    return res.status(401).json({
      message: 'Missing signature or timestamp'
    });
  }

  var currentTimestamp = Date.now();
  var requestTimestamp = parseInt(timestamp);
  var maxTimeDiff = 5 * 60 * 1000; // 5 phút

  if (Math.abs(currentTimestamp - requestTimestamp) > maxTimeDiff) {
    return res.status(401).json({
      message: 'Timestamp expired'
    });
  }

  var payload = req.method === 'GET' ? '' : JSON.stringify(req.body || {});
  var message = "".concat(timestamp, ":").concat(payload);
  var expectedSignature = crypto.createHmac('sha256', SECRET_KEY).update(message).digest('hex');

  if (expectedSignature !== signature) {
    return res.status(401).json({
      message: 'Invalid signature'
    });
  }

  next();
};

module.exports = {
  verifyHMAC: verifyHMAC
};
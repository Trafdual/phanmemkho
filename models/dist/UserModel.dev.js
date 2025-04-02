"use strict";

var _require = require('aws-sdk'),
    KinesisVideoSignalingChannels = _require.KinesisVideoSignalingChannels;

var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  password: {
    type: String
  },
  email: {
    type: String
  },
  phone: {
    type: String
  },
  depot: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'depot'
  }],
  birthday: {
    type: Date
  },
  date: {
    type: Date
  },
  role: {
    type: String,
    "enum": ['admin', 'staff', 'manager'],
    "default": 'manager'
  },
  otp: {
    type: String
  },
  otpCreatedAt: {
    type: Date
  },
  isVerified: {
    type: Boolean,
    "default": false
  },
  isActivity: {
    type: Boolean,
    "default": true
  },
  nganhangkho: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'nganhang'
  }],
  sku: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'sku'
  }],
  mucthuchi: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'mucthuchi'
  }],
  loaichungtu: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'loaichungtu'
  }],
  nhomkhachhang: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'nhomkhachhang'
  }],
  nhanvien: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'nhanvien'
  }],
  khoa: {
    type: Boolean,
    "default": false
  },
  message: {
    type: String
  }
});
var User = mongoose.model('user', userSchema);
module.exports = User;
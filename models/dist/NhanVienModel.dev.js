"use strict";

var mongoose = require('mongoose');

var nhanvienSchema = new mongoose.Schema({
  manhanvien: {
    type: String
  },
  name: {
    type: String
  },
  cccd: {
    type: String
  },
  depot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'depot'
  },
  chucvu: {
    type: String
  },
  quyen: [{
    type: String
  }],
  khoa: {
    type: Boolean,
    "default": false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
});
var NhanVien = mongoose.model('nhanvien', nhanvienSchema);
module.exports = NhanVien;
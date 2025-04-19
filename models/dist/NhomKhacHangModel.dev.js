"use strict";

var mongoose = require('mongoose');

var nhomkhachhangSchema = new mongoose.Schema({
  manhomkh: {
    type: String
  },
  name: {
    type: String
  },
  congno: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'congno'
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  status: {
    type: Number,
    "default": 1
  }
});
var NhomKhacHang = mongoose.model('nhomkhachang', nhomkhachhangSchema);
module.exports = NhomKhacHang;
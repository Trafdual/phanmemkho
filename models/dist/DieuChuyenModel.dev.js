"use strict";

var mongoose = require('mongoose');

var dieuchuyenSchema = new mongoose.Schema({
  sanpham: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'sanpham'
  }],
  depot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'depot'
  },
  trangthai: {
    type: String
  },
  date: {
    type: Date
  },
  tongtien: {
    type: Number
  },
  kiemtra: {
    type: Boolean,
    "default": false
  }
});
var DieuChuyen = mongoose.model('dieuchuyen', dieuchuyenSchema);
module.exports = DieuChuyen;
"use strict";

var mongoose = require('mongoose');

var loaisanphamSchema = new mongoose.Schema({
  malsp: {
    type: String
  },
  name: {
    type: String
  },
  sanpham: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'sanpham'
  }],
  tongtien: {
    type: Number
  },
  date: {
    type: Date
  },
  hour: {
    type: Date
  },
  nhacungcap: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'nhacungcap'
  },
  makhodiechuyen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'depot'
  },
  depot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'depot'
  },
  ghino: {
    type: Boolean,
    "default": false
  },
  method: {
    type: String
  },
  nganhang: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'nganhang'
  },
  conlai: {
    type: Number
  },
  trano: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'trano'
  },
  diengiai: {
    type: String
  },
  loaihanghoa: {
    type: String
  },
  status: {
    type: Number,
    "default": 1
  }
});
var LoaiSanPham = mongoose.model('loaisanpham', loaisanphamSchema);
module.exports = LoaiSanPham;
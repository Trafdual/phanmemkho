"use strict";

var mongoose = require('mongoose');

var depotSchema = new mongoose.Schema({
  name: {
    type: String
  },
  address: {
    type: String
  },
  user: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  khachang: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'khachhang'
  }],
  nhacungcap: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'nhacungcap'
  }],
  loaisanpham: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'loaisanpham'
  }],
  xuatkho: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'sanpham'
  }],
  dieuchuyen: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'dieuchuyen'
  }],
  hoadon: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'hoadon'
  }],
  sanpham: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'sanpham'
  }],
  trahang: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'trahang'
  }],
  lenhdieuchuyen: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'lenhdieuchuyen'
  }],
  thuchi: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'thuchi'
  }],
  congno: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'congno'
  }]
});
var DePot = mongoose.model('depot', depotSchema);
module.exports = DePot;
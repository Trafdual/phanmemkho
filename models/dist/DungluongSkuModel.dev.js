"use strict";

var mongoose = require('mongoose');

var dungluongskuchema = new mongoose.Schema({
  madungluong: {
    type: String
  },
  name: {
    type: String
  },
  sanpham: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'sanpham'
  }],
  sku: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'sku'
  },
  status: {
    type: Number,
    "default": 1
  }
});
var dungluong = mongoose.model('dungluong', dungluongskuchema);
module.exports = dungluong;
"use strict";

var mongoose = require('mongoose');

var skuschema = new mongoose.Schema({
  masku: {
    type: String
  },
  name: {
    type: String
  },
  dungluong: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'dungluong'
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  sanpham: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'sanpham'
  }],
  status: {
    type: Number,
    "default": 1
  }
});
var skus = mongoose.model('sku', skuschema);
module.exports = skus;
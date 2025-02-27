"use strict";

var mongoose = require('mongoose');

var lenhdcSchema = new mongoose.Schema({
  malenhdc: {
    type: String
  },
  tensanpham: {
    type: String
  },
  khochuyen: {
    type: mongoose.Types.ObjectId,
    ref: 'depot'
  },
  khonhan: {
    type: mongoose.Types.ObjectId,
    ref: 'depot'
  },
  lido: {
    type: String
  },
  sku: {
    type: mongoose.Types.ObjectId,
    ref: 'dungluong'
  },
  soluong: {
    type: Number
  },
  date: {
    type: Date
  },
  duyet: {
    type: Boolean,
    "default": false
  }
});
var LenhDieuChuyen = mongoose.model('lenhdieuchuyen', lenhdcSchema);
module.exports = LenhDieuChuyen;
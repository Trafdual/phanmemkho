"use strict";

var mongoose = require('mongoose');

var LoaiChungTuSchema = new mongoose.Schema({
  maloaict: {
    type: String
  },
  name: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  method: {
    type: String
  },
  thuchi: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'thuchi'
  }],
  status: {
    type: Number,
    "default": 1
  }
});
var LoaiChungTu = mongoose.model('loaichungtu', LoaiChungTuSchema);
module.exports = LoaiChungTu;
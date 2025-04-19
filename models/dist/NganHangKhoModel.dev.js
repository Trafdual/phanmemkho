"use strict";

var mongoose = require('mongoose');

var nganhangkhoSchema = new mongoose.Schema({
  manganhangkho: {
    type: String
  },
  name: {
    type: String
  },
  sotaikhoan: {
    type: String
  },
  chusohuu: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  status: {
    type: Number,
    "default": 1
  }
});
var NganHang = mongoose.model('nganhang', nganhangkhoSchema);
module.exports = NganHang;
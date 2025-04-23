"use strict";

var mongoose = require('mongoose');

var tranoSchema = new mongoose.Schema({
  matrano: {
    type: String
  },
  hinhthuc: {
    type: String
  },
  nhacungcap: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'nhacungcap'
  },
  ngaytrahet: {
    type: Date
  },
  tongtra: {
    type: Number
  },
  tongno: {
    type: Number
  },
  donno: [{
    loaisanpham: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'loaisanpham'
    },
    tienno: {
      type: Number
    },
    tienphaitra: {
      type: Number
    },
    tiendatra: {
      type: Number
    },
    ngaytra: {
      type: Date
    }
  }],
  created: {
    type: Date
  },
  datra: {
    type: Boolean,
    "default": false
  }
});
var TraNo = mongoose.model('trano', tranoSchema);
module.exports = TraNo;
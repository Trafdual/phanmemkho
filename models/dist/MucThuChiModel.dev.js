"use strict";

var mongoose = require('mongoose');

var mucthuchiSchema = new mongoose.Schema({
  mamuc: {
    type: String
  },
  name: {
    type: String
  },
  loaimuc: {
    type: String
  },
  thuchi: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'thuchi'
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
var MucThuChi = mongoose.model('mucthuchi', mucthuchiSchema);
module.exports = MucThuChi;
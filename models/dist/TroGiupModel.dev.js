"use strict";

var mongoose = require('mongoose');

var trogiupSchema = new mongoose.Schema({
  tieude: {
    type: String
  },
  noidung: {
    type: String
  },
  image: {
    type: String
  },
  theloaitrogiup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'theloaitrogiup'
  }
});
var TroGiup = mongoose.model('trogiup', trogiupSchema);
module.exports = TroGiup;
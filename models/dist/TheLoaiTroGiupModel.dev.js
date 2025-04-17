"use strict";

var mongoose = require('mongoose');

var theloaitrogiupSchema = new mongoose.Schema({
  name: {
    type: String
  },
  namekhongdau: {
    type: String
  },
  trogiup: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'trogiup'
  }]
});
var TheloaiTrogiup = mongoose.model('theloaitrogiup', theloaitrogiupSchema);
module.exports = TheloaiTrogiup;
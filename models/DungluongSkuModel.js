const mongoose = require('mongoose')

const dungluongskuchema = new mongoose.Schema({
  madungluong:{type:String},
  name:{type:String},
  sanpham: [{ type: mongoose.Schema.Types.ObjectId, ref: 'sanpham' }],
})

const dungluong = mongoose.model('dungluong', dungluongskuchema)
module.exports = dungluong

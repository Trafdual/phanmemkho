const mongoose = require('mongoose')

const nhomkhachhangSchema = new mongoose.Schema({
  manhomkh: { type: String },
  name: { type: String },
  congno: [{ type: mongoose.Schema.Types.ObjectId, ref: 'congno' }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  status: { type: Number, default: 1 }
})
const NhomKhacHang = mongoose.model('nhomkhachang', nhomkhachhangSchema)
module.exports = NhomKhacHang

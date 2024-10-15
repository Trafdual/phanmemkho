const mongoose = require('mongoose')

const hoadonSchema = new mongoose.Schema({
  mahoadon: { type: String },
  khachhang: { type: mongoose.Schema.Types.ObjectId, ref: 'khachhang' },
  sanpham: [{ type: mongoose.Schema.Types.ObjectId, ref: 'sanpham' }],
  date: { type: Date },
  tongtien: { type: Number }
})

const HoaDon = mongoose.model('hoadon', hoadonSchema)
module.exports = HoaDon

const mongoose = require('mongoose')

const hoadonSchema = new mongoose.Schema({
  mahoadon: { type: String },
  khachhang: { type: mongoose.Schema.Types.ObjectId, ref: 'khachhang' },
  sanpham: [{ type: mongoose.Schema.Types.ObjectId, ref: 'sanpham' }],
  method: { type: String },
  soluong: { type: Number },
  date: { type: Date },
  tongtien: { type: Number },
  nganhang: { type: mongoose.Schema.Types.ObjectId, ref: 'nganhang' },
  dongia: { type: Number },
  datcoc: { type: Number },
  tienkhachtra: { type: Number },
  tientralaikhach: { type: Number }
})

const HoaDon = mongoose.model('hoadon', hoadonSchema)
module.exports = HoaDon

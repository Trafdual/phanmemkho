const mongoose = require('mongoose')

const sanphamSchema = new mongoose.Schema({
  masp: { type: String },
  name: { type: String },
  imel: { type: String },
  capacity: { type: String },
  color: { type: String },
  price: { type: Number },
  loaisanpham: { type: mongoose.Schema.Types.ObjectId, ref: 'loaisanpham' },
  datenhap: { type: Date },
  datexuat: { type: Date },
  xuat: { type: Boolean, default: false }
})

const SanPham = mongoose.model('sanpham', sanphamSchema)
module.exports = SanPham

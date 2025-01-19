const mongoose = require('mongoose')

const khachhangSchema = new mongoose.Schema({
  name: { type: String },
  makh: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  cancuoc: { type: String },
  date: { type: Date },
  donhang: [{ type: mongoose.Schema.Types.ObjectId, ref: 'hoadon' }],
  isActivity: { type: Boolean, default: true },
  depotId: { type: mongoose.Schema.Types.ObjectId, ref: 'depot' },
  nhomkhachhang: { type: mongoose.Schema.Types.ObjectId, ref: 'nhomkhachhang' },
  congno:[ { type: mongoose.Schema.Types.ObjectId, ref: 'congno' }]
})
const KhachHang = mongoose.model('khachhang', khachhangSchema)
module.exports = KhachHang

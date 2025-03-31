const mongoose = require('mongoose')

const nhanvienSchema = new mongoose.Schema({
  manhanvien: { type: String },
  name: { type: String },
  cccd: { type: String },
  depot: { type: mongoose.Schema.Types.ObjectId, ref: 'depot' },
  chucvu: { type: String },
  quyen: [{ type: String }],
  khoa: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
})

const NhanVien = mongoose.model('nhanvien', nhanvienSchema)
module.exports = NhanVien

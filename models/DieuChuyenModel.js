const mongoose = require('mongoose')

const dieuchuyenSchema = new mongoose.Schema({
  sanpham: { type: mongoose.Schema.Types.ObjectId, ref: 'sanpham' },
  nhacungcap: { type: mongoose.Schema.Types.ObjectId, ref: 'nhacungcap' },
  loaisanpham: { type: mongoose.Schema.Types.ObjectId, ref: 'loaisanpham' },
  depot: { type: mongoose.Schema.Types.ObjectId, ref: 'depot' },
  trangthai: { type: String },
  date: { type: Date }
})
const DieuChuyen = mongoose.model('dieuchuyen', dieuchuyenSchema)
module.exports = DieuChuyen

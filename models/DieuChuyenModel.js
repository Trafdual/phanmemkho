const mongoose = require('mongoose')

const dieuchuyenSchema = new mongoose.Schema({
  sanpham: [{ type: mongoose.Schema.Types.ObjectId, ref: 'sanpham' }],
  depot: { type: mongoose.Schema.Types.ObjectId, ref: 'depot' },
  trangthai: { type: String },
  date: { type: Date }
})
const DieuChuyen = mongoose.model('dieuchuyen', dieuchuyenSchema)
module.exports = DieuChuyen

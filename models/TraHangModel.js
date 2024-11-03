const mongoose = require('mongoose')

const trahangSchema = new mongoose.Schema({
  matrahang: { type: String },
  diengiai: { type: String },
  nhacungcap: { type: mongoose.Schema.Types.ObjectId, ref: 'nhacungcap' },
  ngaytra: { type: Date },
  hour: { type: Date },
  sanpham: [{ type: mongoose.Schema.Types.ObjectId, ref: 'sanpham' }],
  kho: { type: mongoose.Schema.Types.ObjectId, ref: 'depot' },
  congno: { type: Boolean, default: false },
  method:{type:String}
})
const TraHang = mongoose.model('trahang', trahangSchema)
module.exports = TraHang

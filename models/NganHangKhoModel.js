const mongoose = require('mongoose')

const nganhangkhoSchema = new mongoose.Schema({
  manganhangkho: { type: String },
  name: { type: String },
  sotaikhoan: { type: String },
  chusohuu: { type: String }
})
const NganHang = mongoose.model('nganhang', nganhangkhoSchema)
module.exports = NganHang

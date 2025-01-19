const mongoose = require('mongoose')

const LoaiChungTuSchema = new mongoose.Schema({
  maloaict: { type: String },
  name: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  method: { type: String },
  thuchi: [{ type: mongoose.Schema.Types.ObjectId, ref: 'thuchi' }]
})
const LoaiChungTu = mongoose.model('loaichungtu', LoaiChungTuSchema)
module.exports = LoaiChungTu

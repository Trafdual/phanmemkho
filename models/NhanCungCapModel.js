const mongoose = require('mongoose')

const nhacungcapSchema = new mongoose.Schema({
  mancc: { type: String },
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  depotId: { type: mongoose.Schema.Types.ObjectId, ref: 'depot' },
  loaisanpham: [{ type: mongoose.Schema.Types.ObjectId, ref: 'loaisanpham' }],
  trano: [{ type: mongoose.Schema.Types.ObjectId, ref: 'trano' }],
  status: { type: Number, default: 1 }
})
const NhanCungCap = mongoose.model('nhacungcap', nhacungcapSchema)
module.exports = NhanCungCap

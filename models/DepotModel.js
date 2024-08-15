const mongoose = require('mongoose')

const depotSchema = new mongoose.Schema({
  name: { type: String },
  address: { type: String },
  user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  khachang: [{ type: mongoose.Schema.Types.ObjectId, ref: 'khachhang' }],
  nhacungcap: [{ type: mongoose.Schema.Types.ObjectId, ref: 'nhacungcap' }],
  loaisanpham: [{ type: mongoose.Schema.Types.ObjectId, ref: 'loaisanpham' }]
})
const DePot = mongoose.model('depot', depotSchema)
module.exports = DePot

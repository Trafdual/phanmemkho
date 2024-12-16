const mongoose = require('mongoose')

const congnoSchema = new mongoose.Schema({
  khachhang: { type: mongoose.Schema.Types.ObjectId, name: 'khachhang' },
  date: { type: Date },
  tongtien: { type: Number },
  hoadon: { type: mongoose.Schema.Types.ObjectId, name: 'hoadon' }
})
const CongNo = mongoose.model('congno', congnoSchema)
module.exports = CongNo

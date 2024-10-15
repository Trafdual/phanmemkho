const mongoose = require('mongoose')

const tranoSchema = new mongoose.Schema({
  matrano: { type: String },
  hinhthuc: { type: String },
  nhacungcap: { type: mongoose.Schema.Types.ObjectId, ref: 'nhacungcap' },
  ngaytra: { type: Date },
  tongtra:{type:Number},
  tongno:{type:Number},
  donno: [
    {
      loaisanpham: { type: mongoose.Schema.Types.ObjectId, ref: 'loaisanpham' },
      tienno: { type: Number },
      tienphaitra: { type: Number },
      tiendatra: { type: Number }
    }
  ]
})
const TraNo = mongoose.model('trano', tranoSchema)
module.exports = TraNo

const mongoose = require('mongoose')

const hoadonSchema = new mongoose.Schema({
  mahoadon: { type: String },
  khachhang: { type: mongoose.Schema.Types.ObjectId, ref: 'khachhang' },
  sanpham: [
    {
      sp: { type: mongoose.Schema.Types.ObjectId, ref: 'sanpham' },
      dongia: { type: Number }
    }
  ],
  method: { type: String },
  soluong: { type: Number },
  date: { type: Date },
  tongtien: { type: Number },
  nganhang: { type: mongoose.Schema.Types.ObjectId, ref: 'nganhang' },
  dongia: { type: Number },
  datcoc: { type: Number },
  tienkhachtra: { type: Number },
  tientralaikhach: { type: Number },
  ghino: { type: Boolean, default: false },
  congno: { type: mongoose.Schema.Types.ObjectId, ref: 'congno' }
})

const HoaDon = mongoose.model('hoadon', hoadonSchema)
module.exports = HoaDon

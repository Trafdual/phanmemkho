const mongoose = require('mongoose')

const loaisanphamSchema = new mongoose.Schema({
  malsp: { type: String },
  name: { type: String },
  sanpham: [{ type: mongoose.Schema.Types.ObjectId, ref: 'sanpham' }],
  tongtien: { type: Number },
  date: { type: Date },
  average: { type: Number },
  soluong: { type: Number },
  nhacungcap: { type: mongoose.Schema.Types.ObjectId, ref: 'nhacungcap' },
  depot: { type: mongoose.Schema.Types.ObjectId, ref: 'depot' },
  ghino: { type: Boolean, default: false },
  method:{type:String},
  nganhang:{type: mongoose.Schema.Types.ObjectId, ref: 'nganhang'},
  conlai:{type:Number},
  trano:{type: mongoose.Schema.Types.ObjectId, ref: 'trano'}
})
const LoaiSanPham = mongoose.model('loaisanpham', loaisanphamSchema)
module.exports = LoaiSanPham

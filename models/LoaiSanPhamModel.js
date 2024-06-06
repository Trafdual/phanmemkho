const mongoose = require('mongoose');

const loaisanphamSchema = new mongoose.Schema({
name:{type:String},
depot:{type: mongoose.Schema.Types.ObjectId, ref: 'depot'},
sanpham:[{type: mongoose.Schema.Types.ObjectId, ref: 'sanpham'}]
});
const LoaiSanPham = mongoose.model('loaisanpham', loaisanphamSchema);
module.exports = LoaiSanPham;
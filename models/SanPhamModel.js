const mongoose = require('mongoose');

const sanphamSchema = new mongoose.Schema({
name:{type:String},
imel:{type:String},
capacity:{type:String},
color:{type:String},
loaisanpham:{type:mongoose.Schema.Types.ObjectId, ref:'loaisanpham'},
datenhap:{type:Date},
datexuat:{type:Date},
});

const SanPham = mongoose.model('sanpham', sanphamSchema);
module.exports = SanPham;
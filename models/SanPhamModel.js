const mongoose = require('mongoose');

const sanphamSchema = new mongoose.Schema({
name:{type:String},
imel:{type:String},
capacity:{type:String},
depot:{type: mongoose.Schema.Types.ObjectId, ref: 'depot'},
});

const SanPham = mongoose.model('sanpham', sanphamSchema);
module.exports = SanPham;
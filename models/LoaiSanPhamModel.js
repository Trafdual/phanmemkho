const mongoose = require('mongoose');

const loaisanphamSchema = new mongoose.Schema({
    name: { type: String },
    depot: { type: mongoose.Schema.Types.ObjectId, ref: 'depot' },
    sanpham: [{ type: mongoose.Schema.Types.ObjectId, ref: 'sanpham' }],
    tongtien: { type: Number },
    date: { type: Date },
    average: { type: Number },
    soluong: { type: Number },
    nhacungcap: [{ type: mongoose.Schema.Types.ObjectId, ref: 'nhacungcap' }],
});
const LoaiSanPham = mongoose.model('loaisanpham', loaisanphamSchema);
module.exports = LoaiSanPham;
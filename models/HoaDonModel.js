const mongoose = require('mongoose');

const hoadonSchema = new mongoose.Schema({
nhanvien:{type: mongoose.Schema.Types.ObjectId, ref: 'user'},
khachhang:{type: mongoose.Schema.Types.ObjectId, ref: 'khachhang'},
loaisanpham: [
    {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "loaisanpham" },
      soluong: { type: Number }
    }
  ],
date:{type:Date},
tongtien:{type:Number}
});

const HoaDon = mongoose.model('hoadon', hoadonSchema);
module.exports = HoaDon;
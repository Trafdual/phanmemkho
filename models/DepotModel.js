const mongoose = require('mongoose');

const depotSchema = new mongoose.Schema({
    name: { type: String },
    address: { type: String },
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    loaisanpham: [{ type: mongoose.Schema.Types.ObjectId, ref: 'loaisanpham' }],
    khachang: [{ type: mongoose.Schema.Types.ObjectId, ref: 'khachhang' }]
});
const DePot = mongoose.model('depot', depotSchema);
module.exports = DePot;
const mongoose = require('mongoose');

const depotSchema = new mongoose.Schema({
name:{type:String},
address:{type:String},
company:{type: mongoose.Schema.Types.ObjectId, ref: 'company'},
user:[{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
sanpham:[{type: mongoose.Schema.Types.ObjectId, ref: 'sanpham'}]
});

const DePot = mongoose.model('depot', depotSchema);
module.exports = DePot;
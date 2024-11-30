const mongoose = require('mongoose')

const skuschema = new mongoose.Schema({
  masku: { type: String },
  name: { type: String },
  dungluong:[{ type: mongoose.Schema.Types.ObjectId, ref: 'dungluong' }],
  userId:{type: mongoose.Schema.Types.ObjectId, ref: 'user'},
  sanpham:[{type:mongoose.Schema.Types.ObjectId, ref: 'sanpham'}]
})

const skus = mongoose.model('sku', skuschema)
module.exports = skus
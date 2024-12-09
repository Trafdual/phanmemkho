const mongoose = require('mongoose')

const thuchiSchema = new mongoose.Schema({
  date: { type: Date },
  mathuchi: { type: String },
  loaichungtu: { type: String },
  tongtien: { type: Number },
  doituong: { type: String },
  lydo: { type: String },
  method: { type: String },
  loaitien: { type: String },
  depot: { type: mongoose.Schema.Types.ObjectId, ref: 'depot' }
})

const ThuChi = mongoose.model('thuchi', thuchiSchema)
module.exports = ThuChi

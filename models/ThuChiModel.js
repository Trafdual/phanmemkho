const mongoose = require('mongoose')

const thuchiSchema = new mongoose.Schema({
  date: { type: Date },
  mathuchi: { type: String },
  loaichungtu: { type:mongoose.Schema.Types.ObjectId,ref:'loaichungtu'},
  tongtien: { type: Number },
  doituong: { type: mongoose.Schema.Types.ObjectId, ref: 'nhacungcap' },
  lydo: { type: String },
  method: { type: String },
  loaitien: { type: String },
  depot: { type: mongoose.Schema.Types.ObjectId, ref: 'depot' },
  chitiet: [
    {
      diengiai: { type: String },
      sotien: { type: Number },
      mucthuchi: { type: mongoose.Schema.Types.ObjectId, ref: 'mucthuchi' }
    }
  ]
})

const ThuChi = mongoose.model('thuchi', thuchiSchema)
module.exports = ThuChi

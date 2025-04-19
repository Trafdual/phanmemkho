const mongoose = require('mongoose')

const mucthuchiSchema = new mongoose.Schema({
  mamuc: { type: String },
  name: { type: String },
  loaimuc: { type: String },
  thuchi: [{ type: mongoose.Schema.Types.ObjectId, ref: 'thuchi' }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  status: { type: Number, default: 1 }
})
const MucThuChi = mongoose.model('mucthuchi', mucthuchiSchema)
module.exports = MucThuChi

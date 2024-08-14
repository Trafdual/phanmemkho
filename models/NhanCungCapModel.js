const mongoose = require('mongoose')

const nhacungcapSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  depotId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'depot' }]
})
const NhanCungCap = mongoose.model('nhacungcap', nhacungcapSchema)
module.exports = NhanCungCap

const mongoose = require('mongoose')

const theloaitrogiupSchema = new mongoose.Schema({
  name: { type: String },
  namekhongdau: { type: String },
  trogiup: [{ type: mongoose.Schema.Types.ObjectId, ref: 'trogiup' }]
})
const TheloaiTrogiup = mongoose.model('theloaitrogiup', theloaitrogiupSchema)
module.exports = TheloaiTrogiup

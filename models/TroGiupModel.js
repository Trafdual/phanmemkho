const mongoose = require('mongoose')

const trogiupSchema = new mongoose.Schema({
  tieude:{type:String},
  noidung:{type:String},
  image:{type:String}
})
const TroGiup = mongoose.model('trogiup', trogiupSchema)
module.exports = TroGiup

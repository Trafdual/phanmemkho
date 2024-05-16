const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
name:{type:String},
email:{type:String},
phone:{type:String},
company:{type: mongoose.Schema.Types.ObjectId, ref: 'company'},
role: { type: String, enum: ['admin', 'staff','manager'], default: 'admin' },
});

const User = mongoose.model('user', userSchema);
module.exports = User;
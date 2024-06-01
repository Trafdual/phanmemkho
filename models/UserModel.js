const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
name:{type:String},
password:{type:String},
email:{type:String},
phone:{type:String},
company:{type: mongoose.Schema.Types.ObjectId, ref: 'company'},
date:{type:Date},
role: { type: String, enum: ['admin', 'staff','manager'], default: 'manager' },
otp: { type: String }, // Thêm trường này để lưu mã OTP
isVerified: { type: Boolean, default: false } // Thêm trường này để lưu trạng thái xác minh
});

const User = mongoose.model('user', userSchema);
module.exports = User;
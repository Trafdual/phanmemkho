const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String },
    password: { type: String },
    email: { type: String },
    phone: { type: String },
    depot: [{ type: mongoose.Schema.Types.ObjectId, ref: 'depot' }],
    birthday: { type: Date },
    date: { type: Date },
    role: { type: String, enum: ['admin', 'staff', 'manager'], default: 'manager' },
    otp: { type: String }, // Thêm trường này để lưu mã OTP
    otpCreatedAt: { type: Date },
    isVerified: { type: Boolean, default: false },
    isActivity: { type: Boolean, default: true },
    nganhangkho:[{type: mongoose.Schema.Types.ObjectId, ref: 'nganhang'}],
    sku:[{type: mongoose.Schema.Types.ObjectId, ref: 'sku'}],
});

const User = mongoose.model('user', userSchema);
module.exports = User;
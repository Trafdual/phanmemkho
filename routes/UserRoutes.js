const router = require("express").Router();
const User = require('../models/UserModel')
const bcrypt = require("bcryptjs");
const multer = require('multer')
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const momenttimezone = require('moment-timezone');
const moment = require('moment');
const firebase = require('firebase-admin')
const nodemailer = require('nodemailer');
firebase.initializeApp({
    credential: firebase.credential.cert(require('../appgiapha-firebase-adminsdk-z9uh9-aa3fef5e78.json'))
})
const AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: 'AKIATBPL3NPE3ATWZEWR',
    secretAccessKey: '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',
    region: 'ap-southeast-1'
});
const sns = new AWS.SNS();
let transporter = nodemailer.createTransport({
    service: 'gmail', // hoặc bất kỳ dịch vụ email nào bạn sử dụng
    auth: {
        user: 'your-email@gmail.com', // Email của bạn
        pass: 'your-email-password' // Mật khẩu của bạn
    }
});


const storage = multer.memoryStorage();

const upload = multer({ storage: storage });
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const checkAuth = (req, res, next) => {
    if (!req.session.token) {
        return res.redirect('/');
    }
    try {
        const decoded = jwt.verify(req.session.token, 'mysecretkey', { expiresIn: '1h' });
        req.userData = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            req.session.destroy();
            return res.redirect('/');
        } else {
            console.error(error);
            return res.status(500).json({ message: 'Đã xảy ra lỗi.' });
        }
    }
};

function decrypt(encrypted) {
    const iv = Buffer.from(encrypted.iv, 'hex');
    const key = Buffer.from(encrypted.key, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted.content, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

router.post('/register', async(req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;
        const vietnamTime = momenttimezone().toDate();
        // Kiểm tra số điện thoại
        if (!phone || !/^\d{10}$/.test(phone)) {
            return res.json({ message: 'Số điện thoại không hợp lệ' });
        }

        if (!emailRegex.test(email)) {
            return res.json({ message: 'email không hợp lệ' });
        }

        const exitphone = await User.findOne({ phone });

        const existingemail = await User.findOne({ email });
        if (existingemail) {
            return res.json({ message: 'email này đã được đăng kí' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);


        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            phone,
            date: vietnamTime,
            isVerified: false,
        });

        await user.save();

        const responseData = {
            success: user.success,
            data: {
                user: [{
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    role: user.role,
                    phone: user.phone,
                    date: moment(user.date).format('DD/MM/YYYY HH:mm:ss')
                }, ],
            },
        };

        res.json(responseData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi.' });
    }
});

router.post('/sendemail/:id', async(req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        const otpCreatedAt = new Date();
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Tạo mã OTP ngẫu nhiên

        if (!user) {
            return res.status(400).json({ message: 'Người dùng không tồn tại.' });
        }
        user.otp = otp;
        user.otpCreatedAt = otpCreatedAt;
        await user.save();
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'trafdual0810@gmail.com',
                pass: 'pjrg xxdq cyfs zosf'
            }
        });
        const mailOptions = {
            from: 'trafdual0810@gmail.com',
            to: user.email,
            subject: 'Mã OTP của bạn',
            text: `Mã OTP của bạn là: ${user.otp}`
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: 'gửi thành công' })
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi xác minh mã OTP.' });
    }
})

router.get('/getregister', async(req, res) => {
    res.render('register')
})

router.post('/register/:id', async(req, res) => {
    try {
        const id = req.params.id;
        const { otp } = req.body;
        // Tìm người dùng bằng ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ message: 'Người dùng không tồn tại.' });
        }

        const currentTime = new Date();
        const otpCreationTime = new Date(user.otpCreatedAt);
        const timeDifference = currentTime - otpCreationTime;

        if (user.otp !== otp) {
            return res.json({ message: 'Bạn đã nhập sai mã OTP.' });

        }
        if (timeDifference > 60 * 1000) {
            return res.json({ message: 'Mã OTP đã hết hạn.' });
        }

        user.isVerified = true;
        user.otp = undefined; // Xóa mã OTP sau khi xác minh
        user.otpCreatedAt = null;
        await user.save();

        res.json({ message: 'thành công.' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi xác minh mã OTP.' });
    }
});

router.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        const encryptedPassword = JSON.parse(user.password);
        if (!isPasswordValid) {
            const isPasswordValidCrypto = decrypt(encryptedPassword) === password;

            if (!isPasswordValidCrypto) {
                return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
            }
        }
        const accountCreationTime = moment(user.date);
        const currentTime = moment();
        const differenceInMinutes = currentTime.diff(accountCreationTime, 'months');

        // Kiểm tra nếu khoảng thời gian lớn hơn 10 phút
        if (differenceInMinutes > 8) {
            return res.status(401).json({ message: 'Tài khoản bạn đã hết hạn.' });
        }
        const responseData = {
            success: user.success,
            data: {
                user: [{
                    _id: user._id,
                    username: user.username,
                    password: user.password,
                    role: user.role,
                    date: moment(user.date).format('DD/MM/YYYY HH:mm:ss')
                }, ],
            },
        };

        const token = jwt.sign({ userId: user._id, role: user.role }, 'mysecretkey');
        responseData.token = token;
        res.status(200).json(responseData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi.' });
    }
})


router.get('/user', async(req, res) => {
    try {
        const user = await User.find().lean();
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi.' });
    }
})
router.post('/deletePhone', async(req, res) => {
    try {
        const { phone } = req.body;

        // Kiểm tra số điện thoại hợp lệ
        if (!phone || !/^\d{10}$/.test(phone)) {
            return res.status(400).json({ message: 'Số điện thoại không hợp lệ' });
        }

        // Chuyển đổi số điện thoại sang định dạng quốc tế
        const phoneNumber = `+84${phone.slice(1)}`;

        // Tìm người dùng qua số điện thoại
        const userRecord = await firebase.auth().getUserByPhoneNumber(phoneNumber);

        // Xóa người dùng
        await firebase.auth().deleteUser(userRecord.uid);

        res.status(200).json({ message: 'Đã xóa số điện thoại khỏi hệ thống Firebase.' });
    } catch (error) {
        console.error('Error deleting user:', error);
        if (error.code === 'auth/user-not-found') {
            return res.status(404).json({ message: 'Không tìm thấy người dùng với số điện thoại này.' });
        }
        res.status(500).json({ message: 'Đã xảy ra lỗi.' });
    }
});

router.get('/test', async(req, res) => {
    res.render('testOTP');
})

router.post('/loginadmin', async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.render('login', {
                UserError: 'Email này không đúng'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const encryptedPassword = JSON.parse(user.password);
            const isPasswordValidCrypto = decrypt(encryptedPassword) === password;

            if (!isPasswordValidCrypto) {
                return res.render('login', {
                    PassError: 'Mật khẩu không đúng'
                });
            }

        }

        if (user.role === 'admin') {
            const token = jwt.sign({ userId: user._id, role: user.role }, 'mysecretkey', { expiresIn: '1h' });
            req.session.userId = user._id;
            req.session.token = token;
            req.session.depotId = user.depot;
            return res.redirect('/admin')
        } else if (user.role === 'manager') {
            const token = jwt.sign({ userId: user._id, role: user.role }, 'mysecretkey', { expiresIn: '1h' });
            req.session.userId = user._id;
            req.session.token = token;
            req.session.depotId = user.depot;
            return res.redirect('/manager')
        } else if (user.role === 'staff') {
            const token = jwt.sign({ userId: user._id, role: user.role }, 'mysecretkey', { expiresIn: '1h' });
            req.session.userId = user._id;
            req.session.token = token;
            req.session.depotId = user.depot;
            return res.redirect('/manager')
        } else {
            return res.render('login', {
                RoleError: 'Bạn không có quyền truy cập trang web'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi.' });
    }
});

router.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ message: 'Email không đúng.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.json({ message: 'Mật khẩu không đúng.' });
        }

        const responseData = {
            success: user.success,
            data: {
                user: [{
                    _id: user._id,
                    email: user.email,
                    phone: user.phone,
                    password: user.password,
                    role: user.role,
                    depotId: user.depot,
                    date: user.date
                }, ],
            },
        };

        const token = jwt.sign({ userId: user._id, role: user.role }, 'mysecretkey');
        responseData.token = token;
        res.status(200).json(responseData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi.' });
    }
});

router.get('/manager', checkAuth, async(req, res) => {
    res.render('manager');
})

router.get('/', async(req, res) => {
    res.render('login')
})


module.exports = router;
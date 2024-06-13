const router = require("express").Router();
const User = require('../models/UserModel')
const Depot = require('../models/DepotModel')
const crypto = require('crypto');
const momenttimezone = require('moment-timezone');
const moment = require('moment');

function encrypt(text) {
    const key = crypto.randomBytes(32); // Khóa ngẫu nhiên 32 byte
    const iv = crypto.randomBytes(16); // IV ngẫu nhiên 16 byte
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
        iv: iv.toString('hex'),
        key: key.toString('hex'),
        content: encrypted
    };
}

// Hàm giải mã
function decrypt(encrypted) {
    const iv = Buffer.from(encrypted.iv, 'hex');
    const key = Buffer.from(encrypted.key, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted.content, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/postnhanvien', async(req, res) => {
    try {
        const depotId = req.session.depotId;
        const vietnamTime = momenttimezone().toDate();
        const { name, email, password, phone, birthday } = req.body;

        if (!phone || !/^\d{10}$/.test(phone)) {
            return res.json({ message: 'Số điện thoại không hợp lệ' });
        }

        if (!emailRegex.test(email)) {
            return res.json({ message: 'Email không hợp lệ' });
        }

        const exitphone = await User.findOne({ phone });
        const existingemail = await User.findOne({ email });

        if (existingemail) {
            return res.json({ message: 'Email này đã được đăng ký' });
        }

        const encryptedPassword = encrypt(password);

        if (exitphone) {
            return res.json({ message: 'Số điện thoại đã tồn tại trong hệ thống' });
        }

        const user = new User({
            name,
            email,
            password: JSON.stringify(encryptedPassword),
            phone,
            date: vietnamTime,
            isVerified: false,
            birthday
        });
        user.role = 'staff';
        user.depot = depotId;
        const depot = await Depot.findById(depotId);
        depot.user.push(user._id);
        await user.save();
        await depot.save();

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
                }, ],
            },
        };

        res.json(responseData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi.' });
    }
});

router.post('/putnhanvien/:userId', async(req, res) => {
    try {
        const userId = req.params.userId;
        const { name, email, password, phone, birthday, date } = req.body;
        const user = await User.findById(userId);
        if (!phone || !/^\d{10}$/.test(phone)) {
            return res.json({ message: 'Số điện thoại không hợp lệ' });
        }

        if (!emailRegex.test(email)) {
            return res.json({ message: 'Email không hợp lệ' });
        }

        const exitphone = await User.findOne({ phone, _id: { $ne: userId } });
        const existingemail = await User.findOne({ email, _id: { $ne: userId } });

        if (existingemail) {
            return res.json({ message: 'Email này đã được đăng ký' });
        }
        if (exitphone) {
            return res.json({ message: 'Số điện thoại đã tồn tại trong hệ thống' });
        }
        const encryptedPassword = encrypt(password);
        user.name = name;
        user.email = email;
        user.password = JSON.stringify(encryptedPassword);
        user.phone = phone;
        user.date = date;
        user.birthday = birthday
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
                }, ],
            },
        };

        res.json(responseData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi.' });
    }
});

router.post('/postnhanvien/:depotId', async(req, res) => {
    try {
        const depotId = req.params.depotId;
        const vietnamTime = momenttimezone().toDate();
        const { name, email, password, phone, birthday } = req.body;

        if (!phone || !/^\d{10}$/.test(phone)) {
            return res.json({ message: 'Số điện thoại không hợp lệ' });
        }

        if (!emailRegex.test(email)) {
            return res.json({ message: 'Email không hợp lệ' });
        }

        const exitphone = await User.findOne({ phone });
        const existingemail = await User.findOne({ email });

        if (existingemail) {
            return res.json({ message: 'Email này đã được đăng ký' });
        }

        const encryptedPassword = encrypt(password);

        if (exitphone) {
            return res.json({ message: 'Số điện thoại đã tồn tại trong hệ thống' });
        }

        const user = new User({
            name,
            email,
            password: JSON.stringify(encryptedPassword),
            phone,
            date: vietnamTime,
            isVerified: false,
            birthday,
        });
        user.role = 'staff';
        user.depot = depotId;
        const depot = await Depot.findById(depotId);
        depot.user.push(user._id);
        await user.save();
        await depot.save();

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
                }, ],
            },
        };

        res.json(responseData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi.' });
    }
});

router.get('/getnhanvienjson', async(req, res) => {
    try {
        const depotId = req.session.depotId;
        const depot = await Depot.findById(depotId);
        const nhanvien = [];
        await Promise.all(depot.user.map(async(nv) => {
            const staff = await User.findById(nv._id);

            if (staff && staff.role === 'staff' && staff.isActivity === true) {
                const encryptedPassword = JSON.parse(staff.password);
                nhanvien.push({
                    _id: staff._id,
                    name: staff.name,
                    email: staff.email,
                    phone: staff.phone,
                    password: decrypt(encryptedPassword),
                    role: staff.role,
                    birthday: moment(staff.birthday).format('DD/MM/YYYY'),
                    date: moment(staff.date).format('DD/MM/YYYY')
                });
            }
        }));
        res.json(nhanvien);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi.' });
    }
})
router.get('/getnhanvienjson/:depotId', async(req, res) => {
    try {
        const depotId = req.params.depotId;
        const depot = await Depot.findById(depotId);
        const nhanvien = [];
        await Promise.all(depot.user.map(async(nv) => {
            const staff = await User.findById(nv._id);

            if (staff && staff.role === 'staff') {
                const encryptedPassword = JSON.parse(staff.password);
                nhanvien.push({
                    _id: staff._id,
                    name: staff.name,
                    email: staff.email,
                    password: decrypt(encryptedPassword),
                    role: staff.role,
                    birthday: moment(staff.birthday).format('DD/MM/YYYY'),
                    date: moment(staff.date).format('DD/MM/YY')
                });
            }
        }));
        res.json(nhanvien);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi.' });
    }
})
router.get('/nhanvienweb', async(req, res) => {
    try {
        res.render('nhanvien');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi.' });
    }
})

router.post('/ngunghoatdongnhanvien/:userId', async(req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        user.isActivity = false;
        await user.save();
        res.json({ message: 'ngừng hoạt động thành công' })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi.' });
    }
});
module.exports = router
const router = require("express").Router();
const User = require('../models/UserModel')
const bcrypt = require("bcryptjs");
const multer = require('multer')
const jwt = require('jsonwebtoken');

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/register', async (req, res) => {
    try {
      const { name,email, password, role, phone } = req.body;
  
      // Kiểm tra số điện thoại
      if (!phone || !/^\d{10}$/.test(phone)) {
        return res.status(400).json({ message: 'Số điện thoại không hợp lệ' });
      }

      if(!emailRegex.test(email)){
        return res.status(400).json({ message: 'email không hợp lệ' });
      }

      const exitphone = await User.findOne({ phone });
      if (exitphone) {
        return res.status(400).json({ message: 'số điện thoại đã được đăng kí' });
      }
  
      const existingUser = await User.findOne({ name });
      if (existingUser) {
        return res.status(400).json({ message: 'Tên người dùng đã tồn tại' });
      }
      const existingemail = await User.findOne({ email });
      if (existingemail) {
        return res.status(400).json({ message: 'email này đã được đăng kí' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = new User({ name,email, password: hashedPassword, role, phone });
      await user.save();
  
      const responseData = {
        success: user.success,
        data: {
          user: [
            {
              _id: user._id,
              name: user.name,
              email:user.email,
              password: user.password,
              role: user.role,
              coin: user.coin,
              phone: user.phone,
              __v: user.__v,
            },
          ],
        },
      };
  
      res.status(201).json(responseData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Đã xảy ra lỗi.' });
    }
  });

  router.get('/user',async(req,res)=>{
    try {
      const user=await User.find().lean();
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Đã xảy ra lỗi.' });
    }
  })

module.exports=router;

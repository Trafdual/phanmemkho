const router = require('express').Router()
const User = require('../models/UserModel')
const Depot = require('../models/DepotModel')
const bcrypt = require('bcryptjs')
const multer = require('multer')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const momenttimezone = require('moment-timezone')
const moment = require('moment')
const firebase = require('firebase-admin')
const nodemailer = require('nodemailer')
const passport = require('passport')
const axios = require('axios')
const NhanVien = require('../models/NhanVienModel')
const mongoose = require('mongoose')

function isJSON (str) {
  if (typeof str !== 'string') return false

  try {
    const parsed = JSON.parse(str)
    return typeof parsed === 'object' && parsed !== null
  } catch (e) {
    return false
  }
}

firebase.initializeApp({
  credential: firebase.credential.cert(
    require('../appgiapha-firebase-adminsdk-z9uh9-aa3fef5e78.json')
  )
})
const AWS = require('aws-sdk')
AWS.config.update({
  accessKeyId: 'AKIATBPL3NPE3ATWZEWR',
  secretAccessKey: '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',
  region: 'ap-southeast-1'
})
const sns = new AWS.SNS()

const storage = multer.memoryStorage()

const upload = multer({ storage: storage })
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const checkAuth = (req, res, next) => {
  if (!req.session.token) {
    return res.json({ message: 'hết hạn' })
  }
  try {
    const decoded = jwt.verify(req.session.token, 'mysecretkey', {
      expiresIn: '1h'
    })
    req.userData = decoded
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      req.session.destroy()
      return res.json({ message: 'lỗi' })
    } else {
      console.error(error)
      return res.status(500).json({ message: 'Đã xảy ra lỗi.' })
    }
  }
}

function decrypt (encrypted) {
  const iv = Buffer.from(encrypted.iv, 'hex')
  const key = Buffer.from(encrypted.key, 'hex')
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
  let decrypted = decipher.update(encrypted.content, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

router.get('/', async (req, res) => {
  res.render('logintest')
})

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    req.session.userId = req.user._id // Lưu user ID vào session
    req.session.token = jwt.sign(
      { userId: req.user._id, role: req.user.role },
      'mysecretkey',
      { expiresIn: '1h' }
    )
    req.session.depotId = req.user.depot // Lưu depot ID vào session (nếu có)
    if (req.user.phone) {
      res.redirect('/manager')
    } else {
      res.redirect('/taokho') // Chuyển hướng đến trang yêu cầu nhập số điện thoại
    }
  }
)

router.get(
  '/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
)

router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
    req.session.userId = req.user._id // Lưu user ID vào session
    req.session.token = jwt.sign(
      { userId: req.user._id, role: req.user.role },
      'mysecretkey',
      { expiresIn: '1h' }
    )
    req.session.depotId = req.user.depot // Lưu depot ID vào session (nếu có)
    if (req.user.phone) {
      res.redirect('/manager')
    } else {
      res.redirect('/taokho') // Chuyển hướng đến trang yêu cầu nhập số điện thoại
    }
  }
)

router.post('/taokho', async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const { phone } = req.body
      const { name, address } = req.body
      if (!/^\d{10}$/.test(phone)) {
        return res.status(400).send('Số điện thoại không hợp lệ')
      }
      const depot = new Depot({
        name,
        address
      })
      req.user.phone = phone
      req.user.depot = depot._id
      depot.user.push(req.user._id)
      await depot.save()
      await req.user.save()
      const token = jwt.sign(
        { userId: req.user._id, role: req.user.role },
        'mysecretkey',
        { expiresIn: '1h' }
      )
      req.session.userId = req.user._id
      req.session.token = token
      req.session.depotId = req.user.depot
      res.redirect('/manager')
    } else {
      res.redirect('/test')
    }
  } catch (error) {
    console.error('Error verifying OTP:', error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/registeradmin', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body
    const vietnamTime = momenttimezone().toDate()
    if (!phone || !/^\d{10}$/.test(phone)) {
      return res.json({ message: 'Số điện thoại không hợp lệ' })
    }

    if (!emailRegex.test(email)) {
      return res.json({ message: 'email không hợp lệ' })
    }

    const exitphone = await User.findOne({ phone })
    if (exitphone) {
      return res.json({ message: 'số điện thoại này đã được đăng kí' })
    }

    const existingemail = await User.findOne({ email })
    if (existingemail) {
      return res.json({ message: 'email này đã được đăng kí' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      date: vietnamTime,
      isVerified: false,
      role
    })

    await user.save()

    const responseData = {
      success: user.success,
      data: {
        user: [
          {
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
            phone: user.phone,
            date: moment(user.date).format('DD/MM/YYYY HH:mm:ss')
          }
        ]
      },
      message: 'thành công'
    }

    res.json(responseData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, birthday } = req.body
    const vietnamTime = momenttimezone().toDate()

    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthday)) {
      return res.json({ message: 'Ngày sinh không hợp lệ' })
    }

    if (!phone || !/^\d{10}$/.test(phone)) {
      return res.json({ message: 'Số điện thoại không hợp lệ' })
    }

    if (!emailRegex.test(email)) {
      return res.json({ message: 'email không hợp lệ' })
    }

    const exitphone = await User.findOne({ phone })
    if (exitphone) {
      return res.json({ message: 'số điện thoại này đã được đăng kí' })
    }

    const existingemail = await User.findOne({ email })
    if (existingemail) {
      return res.json({ message: 'email này đã được đăng kí' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      date: vietnamTime,
      isVerified: false,
      birthday,
      duyet: false
    })

    await user.save()

    const responseData = {
      success: user.success,
      data: {
        user: [
          {
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
            phone: user.phone,
            date: moment(user.date).format('DD/MM/YYYY HH:mm:ss')
          }
        ]
      },
      message: 'thành công'
    }

    await axios.post(`http://localhost:3015/sendemail/${user._id}`)

    res.json(responseData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/sendemail/:id', async (req, res) => {
  try {
    const id = req.params.id
    const user = await User.findById(id)
    const otpCreatedAt = new Date()
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    if (!user) {
      return res.status(400).json({ message: 'Người dùng không tồn tại.' })
    }
    user.otp = otp
    user.otpCreatedAt = otpCreatedAt
    await user.save()
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'trafdual0810@gmail.com',
        pass: 'pjrg xxdq cyfs zosf'
      }
    })
    const mailOptions = {
      from: '"BaoTech" <trafdual0810@gmail.com>',
      to: user.email,
      subject: '🔐 Xác thực tài khoản – Mã OTP của bạn',
      html: `
        <div style="background: #f5f8fa; padding: 40px 20px; font-family: 'Segoe UI', Roboto, sans-serif;">
          <div style="max-width: 600px; background: #fff; margin: auto; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;">
            <div style="background-color: #1a73e8; padding: 20px; text-align: center;">
              <img src="http://localhost:3015/LOGO.png" alt="BaoTech Logo" style="height: 50px;" />
              <h1 style="color: #ffffff; margin: 10px 0 0; font-size: 24px;">Mã xác thực OTP</h1>
            </div>
            <div style="padding: 30px;">
              <p style="font-size: 16px; color: #333;">Xin chào <strong>${user.name}</strong>,</p>
              <p style="font-size: 16px; color: #333;">Cảm ơn bạn đã đăng ký tài khoản tại <strong>BaoTech</strong>.</p>
              <p style="font-size: 16px; margin-bottom: 10px;">Dưới đây là mã OTP của bạn:</p>
              <div style="font-size: 36px; font-weight: bold; color: #1a73e8; text-align: center; letter-spacing: 2px; margin: 20px 0;">
                ${user.otp}
              </div>
              <p style="font-size: 14px; color: #555;">Mã OTP có hiệu lực trong vòng <strong>5 phút</strong>. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="#" style="display: inline-block; background: #1a73e8; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 16px;">Xác minh ngay</a>
              </div>
              <p style="font-size: 12px; color: #aaa; text-align: center;">Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
            </div>
            <div style="background: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #888;">
              Email này được gửi từ hệ thống tự động của <strong>BaoTech</strong>. Vui lòng không trả lời.
            </div>
          </div>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)
    res.json({ message: 'gửi thành công' })
  } catch (error) {
    console.error('Error verifying OTP:', error)
    res.status(500).json({ message: 'Đã xảy ra lỗi khi xác minh mã OTP.' })
  }
})

router.post('/resendemail/:email', async (req, res) => {
  try {
    const email = req.params.email
    const user = await User.findOne({ email })
    const otpCreatedAt = new Date()
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    if (!user) {
      return res.status(400).json({ message: 'Người dùng không tồn tại.' })
    }
    user.otp = otp
    user.otpCreatedAt = otpCreatedAt
    await user.save()
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'trafdual0810@gmail.com',
        pass: 'pjrg xxdq cyfs zosf'
      }
    })
    const mailOptions = {
      from: '"BaoTech" <trafdual0810@gmail.com>',
      to: user.email,
      subject: '🔐 Xác thực tài khoản – Mã OTP của bạn',
      html: `
        <div style="background: #f5f8fa; padding: 40px 20px; font-family: 'Segoe UI', Roboto, sans-serif;">
          <div style="max-width: 600px; background: #fff; margin: auto; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;">
            <div style="background-color: #1a73e8; padding: 20px; text-align: center;">
              <img src="http://localhost:3015/LOGO.png" alt="BaoTech Logo" style="height: 50px;" />
              <h1 style="color: #ffffff; margin: 10px 0 0; font-size: 24px;">Mã xác thực OTP</h1>
            </div>
            <div style="padding: 30px;">
              <p style="font-size: 16px; color: #333;">Xin chào <strong>${user.name}</strong>,</p>
              <p style="font-size: 16px; color: #333;">Cảm ơn bạn đã đăng ký tài khoản tại <strong>BaoTech</strong>.</p>
              <p style="font-size: 16px; margin-bottom: 10px;">Dưới đây là mã OTP của bạn:</p>
              <div style="font-size: 36px; font-weight: bold; color: #1a73e8; text-align: center; letter-spacing: 2px; margin: 20px 0;">
                ${user.otp}
              </div>
              <p style="font-size: 14px; color: #555;">Mã OTP có hiệu lực trong vòng <strong>5 phút</strong>. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="#" style="display: inline-block; background: #1a73e8; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 16px;">Xác minh ngay</a>
              </div>
              <p style="font-size: 12px; color: #aaa; text-align: center;">Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
            </div>
            <div style="background: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #888;">
              Email này được gửi từ hệ thống tự động của <strong>BaoTech</strong>. Vui lòng không trả lời.
            </div>
          </div>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)
    res.json({ message: 'gửi thành công' })
  } catch (error) {
    console.error('Error verifying OTP:', error)
    res.status(500).json({ message: 'Đã xảy ra lỗi khi xác minh mã OTP.' })
  }
})

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ error: 'Người dùng không tồn tại.' })
    }

    if (user.otp !== otp) {
      return res.status(400).json({ error: 'Mã OTP không chính xác.' })
    }

    const now = new Date()
    const otpExpiration = new Date(user.otpCreatedAt)
    otpExpiration.setMinutes(otpExpiration.getMinutes() + 5)

    if (now > otpExpiration) {
      return res.status(400).json({ error: 'Mã OTP đã hết hạn.' })
    }

    user.isVerified = true
    user.otp = null
    user.otpCreatedAt = null
    await user.save()

    return res.json({ message: 'Xác minh OTP thành công.' })
  } catch (error) {
    console.error('Lỗi khi xác minh OTP:', error)
    res.status(500).json({ message: 'Đã xảy ra lỗi khi xác minh OTP.' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body

    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }]
    })

    if (!user) {
      return res.json({ message: 'Email hoặc số điện thoại chưa được đăng ký' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.json({ message: 'Mật khẩu đăng nhập không đúng' })
    }

    const accountCreationTime = moment(user.date)
    const currentTime = moment()
    const differenceInMonths = currentTime.diff(accountCreationTime, 'months')
    if (differenceInMonths > 8) {
      return res.json({ message: 'Tài khoản của bạn đã hết hạn.' })
    }

    const responseData = {
      success: user.success,
      data: {
        user: [
          {
            _id: user._id,
            name: user.name,
            password: user.password,
            role: user.role,
            isVerified: user.isVerified,
            date: moment(user.date).format('DD/MM/YYYY HH:mm:ss')
          }
        ]
      }
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, 'mysecretkey')
    responseData.token = token
    res.json(responseData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/user', async (req, res) => {
  try {
    const user = await User.find().lean()
    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})
router.post('/deletePhone', async (req, res) => {
  try {
    const { phone } = req.body

    if (!phone || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: 'Số điện thoại không hợp lệ' })
    }

    const phoneNumber = `+84${phone.slice(1)}`

    const userRecord = await firebase.auth().getUserByPhoneNumber(phoneNumber)

    await firebase.auth().deleteUser(userRecord.uid)

    res
      .status(200)
      .json({ message: 'Đã xóa số điện thoại khỏi hệ thống Firebase.' })
  } catch (error) {
    console.error('Error deleting user:', error)
    if (error.code === 'auth/user-not-found') {
      return res
        .status(404)
        .json({ message: 'Không tìm thấy người dùng với số điện thoại này.' })
    }
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/test', async (req, res) => {
  res.render('testOTP')
})

router.post('/loginadmin', async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }]
    })

    if (!user) {
      return res.json({ message: 'Email hoặc số điện thoại chưa được đăng ký' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      let decryptedPassword = ''

      if (isJSON(user.password)) {
        const encryptedPassword = JSON.parse(user.password)
        decryptedPassword = decrypt(encryptedPassword)
      }

      if (decryptedPassword !== password) {
        return res.json({ message: 'Mật khẩu không chính xác' })
      }
    }

    const responseData = {
      success: user.success,
      data: {
        user: [
          {
            _id: user._id,
            name: user.name,
            role: user.role,
            isVerified: user.isVerified,
            date: moment(user.date).format('DD/MM/YYYY HH:mm:ss'),
            quyen: [],
            warning: ''
          }
        ]
      }
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      'mysecretkey',
      {
        expiresIn: '2h'
      }
    )

    responseData.token = token

    if (user.role === 'admin') {
      req.session.user = {
        _id: user._id,
        name: user.name,
        role: user.role
      }
      console.log('After login, session user:', req.session.user)

      return res.json(responseData)
    } else if (user.role === 'manager') {
      const accountCreationTime = moment(user.date)
      const expiryDate = accountCreationTime.add(1, 'years')
      const currentTime = moment()
      const daysRemaining = expiryDate.diff(currentTime, 'days')

      if (daysRemaining <= 15 && daysRemaining > 0) {
        responseData.data.user[0].warning = `Tài khoản của bạn sẽ hết hạn sau ${daysRemaining} ngày. Vui lòng gia hạn sớm.`
      } else if (daysRemaining <= 0) {
        return res.json({
          message:
            'Tài khoản của bạn đã hết hạn. Vui lòng liên hệ quản trị viên.'
        })
      }

      if (user.duyet === false) {
        return res.json({ message: 'Tài khoản của bạn đang chờ xét duyệt' })
      }
      req.session.user = {
        _id: user._id,
        name: user.name,
        role: user.role
      }
      console.log('After login, session user:', req.session.user)
      return res.json(responseData)
    } else {
      const nhanvien = await NhanVien.findOne({ user: user._id })

      const depot = await Depot.findById(nhanvien.depot)

      const admin = await User.findById(depot.user[0]._id)

      const accountCreationTime = moment(admin.date)
      const currentTime = moment()
      const expiryDate = accountCreationTime.add(1, 'years')
      const daysRemaining = expiryDate.diff(currentTime, 'days')

      if (daysRemaining <= 15 && daysRemaining > 0) {
        responseData.data.user[0].warning = `Tài khoản của bạn sẽ hết hạn sau ${daysRemaining} ngày. Vui lòng gia hạn sớm.`
      } else if (daysRemaining <= 0) {
        return res.json({
          message:
            'Tài khoản của bạn đã hết hạn. Vui lòng liên hệ quản trị viên.'
        })
      }

      if (nhanvien.khoa === true) {
        return res.json({ message: 'Tài khoản của bạn đã bị khóa' })
      }
      if (nhanvien.quyen.length === 0) {
        return res.json({ message: 'Bạn không có quyền truy cập trang web' })
      }
      responseData.data.user[0].quyen = nhanvien.quyen
      req.session.user = {
        _id: user._id,
        name: user.name,
        role: user.role
      }
      console.log('After login, session user:', req.session.user)

      return res.json(responseData)
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/clearalldata', async (req, res) => {
  try {
    const collections = mongoose.connection.collections

    for (const key in collections) {
      const collection = collections[key]
      await collection.deleteMany({})
    }

    res
      .status(200)
      .json({ message: 'Tất cả dữ liệu trong các collection đã được xóa.' })
  } catch (error) {
    console.error('Lỗi khi xóa dữ liệu:', error)
    res.status(500).json({ error: 'Lỗi khi xóa dữ liệu' })
  }
})

router.post('/duyetuser', async (req, res) => {
  try {
    const { ids } = req.body
    for (const id of ids) {
      const user = await User.findById(id)
      user.duyet = true
      await user.save()
    }
    res.json({ message: 'Duyệt thành công' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

module.exports = router

const router = require('express').Router()
const User = require('../models/UserModel')
const Depot = require('../models/DepotModel')
const crypto = require('crypto')
const momenttimezone = require('moment-timezone')
const moment = require('moment')
const NhanVien = require('../models/NhanVienModel')

function encrypt (text) {
  const key = crypto.randomBytes(32) // Khóa ngẫu nhiên 32 byte
  const iv = crypto.randomBytes(16) // IV ngẫu nhiên 16 byte
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return {
    iv: iv.toString('hex'),
    key: key.toString('hex'),
    content: encrypted
  }
}

// Hàm giải mã
function decrypt (encrypted) {
  const iv = Buffer.from(encrypted.iv, 'hex')
  const key = Buffer.from(encrypted.key, 'hex')
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
  let decrypted = decipher.update(encrypted.content, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

router.post('/postnhanvien/:depotid', async (req, res) => {
  try {
    const depotId = req.params.depotid
    const vietnamTime = momenttimezone().toDate()
    const { name, email, password, phone, birthday, hovaten, cccd, chucvu } =
      req.body

    if (!phone || !/^\d{10}$/.test(phone)) {
      return res.json({ message: 'Số điện thoại không hợp lệ' })
    }

    if (!emailRegex.test(email)) {
      return res.json({ message: 'Email không hợp lệ' })
    }

    const exitphone = await User.findOne({ phone })
    const existingemail = await User.findOne({ email })

    if (existingemail) {
      return res.json({ message: 'Email này đã được đăng ký' })
    }

    const encryptedPassword = encrypt(password)

    if (exitphone) {
      return res.json({ message: 'Số điện thoại đã tồn tại trong hệ thống' })
    }

    const nhanvien = new NhanVien({
      name: hovaten,
      depot: depotId,
      chucvu
    })
    nhanvien.manhanvien = 'NV' + nhanvien._id.toString().slice(-4)
    if (cccd) {
      nhanvien.cccd = cccd
    }

    const user = new User({
      name,
      email,
      password: JSON.stringify(encryptedPassword),
      phone,
      date: vietnamTime,
      isVerified: false,
      birthday
    })
    user.role = 'staff'
    nhanvien.user = user._id
    const depot = await Depot.findById(depotId)
    const admin = await User.findById(depot.user[0]._id)
    depot.user.push(user._id)
    user.depot = admin.depot
    user.sku = admin.sku
    user.nganhangkho = admin.nganhangkho
    user.mucthuchi = admin.mucthuchi
    user.loaichungtu = admin.loaichungtu
    user.nhomkhachhang = admin.nhomkhachhang
    admin.nhanvien.push(nhanvien._id)
    await user.save()
    await nhanvien.save()
    await admin.save()
    await depot.save()

    res.json(nhanvien)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/getnhanvien/:userid', async (req, res) => {
  try {
    const userid = req.params.userid
    const user = await User.findById(userid)

    let { page = 1, limit = 10, status } = req.query
    page = parseInt(page)
    limit = parseInt(limit)

    if (page < 1 || limit < 1) {
      return res.status(400).json({ message: 'Page và limit phải lớn hơn 0' })
    }

    let filteredNhanvien = await Promise.all(
      user.nhanvien.map(async nv => {
        const nhanvien = await NhanVien.findById(nv._id)
        if (!nhanvien) return null

        if (status === 'active' && nhanvien.khoa === true) return null
        if (status === 'locked' && nhanvien.khoa === false) return null

        return nhanvien._id
      })
    )

    filteredNhanvien = filteredNhanvien.filter(nv => nv !== null)

    const totalEmployees = filteredNhanvien.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedNhanvien = filteredNhanvien.slice(startIndex, endIndex)

    const nhanvien = await Promise.all(
      paginatedNhanvien.map(async nvId => {
        const nhanvien1 = await NhanVien.findById(nvId)
        const usernv = await User.findById(nhanvien1.user)
        const encryptedPassword = JSON.parse(usernv.password)

        return {
          _id: nhanvien1._id,
          manhanvien: nhanvien1.manhanvien,
          name: usernv.name,
          hovaten: nhanvien1.name,
          email: usernv.email,
          password: decrypt(encryptedPassword),
          phone: usernv.phone,
          birthday: moment(usernv.birthday).format('DD/MM/YYYY'),
          date: moment(usernv.date).format('HH:mm DD/MM/YYYY'),
          chucvu: nhanvien1.chucvu,
          khoa: nhanvien1.khoa,
          quyen: nhanvien1.quyen
        }
      })
    )

    res.json({
      total: totalEmployees,
      page,
      limit,
      totalPages: Math.ceil(totalEmployees / limit),
      data: nhanvien
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/khoanhanvien', async (req, res) => {
  try {
    const { ids } = req.body
    if (!ids || !Array.isArray(ids)) {
      return res
        .status(400)
        .json({ message: 'Danh sách nhân viên không hợp lệ.' })
    }

    const result = await NhanVien.updateMany(
      { _id: { $in: ids } },
      { $set: { khoa: true } }
    )

    res.json({
      message: 'Đã khóa nhân viên.',
      updatedCount: result.modifiedCount
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/mokhoanhanvien', async (req, res) => {
  try {
    const { ids } = req.body

    if (!ids || !Array.isArray(ids)) {
      return res
        .status(400)
        .json({ message: 'Danh sách nhân viên không hợp lệ.' })
    }

    const result = await NhanVien.updateMany(
      { _id: { $in: ids } },
      { $set: { khoa: false } }
    )

    res.json({
      message: 'Đã mở khóa nhân viên.',
      updatedCount: result.modifiedCount
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/addquyennv/:nhanvienid', async (req, res) => {
  try {
    const nhanvienid = req.params.nhanvienid
    let { quyen, userid } = req.body

    const validRoles = ['quanly', 'banhang', 'ketoan']

    if (!Array.isArray(quyen)) {
      quyen = [quyen]
    }

    quyen = quyen.filter(q => validRoles.includes(q))

    const user = await User.findById(userid)
    if (!user) {
      return res.status(404).json({ message: 'tài khoản không tồn tại.' })
    }

    const nhanvien = await NhanVien.findById(nhanvienid)
    if (!nhanvien) {
      return res.status(404).json({ message: 'Nhân viên không tồn tại.' })
    }

    const usernv = await User.findById(nhanvien.user)
    if (!usernv) {
      return res
        .status(404)
        .json({ message: 'tài khoản Nhân viên không tồn tại.' })
    }

    const quyenMoi = quyen.filter(q => !nhanvien.quyen.includes(q))
    if (quyenMoi.length > 0) {
      nhanvien.quyen.push(...quyenMoi)
      await nhanvien.save()
    }

    if (quyen.includes('ketoan') || quyen.includes('quanly')) {
      usernv.nhanvien = user.nhanvien
      await usernv.save()
    }

    res.json(nhanvien)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/removequyennv/:nhanvienid', async (req, res) => {
  try {
    const nhanvienid = req.params.nhanvienid
    let { quyen } = req.body

    if (!Array.isArray(quyen)) {
      quyen = [quyen]
    }

    const nhanvien = await NhanVien.findById(nhanvienid)
    if (!nhanvien) {
      return res.status(404).json({ message: 'Nhân viên không tồn tại.' })
    }

    nhanvien.quyen = nhanvien.quyen.filter(q => !quyen.includes(q))
    await nhanvien.save()

    res.json(nhanvien)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/quyennv/:nhanvienid', async (req, res) => {
  try {
    const nhanvienid = req.params.nhanvienid
    const nhanvien = await NhanVien.findById(nhanvienid)

    if (!nhanvien) {
      return res.status(404).json({ message: 'Nhân viên không tồn tại.' })
    }

    res.json({ quyen: nhanvien.quyen })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/chitietnv/:nhanvineid', async (req, res) => {
  try {
    const nhanvienid = req.params.nhanvineid
    const nhanvien = await NhanVien.findById(nhanvienid)
    const user = await User.findById(nhanvien.user)
    const nhanvienjson = {
      _id: nhanvien._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      birthday: moment(user.birthday).format('YYYY-MM-DD'),
      chucvu: nhanvien.chucvu,
      hovaten: nhanvien.name,
      password: decrypt(JSON.parse(user.password))
    }
    res.json(nhanvienjson)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})
router.post('/putnhanvien/:nhanvienid', async (req, res) => {
  try {
    const nhanvienid = req.params.nhanvienid
    const { name, phone, birthday, hovaten, cccd, chucvu, email } = req.body

    const nhanvien = await NhanVien.findById(nhanvienid)
    if (!nhanvien) {
      return res.status(404).json({ message: 'Nhân viên không tồn tại.' })
    }
    const user = await User.findById(nhanvien.user)

    if (name) user.name = name
    if (phone) user.phone = phone
    if (birthday) user.birthday = birthday
    if (hovaten) nhanvien.hovaten = hovaten
    if (cccd) nhanvien.cccd = cccd
    if (chucvu) nhanvien.chucvu = chucvu
    if (email) user.email = email

    await nhanvien.save()
    await user.save()

    res.json(nhanvien)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/doimknv/:nhanvienid', async (req, res) => {
  try {
    const nhanvienid = req.params.nhanvienid
    const { password } = req.body
    const nhanvien = await NhanVien.findById(nhanvienid)
    if (!nhanvien) {
      return res.status(404).json({ message: 'Nhân viên không tồn tại.' })
    }
    const encryptedPassword = encrypt(password)
    const user = await User.findById(nhanvien.user)
    user.password = JSON.stringify(encryptedPassword)
    await user.save()
    res.json(nhanvien)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

module.exports = router

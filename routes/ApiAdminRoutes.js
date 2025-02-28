const router = require('express').Router()
const User = require('../models/UserModel')
const Depot = require('../models/DepotModel')
const NganHang = require('../models/NganHangKhoModel')
const Sku = require('../models/SkuModel')
const MucThuChi = require('../models/MucThuChiModel')
const LoaiChungTu = require('../models/LoaiChungTuModel')
const NhomKhacHang = require('../models/NhomKhacHangModel')

router.get('/getuser/:iduser', async (req, res) => {
  try {
    const iduser = req.params.iduser
    const user = await User.find({
      _id: {
        $ne: iduser
      }
    }).lean()
    const userjson = await Promise.all(
      user.map(async u => {
        return {
          _id: u._id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          birthday: u.birthday,
          ngaydangky: u.date,
          role: u.role
        }
      })
    )
    res.json(userjson)
  } catch (error) {
    console.log(error)
  }
})

router.post('/registeradmin', async (req, res) => {
  try {
    const { name, email, password, phone, birthday, role } = req.body
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
      birthday: birthday,
      role
    })

    await user.save()

    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})
router.post('/deleteuser', async (req, res) => {
  try {
    const { ids } = req.body

  
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Danh sách ID không hợp lệ.' })
    }

    const users = await User.find({ _id: { $in: ids } })

    if (users.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' })
    }

    const depotIds = users.flatMap(user => user.depot.map(d => d._id))
    const nganhangkhoIds = users.flatMap(user =>
      user.nganhangkho.map(n => n._id)
    )
    const skuIds = users.flatMap(user => user.sku)
    const mucthuchiIds = users.flatMap(user => user.mucthuchi.map(m => m._id))
    const loaichungtuIds = users.flatMap(user =>
      user.loaichungtu.map(l => l._id)
    )
    const nhomkhachhangIds = users.flatMap(user =>
      user.nhomkhachhang.map(n => n._id)
    )

    const deleteOperations = [
      Depot.deleteMany({ _id: { $in: depotIds } }),
      NganHang.deleteMany({ _id: { $in: nganhangkhoIds } }),
      Sku.deleteMany({ _id: { $in: skuIds } }),
      MucThuChi.deleteMany({ _id: { $in: mucthuchiIds } }),
      LoaiChungTu.deleteMany({ _id: { $in: loaichungtuIds } }),
      NhomKhacHang.deleteMany({ _id: { $in: nhomkhachhangIds } }),
      User.deleteMany({ _id: { $in: ids } })
    ]

    await Promise.all(deleteOperations)

    res.json({ message: 'Xóa thành công.' })
  } catch (error) {
    console.error('Lỗi khi xóa người dùng:', error)
    res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình xử lý.' })
  }
})



module.exports = router

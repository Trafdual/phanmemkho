const router = require('express').Router()
const NhomKhacHang = require('../models/NhomKhacHangModel')
const User = require('../models/UserModel')
const NhanVien = require('../models/NhanVienModel')
router.get('/getnhomkhachhang/:userId', async (req, res) => {
  try {
    const userid = req.params.userId
    const user = await User.findById(userid)
    const nhomkhachhang = await Promise.all(
      user.nhomkhachhang.map(async nkh => {
        const nkh1 = await NhomKhacHang.findById(nkh._id)
        return {
          _id: nkh1._id,
          manhomkh: nkh1.manhomkh,
          name: nkh1.name
        }
      })
    )
    res.json(nhomkhachhang)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})
router.post('/postnhomkhachhang/:userId', async (req, res) => {
  try {
    const userId = req.params.userId
    const user = await User.findById(userId)
    const { name } = req.body
    const nhomkhachhang = new NhomKhacHang({ name })
    nhomkhachhang.manhomkh = 'NKH' + nhomkhachhang._id.toString().slice(-4)
    nhomkhachhang.user = user._id
    await nhomkhachhang.save()

    for (const nhanvien of user.nhanvien) {
      const nv = await NhanVien.findById(nhanvien._id)
      if (!nv) continue

      const usernv = await User.findById(nv.user)
      if (!usernv) continue

      usernv.nhomkhachhang.push(nhomkhachhang._id)
      await usernv.save()
    }

    user.nhomkhachhang.push(nhomkhachhang._id)
    await user.save()
    res.json(nhomkhachhang)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/deletenhomkh', async (req, res) => {
  try {
    const { ids } = req.body
    for (const id of ids) {
      const nhomkhachhang = await NhomKhacHang.findById(id)
      nhomkhachhang.status = -1
      await nhomkhachhang.save()
    }
    res.json({ message: 'xóa thành công' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

module.exports = router

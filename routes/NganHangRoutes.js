const router = require('express').Router()
const NganHang = require('../models/NganHangKhoModel')
const Depot = require('../models/DepotModel')
const User = require('../models/UserModel')
const NhanVien = require('../models/NhanVienModel')

router.post('/postnganhang/:userID', async (req, res) => {
  try {
    const { name, sotaikhoan, chusohuu } = req.body
    const userID = req.params.userID
    const user = await User.findById(userID)
    const nganhang = new NganHang({ name, sotaikhoan, chusohuu })
    const maNH = 'NHK' + nganhang._id.toString().slice(-4)
    nganhang.manganhangkho = maNH
    nganhang.user = user._id
    await nganhang.save()

    for (const nhanvien of user.nhanvien) {
      const nv = await NhanVien.findById(nhanvien._id)
      if (!nv) continue

      const usernv = await User.findById(nv.user)
      if (!usernv) continue

      usernv.nganhangkho.push(nganhang._id)
      await usernv.save()
    }

    user.nganhangkho.push(nganhang._id)
    await user.save()
    res.json(nganhang)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/getnganhang/:userId', async (req, res) => {
  try {
    const userId = req.params.userId
    const user = await User.findById(userId)
    const nganhang = await Promise.all(
      user.nganhangkho.map(async nganhang => {
        const nganHangkho = await NganHang.findOne({
          _id: nganhang._id,
          $or: [{ status: 1 }, { status: { $exists: false } }]
        })
        if (!nganHangkho) return null

        return {
          _id: nganHangkho._id,
          manganhangkho: nganHangkho.manganhangkho,
          name: nganHangkho.name,
          sotaikhoan: nganHangkho.sotaikhoan,
          chusohuu: nganHangkho.chusohuu
        }
      })
    )
    const filtered = nganhang.filter(item => item !== null)

    res.json(filtered)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/deletenganhang', async (req, res) => {
  try {
    const { ids } = req.body
    for (const id of ids) {
      const nganhang = await NganHang.findById(id)
      nganhang.status = -1
      await nganhang.save()
    }
    res.json({ message: 'xóa thành công' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

module.exports = router

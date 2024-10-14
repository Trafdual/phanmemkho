const router = require('express').Router()
const NganHang = require('../models/NganHangKhoModel')
const Depot = require('../models/DepotModel')
const User = require('../models/UserModel')

router.post('/postnganhang/:userID', async (req, res) => {
  try {
    const { name, sotaikhoan, chusohuu } = req.body
    const userID = req.params.userID
    const user = await User.findById(userID)
    const nganhang = new NganHang({ name, sotaikhoan, chusohuu })
    const maNH = 'NHK' + nganhang._id.toString().slice(-4)
    nganhang.manganhangkho = maNH
    user.nganhangkho.push(nganhang._id)
    nganhang.user = user._id
    await nganhang.save()
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
        const nganHangkho = await NganHang.findById(nganhang._id)
        return {
            _id:nganHangkho._id,
            manganhangkho:nganHangkho,
            name:nganHangkho.name,
            sotaikhoan:nganHangkho.sotaikhoan,
            chusohuu:nganHangkho.chusohuu
        }
      })
    )
    res.json(nganhang)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

module.exports = router

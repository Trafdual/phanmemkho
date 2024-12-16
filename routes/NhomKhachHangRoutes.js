const router = require('express').Router()
const NhomKhacHang = require('../models/NhomKhacHangModel')
const User = require('../models/UserModel')
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
    user.nhomkhachhang.push(nhomkhachhang._id)
    await nhomkhachhang.save()
    await user.save()
    res.json(nhomkhachhang)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

module.exports = router

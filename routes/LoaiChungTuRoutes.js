const router = require('express').Router()
const LoaiChungTu = require('../models/LoaiChungTuModel')
const User = require('../models/UserModel')

router.get('/getloaichungtu/:userId', async (req, res) => {
  try {
    const userId = req.params.userId
    const user = await User.findById(userId)
    const loaichungtu = await Promise.all(
      user.loaichungtu.map(async lct => {
        const lct1 = await LoaiChungTu.findById(lct._id)
        return {
          _id: lct1._id,
          maloaict: lct1.maloaict,
          name: lct1.name,
          method: lct1.method
        }
      })
    )
    res.json(loaichungtu)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/postloaichungtu/:userid', async (req, res) => {
  try {
    const userId = req.params.userid
    const { name, method } = req.body
    const user = await User.findById(userId)
    const loaichungtu = new LoaiChungTu({ name, method })
    loaichungtu.maloaict = 'LCT' + loaichungtu._id.toString().slice(-5)
    loaichungtu.user = user._id
    user.loaichungtu.push(loaichungtu._id)
    await loaichungtu.save()
    await user.save()
    res.json(loaichungtu)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})


module.exports = router

const router = require('express').Router()
const User = require('../models/UserModel')
const MucThuChi = require('../models/MucThuChiModel')
router.post('/postmucthuchi/:userid', async (req, res) => {
  try {
    const userid = req.params.userid
    const { name, loaimuc } = req.body
    const user = await User.findById(userid)
    const mucthuchi = new MucThuChi({ name, loaimuc })
    mucthuchi.mamuc = 'MTC' + mucthuchi.mamuc.toString().slice(-5)
    mucthuchi.user = user._id
    user.mucthuchi.push(mucthuchi._id)
    await mucthuchi.save()
    await user.save()
    res.json(mucthuchi)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/getmucthuchi/:userId', async (req, res) => {
  try {
    const userid = req.params.userId
    const user = await User.findById(userid)
    const mucthuchi = await Promise.all(
      user.mucthuchi.map(async muc => {
        const mtc = await MucThuChi.findById(muc._id)
        return {
          _id: mtc._id,
          mamuc: mtc.mamuc,
          name: mtc.name,
          loaimuc: mtc.loaimuc
        }
      })
    )
    res.json(mucthuchi)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

module.exports = router

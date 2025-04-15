const router = require('express').Router()
const User = require('../../models/UserModel')
const Depot = require('../../models/DepotModel')
const NganHang = require('../../models/NganHangKhoModel')
const Sku = require('../../models/SkuModel')
const MucThuChi = require('../../models/MucThuChiModel')
const LoaiChungTu = require('../../models/LoaiChungTuModel')
const NhomKhacHang = require('../../models/NhomKhacHangModel')

router.get('/getkhochua/:iduser', async (req, res) => {
  try {
    const iduser = req.params.iduser
    const user = await User.findById(iduser)
    const kho = await Promise.all(
      user.depot.map(async khochua => {
        const kho1 = await Depot.findById(khochua._id)
        return {
          _id: kho1._id,
          name: kho1.name,
          address: kho1.address,
          user: kho1.user.length
        }
      })
    )
    res.json(kho)
  } catch (error) {
    console.log(error)
  }
})

router.get('/getnhanvienadmin/:idkho', async (req, res) => {
  try {
    const idkho = req.params.idkho
    const kho = await Depot.findById(idkho)
    const user = await Promise.all(
      kho.user.map(async user => {
        const user1 = await User.findById(user._id)
        return {
          _id: user1._id,
          name: user1.name,
          email: user1.email,
          phone: user1.phone,
          birthday: user1.birthday,
          ngaydangky: user1.date,
          role: user1.role
        }
      })
    )
    res.json(user)
  } catch (error) {
    console.log(error)
  }
})



module.exports = router

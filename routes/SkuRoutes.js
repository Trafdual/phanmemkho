const router = require('express').Router()
const Sku = require('../models/SkuModel')
const DungLuongSku = require('../models/DungluongSkuModel')
const User = require('../models/UserModel')

router.get('/getdungluongsku/:userID', async (req, res) => {
  try {
    const userID = req.params.userID
    const user = await User.findById(userID)
    const skujson = await Promise.all(
      user.sku.map(async sk => {
        const sku = await Sku.findById(sk._id)
        const dungluong = await Promise.all(
          sku.dungluong.map(async dl => {
            const dungluong = await DungLuongSku.findById(dl._id)
            return {
              _id: dungluong._id,
              name: `${sku.name} (${dungluong.name})`,
              madungluong: dungluong.madungluong
            }
          })
        )
        return dungluong
      })
    )
    res.json(skujson.flat())
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/postsku/:iduser', async (req, res) => {
  try {
    const iduser = req.params.iduser
    const { name, namedungluong } = req.body

    const user = await User.findById(iduser).populate('sku')

    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại.' })
    }

    let lastSku = null
    if (user.sku.length > 0) {
      lastSku = await Sku.findById(user.sku[user.sku.length - 1])
    }

    let newSkuCode = 'SKU001'
    if (lastSku) {
      const lastCode = lastSku.masku.replace('SKU', '')
      const newCodeNumber = parseInt(lastCode) + 1
      newSkuCode = `SKU${newCodeNumber.toString().padStart(3, '0')}`
    }

    const sku = new Sku({
      name,
      masku: newSkuCode,
      dungluong: []
    })

    for (const dlName of namedungluong) {
      const dl = new DungLuongSku({ name: dlName })
      dl.madungluong = `${newSkuCode}-${dlName}`
      await dl.save()
      sku.dungluong.push(dl._id)
    }

    user.sku.push(sku._id)
    sku.userId = user._id
    await sku.save()
    await user.save()

    res.json(sku)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

module.exports = router

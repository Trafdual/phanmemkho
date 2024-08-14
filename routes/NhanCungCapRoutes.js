const router = require('express').Router()
const Depot = require('../models/DepotModel')
const moment = require('moment')
const NhanCungCap = require('../models/NhanCungCapModel')

router.post('/postnhacungcap/:depotId', async (req, res) => {
  try {
    const depotId = req.params.depotId
    const { name, email, phone, address } = req.body
    const nhaCungCap = new NhanCungCap({
      name,
      email,
      phone,
      address
    })

    nhaCungCap.depotId = depotId
    const depot = await Depot.findById(depotId)
    depot.nhacungcap.push(nhaCungCap._id)

    await depot.save()
    await nhaCungCap.save()
    res.json({ message: 'Thêm nhà cung cấp thành công' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra l��i' })
  }
})

router.get('/getnhacungcap/:depotId', async (req, res) => {
  try {
    const depotId = req.params.depotId
    const depot = await Depot.findById(depotId)
    const nhacungcap = await Promise.all(
      depot.nhacungcap.map(async nhacungcap => {
        const nhaCungCap = await NhanCungCap.findById(nhacungcap._id)
        return {
          _id: nhaCungCap._id,
          name: nhaCungCap.name,
          email: nhaCungCap.email,
          phone: nhaCungCap.phone,
          address: nhaCungCap.address
        }
      })
    )
    res.json(nhacungcap)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})



module.exports = router

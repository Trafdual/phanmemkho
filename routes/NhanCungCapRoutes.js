const router = require('express').Router()
const mongoose = require('mongoose')
const Depot = require('../models/DepotModel')
const NhanCungCap = require('../models/NhanCungCapModel')

router.post('/postnhacungcap/:depotId', async (req, res) => {
  try {
    const depotId = req.params.depotId
    const { name, email, phone, address } = req.body
    const nhaCungCap = new NhanCungCap({
      name,
      phone
    })
    if (email) {
      nhaCungCap.email = email
    }
    if (address) {
      nhaCungCap.address = address
    }
    const mancc = 'NCC' + nhaCungCap._id.toString().slice(-4)
    nhaCungCap.mancc = mancc
    nhaCungCap.depotId = depotId
    const depot = await Depot.findById(depotId)
    depot.nhacungcap.push(nhaCungCap._id)

    await depot.save()
    await nhaCungCap.save()
    res.json(nhaCungCap)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi' })
  }
})

router.get('/getnhacungcap/:depotId', async (req, res) => {
  try {
    const depotId = req.params.depotId
    const depot = await Depot.findById(depotId)
    const nhacungcap = await Promise.all(
      depot.nhacungcap.map(async nhacungcap => {
        const nhaCungCap = await NhanCungCap.findOne({
          _id: nhacungcap._id,
          $or: [{ status: 1 }, { status: { $exists: false } }]
        })
        if (!nhaCungCap) return null

        return {
          _id: nhaCungCap._id,
          mancc: nhaCungCap.mancc || '',
          name: nhaCungCap.name,
          email: nhaCungCap.email,
          phone: nhaCungCap.phone,
          address: nhaCungCap.address
        }
      })
    )
    const filtered = nhacungcap.filter(item => item !== null)

    res.json(filtered)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/editnhacungcap/:idncc', async (req, res) => {
  try {
    const idncc = req.params.idncc
    const { name, email, phone, address } = req.body
    const nhaCungCap = await NhanCungCap.findById(idncc)
    nhaCungCap.name = name
    nhaCungCap.email = email
    nhaCungCap.phone = phone
    nhaCungCap.address = address
    await nhaCungCap.save()
    res.json(nhaCungCap)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/deleteanncc', async (req, res) => {
  try {
    const { ids } = req.body
    for (const id of ids) {
      const nhacungcap = await NhanCungCap.findById(id)
      nhacungcap.status = -1
      await nhacungcap.save()
    }
    res.json({ message: 'xóa thành công' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/getchitietncc/:idncc', async (req, res) => {
  try {
    const idncc = req.params.idncc
    const nhacungcap = await NhanCungCap.findById(idncc)
    res.json(nhacungcap)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/dropDatabase', async (req, res) => {
  try {
    await mongoose.connection.dropDatabase()
    res.json({ message: 'Đã xóa toàn bộ cơ sở dữ liệu thành công!' })
  } catch (error) {
    console.error('Lỗi khi xóa database:', error)
    res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa database.' })
  }
})

module.exports = router

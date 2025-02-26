const router = require('express').Router()
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
        const nhaCungCap = await NhanCungCap.findById(nhacungcap._id)
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
    res.json(nhacungcap)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/getncc/:depotId', async (req, res) => {
  try {
    const depotId = req.params.depotId
    const depot = await Depot.findById(depotId)
    const nhacungcap = await Promise.all(
      depot.nhacungcap.map(async nhacungcap => {
        const nhaCungCap = await NhanCungCap.findById(nhacungcap._id)
        return {
          mancc: nhaCungCap.mancc || ''
        }
      })
    )
    res.json(nhacungcap)
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

module.exports = router

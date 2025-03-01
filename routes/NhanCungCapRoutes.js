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

router.post('/deletencc', async (req, res) => {
  try {
    const { ids } = req.body

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Danh sách id không hợp lệ.' })
    }

    const nhacungcaps = await NhanCungCap.find({ _id: { $in: ids } })
    if (nhacungcaps.length === 0) {
      return res
        .status(404)
        .json({ message: 'Không tìm thấy nhà cung cấp nào.' })
    }

    const depotMap = new Map()
    nhacungcaps.forEach(ncc => {
      if (ncc.depotId) {
        if (!depotMap.has(ncc.depotId)) {
          depotMap.set(ncc.depotId, [])
        }
        depotMap.get(ncc.depotId).push(ncc._id.toString())
      }
    })

    await NhanCungCap.deleteMany({ _id: { $in: ids } })

    const updateDepotPromises = []
    for (const [depotId, nccIds] of depotMap.entries()) {
      const depot = await Depot.findById(depotId)

      if (depot) {
        depot.nhacungcap = depot.nhacungcap.filter(
          item => !nccIds.includes(item._id.toString())
        )
        updateDepotPromises.push(depot.save())
      }
    }
    await Promise.all(updateDepotPromises)

    res.json({ message: 'Xóa nhà cung cấp thành công' })
  } catch (error) {
    console.error('Lỗi khi xóa nhà cung cấp:', error)
    res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa nhà cung cấp.' })
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

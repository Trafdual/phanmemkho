const router = require('express').Router()
const KhachHang = require('../models/KhachHangModel')
const Depot = require('../models/DepotModel')
const moment = require('moment')
router.get('/khachhang', async (req, res) => {
  try {
    const khachhang = await KhachHang.find().lean()
    res.render('khachhang', { khachhang })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})
router.get('/getkhachhang/:khoID', async (req, res) => {
  try {
    const depotId = req.params.khoID
    const depot = await Depot.findById(depotId)
    const khachhang = []
    await Promise.all(
      depot.khachang.map(async kh => {
        const khach = await KhachHang.findById(kh._id)
        if (khach.isActivity === true) {
          khachhang.push({
            _id: khach._id,
            makh: khach.makh,
            name: khach.name,
            phone: khach.phone,
            email: khach.email,
            cancuoc: khach.cancuoc,
            address: khach.address,
            date: moment(khach.date).format('DD/MM/YYYY')
          })
        }
      })
    )
    res.json(khachhang)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})
router.post('/postkhachhang', async (req, res) => {
  try {
    const depotId = req.session.depotId
    const depot = await Depot.findById(depotId)
    const formattedDate = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD')

    const { name, phone, email, cancuoc, address, date } = req.body
    const khachhang = new KhachHang({
      name,
      phone,
      email,
      cancuoc,
      address,
      date:formattedDate
    })
    const makh = 'KH' + khachhang._id.toString().slice(-5)
    khachhang.makh = makh
    depot.khachang.push(khachhang._id)
    khachhang.depotId = depot._id
    await khachhang.save()
    await depot.save()
    res.json(khachhang)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/postkhachhang/:depotId', async (req, res) => {
  try {
    const depotId = req.params.depotId
    const depot = await Depot.findById(depotId)
    const { name, phone, email, cancuoc, address, date } = req.body
    const formattedDate = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD')
    const khachhang = new KhachHang({
      name,
      phone,
      email,
      cancuoc,
      address,
      date:formattedDate
    })
    const makh = 'KH' + khachhang._id.toString().slice(-5)
    khachhang.makh = makh
    depot.khachang.push(khachhang._id)
    khachhang.depotId = depot._id
    await khachhang.save()
    await depot.save()
    res.json(khachhang)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/putkhachhang/:idkhachhang', async (req, res) => {
  try {
    const idkhachhang = req.params.idkhachhang
    const { name, phone, email, cancuoc, address, date } = req.body
    const khachhang = await KhachHang.findById(idkhachhang)
    khachhang.name = name
    khachhang.phone = phone
    khachhang.email = email
    khachhang.cancuoc = cancuoc
    khachhang.address = address
    khachhang.date = date
    await khachhang.save()
    res.json(khachhang)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/ngunghdkhachhang/:idkhachhang', async (req, res) => {
  try {
    const idkhachhang = req.params.idkhachhang
    const khachhang = await KhachHang.findById(idkhachhang)
    khachhang.isActivity = false
    await khachhang.save()
    res.json(khachhang)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})
module.exports = router

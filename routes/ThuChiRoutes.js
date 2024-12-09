const router = require('express').Router()
const Depot = require('../models/DepotModel')
const ThuChi = require('../models/ThuChiModel')
const moment = require('moment')

router.get('/getthuchitienmat/:depotid', async (req, res) => {
  try {
    const depotid = req.params.depotid
    const depot = await Depot.findById(depotid)
    const thuchi = await Promise.all(
      depot.thuchi.map(async tc => {
        const thuchitien = await ThuChi.findById(tc._id)
        if (thuchitien.method === 'Tiền mặt') {
          return {
            _id: thuchitien._id,
            mathuchi: thuchitien.mathuchi,
            date: moment(thuchitien.date).format('DD/MM/YYYY'),
            loaichungtu: thuchitien.loaichungtu,
            tongtien: thuchitien.tongtien,
            doituong: thuchitien.doituong,
            lydo: thuchitien.lydo,
            method: thuchitien.method,
            loaitien: thuchitien.loaitien
          }
        }
        return null
      })
    )
    const filteredThuChi = thuchi.filter(item => item !== null)
    res.json(filteredThuChi)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/getthuchichuyenkhoan/:depotid', async (req, res) => {
  try {
    const depotid = req.params.depotid
    const depot = await Depot.findById(depotid)
    const thuchi = await Promise.all(
      depot.thuchi.map(async tc => {
        const thuchitien = await ThuChi.findById(tc._id)
        if (thuchitien.method === 'Chuyển khoản') {
          return {
            _id: thuchitien._id,
            mathuchi: thuchitien.mathuchi,
            date: moment(thuchitien.date).format('DD/MM/YYYY'),
            loaichungtu: thuchitien.loaichungtu,
            tongtien: thuchitien.tongtien,
            doituong: thuchitien.doituong,
            lydo: thuchitien.lydo,
            method: thuchitien.method,
            loaitien: thuchitien.loaitien
          }
        }
        return null
      })
    )
    const filteredThuChi = thuchi.filter(item => item !== null)
    res.json(filteredThuChi)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})



router.post('/postthuchi/:depotid', async (req, res) => {
  try {
    const depotid = req.params.depotid
    const { date, loaichungtu, tongtien, doituong, lydo, method, loaitien } =
      req.body
    const depot = await Depot.findById(depotid)
    const thuchi = new ThuChi({
      date,
      loaichungtu,
      tongtien,
      doituong,
      lydo,
      method,
      loaitien,
      depot: depot._id
    })
    if (loaitien === 'Tiền thu') {
      thuchi.mathuchi = 'PT' + thuchi._id.toString().slice(-5)
    } else {
      thuchi.mathuchi = 'PC' + thuchi._id.toString().slice(-5)
    }
    depot.thuchi.push(thuchi._id)
    await thuchi.save()
    await depot.save()
    res.json(thuchi)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})
module.exports = router

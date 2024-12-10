const router = require('express').Router()
const Depot = require('../models/DepotModel')
const ThuChi = require('../models/ThuChiModel')
const MucThuChi = require('../models/MucThuChiModel')
const moment = require('moment')
const { request } = require('express')

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
    const { depotid } = req.params
    const {
      date,
      loaichungtu,
      tongtien,
      doituong,
      lydo,
      method,
      loaitien,
      products
    } = req.body

    // Kiểm tra giá trị đầu vào
    if (
      !date ||
      !loaichungtu ||
      !tongtien ||
      !doituong ||
      !method ||
      !loaitien ||
      !products
    ) {
      return res.status(400).json({ message: 'Dữ liệu đầu vào không hợp lệ.' })
    }

    const depot = await Depot.findById(depotid)
    if (!depot) {
      return res.status(404).json({ message: 'Không tìm thấy kho hàng.' })
    }

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

    thuchi.mathuchi =
      loaitien === 'Tiền thu'
        ? 'PT' + thuchi._id.toString().slice(-5)
        : 'PC' + thuchi._id.toString().slice(-5)

    // Xử lý products đồng thời
    const productPromises = products.map(async product => {
      const { diengiai, sotien, mucthuchiid } = product
      const mucthuchi = await MucThuChi.findById(mucthuchiid)
      if (!mucthuchi) {
        throw new Error(`Không tìm thấy mục thu chi với ID: ${mucthuchiid}`)
      }

      thuchi.chitiet.push({
        diengiai,
        sotien,
        mucthuchi: mucthuchi._id
      })

      mucthuchi.thuchi.push(thuchi._id)
      await mucthuchi.save()
    })

    await Promise.all(productPromises)

    depot.thuchi.push(thuchi._id)
    await thuchi.save()
    await depot.save()

    res.json(thuchi)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.', error: error.message })
  }
})

router.get('/getchitietthuchi/:idthuchi', async (req, res) => {
  try {
    const idthuchi = req.params.idthuchi
    const thuchi = await ThuChi.findById(idthuchi)
    const chitiet = await Promise.all(
      thuchi.chitiet.map(async ct => {
        const mucthuchi = await MucThuChi.findById(ct.mucthuchi)
        return {
          diengiai: ct.diengiai,
          sotien: ct.sotien,
          mucthuchi: mucthuchi.name
        }
      })
    )
    res.json(chitiet)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

module.exports = router

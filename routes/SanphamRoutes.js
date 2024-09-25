const router = require('express').Router()
const SanPham = require('../models/SanPhamModel')
const LoaiSanPham = require('../models/LoaiSanPhamModel')
const Depot = require('../models/DepotModel')
const momenttimezone = require('moment-timezone')
const moment = require('moment')
router.get('/getsanpham/:idloaisanpham', async (req, res) => {
  try {
    const idloai = req.params.idloaisanpham
    const loaisanpham = await LoaiSanPham.findById(idloai)
    const sanpham = await Promise.all(
      loaisanpham.sanpham.map(async sp => {
        const sp1 = await SanPham.findById(sp._id)
        return {
          masp: sp1.masp,
          _id: sp1._id,
          imel: sp1.imel,
          name: sp1.name,
          capacity: sp1.capacity,
          color: sp1.color,
          xuatStatus: sp1.xuat ? 'Đã xuất' : 'tồn kho'
        }
      })
    )
    res.json(sanpham)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/postsp/:idloaisanpham', async (req, res) => {
  try {
    const idloai = req.params.idloaisanpham
    const { imel, name, capacity, color } = req.body
    const sp = await SanPham.findOne({ imel })
    if (sp) {
      return res.json({ message: 'sản phẩm đã có trên hệ thống' })
    }
    const loaisanpham = await LoaiSanPham.findById(idloai)
    const sanpham = new SanPham({
      name,
      capacity,
      color,
      imel,
      datenhap: loaisanpham.date
    })
    const masp = 'SP' + loaisanpham._id.toString().slice(-5)
    sanpham.masp = masp
    sanpham.datexuat = ''
    sanpham.xuat = false
    sanpham.loaisanpham = loaisanpham._id
    await sanpham.save()
    loaisanpham.sanpham.push(sanpham._id)
    await loaisanpham.save()
    res.json(sanpham)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})
router.post('/postsp', async (req, res) => {
  try {
    const { imel, name, capacity, color, tenloai } = req.body
    const vietnamTime = momenttimezone().toDate()
    const loaisanpham = await LoaiSanPham.findOne({ name: tenloai })
    const sanpham = new SanPham({
      name,
      capacity,
      color,
      imel,
      datenhap: vietnamTime
    })
    sanpham.datexuat = ''
    sanpham.loaisanpham = loaisanpham._id
    await sanpham.save()
    loaisanpham.sanpham.push(sanpham._id)
    await loaisanpham.save()
    res.json(sanpham)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})
router.get('/getloaisanpham', async (req, res) => {
  try {
    const depotId = req.session.depotId
    const depot = await Depot.findById(depotId)
    const loaisanpham = await Promise.all(
      depot.loaisanpham.map(async loai => {
        const loaisp = await LoaiSanPham.findById(loai._id)
        return {
          _id: loaisp._id,
          name: loaisp.name
        }
      })
    )
    res.render('nhapkho', { loaisanpham })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/putsp/:idsanpham', async (req, res) => {
  try {
    const idsanpham = req.params.idsanpham
    const { imel, name, capacity, color } = req.body
    const sanpham = await SanPham.findByIdAndUpdate(idsanpham, {
      imel,
      name,
      capacity,
      color
    })
    await sanpham.save()
    res.json(sanpham)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/deletesp/:idsanpham', async (req, res) => {
  try {
    const idsanpham = req.params.idsanpham
    const sanpham = await SanPham.findById(idsanpham)
    const loaisanpham = await LoaiSanPham.findById(sanpham.loaisanpham)
    loaisanpham.sanpham = loaisanpham.sanpham.filter(sp => sp._id != idsanpham)
    await loaisanpham.save()
    await SanPham.deleteOne({ _id: idsanpham })
    res.json(sanpham)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/postest', async (req, res) => {
  try {
    const { imel } = req.body
    const sanpham = new SanPham({ imel })
    await sanpham.save()
    res.json(sanpham)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})
router.post('/xuatkho/:idsanpham/:idloaisp/:khoid', async (req, res) => {
  try {
    const idsanpham = req.params.idsanpham
    const idloaisp = req.params.idloaisp
    const khoid = req.params.khoid

    const sanpham1 = await SanPham.findById(idsanpham)
    const loaisanpham = await LoaiSanPham.findById(idloaisp)
    const kho = await Depot.findById(khoid)
    const sanpham = await Promise.all(
      loaisanpham.sanpham.map(async sp => {
        const sp1 = await SanPham.findById(sp._id)
        return {
          masp: sp1.masp,
          _id: sp1._id,
          imel: sp1.imel,
          name: sp1.name,
          capacity: sp1.capacity,
          color: sp1.color,
          xuatStatus: sp1.xuat ? 'Đã xuất' : 'tồn kho'
        }
      })
    )

    const vietnamTime = moment().tz('Asia/Ho_Chi_Minh').toDate()

    sanpham1.xuat = true
    sanpham1.datexuat = moment(vietnamTime).format('YYYY-MM-DD HH:mm:ss')
    kho.xuatkho.push(sanpham1._id)
    await sanpham1.save()
    await kho.save()
    res.json(sanpham)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})
router.get('/getxuatkho/:khoid', async (req, res) => {
  try {
    const khoid = req.params.khoid
    const kho = await Depot.findById(khoid)
    const sp1 = await Promise.all(
      kho.xuatkho.map(async sp => {
        const sp1 = await SanPham.findById(sp)
        const loaisp = await LoaiSanPham.findById(sp1.loaisanpham)
        return {
          malohang: loaisp.malsp,
          masp: sp1.masp,
          tenmay: sp1.name,
          ngaynhap: moment(loaisp.date).format('DD/MM/YYYY'),
          ngayxuat: moment(sp1.datexuat).format('DD/MM/YYYY')
        }
      })
    )
    res.json(sp1)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

module.exports = router

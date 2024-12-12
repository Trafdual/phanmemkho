const router = require('express').Router()
const ThuChi = require('../models/ThuChiModel')
const HoaDon = require('../models/HoaDonModel')
const LoaiSanPham = require('../models/LoaiSanPhamModel')
const Depot =require('../models/DepotModel')
router.post('/getdoanhthu/:depotid', async (req, res) => {
  try {
    const depotId = req.params.depotid
    const { fromDate, endDate, fromDatetruoc, endDatetruoc } = req.query
    const from = new Date(fromDate)
    const end = new Date(endDate)
    const fromtruoc = new Date(fromDatetruoc)
    const endtruoc = new Date(endDatetruoc)
    const depot = await Depot.findById(depotId).populate('hoadon') // `hoadon` là mảng ObjectId
    if (!depot) {
      return res.status(404).json({ message: 'Depot không tồn tại.' })
    }

    const hoadon = depot.hoadon.filter(
      hd => new Date(hd.date) >= from && new Date(hd.date) <= end
    )
    const hoadontruoc = depot.hoadon.filter(
      hd => new Date(hd.date) >= fromtruoc && new Date(hd.date) <= endtruoc
    )

    const loaisanpham = await LoaiSanPham.find({
      depot: depotId,
      date: { $gte: from, $lte: end }
    })
    const thuchi = await ThuChi.find({
      depot: depotId,
      date: { $gte: from, $lte: end }
    })

    const loaisanphamtruoc = await LoaiSanPham.find({
      depot: depotId,
      date: { $gte: fromtruoc, $lte: endtruoc }
    })
    const thuchitruoc = await ThuChi.find({
      depot: depotId,
      date: { $gte: fromtruoc, $lte: endtruoc }
    })

    const doanhthu = hoadon.reduce((total, hd) => total + hd.tongtien, 0)
    const doanhthutruoc = hoadontruoc.reduce(
      (total, hd) => total + hd.tongtien,
      0
    )
    const loaisanphamdoanhthu = loaisanpham.reduce(
      (total, lsp) => total + lsp.tongtien,
      0
    )
    const loaisanphamdoanhthutruoc = loaisanphamtruoc.reduce(
      (total, lsp) => total + lsp.tongtien,
      0
    )
    const thuchidoanhthu = thuchi.reduce((total, tc) => total + tc.tongtien, 0)
    const thuchidoanhthutruoc = thuchitruoc.reduce(
      (total, tc) => total + tc.tongtien,
      0
    )
    const doanhthutong = doanhthu - loaisanphamdoanhthu - thuchidoanhthu
    const doanhthutongtruoc =
      doanhthutruoc - loaisanphamdoanhthutruoc - thuchidoanhthutruoc
    const doanhthujson = {
      doanhthu,
      doanhthutruoc,
      loaisanphamdoanhthu,
      loaisanphamdoanhthutruoc,
      thuchidoanhthu,
      thuchidoanhthutruoc,
      doanhthutong,
      doanhthutongtruoc
    }
    res.json(doanhthujson)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/getdoanhthu/:depotid', async (req, res) => {
  try {
    const depotId = req.params.depotid
    const { fromDate, endDate, fromDatetruoc, endDatetruoc } = req.query
    const from = new Date(fromDate)
    const end = new Date(endDate)
    const fromtruoc = new Date(fromDatetruoc)
    const endtruoc = new Date(endDatetruoc)

    const hoadon = await HoaDon.find({
      depot: depotId,
      date: { $gte: from, $lte: end }
    })
    const loaisanpham = await LoaiSanPham.find({
      depot: depotId,
      date: { $gte: from, $lte: end }
    })
    const thuchi = await ThuChi.find({
      depot: depotId,
      date: { $gte: from, $lte: end }
    })

    const hoadontruoc = await HoaDon.find({
      depot: depotId,
      date: { $gte: fromtruoc, $lte: endtruoc }
    })
    const loaisanphamtruoc = await LoaiSanPham.find({
      depot: depotId,
      date: { $gte: fromtruoc, $lte: endtruoc }
    })
    const thuchitruoc = await ThuChi.find({
      depot: depotId,
      date: { $gte: fromtruoc, $lte: endtruoc }
    })

    const doanhthu = hoadon.reduce((total, hd) => total + hd.tongtien, 0)
    const doanhthutruoc = hoadontruoc.reduce(
      (total, hd) => total + hd.tongtien,
      0
    )
    const loaisanphamdoanhthu = loaisanpham.reduce(
      (total, lsp) => total + lsp.tongtien,
      0
    )
    const loaisanphamdoanhthutruoc = loaisanphamtruoc.reduce(
      (total, lsp) => total + lsp.tongtien,
      0
    )
    const thuchidoanhthu = thuchi.reduce((total, tc) => total + tc.tongtien, 0)
    const thuchidoanhthutruoc = thuchitruoc.reduce(
      (total, tc) => total + tc.tongtien,
      0
    )
    const doanhthutong = doanhthu - loaisanphamdoanhthu - thuchidoanhthu
    const doanhthutongtruoc =
      doanhthutruoc - loaisanphamdoanhthutruoc - thuchidoanhthutruoc
    const doanhthujson = {
      doanhthu,
      doanhthutruoc,
      loaisanphamdoanhthu,
      loaisanphamdoanhthutruoc,
      thuchidoanhthu,
      thuchidoanhthutruoc,
      doanhthutong,
      doanhthutongtruoc
    }
    res.json(doanhthujson)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

module.exports = router

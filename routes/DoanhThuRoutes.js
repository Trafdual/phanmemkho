const router = require('express').Router()
const ThuChi = require('../models/ThuChiModel')
const CongNo = require('../models/CongNoModel')
const HoaDon = require('../models/HoaDonModel')
const LoaiSanPham = require('../models/LoaiSanPhamModel')
const Depot = require('../models/DepotModel')
router.post('/getdoanhthu/:depotid', async (req, res) => {
  try {
    const depotId = req.params.depotid
    const { fromDate, endDate, fromDatetruoc, endDatetruoc } = req.query
    const from = new Date(fromDate)
    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999)
    const fromtruoc = new Date(fromDatetruoc)
    const endtruoc = new Date(endDatetruoc)
    endtruoc.setHours(23, 59, 59, 999)
    const depot = await Depot.findById(depotId).populate('hoadon')
    if (!depot) {
      return res.status(404).json({ message: 'Depot không tồn tại.' })
    }

    const congno = await CongNo.find({
      depot: depot._id,
      date: { $lt: from, $lte: end }
    })

    const tongCongNo = congno.reduce((sum, item) => sum + item.amount, 0)

    const congnotruoc = await CongNo.find({
      depot: depot._id,
      date: { $gte: fromtruoc, $lte: endtruoc }
    })

    const tongCongNoTruoc = congnotruoc.reduce(
      (sum, item) => sum + item.amount,
      0
    )

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

    const { tongThu, tongChi } = thuchi.reduce(
      (acc, tc) => {
        if (tc.loaitien === 'Tiền thu') {
          acc.tongThu += tc.tongtien
        } else if (tc.loaitien === 'Tiền chi') {
          acc.tongChi += tc.tongtien
        }
        return acc
      },
      { tongThu: 0, tongChi: 0 }
    )

    const tongThuChi = tongThu - tongChi

    const loaisanphamtruoc = await LoaiSanPham.find({
      depot: depotId,
      date: { $gte: fromtruoc, $lte: endtruoc }
    })
    const thuchitruoc = await ThuChi.find({
      depot: depotId,
      date: { $gte: fromtruoc, $lte: endtruoc }
    })

    const { tongThu: tongThutruoc, tongChi: tongChitruoc } = thuchitruoc.reduce(
      (acc, tc) => {
        if (tc.loaitien === 'Tiền thu') {
          acc.tongThu += tc.tongtien || 0
        } else if (tc.loaitien === 'Tiền chi') {
          acc.tongChi += tc.tongtien || 0
        }
        return acc
      },
      { tongThu: 0, tongChi: 0 }
    )

    const tongThuChitruoc = tongThutruoc - tongChitruoc

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

    const doanhthutong =
      doanhthu - loaisanphamdoanhthu + tongThuChi - tongCongNo
    const doanhthutongtruoc =
      doanhthutruoc -
      loaisanphamdoanhthutruoc +
      tongThuChitruoc -
      tongCongNoTruoc
    const doanhthujson = {
      doanhthu,
      doanhthutruoc,
      loaisanphamdoanhthu,
      loaisanphamdoanhthutruoc,
      tongThuChi,
      tongThuChitruoc,
      tongCongNo,
      tongCongNoTruoc,
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

router.get('/getbaocaobanhang/:depotid', async (req, res) => {
  try {
    const depotid = req.params.depotid
    const { fromDate, endDate } = req.query
    const depot = await Depot.findById(depotid).populate('hoadon')
    const from = new Date(fromDate)
    const end = new Date(endDate)
    const hoadon = depot.hoadon.filter(
      hd => new Date(hd.date) >= from && new Date(hd.date) <= end
    )
    const tongTienTienMat = hoadon
      .filter(hd => hd.method === 'Tiền mặt')
      .reduce((total, hd) => total + hd.tongtien, 0)

    const tongTienChuyenKhoan = hoadon
      .filter(hd => hd.method === 'Chuyển khoản')
      .reduce((total, hd) => total + hd.tongtien, 0)

    const loaisanpham = await LoaiSanPham.find({
      depot: depotid,
      date: { $gte: from, $lte: end }
    })
    const loaisanphamdoanhthu = loaisanpham.reduce(
      (total, lsp) => total + lsp.tongtien,
      0
    )
    const baocaojson = {
      tongTienTienMat,
      tongTienChuyenKhoan,
      loaisanphamdoanhthu
    }
    res.json(baocaojson)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

module.exports = router

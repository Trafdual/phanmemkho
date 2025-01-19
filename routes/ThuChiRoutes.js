const router = require('express').Router()
const Depot = require('../models/DepotModel')
const ThuChi = require('../models/ThuChiModel')
const MucThuChi = require('../models/MucThuChiModel')
const LoaiChungTu = require('../models/LoaiChungTuModel')
const NhaCungCap = require('../models/NhanCungCapModel')
const KhachHang = require('../models/KhachHangModel')
const moment = require('moment')

router.get('/getthuchitienmat/:depotid', async (req, res) => {
  try {
    const depotid = req.params.depotid
    const depot = await Depot.findById(depotid)
    const thuchi = await Promise.all(
      depot.thuchi.map(async tc => {
        const thuchitien = await ThuChi.findById(tc._id)
        let doituong = await NhaCungCap.findById(thuchitien.doituong)
        if (!doituong) {
          doituong = await KhachHang.findById(thuchitien.doituong)
        }

        const loaichungtu = await LoaiChungTu.findById(thuchitien.loaichungtu)
        if (thuchitien.method === 'Tiền mặt') {
          return {
            _id: thuchitien._id,
            mathuchi: thuchitien.mathuchi,
            date: moment(thuchitien.date).format('DD/MM/YYYY'),
            loaichungtu: `${loaichungtu.name} - ${loaichungtu.method}`,
            tongtien: thuchitien.tongtien,
            doituong: doituong.name || '',
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
        let doituong = await NhaCungCap.findById(thuchitien.doituong)
        if (!doituong) {
          doituong = await KhachHang.findById(thuchitien.doituong)
        }
        const loaichungtu = await LoaiChungTu.findById(thuchitien.loaichungtu)
        if (thuchitien.method === 'Tiền gửi') {
          return {
            _id: thuchitien._id,
            mathuchi: thuchitien.mathuchi,
            date: moment(thuchitien.date).format('DD/MM/YYYY'),
            loaichungtu: `${loaichungtu.name} - ${loaichungtu.method}`,
            tongtien: thuchitien.tongtien,
            doituong: doituong.name || '',
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
      maloaict,
      tongtien,
      madoituong,
      lydo,
      method,
      loaitien,
      products
    } = req.body

    // Kiểm tra giá trị đầu vào
    if (
      !date ||
      !maloaict ||
      !tongtien ||
      !madoituong ||
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
    const loaichungtu = await LoaiChungTu.findOne({ maloaict })
    let doituong = await NhaCungCap.findOne({ mancc: madoituong })
    if (!doituong) {
      doituong = await KhachHang.findOne({ makh: madoituong })
    }

    const thuchi = new ThuChi({
      date,
      loaichungtu: loaichungtu._id,
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
      const { diengiai, sotien, mamucthu } = product
      const mucthuchi = await MucThuChi.findOne({ mamuc: mamucthu })
      if (!mucthuchi) {
        return res.json({
          message: `Không tìm thấy mục thu chi với mã: ${mamucthu}`
        })
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
    loaichungtu.thuchi.push(thuchi._id)
    await thuchi.save()
    await depot.save()
    await loaichungtu.save()

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
router.get('/doituongthuchi/:idkho', async (req, res) => {
  try {
    const idkho = req.params.idkho
    const depot = await Depot.findById(idkho)
    const nhacungcap = await Promise.all(
      depot.nhacungcap.map(async ncc => {
        const ncc1 = await NhaCungCap.findById(ncc._id)
        return ncc1
      })
    )
    const khachhang = await Promise.all(
      depot.khachang.map(async kh => {
        const kh1 = await KhachHang.findById(kh._id)
        return kh1
      })
    )
    const doituongjson = {
      nhacungcap: nhacungcap,
      khachhang: khachhang
    }
    res.json(doituongjson)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

module.exports = router

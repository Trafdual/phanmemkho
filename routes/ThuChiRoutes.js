const router = require('express').Router()
const Depot = require('../models/DepotModel')
const ThuChi = require('../models/ThuChiModel')
const MucThuChi = require('../models/MucThuChiModel')
const LoaiChungTu = require('../models/LoaiChungTuModel')
const NhaCungCap = require('../models/NhanCungCapModel')
const KhachHang = require('../models/KhachHangModel')
const moment = require('moment')

const parseDate = dateString => {
  return moment(dateString, 'DD/MM/YYYY').isValid()
    ? moment(dateString, 'DD/MM/YYYY').toDate()
    : null
}
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

router.get('/getphieuchi/:depotid', async (req, res) => {
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
        if (loaichungtu.name === 'Phiếu chi') {
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

router.get('/getphieuchitheodate/:depotid', async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    const begintime = parseDate(startDate)
    const endtime = parseDate(endDate)

    const depotid = req.params.depotid
    const depot = await Depot.findById(depotid)

    const thuchiIds = depot.thuchi.map(tc => tc._id)

    const query = {
      _id: { $in: thuchiIds }
    }

    if (startDate && endDate) {
      query.date = {
        $gte: moment(begintime).startOf('day').toDate(),
        $lte: moment(endtime).endOf('day').toDate()
      }
    }

    const allThuChi = await ThuChi.find(query).lean()

    const result = await Promise.all(
      allThuChi.map(async tc => {
        const loaichungtu = await LoaiChungTu.findById(tc.loaichungtu)
        if (!loaichungtu || loaichungtu.name !== 'Phiếu chi') return null

        let doituong = await NhaCungCap.findById(tc.doituong)
        if (!doituong) {
          doituong = await KhachHang.findById(tc.doituong)
        }

        return {
          _id: tc._id,
          mathuchi: tc.mathuchi,
          date: moment(tc.date).format('DD/MM/YYYY'),
          loaichungtu: `${loaichungtu.name} - ${loaichungtu.method}`,
          tongtien: tc.tongtien,
          doituong: doituong?.name || '',
          lydo: tc.lydo,
          method: tc.method,
          loaitien: tc.loaitien
        }
      })
    )

    const filtered = result.filter(r => r !== null)
    res.json(filtered)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/getphieuthu/:depotid', async (req, res) => {
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
        if (loaichungtu.name === 'Phiếu thu') {
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

router.get('/getphieuthutheodate/:depotid', async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    const begintime = parseDate(startDate)
    const endtime = parseDate(endDate)

    const depotid = req.params.depotid
    const depot = await Depot.findById(depotid)

    const thuchiIds = depot.thuchi.map(tc => tc._id)

    const query = {
      _id: { $in: thuchiIds }
    }

    if (startDate && endDate) {
      query.date = {
        $gte: moment(begintime).startOf('day').toDate(),
        $lte: moment(endtime).endOf('day').toDate()
      }
    }

    const allThuChi = await ThuChi.find(query).lean()

    const result = await Promise.all(
      allThuChi.map(async tc => {
        const loaichungtu = await LoaiChungTu.findById(tc.loaichungtu)
        if (!loaichungtu || loaichungtu.name !== 'Phiếu thu') return null

        let doituong = await NhaCungCap.findById(tc.doituong)
        if (!doituong) {
          doituong = await KhachHang.findById(tc.doituong)
        }

        return {
          _id: tc._id,
          mathuchi: tc.mathuchi,
          date: moment(tc.date).format('DD/MM/YYYY'),
          loaichungtu: `${loaichungtu.name} - ${loaichungtu.method}`,
          tongtien: tc.tongtien,
          doituong: doituong?.name || '',
          lydo: tc.lydo,
          method: tc.method,
          loaitien: tc.loaitien
        }
      })
    )

    const filtered = result.filter(r => r !== null)
    res.json(filtered)
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

router.post('/deletethuchi', async (req, res) => {
  try {
    const { ids } = req.body
    for (const id of ids) {
      const thuchi = await ThuChi.findById(id)
      if (!thuchi || !thuchi.chitiet || thuchi.chitiet.length === 0) {
        continue
      }
      const mucthuchi = await MucThuChi.findById(
        thuchi.chitiet[0].mucthuchi._id
      )
      if (!mucthuchi) {
        console.warn(`Mục thu chi không tồn tại với id: ${id}`)
        continue
      }

      mucthuchi.thuchi = mucthuchi.thuchi.filter(
        tc => tc._id.toString() !== thuchi._id.toString()
      )
      await mucthuchi.save()
      await ThuChi.findByIdAndDelete(id)
    }
    res.json({ message: 'xóa thành công' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

module.exports = router

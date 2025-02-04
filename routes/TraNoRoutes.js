const router = require('express').Router()
const TraNo = require('../models/TraNoModel')
const LoaiSanPham = require('../models/LoaiSanPhamModel')
const HoaDon = require('../models/HoaDonModel')
const Depot = require('../models/DepotModel')
const KhachHang = require('../models/KhachHangModel')
const MucThuChi = require('../models/MucThuChiModel')
const User = require('../models/UserModel')
const ThuChi = require('../models/ThuChiModel')
const LoaiChungTu = require('../models/LoaiChungTuModel')

router.post('/posttranno/:idtrano', async (req, res) => {
  try {
    const { tiendatra, ngaytra, iddonno } = req.body
    const idtrano = req.params.idtrano

    const trano = await TraNo.findById(idtrano)

    if (!trano) {
      return res.status(404).json({ message: 'Không tìm thấy tài liệu.' })
    }

    if (!Array.isArray(tiendatra) || tiendatra.length !== trano.donno.length) {
      return res.status(400).json({ message: 'Mảng tiendatra không hợp lệ.' })
    }
    const index = trano.donno.findIndex(item => item._id.toString() === iddonno)

    if (index !== -1) {
      trano.donno[index].tiendatra = tiendatra
    } else {
      return res
        .status(404)
        .json({ message: 'Không tìm thấy id trong danh sách đơn nợ' })
    }

    trano.tongtra = trano.donno.reduce((sum, item) => sum + item.tiendatra, 0)

    trano.ngaytra = ngaytra

    await trano.save()

    res.json(trano)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/gettrano/:idkho', async (req, res) => {
  try {
    const idkho = req.params.idkho
    const depot = await Depot.findById(idkho)
    const tranojson = await Promise.all(
      depot.hoadon.map(async trano => {
        const tn = await HoaDon.findById(trano._id)
        if (!tn) return null
        const khachhang = await KhachHang.findById(tn.khachhang)
        if (!khachhang) return null
        if (tn.ghino === true) {
          return {
            _id: tn._id,
            mahoadon: tn.mahoadon,
            khachhangid: khachhang._id,
            makhachhang: khachhang.makh,
            namekhachhang: khachhang.name,
            phone: khachhang.phone,
            address: khachhang.address || '',
            tongtien: tn.tongtien
          }
        }
        return null
      })
    )

    const filteredTranojson = tranojson.filter(item => item !== null)

    const groupedData = {}
    filteredTranojson.forEach(item => {
      if (!groupedData[item.makhachhang]) {
        groupedData[item.makhachhang] = {
          makhachhang: item.makhachhang,
          namekhachhang: item.namekhachhang,
          khachhangid: item.khachhangid,
          address: item.address,
          phone: item.phone,
          tongtien: 0,
          ids: []
        }
      }
      groupedData[item.makhachhang].tongtien += item.tongtien
      groupedData[item.makhachhang].ids.push({
        _id: item._id,
        mahoadon: item.mahoadon,
        tongtien: item.tongtien
      })
    })

    const result = Object.values(groupedData)

    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/thuno/:userID/:khoId', async (req, res) => {
  try {
    const { ids, loaichungtu, khachhangid, method } = req.body
    const userID = req.params.userID
    const khoId = req.params.khoId

    const user = await User.findById(userID)

    let mucthuchi = await MucThuChi.findOne({ name: 'công nợ', user: user._id })
    const lct = await LoaiChungTu.findById(loaichungtu)
    const depot = await Depot.findById(khoId)

    if (!mucthuchi) {
      mucthuchi = new MucThuChi({
        name: 'công nợ',
        loaimuc: 'Tiền thu',
        user: user._id
      })
      mucthuchi.mamuc = 'MTC' + mucthuchi._id.toString().slice(-5)
      await mucthuchi.save()
    }

    const thuchi = new ThuChi({
      loaichungtu: loaichungtu,
      doituong: khachhangid,
      method,
      lydo: 'Trả nợ',
      loaitien: 'Tiền thu',
      depot: khoId
    })
    thuchi.mathuchi = 'PT' + thuchi._id.toString().slice(-5)
    lct.thuchi.push(thuchi._id)
    depot.thuchi.push(thuchi._id)

    for (const id of ids) {
      const trano = await HoaDon.findById(id)
      if (!trano)
        return res.status(404).json({ message: 'Không tìm thấy tài liệu.' })

      thuchi.chitiet.push({
        diengiai: `Trả nợ hóa đơn ${trano.mahoadon}`,
        sotien: trano.tongtien,
        mucthuchi: mucthuchi._id
      })
      mucthuchi.thuchi.push(thuchi._id)

      trano.ghino = false
      await trano.save()
    }

    thuchi.tongtien = thuchi.chitiet.reduce((sum, item) => sum + item.sotien, 0)

    await thuchi.save()
    await mucthuchi.save()
    await depot.save()
    await lct.save()
    res.json({ message: 'Thu nợ thành công.' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

module.exports = router

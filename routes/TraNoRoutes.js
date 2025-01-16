const router = require('express').Router()
const TraNo = require('../models/TraNoModel')
const LoaiSanPham = require('../models/LoaiSanPhamModel')
const HoaDon = require('../models/HoaDonModel')
const Depot = require('../models/DepotModel')
const KhachHang = require('../models/KhachHangModel')

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
          address: item.address,
          phone: item.phone,
          tongtien: 0,
          ids: []
        }
      }
      groupedData[item.makhachhang].tongtien += item.tongtien
      groupedData[item.makhachhang].ids.push(item._id)
    })

    const result = Object.values(groupedData)

    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/thuno', async (req, res) => {
  try {
    const { ids } = req.body
    for (const id of ids) {
      const trano = await HoaDon.findById(id)
      if (!trano)
        return res.status(404).json({ message: 'Không tìm thấy tài liệu.' })
      trano.ghino = true
      await trano.save()
    }
    res.json({ message: 'Thu nợ thành công.' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

module.exports = router

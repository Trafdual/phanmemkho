const router = require('express').Router()
const TraHang = require('../models/TraHangModel')
const SanPham = require('../models/SanPhamModel')
const LoaiSanPham = require('../models/LoaiSanPhamModel')
const Depot = require('../models/DepotModel')
const Dungluong = require('../models/DungluongSkuModel')

router.get('/gettrahang/:khoId', async (req, res) => {
  try {
    const khoId = req.params.khoId
    const kho = await Depot.findById(khoId)
    const trahang = await Promise.all(
      kho.trahang.map(async th => {
        const th1 = await TraHang.findById(th._id)
        const sanpham = await Promise.all(
          th1.sanpham.map(async sp => {
            const sp1 = await SanPham.findById(sp._id)
            const dungluong = await Dungluong.findById(sp1.dungluongsku)
            return {
              _id: sp1._id,
              masp: sp1.masp,
              imel: sp1.imel,
              name: sp1.name,
              sku: dungluong.madungluong
            }
          })
        )
        return {
          _id: th1._id,
          matrahang: th1.matrahang,
          hinhthuc: th1.hinhthuc,
          diengiai: th1.diengiai,
          sanpham: sanpham
        }
      })
    )
    res.json(trahang)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

module.exports = router

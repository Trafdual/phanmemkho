const router = require('express').Router()
const TraHang = require('../models/TraHangModel')
const SanPham = require('../models/SanPhamModel')
const LoaiSanPham = require('../models/LoaiSanPhamModel')
const Depot = require('../models/DepotModel')
const Dungluong = require('../models/DungluongSkuModel')
const NhanCungCap = require('../models/NhanCungCapModel')

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
          sanpham: sanpham,
          congno: th1.congno,
          method: th1.method || ''
        }
      })
    )
    res.json(trahang)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/posttrahang/:khoID', async (req, res) => {
  try {
    const khoID = req.params.khoID
    const { imelist, manhacungcap, ngaynhap, hour, diengiai, method, congno } =
      req.body
    const kho = await Depot.findById(khoID)

    for (const imel of imelist) {
      const sanpham = await SanPham.findOne({ imel })
      const nhacungcap = await NhanCungCap.findOne({ mancc: manhacungcap })
      const loaisanpham = await LoaiSanPham.findById(sanpham.loaisanpham)
      const trahang = new TraHang({
        diengiai,
        ngaynhap,
        hour,
        nhacungcap: nhacungcap._id
      })
      trahang.sanpham.push(sanpham._id)
      trahang.kho = kho._id
      if (congno === 'congno') {
        trahang.congno = true
      } else {
        trahang.congno = false
        trahang.method = method
      }
      sanpham.tralai = true
      loaisanpham.sanpham = loaisanpham.sanpham.filter(
        sp => sp._id.toString() !== sanpham._id.toString()
      )
      await trahang.save()
      await kho.save()
      await sanpham.save()
      await loaisanpham.save()
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

module.exports = router

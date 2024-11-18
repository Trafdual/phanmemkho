const router = require('express').Router()
const SanPham = require('../models/SanPhamModel')
const Depot = require('../models/DepotModel')
const DungLuongSku = require('../models/DungluongSkuModel')
const Sku = require('../models/SkuModel')
const User = require('../models/UserModel')

router.get('/banhang/:idsku/:idkho/:userid', async (req, res) => {
  try {
    const { idsku, idkho, userid } = req.params

    const user = await User.findById(userid).populate('depot')
    if (!user || !user.depot.length) {
      return res.status(404).json({ message: 'Người dùng không có kho nào.' })
    }

    const allKho = user.depot

    const khoHienTai = allKho.find(kho => kho._id.toString() === idkho)
    if (!khoHienTai) {
      return res.status(404).json({ message: 'Kho hiện tại không tồn tại.' })
    }

    const cacKhoKhac = allKho.filter(kho => kho._id.toString() !== idkho)

    const sku = await Sku.findById(idsku)
    if (!sku) {
      return res.status(404).json({ message: 'SKU không tồn tại.' })
    }

    const dungluongskujson = await Promise.all(
      sku.dungluong.map(async dungluong => {
        const dl = await DungLuongSku.findById(dungluong._id)
        if (!dl) return null

        const sku1 = await Sku.findById(dl.sku)

        const sanpham = await Promise.all(
          dl.sanpham.map(async sp => {
            const sp1 = await SanPham.findById(sp._id)
            if (sp1 && sp1.xuat === false) {
              return {
                _id: sp1._id,
                name: sp1.name,
                masku: dl.madungluong,
                price: sp1.price,
                kho: sp1.kho.toString()
              }
            }
            return null
          })
        )

        const filteredSanpham = sanpham.filter(Boolean)

        const tonkho = filteredSanpham.reduce((acc, sp) => {
          acc[sp.kho] = (acc[sp.kho] || 0) + 1
          return acc
        }, {})

        const soluongTrongKhoHienTai = tonkho[idkho] || 0

        const totalSoLuongCacKhoKhac = cacKhoKhac.reduce((acc, kho) => {
          acc += tonkho[kho._id.toString()] || 0
          return acc
        }, 0)

        const soLuongCacKhoKhac = cacKhoKhac.map(kho => ({
          khoId: kho._id,
          tenkho: kho.name,
          soluong: tonkho[kho._id.toString()] || 0
        }))

        return {
          idsku: dl._id,
          name: dl.name,
          tenkhohientai: khoHienTai.name,
          tensp: `${sku1.name} (${dl.name})`,
          tonkho: soluongTrongKhoHienTai,
          cacKhoKhac: soLuongCacKhoKhac,
          tongSoLuongCacKhoKhac: totalSoLuongCacKhoKhac
        }
      })
    )

    res.json(dungluongskujson.filter(Boolean))
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/getspbanhang/:iduser', async (req, res) => {
  try {
    const iduser = req.params.iduser
    const user = await User.findById(iduser)
    const skujson = await Promise.all(
      user.sku.map(async sku => {
        const sku1 = await Sku.findById(sku._id)
        return {
          _id: sku1._id,
          name: sku1.name
        }
      })
    )
    res.json(skujson)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/postchonsanpham', async (req, res) => {
  try {
    const { idskus } = req.body
    for (const idsku of idskus) {
        const sku = await Sku.findById(idsku)
        
    }
  } catch (error) {}
})

module.exports = router

const router = require('express').Router()
const TraNo = require('../models/TraNoModel')
const LoaiSanPham = require('../models/LoaiSanPhamModel')

router.post('/posttranno/:idtrano', async (req, res) => {
  try {
    const { tiendatra, ngaytra } = req.body 
    const idtrano = req.params.idtrano

    const trano = await TraNo.findById(idtrano)

    if (!trano) {
      return res.status(404).json({ message: 'Không tìm thấy tài liệu.' })
    }

    if (!Array.isArray(tiendatra) || tiendatra.length !== trano.donno.length) {
      return res.status(400).json({ message: 'Mảng tiendatra không hợp lệ.' })
    }

    trano.donno.forEach((item, index) => {
      item.tiendatra = tiendatra[index] 
    })
    trano.tongtra = trano.donno.reduce((sum, item) => sum + item.tiendatra, 0)


    trano.ngaytra = ngaytra

    await trano.save()

    res.status(200).json({ message: 'Cập nhật thành công.', trano })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})


module.exports = router

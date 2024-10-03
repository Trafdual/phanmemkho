const router = require('express').Router()
const SanPham = require('../models/SanPhamModel')
const LoaiSanPham = require('../models/LoaiSanPhamModel')
const Depot = require('../models/DepotModel')
const momenttimezone = require('moment-timezone')
const moment = require('moment')
const NhaCungCap = require('../models/NhanCungCapModel')
const DieuChuyen = require('../models/DieuChuyenModel')
router.get('/getdieuchuyen/:khoID', async (req, res) => {
  try {
    const khoID = req.params.khoID
    const kho = await Depot.findById(khoID)
    const dieuchuyen = await Promise.all(
      kho.dieuchuyen.map(async dieuchuyen => {
        const dieuchuyen1 = await DieuChuyen.findById(dieuchuyen._id)
        const sanpham = await SanPham.findById(dieuchuyen1.sanpham)
        const loaisanpham = await LoaiSanPham.findById(dieuchuyen1.loaisanpham)
        const nhacungcap = await NhaCungCap.findById(dieuchuyen1.nhacungcap)
        return {
          _id: dieuchuyen1._id,
          mancc: nhacungcap.mancc,
          malohang: loaisanpham.malsp,
          masp: sanpham.masp,
          tenmay: sanpham.name,
          date: moment(dieuchuyen1.date).format('DD-MM-YYYY'),
          trangthai: dieuchuyen1.trangthai
        }
      })
    )
    res.json(dieuchuyen)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})
router.post('/deletedieuchuyen/:khoid', async (req, res) => {
  try {
    const {iddieuchuyen}=req.body
    const khoid=req.params.khoid;
    const kho=await Depot.findById(khoid)
    for(const iddieuchuyendetail of iddieuchuyen){
      const dieuchuyen= await DieuChuyen.findById(iddieuchuyendetail)
      kho.dieuchuyen = kho.dieuchuyen.filter(item => item._id.toString() !== dieuchuyen._id.toString())
      await DieuChuyen.findByIdAndDelete(iddieuchuyendetail)
      await kho.save()
    }
    res.json({message:'xóa điều chuyển thành công'})
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

module.exports = router

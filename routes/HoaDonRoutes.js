const router = require('express').Router()
const HoaDon = require('../models/HoaDonModel')
const User = require('../models/UserModel')
const KhachHang = require('../models/KhachHangModel')
const LoaiSanPham = require('../models/LoaiSanPhamModel')
const SanPham = require('../models/SanPhamModel')
const moment = require('moment')
const momenttimezone = require('moment-timezone')
const DePot = require('../models/DepotModel')
router.get('/hoadon/:khoId', async (req, res) => {
  try {
    const khoid = req.params.khoId
    const kho = await DePot.findById(khoid)
    const hoadon = await Promise.all(
      kho.hoadon.map(async hd => {
        const hd1 = await HoaDon.findById(hd._id)
        const khachhang = await KhachHang.findById(hd1.khachhang)
        const sanpham = await Promise.all(
          hd1.sanpham.map(async sp => {
            const sp1 = await SanPham.findById(sp.sp._id)
            const loaisanpham = await LoaiSanPham.findById(sp1.loaisanpham)
            return {
              malohang: loaisanpham.malsp,
              masp: sp1.masp,
              tenmay: sp1.name,
              price: sp1.price,
              mausac: sp1.color,
              dungluong: sp1.dungluongsku
            }
          })
        )
        return {
          _id: hd1._id,
          mahd: hd1.mahoadon,
          makh: khachhang.makh,
          tenkhach: khachhang.name,
          phone: khachhang.phone,
          email: khachhang.email,
          address: khachhang.address,
          date: moment(hd1.date).format('DD/MM/YYYY'),
          tongtien: hd1.tongtien,
          sanpham: sanpham
        }
      })
    )
    res.json(hoadon)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})
router.get('/getchitiethoadon/:idhoadon', async (req, res) => {
  try {
    const idhoadon = req.params.idhoadon
    const hoadon = await HoaDon.findById(idhoadon)
    const user = await User.findById(hoadon.nhanvien)
    const khachhang = await KhachHang.findById(hoadon.khachhang)
    const loaisanpham = await Promise.all(
      hoadon.loaisanpham.map(async loaisp => {
        const loai = await LoaiSanPham.findById(loaisp.id)
        return {
          _id: loai._id,
          soluong: loaisp.soluong
        }
      })
    )
    const hoadonjson = {
      _id: hd._id,
      manhanvien: user._id,
      nhanvien: user.name,
      makhachhang: khachhang._id,
      khachhang: khachhang.name,
      loaisanpham: loaisanpham,
      date: moment(hd.date).format('DD/MM/YYYY'),
      tongtien: hd.tongtien
    }
    res.json(hoadonjson)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/posthoadon/:khoid', async (req, res) => {
  try {
    const khoid = req.params.khoid
    const { makhachhang, masanpham } = req.body
    const kho = await DePot.findById(khoid)
    const vietnamTime = momenttimezone().toDate()
    const kh = await KhachHang.findOne({ makh: makhachhang })
    const hoadon = new HoaDon({ khachhang: kh._id, date: vietnamTime,tongtien:0 })

    for (const masp of masanpham) {
      const sanpham = await SanPham.findOne({ masp })
      if (sanpham) {
        hoadon.sanpham.push(sanpham._id)
        hoadon.tongtien = hoadon.tongtien + sanpham.price
      } else {
        return res.json({ message: `Sản phẩm với mã ${masp} không tìm thấy.` })
      }
    }

    const mahd = 'HD' + hoadon._id.toString().slice(-5)
    hoadon.mahoadon = mahd
    kho.hoadon.push(hoadon._id)
    await hoadon.save()
    await kho.save()
    res.json(hoadon)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

module.exports = router

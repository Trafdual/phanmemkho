const router = require('express').Router()
const KhachHang = require('../models/KhachHangModel')
const Depot = require('../models/DepotModel')
const HoaDon = require('../models/HoaDonModel')
const SanPham = require('../models/SanPhamModel')
const Sku = require('../models/SkuModel')
const DungLuong = require('../models/DungluongSkuModel')
const LoaiSanPham = require('../models/LoaiSanPhamModel')

router.get('/topkhachhang/:idkho', async (req, res) => {
  try {
    const idkho = req.params.idkho
    const depot = await Depot.findById(idkho)

    const topkhachhang = await Promise.all(
      depot.khachang.map(async khach => {
        const khachhang = await KhachHang.findById(khach._id)
        const danhSachHoaDon = await Promise.all(
          khachhang.donhang.map(async don => {
            const hoadon = await HoaDon.findById(don._id)
            return hoadon ? hoadon.tongtien : 0
          })
        )
        const tongTien = danhSachHoaDon.reduce((sum, tien) => sum + tien, 0)

        return {
          _id: khachhang._id,
          name: khachhang.name,
          phone: khachhang.phone,
          address: khachhang.address,
          tongtien: tongTien
        }
      })
    )

    const sortedKhachHang = topkhachhang.sort((a, b) => b.tongtien - a.tongtien)

    const top4KhachHang = sortedKhachHang.slice(0, 8)

    res.json(top4KhachHang)
  } catch (error) {
    console.error('Lỗi khi lấy top khách hàng:', error)
    res.status(500).json({ message: 'Lỗi khi lấy top khách hàng', error })
  }
})

router.get('/sanphamban/:idkho', async (req, res) => {
  try {
    const khoid = req.params.idkho
    const kho = await Depot.findById(khoid)

    const sanPhamCount = {}

    await Promise.all(
      kho.xuatkho.map(async sp => {
        const sp1 = await SanPham.findById(sp)
        const dungluong = await DungLuong.findById(sp1.dungluongsku)
        const masku = await Sku.findById(dungluong.sku)
        const masku1 = masku.name
        if (sanPhamCount[masku1]) {
          sanPhamCount[masku1] += 1
        } else {
          sanPhamCount[masku1] = 1
        }
      })
    )

    // Chuyển đổi sang định dạng polarData
    const labels = Object.keys(sanPhamCount)
    const data = Object.values(sanPhamCount)
    const backgroundColor = [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)'
      //   'rgba(75, 192, 192, 1)',
      //   'rgba(153, 102, 255, 1)',
      //   'rgba(255, 159, 64, 1)'
    ] // Thêm màu nếu có nhiều sản phẩm hơn

    const polarData = {
      labels: labels,
      datasets: [
        {
          label: 'Số lượng máy',
          data: data,
          backgroundColor: backgroundColor.slice(0, labels.length)
        }
      ]
    }

    res.json(polarData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/doanhthutheothang/:idkho', async (req, res) => {
  try {
    const khoid = req.params.idkho
    const kho = await Depot.findById(khoid)

    if (!kho) {
      return res.status(404).json({ message: 'Không tìm thấy kho.' })
    }

    const year = new Date().getFullYear()

    // Khởi tạo mảng 12 tháng cho hóa đơn, loại sản phẩm và doanh thu
    const tongTienHoaDon = Array(12).fill(0) // Tổng tiền hóa đơn theo tháng
    const tongTienLoaiSP = Array(12).fill(0) // Tổng tiền loại sản phẩm theo tháng
    const doanhThuTheoThang = Array(12).fill(0) // Doanh thu từng tháng

    // Tính tổng tiền hóa đơn theo tháng
    await Promise.all(
      kho.hoadon.map(async hd => {
        const hoaDon = await HoaDon.findById(hd._id)

        if (hoaDon && hoaDon.date) {
          const ngayLap = new Date(hoaDon.date)

          // Nếu hóa đơn thuộc năm hiện tại, thêm tổng tiền vào tháng tương ứng
          if (ngayLap.getFullYear() === year) {
            const month = ngayLap.getMonth() // Lấy tháng (0-11)
            tongTienHoaDon[month] += hoaDon.tongtien
          }
        }
      })
    )

    // Tính tổng tiền loại sản phẩm theo tháng
    await Promise.all(
      kho.loaisanpham.map(async loaiSP => {
        const loaiSanPham = await LoaiSanPham.findById(loaiSP._id)

        if (loaiSanPham && loaiSanPham.date) {
          const ngayLap = new Date(loaiSanPham.date)

          if (ngayLap.getFullYear() === year) {
            const month = ngayLap.getMonth()
            tongTienLoaiSP[month] += loaiSanPham.tongtien
          }
        }
      })
    )

    // Tính doanh thu từng tháng
    for (let i = 0; i < 12; i++) {
      doanhThuTheoThang[i] = tongTienHoaDon[i] - tongTienLoaiSP[i]
    }

    // Tạo dữ liệu theo cấu trúc barData
    const barData = {
      labels: [
        'Tháng 1',
        'Tháng 2',
        'Tháng 3',
        'Tháng 4',
        'Tháng 5',
        'Tháng 6',
        'Tháng 7',
        'Tháng 8',
        'Tháng 9',
        'Tháng 10',
        'Tháng 11',
        'Tháng 12'
      ],
      datasets: [
        {
          label: 'Doanh Thu',
          data: doanhThuTheoThang,
          backgroundColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ]
        }
      ]
    }

    // Trả về dữ liệu
    res.json(barData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})


module.exports = router

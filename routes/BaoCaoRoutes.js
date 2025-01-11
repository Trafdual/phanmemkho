const router = require('express').Router()
const SanPham = require('../models/SanPhamModel')
const LoaiSanPham = require('../models/LoaiSanPhamModel')
const mongoose = require('mongoose')
const DePot = require('../models/DepotModel')
const DungLuongSku = require('../models/DungluongSkuModel')
const Sku = require('../models/SkuModel')
const CongNo = require('../models/CongNoModel')
const KhachHang = require('../models/KhachHangModel')
const NhomKhacHang = require('../models/NhomKhacHangModel')
const MucThuChi = require('../models/MucThuChiModel')
const ThuChi = require('../models/ThuChiModel')
const HoaDon = require('../models/HoaDonModel')

router.get('/getsptest/:khoID', async (req, res) => {
  try {
    const khoId = req.params.khoID
    const { fromDate, endDate } = req.query

    const from = new Date(fromDate)
    const end = new Date(endDate)

    const prevDay = new Date(fromDate)
    prevDay.setDate(prevDay.getDate() - 1)

    const depot = await DePot.findById(khoId)
    const sanphamtest = await Promise.all(
      depot.sanpham.map(async sanpham => {
        const sanpham1 = await SanPham.findById(sanpham._id)
        const dungluongsku = await DungLuongSku.findById(sanpham1.dungluongsku)
        const sku = await Sku.findById(dungluongsku.sku)

        const sanphamjson = {
          madungluongsku: dungluongsku.madungluong,
          name: sanpham1.name,
          datenhap: sanpham1.datenhap,
          price: sanpham1.price,
          datexuat: sanpham1.datexuat,
          xuat: sanpham1.xuat
        }

        return {
          masku: sku.masku,
          namesku: sku.name,
          sanpham: sanphamjson
        }
      })
    )

    const gopSanPham = sanphamtest.reduce((acc, item) => {
      let existingSku = acc.find(x => x.masku === item.masku)
      if (existingSku) {
        existingSku.sanpham.push(item.sanpham)
      } else {
        acc.push({
          masku: item.masku,
          namesku: item.namesku,
          sanpham: [item.sanpham]
        })
      }
      return acc
    }, [])

    gopSanPham.forEach(skuItem => {
      const gopDungLuong = skuItem.sanpham.reduce((acc, product) => {
        let existingDungLuong = acc.find(
          p => p.madungluongsku === product.madungluongsku
        )
        const datenhapArray = Array.isArray(product.datenhap)
          ? product.datenhap
          : [product.datenhap]

        if (existingDungLuong) {
          existingDungLuong.datenhap.push(...datenhapArray)
        } else {
          acc.push({
            madungluongsku: product.madungluongsku,
            name: product.name,
            datenhap: [...datenhapArray],
            soluongsp: 0,
            price: 0,
            tondauky: {
              soluong: 0,
              price: 0
            },
            nhaptrongky: {
              soluong: 0,
              price: 0
            },
            xuattrongky: {
              soluong: 0,
              price: 0
            },
            toncuoiky: {
              soluong: 0,
              price: 0
            }
          })
          existingDungLuong = acc[acc.length - 1]
        }

        datenhapArray.forEach(date => {
          const dateObj = new Date(date)
          if (dateObj >= from && dateObj <= end) {
            existingDungLuong.price += product.price
          }
        })

        return acc
      }, [])

      gopDungLuong.forEach(dungluong => {
        dungluong.datenhap = dungluong.datenhap.filter(date => {
          const dateObj = new Date(date)
          return dateObj
        })

        if (dungluong.datenhap.length > 0) {
          dungluong.soluongsp = dungluong.datenhap.length
          dungluong.nhaptrongky.soluong = dungluong.datenhap.filter(date => {
            return (
              new Date(date).setHours(0, 0, 0, 0) >=
                from.setHours(0, 0, 0, 0) &&
              new Date(date).setHours(0, 0, 0, 0) <= end.setHours(0, 0, 0, 0)
            )
          }).length
          let productsOnPrevDay = []

          skuItem.sanpham.forEach(product => {
            if (product.madungluongsku === dungluong.madungluongsku) {
              const productDate = new Date(product.datenhap).setHours(
                0,
                0,
                0,
                0
              )
              const productdatexuat = new Date(product.datexuat).setHours(
                0,
                0,
                0,
                0
              )
              const fromdate = new Date(from).setHours(0, 0, 0, 0)
              const enddate = new Date(end).setHours(0, 0, 0, 0)
              const prevDayDate = new Date(prevDay).setHours(0, 0, 0, 0)

              if (productDate >= fromdate && productDate <= enddate) {
                dungluong.nhaptrongky.price += product.price
              }
              if (productDate === prevDayDate) {
                if (product.xuat === false) {
                  dungluong.tondauky.price += product.price
                  productsOnPrevDay.push(product)
                }
              }
              if (productdatexuat >= fromdate && productdatexuat <= enddate) {
                if (product.xuat === true) {
                  dungluong.xuattrongky.soluong++
                  dungluong.xuattrongky.price += product.price
                }
              }
            }
          })

          dungluong.tondauky.soluong = productsOnPrevDay.length

          dungluong.toncuoiky.soluong =
            dungluong.tondauky.soluong +
            dungluong.nhaptrongky.soluong -
            dungluong.xuattrongky.soluong

          dungluong.toncuoiky.price =
            dungluong.tondauky.price +
            dungluong.nhaptrongky.price -
            dungluong.xuattrongky.price
        }
      })
      skuItem.tongtondau = skuItem.tongtondau || { soluong: 0, price: 0 }
      skuItem.tongnhaptrong = skuItem.tongnhaptrong || { soluong: 0, price: 0 }
      skuItem.tongxuattrong = skuItem.tongxuattrong || { soluong: 0, price: 0 }
      skuItem.tongtoncuoiky = skuItem.tongtoncuoiky || { soluong: 0, price: 0 }

      skuItem.soluongsanpham = gopDungLuong.reduce(
        (total, product) => total + product.soluongsp,
        0
      )
      skuItem.tongtondau.price = gopDungLuong.reduce(
        (total, product) => total + product.tondauky.price,
        0
      )
      skuItem.tongnhaptrong.price = gopDungLuong.reduce(
        (total, product) => total + product.nhaptrongky.price,
        0
      )

      skuItem.tongxuattrong.price = gopDungLuong.reduce(
        (total, product) => total + product.xuattrongky.price,
        0
      )
      skuItem.tongtoncuoiky.price = gopDungLuong.reduce(
        (total, product) => total + product.toncuoiky.price,
        0
      )

      skuItem.tongtondau.soluong = gopDungLuong.reduce(
        (total, product) => total + product.tondauky.soluong,
        0
      )
      skuItem.tongnhaptrong.soluong = gopDungLuong.reduce(
        (total, product) => total + product.nhaptrongky.soluong,
        0
      )
      skuItem.tongxuattrong.soluong = gopDungLuong.reduce(
        (total, product) => total + product.xuattrongky.soluong,
        0
      )
      skuItem.tongtoncuoiky.soluong = gopDungLuong.reduce(
        (total, product) => total + product.toncuoiky.soluong,
        0
      )

      skuItem.sanpham = gopDungLuong
    })

    res.json(gopSanPham)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/getcongno/:idkho', async (req, res) => {
  try {
    const idkho = req.params.idkho
    const depot = await DePot.findById(idkho)
    const { fromdate, enddate } = req.query
    const from = new Date(fromdate)
    const end = new Date(enddate)
    end.setUTCHours(23, 59, 59, 999)
    const prevMonthEnd = new Date(from)
    prevMonthEnd.setDate(0)
    prevMonthEnd.setUTCHours(23, 59, 59, 999)

    const prevMonthStart = new Date(
      prevMonthEnd.getFullYear(),
      prevMonthEnd.getMonth(),
      1
    )
    const congnoLastMonth = await CongNo.find({
      depot: depot._id,
      date: { $gte: prevMonthStart, $lte: prevMonthEnd }
    })
    console.log(prevMonthEnd)

    const lastMonthData = {}
    congnoLastMonth.forEach(cn => {
      lastMonthData[cn.khachhang] = cn.tongtien
    })

    const congno = await CongNo.find({
      depot: depot._id,
      date: { $gte: from, $lte: end }
    })

    const congno1 = await Promise.all(
      congno.map(async cn => {
        const khachhang = await KhachHang.findById(cn.khachhang)
        const nhomkhachhang = await NhomKhacHang.findById(
          khachhang.nhomkhachhang
        )

        const tangTrongKy = congno
          .filter(
            transaction =>
              transaction.khachhang.toString() === cn.khachhang.toString()
          )
          .reduce((sum, transaction) => {
            return sum + transaction.tongtien
          }, 0)

        const nodauky = lastMonthData[cn.khachhang] || 0

        return {
          makh: khachhang.makh,
          namekhach: khachhang.name,
          nhomkhachhang: nhomkhachhang.name,
          phone: khachhang.phone,
          nodauky,
          tangtrongky: tangTrongKy,
          giamtrongky: 0
        }
      })
    )

    res.json(congno1)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/getcongno3/:idkho', async (req, res) => {
  try {
    const idkho = req.params.idkho
    const depot = await DePot.findById(idkho)
    const { fromdate, enddate } = req.query
    const from = new Date(fromdate)
    const end = new Date(enddate)
    end.setUTCHours(23, 59, 59, 999)

    const previousFrom = new Date(from)
    previousFrom.setDate(
      previousFrom.getDate() - (end.getDate() - from.getDate())
    )
    const previousEnd = new Date(from)
    previousEnd.setDate(previousEnd.getDate() - 1)
    console.log(previousFrom)

    const mucThuChiCongNo = await MucThuChi.find({ name: 'công nợ' })

    const giamTrongKyThuChi = await ThuChi.find({
      depot: depot._id,
      date: { $gte: from, $lte: end },
      'chitiet.mucthuchi': { $in: mucThuChiCongNo.map(muc => muc._id) },
      loaitien: 'Tiền thu'
    })

    const giamTrongKyTruoc = await ThuChi.find({
      depot: depot._id,
      date: { $gte: previousFrom, $lte: previousEnd },
      'chitiet.mucthuchi': { $in: mucThuChiCongNo.map(muc => muc._id) },
      loaitien: 'Tiền thu'
    })

    const congnoAllPreviousMonths = await CongNo.find({
      depot: depot._id,
      date: { $lt: from }
    })

    const congnoCurrentMonth = await CongNo.find({
      depot: depot._id,
      date: { $gte: from, $lte: end }
    })

    const khachhang = await Promise.all(
      depot.khachang.map(async kh => {
        const khachhang = await KhachHang.findById(kh._id)
        const nhomkhachhang = await NhomKhacHang.findById(
          khachhang.nhomkhachhang
        )

        let totalTanggtrongky = 0
        let customerTotalNodauky = 0
        let totalGiamtrongky = 0

        const customerCongnoPreviousMonths = congnoAllPreviousMonths.filter(
          cn => cn.khachhang.toString() === khachhang._id.toString()
        )
        customerTotalNodauky = customerCongnoPreviousMonths.reduce(
          (sum, cn) => sum + cn.tongtien,
          0
        )

        const customerCongnoCurrentMonth = congnoCurrentMonth.filter(
          cn => cn.khachhang.toString() === khachhang._id.toString()
        )

        totalTanggtrongky = customerCongnoCurrentMonth.reduce(
          (sum, cn) => sum + cn.tongtien,
          0
        )

        const customerThuChi = giamTrongKyThuChi.filter(
          tc => tc.doituong.toString() === khachhang._id.toString()
        )
        totalGiamtrongky = customerThuChi.reduce(
          (sum, tc) =>
            sum +
            tc.chitiet.reduce(
              (detailSum, detail) =>
                mucThuChiCongNo.some(
                  muc => muc._id.toString() === detail.mucthuchi.toString()
                )
                  ? detailSum + detail.sotien
                  : detailSum,
              0
            ),
          0
        )

        const customerThuChiTruoc = giamTrongKyTruoc.filter(
          tc => tc.doituong.toString() === khachhang._id.toString()
        )

        const totalGiamtrongkyTruocDo = customerThuChiTruoc.reduce(
          (sum, tc) =>
            sum +
            tc.chitiet.reduce(
              (detailSum, detail) =>
                mucThuChiCongNo.some(
                  muc => muc._id.toString() === detail.mucthuchi.toString()
                )
                  ? detailSum + detail.sotien
                  : detailSum,
              0
            ),
          0
        )

        customerTotalNodauky = customerTotalNodauky - totalGiamtrongkyTruocDo

        return {
          makh: khachhang.makh,
          namekhach: khachhang.name,
          nhomkhachhang: nhomkhachhang.name,
          phone: khachhang.phone,
          nodauky: customerTotalNodauky,
          tangtrongky: totalTanggtrongky,
          giamtrongky: totalGiamtrongky
        }
      })
    )

    res.json(khachhang)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/baocaobanhang', async (req, res) => {
  try {
    const { fromdate, enddate } = req.query
    const from = new Date(fromdate)
    const end = new Date(enddate)
    end.setUTCHours(23, 59, 59, 999)

    const hoaDons = await HoaDon.find({
      date: {
        $gte: from,
        $lte: end
      }
    })

    const hoaDonReport = hoaDons.reduce((acc, hoaDon) => {
      const dateKey = hoaDon.date.toISOString().split('T')[0]
      if (!acc[dateKey]) {
        acc[dateKey] = 0
      }
      acc[dateKey] += hoaDon.tongtien || 0
      return acc
    }, {})

    const sanPhams = await SanPham.find({
      datenhap: {
        $gte: from,
        $lte: end
      }
    })

    const nhapHangReport = sanPhams.reduce((acc, sanPham) => {
      const dateKey = sanPham.datenhap.toISOString().split('T')[0]
      if (!acc[dateKey]) {
        acc[dateKey] = 0
      }
      acc[dateKey] += sanPham.price || 0
      return acc
    }, {})

    const congNoHoaDons = await HoaDon.find({
      date: {
        $gte: from,
        $lte: end
      },
      ghino: true
    }).populate('khachhang', 'ten')

    const congNoReport = congNoHoaDons.reduce((acc, hoaDon) => {
      const dateKey = hoaDon.date.toISOString().split('T')[0]
      if (!acc[dateKey]) {
        acc[dateKey] = 0
      }

      acc[dateKey] += hoaDon.tongtien || 0

      return acc
    }, {})

    const combinedReport = {}

    const allDates = [
      ...new Set([
        ...Object.keys(hoaDonReport),
        ...Object.keys(nhapHangReport),
        ...Object.keys(congNoReport)
      ])
    ]

    allDates.forEach(date => {
      combinedReport[date] = {
        hoaDon: hoaDonReport[date] || 0,
        nhapHang: nhapHangReport[date] || 0,
        congNo: congNoReport[date] || 0
      }
    })

    res.status(200).json(combinedReport)
  } catch (error) {
    console.error('Lỗi khi tạo báo cáo:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ. Không thể tạo báo cáo.'
    })
  }
})

module.exports = router
